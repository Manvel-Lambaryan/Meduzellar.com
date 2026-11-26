import { randomUUID } from "node:crypto";
import { mkdir, realpath, rename, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "pg";
import { normalizeEmail, unseal } from "../src/lib/security/crypto.ts";

async function report() {
  const url = new URL(process.env.DATABASE_URL ?? "");
  const domain = process.env.LOCAL_TEST_MAIL_DOMAIN ?? "";
  if (
    url.protocol !== "postgresql:" ||
    url.hostname !== "127.0.0.1" ||
    url.port !== "55432" ||
    url.pathname !== "/prelaunch" ||
    url.search ||
    url.hash ||
    !domain.endsWith(".test") ||
    normalizeEmail("report@" + domain) !== "report@" + domain
  ) {
    throw new Error("Dedicated local waitlist database required");
  }

  const client = new Client({
    connectionString: url.href,
    connectionTimeoutMillis: 3000,
  });
  await client.connect();
  let rows;
  try {
    ({ rows } = await client.query(
      `SELECT "lookup", "ciphertext", "status" FROM "Subscriber"
        WHERE "status" IN ('PENDING', 'ACTIVE') ORDER BY "createdAt", "id"`,
    ));
  } finally {
    await client.end();
  }

  const subscribers = rows.flatMap(({ lookup, ciphertext, status }) => {
    const email = normalizeEmail(unseal(ciphertext, lookup));
    return email?.endsWith("@" + domain) ? [{ email, status }] : [];
  });
  const verified = subscribers.filter(
    ({ status }) => status === "ACTIVE",
  ).length;
  const data = {
    generatedAt: new Date().toISOString(),
    total: subscribers.length,
    verified,
    pending: subscribers.length - verified,
    subscribers,
  };

  const root = await realpath(fileURLToPath(new URL("../", import.meta.url)));
  const directory = join(root, ".local");
  await mkdir(directory, { recursive: true, mode: 0o700 });
  if ((await realpath(directory)) !== directory)
    throw new Error("Expected a local report directory");

  const filename = join(directory, "waitlist-report.json");
  const temporary = join(directory, `waitlist-report-${randomUUID()}.tmp`);
  try {
    await writeFile(temporary, JSON.stringify(data, null, 2) + "\n", {
      flag: "wx",
      mode: 0o600,
    });
    await rename(temporary, filename);
  } finally {
    await rm(temporary, { force: true });
  }
  console.log(`Saved ${data.total} addresses to .local/waitlist-report.json.`);
}

report().catch(() => {
  console.error("Could not write the local waitlist report.");
  process.exitCode = 1;
});
