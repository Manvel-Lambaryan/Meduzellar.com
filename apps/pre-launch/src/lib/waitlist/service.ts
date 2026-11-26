import { randomUUID } from "node:crypto";
import { db, type Prisma } from "@/lib/db/client";
import { consentCopy, consentVersion } from "@/lib/content";
import {
  credential,
  fromToken,
  hash,
  lookup,
  makeSelector,
  same,
  seal,
  type Purpose,
} from "@/lib/security/crypto";
import { HttpError } from "@/lib/security/http";

type Tx = Prisma.TransactionClient;
type Member = {
  id: string;
  lookup: string;
  generation: number;
  status: "PENDING" | "ACTIVE" | "UNSUBSCRIBED" | "DELETION_PENDING";
};
export const day = 86_400_000;
export async function lockMember(tx: Tx, id: string) {
  const [row] = await tx.$queryRaw<
    Member[]
  >`SELECT "id","lookup","generation","status" FROM "Subscriber" WHERE "id"=${id}::uuid FOR UPDATE`;
  return row;
}
export function suppression(tx: Tx, digest: string) {
  return tx.suppression.findFirst({
    where: {
      lookup: digest,
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
    },
  });
}
export async function issue(tx: Tx, member: Member, purpose: Purpose) {
  const selector = makeSelector();
  return tx.emailToken.create({
    data: {
      selector,
      subscriberId: member.id,
      generation: member.generation,
      purpose,
      digest: hash(credential(purpose, selector, member.generation)),
      expiresAt: purpose === "UNSUBSCRIBE" ? null : new Date(Date.now() + day),
    },
  });
}
export async function enqueue(
  tx: Tx,
  data: Prisma.DeliveryUncheckedCreateInput,
) {
  const delivery = await tx.delivery.create({ data });
  await tx.job.create({ data: { deliveryId: delivery.id } });
  return delivery;
}
async function event(
  tx: Tx,
  member: Member,
  kind: "GRANTED" | "VERIFIED" | "REVOKED",
) {
  await tx.consentEvent.create({
    data: {
      subscriberId: member.id,
      generation: member.generation,
      kind,
      version: consentVersion,
      contentHash: hash(consentCopy),
      locale: "en",
      source: "waitlist",
    },
  });
}
export async function subscribe(email: string) {
  const digest = lookup(email);
  await db().$transaction(async (tx) => {
    const newId = randomUUID();
    const ciphertext = seal(email, digest);
    await tx.$executeRaw`INSERT INTO "Subscriber" ("id","lookup","ciphertext","updatedAt") VALUES (${newId}::uuid,${digest},${ciphertext},NOW()) ON CONFLICT ("lookup") DO NOTHING`;
    const candidate = await tx.subscriber.findUniqueOrThrow({
      where: { lookup: digest },
      select: { id: true },
    });
    const member = await lockMember(tx, candidate.id);
    if (
      !member ||
      member.status === "ACTIVE" ||
      member.status === "DELETION_PENDING" ||
      (await suppression(tx, digest))
    )
      return;
    const recent = await tx.emailToken.findMany({
      where: {
        subscriberId: member.id,
        purpose: "VERIFY",
        issuedAt: { gt: new Date(Date.now() - day) },
      },
      orderBy: { issuedAt: "desc" },
      take: 3,
    });
    if (
      recent.length >= 3 ||
      (recent[0] && Date.now() - recent[0].issuedAt.getTime() < 30 * 60_000)
    )
      return;
    if (member.status === "UNSUBSCRIBED") {
      member.generation++;
      await tx.subscriber.update({
        where: { id: member.id },
        data: {
          status: "PENDING",
          generation: member.generation,
          verifiedAt: null,
          verifiedEpoch: null,
          unsubscribedAt: null,
        },
      });
    }
    const grant = await tx.consentEvent.findUnique({
      where: {
        subscriberId_generation_kind: {
          subscriberId: member.id,
          generation: member.generation,
          kind: "GRANTED",
        },
      },
    });
    if (!grant) await event(tx, member, "GRANTED");
    await tx.emailToken.updateMany({
      where: {
        subscriberId: member.id,
        generation: member.generation,
        purpose: "VERIFY",
        consumedAt: null,
        revokedAt: null,
      },
      data: { revokedAt: new Date() },
    });
    const verify = await issue(tx, member, "VERIFY");
    await enqueue(tx, {
      logicalKey: "verify:" + verify.selector,
      kind: "VERIFY",
      subscriberId: member.id,
      generation: member.generation,
      tokenSelector: verify.selector,
    });
  });
}
export async function applyCredential(token: string, purpose: Purpose) {
  const selector = fromToken(token);
  if (!selector) throw new HttpError(400, "invalid_token");
  return db().$transaction(async (tx) => {
    const hint = await tx.emailToken.findUnique({
      where: { selector },
      select: { subscriberId: true },
    });
    if (!hint) throw new HttpError(400, "invalid_token");
    const [epoch] =
      purpose === "VERIFY"
        ? await tx.$queryRaw<
            { epoch: number }[]
          >`SELECT "epoch" FROM "EnrollmentEpoch" WHERE "id"=1 FOR SHARE`
        : [];
    const member = await lockMember(tx, hint.subscriberId);
    const stored = await tx.emailToken.findUnique({ where: { selector } });
    if (
      !member ||
      !stored ||
      stored.purpose !== purpose ||
      stored.revokedAt ||
      !same(stored.digest, hash(token))
    )
      throw new HttpError(400, "invalid_token");
    if (purpose === "UNSUBSCRIBE") {
      if (
        member.status === "UNSUBSCRIBED" ||
        member.status === "DELETION_PENDING"
      )
        return;
      await tx.subscriber.update({
        where: { id: member.id },
        data: { status: "UNSUBSCRIBED", unsubscribedAt: new Date() },
      });
      await event(tx, member, "REVOKED");
      await cancelMember(tx, member.id);
      await tx.recoveryEvent.create({
        data: { lookup: member.lookup, kind: "UNSUBSCRIBE" },
      });
      return;
    }
    if (stored.generation !== member.generation)
      throw new HttpError(400, "invalid_token");
    if (stored.consumedAt) return;
    if (!stored.expiresAt || stored.expiresAt <= new Date())
      throw new HttpError(400, "invalid_token");
    if (purpose === "PRIVACY") {
      const request = await tx.privacyRequest.findUnique({
        where: { tokenSelector: selector },
      });
      if (
        !request ||
        request.state !== "PENDING" ||
        request.expiresAt <= new Date()
      )
        throw new HttpError(400, "invalid_token");
      await tx.subscriber.update({
        where: { id: member.id },
        data: { status: "DELETION_PENDING" },
      });
      await cancelMember(tx, member.id);
      await tx.emailToken.update({
        where: { selector },
        data: { consumedAt: new Date() },
      });
      await tx.privacyRequest.update({
        where: { id: request.id },
        data: { state: "VERIFIED", verifiedAt: new Date() },
      });
      await tx.recoveryEvent.create({
        data: { lookup: member.lookup, kind: "ERASE" },
      });
      return;
    }
    if (
      !epoch ||
      member.status !== "PENDING" ||
      (await suppression(tx, member.lookup))
    )
      throw new HttpError(400, "invalid_token");
    const grant = await tx.consentEvent.findUnique({
      where: {
        subscriberId_generation_kind: {
          subscriberId: member.id,
          generation: member.generation,
          kind: "GRANTED",
        },
      },
    });
    if (!grant || grant.version !== consentVersion)
      throw new HttpError(400, "invalid_token");
    await tx.emailToken.update({
      where: { selector },
      data: { consumedAt: new Date() },
    });
    await tx.subscriber.update({
      where: { id: member.id },
      data: {
        status: "ACTIVE",
        verifiedAt: new Date(),
        verifiedEpoch: epoch.epoch,
      },
    });
    await event(tx, member, "VERIFIED");
    const unsubscribe = await issue(tx, member, "UNSUBSCRIBE");
    await enqueue(tx, {
      logicalKey: `confirm:${member.id}:${member.generation}`,
      kind: "CONFIRM",
      subscriberId: member.id,
      generation: member.generation,
      tokenSelector: unsubscribe.selector,
    });
  });
}
export async function cancelMember(tx: Tx, subscriberId: string) {
  const where = {
    subscriberId,
    kind: { not: "PRIVACY" as const },
    state: {
      in: ["QUEUED", "RETRY", "LEASED"] as ("QUEUED" | "RETRY" | "LEASED")[],
    },
    firstSubmission: null,
  };
  const affected = await tx.delivery.updateManyAndReturn({
    where,
    data: { state: "CANCELED" },
    select: { id: true },
  });
  await tx.job.updateMany({
    where: { deliveryId: { in: affected.map((row) => row.id) } },
    data: { state: "CANCELED", leaseToken: null, leaseUntil: null },
  });
}
