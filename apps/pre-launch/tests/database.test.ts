import { beforeAll, afterAll, describe, expect, it } from "vitest";
import { randomUUID } from "node:crypto";
import { db } from "@/lib/db/client";
import { credential, lookup, unseal } from "@/lib/security/crypto";
import { subscribe, applyCredential } from "@/lib/waitlist/service";
import { tick } from "@/lib/delivery/worker";
import { emailEvent } from "@/lib/delivery/webhook";
import * as campaigns from "@/lib/campaigns/service";

const email = "Integration-" + randomUUID() + "@example.test";
const second = "Late-" + randomUUID() + "@example.test";
let id: string;
let revoke: string;
const context = { actor: "signed-test-operator", requestId: randomUUID() };
function key() {
  return randomUUID();
}
beforeAll(async () => {
  if (!process.env.TEST_DATABASE_URL)
    throw new Error("TEST_DATABASE_URL is required for integration validation");
  const url = new URL(process.env.TEST_DATABASE_URL);
  if (url.hostname !== "127.0.0.1" || url.pathname !== "/prelaunch_test")
    throw new Error("Dedicated test database required");
  process.env.DATABASE_URL = url.href;
  // The test database is separate. Retire only earlier runs of these exact fixtures.
  await db().$transaction(async (tx) => {
    const campaign = await tx.campaign.findUnique({
      where: { key: "official-launch" },
      include: { revisions: true },
    });
    if (
      campaign &&
      campaign.revisions.some(
        (revision) => revision.subject === "Integration launch!",
      )
    ) {
      await tx.approval.deleteMany({
        where: { campaignId: campaign.id, actor: context.actor },
      });
      await tx.delivery.deleteMany({ where: { campaignId: campaign.id } });
      await tx.campaignRevision.deleteMany({
        where: { campaignId: campaign.id },
      });
      await tx.campaign.delete({ where: { id: campaign.id } });
    }
    const rows = await tx.subscriber.findMany({
      select: { id: true, lookup: true, ciphertext: true },
    });
    const fixtures = rows.filter((row) =>
      /^(Integration|Late)-[0-9a-f-]{36}@example\.test$/.test(
        unseal(row.ciphertext, row.lookup),
      ),
    );
    await tx.subscriber.deleteMany({
      where: { id: { in: fixtures.map((row) => row.id) } },
    });
  });
});
afterAll(async () => {
  if (process.env.TEST_DATABASE_URL) await db().$disconnect();
});
async function proof(
  memberId: string,
  purpose: "VERIFY" | "UNSUBSCRIBE" | "PRIVACY",
) {
  const token = await db().emailToken.findFirstOrThrow({
    where: { subscriberId: memberId, purpose },
    orderBy: { issuedAt: "desc" },
  });
  return credential(purpose, token.selector, token.generation);
}
async function memberId(address: string) {
  return (
    await db().subscriber.findUniqueOrThrow({
      where: { lookup: lookup(address) },
    })
  ).id;
}

