import { randomUUID } from "node:crypto";
import { db } from "@/lib/db/client";
import { mac } from "@/lib/security/crypto";

export class HttpError extends Error {
  constructor(
    public status: number,
    public code: string,
    public retryAfter?: number,
  ) {
    super(code);
  }
}
export function origin() {
  const configured = process.env.APP_ORIGIN ?? "http://127.0.0.1:3001";
  const url = new URL(configured);
  if (
    url.origin !== configured ||
    (!["localhost", "127.0.0.1", "[::1]"].includes(url.hostname) &&
      url.protocol !== "https:")
  )
    throw new Error("Invalid application origin");
  return configured;
}
export const local = () =>
  ["localhost", "127.0.0.1", "[::1]"].includes(new URL(origin()).hostname);
export function sameOrigin(req: Request) {
  if (
    req.headers.get("origin") !== origin() ||
    req.headers.get("sec-fetch-site") === "cross-site"
  )
    throw new HttpError(403, "forbidden");
}
export function nonCookie(req: Request) {
  if (req.headers.has("cookie") || req.headers.has("origin"))
    throw new HttpError(403, "forbidden");
}
export async function bytes(req: Request, max = 4096) {
  const reader = req.body?.getReader();
  if (!reader || Number(req.headers.get("content-length")) > max)
    throw new HttpError(400, "invalid_input");
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.length;
      if (length > max) {
        await reader.cancel();
        throw new HttpError(400, "invalid_input");
      }
      chunks.push(value);
    }
    return new TextDecoder("utf-8", { fatal: true }).decode(
      Buffer.concat(chunks),
    );
  } catch {
    throw new HttpError(400, "invalid_input");
  }
}
export async function json(req: Request) {
  if (req.headers.get("content-type")?.split(";")[0] !== "application/json")
    throw new HttpError(400, "invalid_input");
  const value = await bytes(req);
  try {
    return JSON.parse(value) as unknown;
  } catch {
    throw new HttpError(400, "invalid_input");
  }
}
export function output(data: unknown, status = 200, extra: HeadersInit = {}) {
  return Response.json(data, {
    status,
    headers: { "Cache-Control": "no-store", ...extra },
  });
}
export async function handle(run: (requestId: string) => Promise<Response>) {
  const requestId = randomUUID();
  try {
    return await run(requestId);
  } catch (error) {
    if (error instanceof HttpError)
      return output(
        { error: { code: error.code, requestId } },
        error.status,
        error.retryAfter ? { "Retry-After": String(error.retryAfter) } : {},
      );
    if (error instanceof Error && error.name === "ZodError")
      return output({ error: { code: "invalid_input", requestId } }, 400);
    console.error(JSON.stringify({ event: "request_unavailable", requestId }));
    return output({ error: { code: "unavailable", requestId } }, 503);
  }
}
export async function rate(
  scope: string,
  identity: string,
  limit: number,
  seconds: number,
) {
  const now = Date.now();
  const part = seconds * 1000;
  const start = new Date(Math.floor(now / part) * part);
  const expires = new Date(start.getTime() + part);
  const digest = mac("RATE_KEY", scope + ":" + identity);
  const [{ count }] = await db().$queryRaw<
    { count: number }[]
  >`INSERT INTO "RateBucket" ("scope","identity","start","expires","count") VALUES (${scope},${digest},${start},${expires},1) ON CONFLICT ("scope","identity","start") DO UPDATE SET "count"=LEAST("RateBucket"."count"+1,${limit + 1}) RETURNING "count"`;
  if (count > limit)
    throw new HttpError(
      429,
      "rate_limited",
      Math.max(1, Math.ceil((expires.getTime() - now) / 1000)),
    );
}
export function source(req: Request) {
  if (local()) return "loopback";
  if (process.env.VERCEL === "1")
    return (
      req.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
      "other"
    );
  return "other";
}
