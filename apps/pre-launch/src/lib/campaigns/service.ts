import { z } from "zod";
import { db, type Prisma } from "@/lib/db/client";
import { hash, lookup, normalizeEmail } from "@/lib/security/crypto";
import { HttpError, local } from "@/lib/security/http";
import {
  enqueue,
  issue,
  lockMember,
  suppression,
  day,
} from "@/lib/waitlist/service";

type Tx = Prisma.TransactionClient;
export const draft = z.strictObject({
  subject: z
    .string()
    .trim()
    .min(1)
    .max(120)
    .refine((s) => !/[\r\n]/.test(s)),
  bodyVersion: z.literal("launch-v1"),
  launchUrl: z.url().max(500),
});
export const testRecipientId = "local-review";
export function testAddress(id: string) {
  const domain = process.env.LOCAL_TEST_MAIL_DOMAIN;
  return id === testRecipientId && domain && domain.endsWith(".test")
    ? `launch-review@${domain}`
    : null;
}
export const revisionSchema = z.strictObject({ revisionId: z.uuid() });
export const approvalSchema = revisionSchema.extend({
  digest: z.string().regex(/^[a-f0-9]{64}$/),
  maxRecipients: z.number().int().min(1).max(1000),
  confirm: z.literal(true),
});
export const testSchema = revisionSchema.extend({
  testRecipientId: z.literal(testRecipientId),
});
export const changeSchema = z.strictObject({
  expectedState: z.enum([
    "DRAFT",
    "APPROVED",
    "MATERIALIZING",
    "RUNNING",
    "PAUSED",
    "CANCELED",
    "COMPLETED",
  ]),
});
const audience = { status: "ACTIVE" as const };
export function launchCopy(url: string) {
  return `Meduzellar is officially live! Explore Meduzellar: ${url}`;
}
function localRevision(fields: z.infer<typeof draft>) {
  const url = new URL(fields.launchUrl);
  const allowed = (
    process.env.LOCAL_LAUNCH_URLS ?? "https://meduzellar.test/"
  ).split(",");
  if (
    !local() ||
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    !allowed.includes(url.href)
  )
    throw new HttpError(400, "invalid_input");
  const sender = "Meduzellar Local Preview";
  const snapshot = {
    subject: fields.subject,
    bodyVersion: fields.bodyVersion,
    launchUrl: url.href,
    sender,
  };
  return { ...snapshot, digest: hash(JSON.stringify(snapshot)) };
}
function conflict(): never {
  throw new HttpError(409, "campaign_conflict");
}
export async function campaignLock(tx: Tx, id: string) {
  await tx.$queryRaw`SELECT "id" FROM "Campaign" WHERE "id"=${id}::uuid FOR UPDATE`;
  const campaign = await tx.campaign.findUnique({ where: { id } });
  if (!campaign) throw new HttpError(404, "not_found");
  return campaign;
}
async function audit(
  tx: Tx,
  ctx: Context,
  action: string,
  resource: string,
  requestDigest?: string,
) {
  await tx.auditEvent.create({
    data: { ...ctx, action, resource, outcome: "accepted", requestDigest },
  });
}
type Context = { actor: string; requestId: string };
async function revision(tx: Tx, campaignId: string, id: string) {
  const value = await tx.campaignRevision.findFirst({
    where: { id, campaignId },
  });
  if (!value) throw new HttpError(404, "not_found");
  return value;
}
export async function create(fields: z.infer<typeof draft>, ctx: Context) {
  const data = localRevision(fields);
  return db().$transaction(async (tx) => {
    await tx.$queryRaw`SELECT "id" FROM "EnrollmentEpoch" WHERE "id"=1 FOR UPDATE`;
    if (await tx.campaign.findUnique({ where: { key: "official-launch" } }))
      conflict();
    const campaign = await tx.campaign.create({
      data: { key: "official-launch" },
    });
    const rev = await tx.campaignRevision.create({
      data: { ...data, campaignId: campaign.id, number: 1 },
    });
    await tx.campaign.update({
      where: { id: campaign.id },
      data: { activeRevisionId: rev.id },
    });
    await audit(tx, ctx, "campaign.create", campaign.id);
    return { id: campaign.id, revisionId: rev.id };
  });
}
export async function revise(
  id: string,
  fields: z.infer<typeof draft> & { expectedRevision: string },
  ctx: Context,
) {
  const data = localRevision(fields);
  return db().$transaction(async (tx) => {
    const campaign = await campaignLock(tx, id);
    if (
      campaign.state !== "DRAFT" ||
      campaign.activeRevisionId !== fields.expectedRevision
    )
      conflict();
    const current = await revision(tx, id, fields.expectedRevision);
    const rev = await tx.campaignRevision.create({
      data: { ...data, campaignId: id, number: current.number + 1 },
    });
    await tx.campaign.update({
      where: { id },
      data: { activeRevisionId: rev.id },
    });
    await audit(tx, ctx, "campaign.revise", id, rev.digest);
    return { revisionId: rev.id };
  });
}
export async function preview(id: string, revisionId: string, ctx: Context) {
  return db().$transaction(async (tx) => {
    await campaignLock(tx, id);
    const rev = await revision(tx, id, revisionId);
    const asOf = new Date();
    const estimate = await countAudience(tx);
    await tx.campaignRevision.update({
      where: { id: revisionId },
      data: { previewedAt: asOf },
    });
    await audit(tx, ctx, "campaign.preview", id, rev.digest);
    return {
      revisionId,
      digest: rev.digest,
      estimate,
      asOf,
      subject: rev.subject,
      body: launchCopy(rev.launchUrl),
    };
  });
}
async function countAudience(tx: Tx, epoch?: number) {
  const [{ count }] = await tx.$queryRaw<
    { count: number }[]
  >`SELECT COUNT(*)::int AS "count" FROM "Subscriber" s WHERE s."status"='ACTIVE' AND s."verifiedEpoch" <= ${epoch ?? 2147483647} AND NOT EXISTS (SELECT 1 FROM "Suppression" x WHERE x."lookup"=s."lookup" AND (x."expiresAt" IS NULL OR x."expiresAt">NOW()))`;
  return count;
}
export async function testSend(
  id: string,
  fields: z.infer<typeof testSchema>,
  key: string,
  ctx: Context,
) {
  if (!testAddress(fields.testRecipientId))
    throw new HttpError(400, "invalid_input");
  return db().$transaction(async (tx) => {
    const campaign = await campaignLock(tx, id);
    const rev = await revision(tx, id, fields.revisionId);
    const logicalKey = "test:" + hash(ctx.actor + ":" + key);
    const prior = await tx.delivery.findUnique({ where: { logicalKey } });
    if (prior) {
      if (
        prior.revisionId !== rev.id ||
        prior.testRecipientId !== fields.testRecipientId
      )
        conflict();
      return { deliveryId: prior.id };
    }
    if (
      campaign.state !== "DRAFT" ||
      campaign.activeRevisionId !== rev.id ||
      !rev.previewedAt
    )
      conflict();
    if (
      (await tx.delivery.count({
        where: {
          kind: "TEST",
          campaignId: id,
          createdAt: { gt: new Date(Date.now() - day) },
        },
      })) >= 10
    )
      throw new HttpError(429, "rate_limited");
    const delivery = await enqueue(tx, {
      logicalKey,
      kind: "TEST",
      campaignId: id,
      revisionId: rev.id,
      testRecipientId: fields.testRecipientId,
    });
    await audit(tx, ctx, "campaign.test", id, rev.digest);
    return { deliveryId: delivery.id };
  });
}
export async function approve(
  id: string,
  fields: z.infer<typeof approvalSchema>,
  key: string,
  ctx: Context,
) {
  if (!local()) throw new HttpError(403, "forbidden");
  return db().$transaction(async (tx) => {
    const [epoch] = await tx.$queryRaw<
      { epoch: number }[]
    >`SELECT "epoch" FROM "EnrollmentEpoch" WHERE "id"=1 FOR UPDATE`;
    const campaign = await campaignLock(tx, id);
    const rev = await revision(tx, id, fields.revisionId);
    const approvalKey = hash(ctx.actor + ":" + key);
    const prior = await tx.approval.findUnique({ where: { campaignId: id } });
    if (prior) {
      if (
        prior.key !== approvalKey ||
        prior.digest !== fields.digest ||
        prior.revisionId !== rev.id ||
        prior.maxRecipients !== fields.maxRecipients
      )
        conflict();
      return;
    }
    if (
      !epoch ||
      campaign.state !== "DRAFT" ||
      campaign.activeRevisionId !== rev.id ||
      rev.digest !== fields.digest ||
      !rev.previewedAt ||
      Date.now() - rev.previewedAt.getTime() > day
    )
      conflict();
    if (
      !(await tx.delivery.findFirst({
        where: {
          campaignId: id,
          revisionId: rev.id,
          kind: "TEST",
          state: "DELIVERED",
        },
      }))
    )
      conflict();
    if ((await countAudience(tx, epoch.epoch)) > fields.maxRecipients)
      conflict();
    await tx.enrollmentEpoch.update({
      where: { id: 1 },
      data: { epoch: { increment: 1 } },
    });
    await tx.approval.create({
      data: {
        campaignId: id,
        revisionId: rev.id,
        actor: ctx.actor,
        digest: rev.digest,
        key: approvalKey,
        maxRecipients: fields.maxRecipients,
      },
    });
    await tx.campaign.update({
      where: { id },
      data: {
        state: "APPROVED",
        cutoffEpoch: epoch.epoch,
        recipientCap: fields.maxRecipients,
        remaining: fields.maxRecipients,
      },
    });
    await audit(tx, ctx, "campaign.approve", id, rev.digest);
  });
}
export async function change(
  id: string,
  action: "pause" | "resume" | "cancel",
  expected: z.infer<typeof changeSchema>["expectedState"],
  key: string,
  ctx: Context,
) {
  await db().$transaction(async (tx) => {
    const campaign = await campaignLock(tx, id);
    const digest = hash(ctx.actor + ":" + key);
    const prior = await tx.auditEvent.findFirst({
      where: { resource: id, requestDigest: digest },
    });
    const label = "campaign." + action + "." + expected;
    if (prior) {
      if (prior.action !== label) conflict();
      return;
    }
    if (
      campaign.state !== expected ||
      campaign.state === "COMPLETED" ||
      campaign.state === "CANCELED" ||
      campaign.state === "DRAFT"
    )
      conflict();
    if (action === "resume" && campaign.state !== "PAUSED") conflict();
    if (action === "pause" && campaign.state === "PAUSED") conflict();
    const state =
      action === "pause"
        ? "PAUSED"
        : action === "cancel"
          ? "CANCELED"
          : campaign.materialized
            ? "RUNNING"
            : "MATERIALIZING";
    await tx.campaign.update({ where: { id }, data: { state } });
    await audit(tx, ctx, label, id, digest);
  });
}
export async function status(id: string) {
  const campaign = await db().campaign.findUnique({
    where: { id },
    include: {
      revisions: {
        select: {
          id: true,
          number: true,
          subject: true,
          bodyVersion: true,
          launchUrl: true,
          digest: true,
          previewedAt: true,
        },
        orderBy: { number: "desc" },
      },
    },
  });
  if (!campaign) throw new HttpError(404, "not_found");
  const totals = await db().delivery.groupBy({
    by: ["kind", "state"],
    where: { campaignId: id },
    _count: true,
  });
  return { campaign, totals };
}
export async function materialize() {
  const hint = await db().campaign.findUnique({
    where: { key: "official-launch" },
  });
  if (!hint || !["APPROVED", "MATERIALIZING"].includes(hint.state)) return;
  await db().$transaction(async (tx) => {
    const campaign = await campaignLock(tx, hint.id);
    if (
      !["APPROVED", "MATERIALIZING"].includes(campaign.state) ||
      !campaign.activeRevisionId ||
      campaign.cutoffEpoch === null ||
      campaign.remaining === null
    )
      return;
    const batch = await tx.subscriber.findMany({
      where: {
        ...audience,
        verifiedEpoch: { lte: campaign.cutoffEpoch },
        id: campaign.cursor ? { gt: campaign.cursor } : undefined,
      },
      orderBy: { id: "asc" },
      take: 50,
      select: { id: true },
    });
    let remaining = campaign.remaining;
    for (const item of batch) {
      if (remaining === 0) break;
      const member = await lockMember(tx, item.id);
      if (
        !member ||
        member.status !== "ACTIVE" ||
        (await suppression(tx, member.lookup))
      )
        continue;
      const row = await tx.subscriber.findUnique({
        where: { id: item.id },
        select: { verifiedEpoch: true },
      });
      if (
        row?.verifiedEpoch === null ||
        row?.verifiedEpoch === undefined ||
        row.verifiedEpoch > campaign.cutoffEpoch
      )
        continue;
      const token = await tx.emailToken.findFirst({
        where: {
          subscriberId: member.id,
          generation: member.generation,
          purpose: "UNSUBSCRIBE",
          revokedAt: null,
        },
      });
      if (!token) continue;
      await enqueue(tx, {
        logicalKey: `launch:${campaign.id}:${member.id}`,
        kind: "LAUNCH",
        subscriberId: member.id,
        generation: member.generation,
        campaignId: campaign.id,
        revisionId: campaign.activeRevisionId,
        tokenSelector: token.selector,
      });
      remaining--;
    }
    const done = batch.length < 50 || remaining === 0;
    await tx.campaign.update({
      where: { id: campaign.id },
      data: {
        remaining,
        cursor: batch.at(-1)?.id ?? campaign.cursor,
        state: done ? "RUNNING" : "MATERIALIZING",
        materialized: done,
      },
    });
  });
}
export async function privacyRequest(
  email: string,
  reference: string,
  ctx: Context,
) {
  await db().$transaction(async (tx) => {
    await tx.$queryRaw`SELECT "id" FROM "EnrollmentEpoch" WHERE "id"=1 FOR SHARE`;
    const candidate = await tx.subscriber.findUnique({
      where: { lookup: lookup(email) },
    });
    if (!candidate) return;
    const member = await lockMember(tx, candidate.id);
    if (!member || member.status === "DELETION_PENDING") return;
    const request = await tx.privacyRequest.upsert({
      where: { supportReference: hash(reference) },
      create: {
        supportReference: hash(reference),
        subscriberId: member.id,
        state: "PENDING",
        expiresAt: new Date(Date.now() + day),
      },
      update: {},
    });
    if (
      request.subscriberId !== member.id ||
      request.tokenSelector ||
      request.state !== "PENDING" ||
      request.expiresAt <= new Date()
    )
      return;
    if (await suppression(tx, member.lookup)) {
      await tx.privacyRequest.update({
        where: { id: request.id },
        data: { state: "SUPPORT_PROOF_REQUIRED" },
      });
    } else {
      const token = await issue(tx, member, "PRIVACY");
      await tx.privacyRequest.update({
        where: { id: request.id },
        data: { tokenSelector: token.selector },
      });
      await enqueue(tx, {
        logicalKey: "privacy:" + request.id,
        kind: "PRIVACY",
        subscriberId: member.id,
        generation: member.generation,
        tokenSelector: token.selector,
      });
    }
    await audit(tx, ctx, "privacy.admit", request.id);
  });
}
export const privacyInput = z.strictObject({
  email: z
    .string()
    .max(320)
    .transform((value, ctx) => {
      const result = normalizeEmail(value);
      if (!result) {
        ctx.addIssue({ code: "custom", message: "Invalid email" });
        return z.NEVER;
      }
      return result;
    }),
  type: z.literal("deletion"),
  supportReference: z.string().trim().min(8).max(80),
});
