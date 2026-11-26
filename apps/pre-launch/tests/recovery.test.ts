import { afterAll, expect, test } from "vitest";
import { Client } from "pg";
import { randomUUID } from "node:crypto";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  readRecoveryLedger,
  replayRecovery,
} from "../scripts/reconcile-local-restore.mjs";
import { lookup, seal } from "@/lib/security/crypto";

const client = new Client({
  connectionString: process.env.TEST_DATABASE_URL,
  connectionTimeoutMillis: 3000,
});
let connected = false;
afterAll(async () => {
  if (connected) await client.end();
});

test("replays authenticated opt-out and erasure over a synthetic restored snapshot without reapplying them", async () => {
  const url = new URL(process.env.TEST_DATABASE_URL ?? "");
  if (url.hostname !== "127.0.0.1" || url.pathname !== "/prelaunch_test")
    throw new Error("Dedicated local test database required");
  await client.connect();
  connected = true;
  const originalAt = new Date(Date.now() - 120_000);
  const eventAt = new Date(Date.now() - 30_000);
  const ledger = await mkdtemp(join(tmpdir(), "meduzellar-recovery-test-"));
  const records = [];
  for (const kind of ["UNSUBSCRIBE", "ERASE"]) {
    const address = "Replay-" + randomUUID() + "@example.test";
    const digest = lookup(address);
    const memberId = randomUUID();
    const deliveryId = randomUUID();
    const eventId = randomUUID();
    await client.query(
      `INSERT INTO "Subscriber" ("id","lookup","ciphertext","status","verifiedAt","verifiedEpoch","createdAt","updatedAt")
      VALUES ($1,$2,$3,'ACTIVE',$4,0,$4,$4)`,
      [memberId, digest, seal(address, digest), originalAt],
    );
    await client.query(
      `INSERT INTO "Delivery" ("id","logicalKey","kind","subscriberId","generation","updatedAt")
      VALUES ($1,$2,'CONFIRM',$3,1,$4)`,
      [deliveryId, "restore:" + deliveryId, memberId, originalAt],
    );
    await client.query('INSERT INTO "Job" ("id","deliveryId") VALUES ($1,$2)', [
      randomUUID(),
      deliveryId,
    ]);
    await writeFile(
      join(ledger, eventId + ".sealed"),
      seal(
        JSON.stringify({ lookup: digest, kind, createdAt: eventAt }),
        "recovery:" + eventId,
      ),
    );
    records.push({ memberId, deliveryId, eventId });
  }
  const events = await readRecoveryLedger(ledger, originalAt, new Date());
  expect(await replayRecovery(client, events)).toMatchObject({ applied: 2 });
  expect(await replayRecovery(client, events)).toMatchObject({ applied: 0 });
  const [optOut, erase] = records;
  const { rows } = await client.query(
    'SELECT "id","status" FROM "Subscriber" WHERE "id" = ANY($1::uuid[])',
    [records.map((record) => record.memberId)],
  );
  expect(rows).toEqual([{ id: optOut.memberId, status: "UNSUBSCRIBED" }]);
  const job = await client.query(
    'SELECT "state" FROM "Job" WHERE "deliveryId"=$1',
    [optOut.deliveryId],
  );
  expect(job.rows).toEqual([{ state: "CANCELED" }]);
  expect(
    (
      await client.query('SELECT 1 FROM "Delivery" WHERE "id"=$1', [
        erase.deliveryId,
      ])
    ).rowCount,
  ).toBe(0);
});
