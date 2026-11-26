import { same } from "@/lib/security/crypto";
import { handle, HttpError, nonCookie } from "@/lib/security/http";
import { tick } from "@/lib/delivery/worker";
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
    await tick();
    return new Response(null, {
      status: 204,
      headers: { "Cache-Control": "no-store" },
    });
  });
}
