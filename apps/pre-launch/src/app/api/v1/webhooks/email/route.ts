import { Resend } from "resend";
import { z } from "zod";
import { bytes, handle, HttpError, nonCookie } from "@/lib/security/http";
import { normalizeEmail } from "@/lib/security/crypto";
import { suppressWaitlistAddresses } from "@/lib/waitlist/json-service";
import { storageConfigured } from "@/lib/waitlist/json-storage";

const schema = z.object({
  type: z.string().max(90),
  created_at: z.iso.datetime({ offset: true }),
  data: z.object({
    email_id: z.string().max(120),
    to: z.array(z.string().max(320)).max(50).optional(),
  }),
});
export async function POST(req: Request) {
  return handle(async () => {
    nonCookie(req);
    const secret = process.env.RESEND_WEBHOOK_SECRET;
    if (!secret) throw new HttpError(401, "authentication_required");
    if (req.headers.get("content-type")?.split(";")[0] !== "application/json")
      throw new HttpError(400, "invalid_input");
    const id = req.headers.get("svix-id") ?? "";
    const timestamp = req.headers.get("svix-timestamp") ?? "";
    const signature = req.headers.get("svix-signature") ?? "";
    if (
      !/^[A-Za-z0-9_-]{1,120}$/.test(id) ||
      !/^\d{10}$/.test(timestamp) ||
      Math.abs(Date.now() - Number(timestamp) * 1000) > 300_000 ||
      !signature ||
      signature.length > 2000
    )
      throw new HttpError(401, "authentication_required");
    const payload = await bytes(req, 128 * 1024);
    let verified: unknown;
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      verified = resend.webhooks.verify({
        payload,
        headers: { id, timestamp, signature },
        webhookSecret: secret,
      });
    } catch {
      throw new HttpError(401, "authentication_required");
    }
    const event = schema.parse(verified);
    if (storageConfigured()) {
      if (
        ["email.bounced", "email.complained", "email.suppressed"].includes(
          event.type,
        )
      ) {
        const addresses = event.data.to?.map(normalizeEmail);
        if (!addresses?.length || addresses.some((address) => !address))
          throw new HttpError(400, "invalid_input");
        await suppressWaitlistAddresses(
          addresses.filter((address): address is string => Boolean(address)),
        );
      }
    } else if (process.env.VERCEL !== "1") {
      const { emailEvent } = await import("@/lib/delivery/webhook");
      await emailEvent({
        eventId: id,
        messageId: event.data.email_id,
        kind: event.type,
        eventTime: new Date(event.created_at),
      });
    } else throw new HttpError(503, "unavailable");
    return new Response(null, {
      status: 204,
      headers: { "Cache-Control": "no-store" },
    });
  });
}
