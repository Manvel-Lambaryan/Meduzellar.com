import { setTimeout as wait } from "node:timers/promises";

const origin = new URL(process.env.APP_ORIGIN ?? "");
if (!["localhost", "127.0.0.1", "[::1]"].includes(origin.hostname))
  throw new Error("Run the local dispatcher on loopback");
const secret = process.env.CRON_SECRET;
if (!secret || secret.length < 32)
  throw new Error("Local dispatcher credentials are missing");
const watch = process.argv.includes("--watch");
async function dispatch() {
  const reply = await fetch(new URL("/api/v1/internal/cron/delivery", origin), {
    headers: { authorization: `Bearer ${secret}` },
    signal: AbortSignal.timeout(55_000),
  });
  if (!reply.ok) throw new Error("Dispatch failed with status " + reply.status);
}
do {
  try {
    await dispatch();
    if (!watch) console.log("Dispatch tick completed");
  } catch {
    console.error("Local dispatch request failed");
    if (!watch) process.exitCode = 1;
  }
  if (watch) await wait(60_000);
} while (watch);