describe("PostgreSQL waitlist and delivery", () => {
  it("converges concurrent enrollment and delivers captured mail once", async () => {
    await Promise.all(Array.from({ length: 4 }, () => subscribe(email)));
    id = await memberId(email);
    expect(
      await db().emailToken.count({
        where: { subscriberId: id, purpose: "VERIFY" },
      }),
    ).toBe(1);
    expect(await db().consentEvent.count({ where: { subscriberId: id } })).toBe(
      1,
    );
    const pending = await db().delivery.findFirstOrThrow({
      where: { subscriberId: id, kind: "VERIFY" },
    });
    await db().job.update({
      where: { deliveryId: pending.id },
      data: {
        state: "LEASED",
        leaseToken: key(),
        leaseUntil: new Date(Date.now() - 1000),
      },
    });
    await Promise.all([tick(), tick()]);
    const result = await db().delivery.findFirstOrThrow({
      where: { subscriberId: id, kind: "VERIFY" },
      include: { messages: true },
    });
    expect(result.state).toBe("DELIVERED");
    expect(
      JSON.parse(unseal(result.messages!.sealed, "mail:" + result.id)).to,
    ).toBe(email);
    expect(
      (await db().subscriber.findUniqueOrThrow({ where: { id } })).ciphertext,
    ).not.toContain(email);
  });
  it("verifies once under parallel requests and refuses another token purpose", async () => {
    const token = await proof(id, "VERIFY");
    await expect(applyCredential(token, "UNSUBSCRIBE")).rejects.toMatchObject({
      status: 400,
    });
    await Promise.all([
      applyCredential(token, "VERIFY"),
      applyCredential(token, "VERIFY"),
    ]);
    revoke = await proof(id, "UNSUBSCRIBE");
    expect(
      await db().delivery.count({
        where: { subscriberId: id, kind: "CONFIRM" },
      }),
    ).toBe(1);
  });
  it("freezes the approved audience, honors pause, and captures one launch message", async () => {
    // A new test run gets its own dedicated disposable test database.
    const { id: campaign, revisionId } = await campaigns.create(
      {
        subject: "Integration launch!",
        bodyVersion: "launch-v1",
        launchUrl: "https://meduzellar.test/",
      },
      context,
    );
    const preview = await campaigns.preview(campaign, revisionId, context);
    const request = {
      revisionId,
      digest: preview.digest,
      maxRecipients: 1,
      confirm: true as const,
    };
    await expect(
      campaigns.approve(campaign, request, key(), context),
    ).rejects.toMatchObject({ status: 409 });
    await campaigns.testSend(
      campaign,
      { revisionId, testRecipientId: "local-review" },
      key(),
      context,
    );
    await tick();
    const approval = key();
    await campaigns.approve(campaign, request, approval, context);
    await campaigns.approve(campaign, request, approval, context);
    await subscribe(second);
    const late = await memberId(second);
    await applyCredential(await proof(late, "VERIFY"), "VERIFY");
    await campaigns.change(campaign, "pause", "APPROVED", key(), context);
    await tick();
    expect(
      await db().delivery.count({
        where: { campaignId: campaign, kind: "LAUNCH" },
      }),
    ).toBe(0);
    await campaigns.change(campaign, "resume", "PAUSED", key(), context);
    await tick();
    await tick();
    const sent = await db().delivery.findMany({
      where: { campaignId: campaign, kind: "LAUNCH" },
    });
    expect(sent.map((row) => [row.subscriberId, row.state])).toEqual([
      [id, "DELIVERED"],
    ]);
    expect((await campaigns.status(campaign)).campaign.state).toBe("COMPLETED");
  });
  it("unsubscribes idempotently and keeps provider suppression after a delayed event", async () => {
    await Promise.all([
      applyCredential(revoke, "UNSUBSCRIBE"),
      applyCredential(revoke, "UNSUBSCRIBE"),
    ]);
    expect(
      (await db().subscriber.findUniqueOrThrow({ where: { id } })).status,
    ).toBe("UNSUBSCRIBED");
    const delivery = await db().delivery.findFirstOrThrow({
      where: { subscriberId: id, kind: "CONFIRM" },
    });
    const first = {
      eventId: key(),
      messageId: delivery.providerId!,
      kind: "email.complained",
      eventTime: new Date(),
    };
    await emailEvent(first);
    await emailEvent(first);
    await emailEvent({ ...first, eventId: key(), kind: "email.delivered" });
    expect(
      (await db().delivery.findUniqueOrThrow({ where: { id: delivery.id } }))
        .state,
    ).toBe("COMPLAINED");
    expect(
      await db().suppression.count({ where: { lookup: lookup(email) } }),
    ).toBe(1);
  });
  it("requires mailbox proof, exports erasure evidence and removes the synthetic subscriber", async () => {
    const late = await memberId(second);
    await campaigns.privacyRequest(second, "case-" + key(), context);
    await tick();
    const token = await proof(late, "PRIVACY");
    await applyCredential(token, "PRIVACY");
    await applyCredential(token, "PRIVACY");
    await tick();
    expect(
      await db().subscriber.findUnique({ where: { id: late } }),
    ).toBeNull();
    expect(
      await db().recoveryEvent.count({
        where: {
          lookup: lookup(second),
          kind: "ERASE",
          exportedAt: { not: null },
        },
      }),
    ).toBe(1);
  });
});
