import { db } from "@/lib/db/client";
import { lockMember, cancelMember } from "@/lib/waitlist/service";

const mapping = {
  "email.sent": "ACCEPTED",
  "email.delayed": "DELAYED",
  "email.delivery_delayed": "DELAYED",
  "email.delivered": "DELIVERED",
  "email.bounced": "BOUNCED",
  "email.complained": "COMPLAINED",
  "email.suppressed": "BOUNCED",
  "email.failed": "FAILED",
} as const;
const order: Record<string, number> = {
  ACCEPTED: 10,
  DELAYED: 20,
  FAILED: 25,
  DELIVERED: 30,
  BOUNCED: 40,
  COMPLAINED: 50,
};
type Incoming = {
  eventId: string;
  messageId: string;
  kind: string;
  eventTime: Date;
};
export async function emailEvent(event: Incoming) {
  await db().$transaction(async (tx) => {
    const receipt = await tx.webhookReceipt.upsert({
      where: {
        provider_eventId: { provider: "resend", eventId: event.eventId },
      },
      create: { provider: "resend", ...event },
      update: {},
    });
    if (receipt.processedAt) return;
    const hint = await tx.delivery.findUnique({
      where: { providerId: receipt.messageId },
    });
    const state = mapping[receipt.kind as keyof typeof mapping];
    if (!hint || !state) return;
    const member = hint.subscriberId
      ? await lockMember(tx, hint.subscriberId)
      : null;
    await tx.$queryRaw`SELECT "id" FROM "Delivery" WHERE "id"=${hint.id}::uuid FOR UPDATE`;
    const delivery = await tx.delivery.findUnique({ where: { id: hint.id } });
    if (!delivery) return;
    if ((order[delivery.state] ?? 0) < order[state])
      await tx.delivery.update({ where: { id: delivery.id }, data: { state } });
    if (member && (state === "COMPLAINED" || state === "BOUNCED")) {
      const reason = state === "COMPLAINED" ? "complaint" : "hard-bounce";
      await tx.suppression.upsert({
        where: { lookup_reason: { lookup: member.lookup, reason } },
        create: { lookup: member.lookup, reason, provenance: "resend" },
        update: {},
      });
      await cancelMember(tx, member.id);
      await tx.recoveryEvent.create({
        data: { lookup: member.lookup, kind: reason },
      });
    }
    await tx.webhookReceipt.update({
      where: {
        provider_eventId: { provider: "resend", eventId: event.eventId },
      },
      data: { processedAt: new Date() },
    });
  });
}
