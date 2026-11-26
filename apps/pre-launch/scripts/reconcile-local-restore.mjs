import { readFile, readdir } from "node:fs/promises";
import { basename, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { Client } from "pg";
import { unseal } from "../src/lib/security/crypto.ts";

const kinds = new Set(["UNSUBSCRIBE", "ERASE", "complaint", "hard-bounce"]);
const uuid = /^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/;
export async function readRecoveryLedger(directory, after, through) {
  const events = [];
  for (const name of await readdir(directory)) {
    if (!name.endsWith(".sealed")) continue;
    const id = basename(name, ".sealed");
    if (!uuid.test(id)) throw new Error("Invalid recovery record identity");
    const event = JSON.parse(
      unseal(
        await readFile(resolve(directory, name), "utf8"),
        "recovery:" + id,
      ),
    );
    const createdAt = new Date(event.createdAt);
    if (
      !Number.isFinite(+createdAt) ||
      !/^[a-f0-9]{64}$/.test(event.lookup) ||
      !kinds.has(event.kind)
    )
      throw new Error("Invalid recovery record");
    if (createdAt > after && createdAt <= through)
      events.push({ ...event, id, createdAt });
  }
  return events.sort(
    (a, b) => +a.createdAt - +b.createdAt || a.id.localeCompare(b.id),
  );
}

async function cancel(client, subscriber) {
  const { rows } = await client.query(
    `UPDATE "Delivery" SET "state"='CANCELED',"updatedAt"=NOW()
    WHERE "subscriberId"=$1 AND "firstSubmission" IS NULL AND "state" IN ('QUEUED','LEASED','RETRY') RETURNING "id"`,
    [subscriber],
  );
  await client.query(
    `UPDATE "Job" SET "state"='CANCELED',"leaseToken"=NULL,"leaseUntil"=NULL WHERE "deliveryId"=ANY($1::uuid[])`,
    [rows.map((row) => row.id)],
  );
}

export async function replayRecovery(client, events) {
  await client.query("BEGIN");
  try {
    // Dedicated restore target, with dispatch offline. Refuse an overlapping repository replay.
    await client.query('LOCK TABLE "RecoveryEvent" IN EXCLUSIVE MODE');
    let applied = 0;
    for (const { id, lookup, kind, createdAt } of events) {
      const prior = await client.query(
        'SELECT 1 FROM "RecoveryEvent" WHERE "id"=$1',
        [id],
      );
      if (prior.rowCount) continue;
      const {
        rows: [member],
      } = await client.query(
        'SELECT "id","generation","status","createdAt","verifiedAt" FROM "Subscriber" WHERE "lookup"=$1 FOR UPDATE',
        [lookup],
      );
      if (kind === "complaint" || kind === "hard-bounce") {
        await client.query(
          `INSERT INTO "Suppression" ("lookup","reason","provenance","recordedAt") VALUES ($1,$2,'restore-ledger',$3) ON CONFLICT DO NOTHING`,
          [lookup, kind, createdAt],
        );
        if (member) await cancel(client, member.id);
      } else if (
        member &&
        member.createdAt <= createdAt &&
        (kind === "ERASE" ||
          !member.verifiedAt ||
          member.verifiedAt <= createdAt)
      ) {
        if (kind === "ERASE") {
          await client.query(
            `UPDATE "PrivacyRequest" SET "supportReference"=gen_random_uuid()::text,"state"='COMPLETE',"completedAt"=$2 WHERE "subscriberId"=$1`,
            [member.id, createdAt],
          );
          await client.query('DELETE FROM "Subscriber" WHERE "id"=$1', [
            member.id,
          ]);
        } else if (member.status !== "DELETION_PENDING") {
          await client.query(
            `UPDATE "Subscriber" SET "status"='UNSUBSCRIBED',"unsubscribedAt"=$2,"updatedAt"=NOW() WHERE "id"=$1`,
            [member.id, createdAt],
          );
          await client.query(
            `INSERT INTO "ConsentEvent" ("id","subscriberId","generation","kind","version","contentHash","locale","source","at")
            SELECT gen_random_uuid(),"subscriberId","generation",'REVOKED',"version","contentHash","locale",'restore-ledger',$3
            FROM "ConsentEvent" WHERE "subscriberId"=$1 AND "generation"=$2 AND "kind"='GRANTED'
            ON CONFLICT ("subscriberId","generation","kind") DO NOTHING`,
            [member.id, member.generation, createdAt],
          );
          await cancel(client, member.id);
        }
      }
      await client.query(
        `INSERT INTO "RecoveryEvent" ("id","lookup","kind","createdAt","exportedAt") VALUES ($1,$2,$3,$4,NOW())`,
        [id, lookup, kind, createdAt],
      );
      applied++;
    }
    const uncertain = await client.query(
      `UPDATE "Delivery" SET "state"='UNKNOWN',"updatedAt"=NOW() WHERE "firstSubmission" IS NOT NULL AND "state" IN ('RETRY','LEASED','QUEUED') RETURNING "id"`,
    );
    await client.query(
      `UPDATE "Job" SET "state"='UNKNOWN',"leaseToken"=NULL,"leaseUntil"=NULL WHERE "deliveryId"=ANY($1::uuid[])`,
      [uncertain.rows.map((row) => row.id)],
    );
    await client.query(
      `UPDATE "Campaign" SET "state"='PAUSED',"updatedAt"=NOW() WHERE "state" IN ('APPROVED','MATERIALIZING','RUNNING')`,
    );
    await client.query("COMMIT");
    return { applied, uncertain: uncertain.rowCount };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  }
}

async function main() {
  const target = new URL(process.env.RESTORE_DATABASE_URL ?? "");
  const [start, end] = process.argv.slice(2);
  const after = new Date(start);
  const through = new Date(end);
  if (
    process.env.DISPATCH_DISABLED !== "1" ||
    target.hostname !== "127.0.0.1" ||
    target.port !== "55432" ||
    target.pathname !== "/prelaunch_restore" ||
    !Number.isFinite(+after) ||
    !Number.isFinite(+through) ||
    through <= after ||
    through > new Date()
  )
    throw new Error(
      "A paused, dedicated local restore database and explicit recovery interval are required",
    );
  const events = await readRecoveryLedger(
    resolve(".local/recovery-ledger"),
    after,
    through,
  );
  const client = new Client({
    connectionString: target.href,
    connectionTimeoutMillis: 3000,
  });
  await client.connect();
  try {
    console.log(JSON.stringify(await replayRecovery(client, events)));
  } finally {
    await client.end();
  }
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  try {
    await main();
  } catch {
    console.error("Local replay failed. Keep dispatch paused.");
    process.exitCode = 1;
  }
}
