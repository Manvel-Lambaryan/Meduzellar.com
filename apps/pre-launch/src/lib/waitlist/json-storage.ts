import { randomUUID } from "node:crypto";
import { mkdir, open, readFile, rename, rm } from "node:fs/promises";
import { join } from "node:path";
import { BlobPreconditionFailedError, get, put } from "@vercel/blob";
import type { z } from "zod";
import { hash } from "@/lib/security/crypto";
import { local } from "@/lib/security/http";

const maxBytes = 8 * 1024 * 1024;
type Snapshot = { body: string; version: string };
type Store = {
  read(name: string): Promise<Snapshot | null>;
  write(
    name: string,
    body: string,
    version: string | undefined,
  ): Promise<boolean>;
};

class StorageFailure extends Error {
  constructor() {
    super("Waitlist storage unavailable");
  }
}

function blobStore(token: string): Store {
  return {
    async read(name) {
      const file = await get(name, {
        token,
        access: "private",
        useCache: false,
        abortSignal: AbortSignal.timeout(6000),
      });
      if (!file) return null;
      if (
        file.statusCode !== 200 ||
        !file.stream ||
        !file.blob.etag ||
        file.blob.size === null ||
        file.blob.size > maxBytes
      )
        throw new StorageFailure();
      const body = await new Response(file.stream).text();
      return { body, version: file.blob.etag };
    },
    async write(name, body, version) {
      try {
        await put(name, body, {
          token,
          access: "private",
          addRandomSuffix: false,
          contentType: "application/json",
          allowOverwrite: version !== undefined,
          ifMatch: version,
          abortSignal: AbortSignal.timeout(6000),
        });
        return true;
      } catch (error) {
        if (
          error instanceof BlobPreconditionFailedError ||
          (version === undefined && (await this.read(name)))
        )
          return false;
        throw error;
      }
    },
  };
}

function code(error: unknown) {
  return (error as NodeJS.ErrnoException | undefined)?.code;
}

function fileStore(directory: string): Store {
  async function read(name: string) {
    const body = await readFile(join(directory, name), "utf8").catch(
      (error: unknown) => {
        if (code(error) === "ENOENT") return null;
        throw error;
      },
    );
    return body === null ? null : { body, version: hash(body) };
  }
  return {
    read,
    async write(name, body, version) {
      await mkdir(directory, { recursive: true, mode: 0o700 });
      const filename = join(directory, name);
      const lock = filename + ".lock";
      const handle = await open(lock, "wx", 0o600).catch((error: unknown) => {
        if (code(error) === "EEXIST") return null;
        throw error;
      });
      if (!handle) return false;
      const temporary = filename + "." + randomUUID() + ".tmp";
      try {
        if ((await read(name))?.version !== version) return false;
        const output = await open(temporary, "wx", 0o600);
        try {
          await output.writeFile(body, "utf8");
          await output.sync();
        } finally {
          await output.close();
        }
        await rename(temporary, filename);
        return true;
      } finally {
        await handle.close();
        await rm(lock, { force: true });
        await rm(temporary, { force: true });
      }
    },
  };
}

function store() {
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  if (token) return blobStore(token);
  const directory = process.env.WAITLIST_LOCAL_DIRECTORY;
  if (!directory || process.env.VERCEL === "1" || !local())
    throw new StorageFailure();
  return fileStore(directory);
}

function validated<T>(schema: z.ZodType<T>, document: unknown) {
  const parsed = schema.safeParse(document);
  if (!parsed.success) throw new StorageFailure();
  return parsed.data;
}

export function storageConfigured() {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN?.trim() ||
    (process.env.VERCEL !== "1" &&
      local() &&
      process.env.WAITLIST_LOCAL_DIRECTORY),
  );
}

export async function updateJson<T extends object, R>(
  name: "waitlist.json" | "waitlist-limits.json",
  schema: z.ZodType<T>,
  empty: () => T,
  mutate: (document: T) => { value: R; changed: boolean },
): Promise<R> {
  const backend = store();
  for (let attempt = 0; attempt < 6; attempt++) {
    const snapshot = await backend.read(name);
    if (snapshot && Buffer.byteLength(snapshot.body) > maxBytes)
      throw new StorageFailure();
    const document = snapshot
      ? validated(schema, JSON.parse(snapshot.body))
      : empty();
    const { value, changed } = mutate(document);
    if (!changed) return value;
    const body = JSON.stringify(validated(schema, document)) + "\n";
    if (Buffer.byteLength(body) > maxBytes) throw new StorageFailure();
    if (await backend.write(name, body, snapshot?.version)) return value;
    await new Promise((resolve) =>
      setTimeout(resolve, 10 * (attempt + 1) + Math.random() * 20),
    );
  }
  throw new StorageFailure();
}
