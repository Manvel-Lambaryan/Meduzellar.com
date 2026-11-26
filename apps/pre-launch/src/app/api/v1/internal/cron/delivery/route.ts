import { same } from "@/lib/security/crypto";
import { handle, HttpError, nonCookie } from "@/lib/security/http";
import { deliverWaitlistMail, deliveryConfigured } from "@/lib/waitlist/json-delivery";
export async function GET(req: Request) {
  return handle(async () => {
    nonCookie(req);
    const key = process.env.CRON_SECRET;
    if (
      !key ||
      key.length < 32 ||
      !same(req.headers.get("authorization") ?? "", `Bearer ${key}`)
    )
      throw new HttpError(401, "authentication_required");
    if (deliveryConfigured()) await deliverWaitlistMail();
    else if (process.env.VERCEL !== "1") {
      const { tick } = await import("@/lib/delivery/worker");
      await tick();
    }
    else throw new HttpError(503, "unavailable");
    return new Response(null, {
      status: 204,
      headers: { "Cache-Control": "no-store" },
    });
  });
}
