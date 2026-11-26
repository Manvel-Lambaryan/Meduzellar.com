import { randomUUID } from "node:crypto";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { db } from "@/lib/db/client";
import { credential, seal, unseal } from "@/lib/security/crypto";
import { local, origin } from "@/lib/security/http";
import {
  campaignLock,
  launchCopy,
  materialize,
  testAddress,
} from "@/lib/campaigns/service";
import { day, lockMember, suppression } from "@/lib/waitlist/service";

const delay = [1, 5, 15, 45, 120];
const nonterminal = ["QUEUED", "LEASED", "RETRY"] as const;
type DeliveryState = "DELIVERED" | "SKIPPED" | "CANCELED" | "UNKNOWN" | "RETRY";
type Payload = {
  to: string;
  subject: string;
  text: string;
  html: string;
  headers: Record<string, string>;
};
const escape = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
function message(
  to: string,
  subject: string,
  body: string,
  link?: { url: string; label: string },
  unsubscribe?: string,
): Payload {
  const visible = unsubscribe ? origin() + "/unsubscribe#" + unsubscribe : "";
  const oneClick =
    unsubscribe && new URL(origin()).protocol === "https:"
      ? origin() + "/api/v1/waitlist/one-click/" + unsubscribe
      : "";
  const headers: Record<string, string> = oneClick
    ? {
        "List-Unsubscribe": `<${oneClick}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      }
    : {};
  const text = [body, link?.url, visible && "Unsubscribe: " + visible]
    .filter(Boolean)
    .join("\n\n");
  const html = `<main><h1>Meduzellar</h1><p>${escape(body)}</p>${link ? `<p><a href="${escape(link.url)}">${escape(link.label)}</a></p>` : ""}${visible ? `<p><a href="${escape(visible)}">Unsubscribe</a></p>` : ""}</main>`;
  return { to, subject, text, html, headers };
}
function permitted(address: string) {
  const domain = process.env.LOCAL_TEST_MAIL_DOMAIN;
  return (
    local() &&
    process.env.VERCEL !== "1" &&
    !!domain &&
    /^[a-z0-9.-]+\.test$/.test(domain) &&
    address.endsWith("@" + domain)
  );
}
async function claim(excludeLaunch: boolean) {
  const token = randomUUID();
  const rows = await db().$queryRaw<{ id: string; deliveryId: string }[]>`
    WITH candidate AS (
      SELECT j."id" FROM "Job" j JOIN "Delivery" d ON d."id"=j."deliveryId"
      LEFT JOIN "Campaign" c ON c."id"=d."campaignId"
      WHERE ((j."state" IN ('QUEUED','RETRY') AND j."runAfter"<=NOW()) OR (j."state"='LEASED' AND j."leaseUntil"<=NOW()))
        AND (d."kind"<>'LAUNCH' OR (NOT ${excludeLaunch} AND c."state"<>'PAUSED'))
      ORDER BY CASE d."kind" WHEN 'VERIFY' THEN 0 WHEN 'PRIVACY' THEN 1 WHEN 'CONFIRM' THEN 2 WHEN 'TEST' THEN 3 ELSE 4 END, j."runAfter",j."id"
      LIMIT 1 FOR UPDATE OF j SKIP LOCKED
    ) UPDATE "Job" j SET "state"='LEASED',"leaseToken"=${token}::uuid,"leaseUntil"=NOW()+interval '90 seconds'
      FROM candidate WHERE j."id"=candidate."id" RETURNING j."id",j."deliveryId"`;
  return rows[0] ? { ...rows[0], token } : null;
}
type Claim = NonNullable<Awaited<ReturnType<typeof claim>>>;
async function dispatch(item: Claim) {
  const hint = await db().delivery.findUnique({
    where: { id: item.deliveryId },
  });
  if (!hint) return false;
  return db().$transaction(async (tx) => {
    const campaign = hint.campaignId
      ? await campaignLock(tx, hint.campaignId)
      : null;
    const member = hint.subscriberId
      ? await lockMember(tx, hint.subscriberId)
      : null;
    await tx.$queryRaw`SELECT "id" FROM "Delivery" WHERE "id"=${item.deliveryId}::uuid FOR UPDATE`;
    await tx.$queryRaw`SELECT "id" FROM "Job" WHERE "id"=${item.id}::uuid FOR UPDATE`;
    const job = await tx.job.findUnique({
      where: { id: item.id },
      include: {
        delivery: {
          include: {
            subscriber: true,
            token: true,
            revision: true,
            messages: true,
          },
        },
        attempts: { orderBy: { number: "desc" }, take: 1 },
      },
    });
    if (
      !job ||
      job.leaseToken !== item.token ||
      job.state !== "LEASED" ||
      !job.leaseUntil ||
      job.leaseUntil <= new Date()
    )
      return false;
    const delivery = job.delivery;
    const finish = async (state: DeliveryState, next?: Date) => {
      await tx.job.update({
        where: { id: job.id },
        data: { state, leaseToken: null, leaseUntil: null, runAfter: next },
      });
      await tx.delivery.update({
        where: { id: delivery.id },
        data: {
          state,
          providerId:
            state === "DELIVERED" ? "capture:" + delivery.id : undefined,
        },
      });
    };
    if (delivery.messages) {
      await finish("DELIVERED");
      return false;
    }
    if (delivery.kind === "LAUNCH" && campaign?.state === "PAUSED") {
      await finish("RETRY", new Date(Date.now() + 60_000));
      return false;
    }
    if (
      delivery.kind === "LAUNCH" &&
      (!campaign || campaign.state === "CANCELED")
    ) {
      await finish("CANCELED");
      return false;
    }
    if (
      delivery.kind === "LAUNCH" &&
      (!campaign ||
        !["RUNNING", "MATERIALIZING"].includes(campaign.state) ||
        campaign.activeRevisionId !== delivery.revisionId)
    ) {
      await finish("SKIPPED");
      return false;
    }
    const number = (job.attempts[0]?.number ?? 0) + 1;
    if (
      number > job.attemptLimit ||
      (delivery.firstSubmission &&
        Date.now() - delivery.firstSubmission.getTime() >= 23 * 3600_000)
    ) {
      await finish("UNKNOWN");
      return false;
    }
    const verify = delivery.kind === "VERIFY";
    const privacy = delivery.kind === "PRIVACY";
    const test = delivery.kind === "TEST";
    const token = delivery.token;
    const stateOk = privacy
      ? member?.status !== "DELETION_PENDING"
      : member?.status === (verify ? "PENDING" : "ACTIVE");
    if (
      !test &&
      (!member ||
        !delivery.subscriber ||
        member.generation !== delivery.generation ||
        !stateOk ||
        !token ||
        token.revokedAt ||
        token.consumedAt ||
        (token.expiresAt && token.expiresAt <= new Date()) ||
        (await suppression(tx, member.lookup)))
    ) {
      await finish("SKIPPED");
      return false;
    }
    const to = test
      ? testAddress(delivery.testRecipientId ?? "")
      : unseal(delivery.subscriber!.ciphertext, member!.lookup);
    if (!to || !permitted(to)) {
      await finish("SKIPPED");
      return false;
    }
    const proof = token
      ? credential(
          token.purpose,
          token.selector,
          token.generation,
          token.keyVersion,
        )
      : "";
    let payload: Payload;
    if (verify)
      payload = message(
        to,
        "Confirm your Meduzellar early access",
        "Confirm your email to join the Meduzellar waitlist.",
        { url: origin() + "/verify#" + proof, label: "Confirm email" },
      );
    else if (privacy)
      payload = message(
        to,
        "Confirm your Meduzellar privacy request",
        "Confirm your deletion request.",
        {
          url: origin() + "/verify-deletion#" + proof,
          label: "Confirm deletion request",
        },
      );
    else if (delivery.kind === "CONFIRM")
      payload = message(
        to,
        "You're on the Meduzellar waitlist!",
        "Your email is confirmed. We will contact you once when Meduzellar launches.",
        undefined,
        proof,
      );
    else if (delivery.revision) {
      const revision = delivery.revision;
      payload = message(
        to,
        (test ? "[TEST] " : "") + revision.subject,
        test
          ? "Preview of the official launch notification."
          : launchCopy(revision.launchUrl),
        test
          ? undefined
          : { url: revision.launchUrl, label: "Explore Meduzellar" },
        test ? undefined : proof,
      );
    } else {
      await finish("SKIPPED");
      return false;
    }
    // A local capture and its delivery status share a commit. No network or provider handoff occurs.
    await tx.delivery.update({
      where: { id: delivery.id },
      data: { firstSubmission: delivery.firstSubmission ?? new Date() },
    });
    await tx.deliveryAttempt.create({
      data: { jobId: job.id, number, outcome: "capture_committed" },
    });
    await tx.capturedMail.create({
      data: {
        deliveryId: delivery.id,
        sealed: seal(JSON.stringify(payload), "mail:" + delivery.id),
      },
    });
    await finish("DELIVERED");
    return true;
  });
}
async function retry(item: Claim) {
  await db().$transaction(async (tx) => {
    await tx.$queryRaw`SELECT "id" FROM "Delivery" WHERE "id"=${item.deliveryId}::uuid FOR UPDATE`;
    await tx.$queryRaw`SELECT "id" FROM "Job" WHERE "id"=${item.id}::uuid FOR UPDATE`;
    const job = await tx.job.findUnique({
      where: { id: item.id },
      include: { attempts: { orderBy: { number: "desc" }, take: 1 } },
    });
    if (!job || job.leaseToken !== item.token) return;
    const number = (job.attempts[0]?.number ?? 0) + 1;
    const state = number >= job.attemptLimit ? "FAILED" : "RETRY";
    await tx.deliveryAttempt.create({
      data: { jobId: job.id, number, outcome: "capture_transaction_failed" },
    });
    await tx.job.update({
      where: { id: item.id },
      data: {
        state,
        leaseToken: null,
        leaseUntil: null,
        runAfter: new Date(
          Date.now() +
            (delay[number - 1] ?? 120) * 60_000 +
            Math.floor(Math.random() * 15_000),
        ),
      },
    });
    await tx.delivery.update({
      where: { id: item.deliveryId },
      data: { state },
    });
  });
}
async function recovery() {
  const database = new URL(process.env.DATABASE_URL ?? "");
  const directory = resolve(
    database.pathname === "/prelaunch_test"
      ? ".local/recovery-ledger-test"
      : ".local/recovery-ledger",
  );
  const records = await db().recoveryEvent.findMany({
    where: { exportedAt: null },
    take: 50,
    orderBy: { createdAt: "asc" },
  });
  if (records.length) await mkdir(directory, { recursive: true });
  for (const row of records) {
    const name = resolve(directory, row.id + ".sealed");
    const context = "recovery:" + row.id;
    const value = JSON.stringify({
      lookup: row.lookup,
      kind: row.kind,
      createdAt: row.createdAt,
    });
    try {
      await writeFile(name, seal(value, context), {
        flag: "wx",
        mode: 0o600,
        flush: true,
      });
    } catch (error) {
      if (
        (error as NodeJS.ErrnoException).code !== "EEXIST" ||
        unseal(await readFile(name, "utf8"), context) !== value
      )
        throw error;
    }
    await db().recoveryEvent.update({
      where: { id: row.id },
      data: { exportedAt: new Date() },
    });
  }
  const requests = await db().privacyRequest.findMany({
    where: { state: "VERIFIED" },
    take: 25,
  });
  for (const request of requests) {
    await db().$transaction(async (tx) => {
      const member = request.subscriberId
        ? await lockMember(tx, request.subscriberId)
        : null;
      if (!member || member.status !== "DELETION_PENDING") return;
      if (
        await tx.recoveryEvent.findFirst({
          where: { lookup: member.lookup, exportedAt: null },
        })
      )
        return;
      await tx.subscriber.delete({ where: { id: member.id } });
      await tx.privacyRequest.update({
        where: { id: request.id },
        data: {
          supportReference: randomUUID(),
          state: "COMPLETE",
          completedAt: new Date(),
        },
      });
    });
  }
}
async function maintenance() {
  const now = new Date();
  const cutoff = (days: number) => new Date(Date.now() - days * day);
  await db().rateBucket.deleteMany({ where: { expires: { lt: now } } });
  await db().capturedMail.deleteMany({
    where: { createdAt: { lt: cutoff(7) } },
  });
  await db().emailToken.deleteMany({
    where: { expiresAt: { lt: cutoff(7) }, purpose: { not: "UNSUBSCRIBE" } },
  });
  await db().deliveryAttempt.deleteMany({
    where: { createdAt: { lt: cutoff(30) } },
  });
  await db().webhookReceipt.deleteMany({
    where: { receivedAt: { lt: cutoff(30) }, processedAt: { not: null } },
  });
  await db().auditEvent.deleteMany({
    where: { createdAt: { lt: cutoff(180) } },
  });
  const old = await db().subscriber.findMany({
    where: {
      OR: [
        { status: "PENDING", updatedAt: { lt: cutoff(14) } },
        { status: "UNSUBSCRIBED", unsubscribedAt: { lt: cutoff(30) } },
      ],
    },
    select: { id: true },
  });
  for (const item of old.slice(0, 25)) {
    await db().$transaction(async (tx) => {
      await lockMember(tx, item.id);
      await tx.subscriber.deleteMany({
        where: {
          id: item.id,
          OR: [
            { status: "PENDING", updatedAt: { lt: cutoff(14) } },
            { status: "UNSUBSCRIBED", unsubscribedAt: { lt: cutoff(30) } },
          ],
        },
      });
    });
  }
}
export async function tick() {
  if (
    !local() ||
    process.env.VERCEL === "1" ||
    process.env.DISPATCH_DISABLED === "1"
  )
    return;
  const database = new URL(process.env.DATABASE_URL ?? "");
  if (
    database.hostname !== "127.0.0.1" ||
    !["/prelaunch", "/prelaunch_test"].includes(database.pathname)
  )
    return;
  const token = randomUUID();
  const lease = await db().$queryRaw<
    { id: string }[]
  >`INSERT INTO "WorkerLease" ("id","token","expiresAt") VALUES ('delivery',${token}::uuid,NOW()+interval '90 seconds')
    ON CONFLICT ("id") DO UPDATE SET "token"=EXCLUDED."token","expiresAt"=EXCLUDED."expiresAt" WHERE "WorkerLease"."expiresAt"<=NOW() RETURNING "id"`;
  if (!lease.length) return;
  try {
    await recovery();
    await materialize();
    const until = Date.now() + 35_000;
    let launched = 0;
    const minute = new Date(Math.floor(Date.now() / 60_000) * 60_000);
    const sent = await db().delivery.count({
      where: { firstSubmission: { gte: minute } },
    });
    launched = await db().delivery.count({
      where: { kind: "LAUNCH", firstSubmission: { gte: minute } },
    });
    for (let index = sent; index < 60 && Date.now() < until; index++) {
      const item = await claim(launched >= 45);
      if (!item) break;
      const launch = await db().delivery.findUnique({
        where: { id: item.deliveryId },
        select: { kind: true },
      });
      try {
        if ((await dispatch(item)) && launch?.kind === "LAUNCH") launched++;
      } catch {
        await retry(item);
      }
    }
    const campaign = await db().campaign.findUnique({
      where: { key: "official-launch" },
    });
    if (campaign?.state === "RUNNING" && campaign.materialized)
      await db().$transaction(async (tx) => {
        const current = await campaignLock(tx, campaign.id);
        if (
          current.state === "RUNNING" &&
          !(await tx.delivery.count({
            where: { campaignId: campaign.id, state: { in: [...nonterminal] } },
          }))
        )
          await tx.campaign.update({
            where: { id: campaign.id },
            data: { state: "COMPLETED" },
          });
      });
    await maintenance();
  } finally {
    await db().workerLease.deleteMany({ where: { id: "delivery", token } });
  }
}
