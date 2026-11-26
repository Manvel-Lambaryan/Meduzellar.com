import {
  bytes,
  handle,
  HttpError,
  nonCookie,
  origin,
  rate,
  source,
} from "@/lib/security/http";
import { fromToken } from "@/lib/security/crypto";
import { applyCredential } from "@/lib/waitlist/service";
type Params = { params: Promise<{ token: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { token } = await params;
  if (!fromToken(token)) return new Response(null, { status: 404 });
  return new Response(null, {
    status: 303,
    headers: {
      Location: origin() + "/unsubscribe#" + token,
      "Cache-Control": "no-store",
      "Referrer-Policy": "no-referrer",
    },
  });
}
export async function POST(req: Request, { params }: Params) {
  return handle(async () => {
    nonCookie(req);
    const type = req.headers.get("content-type") ?? "";
    if (
      !type.startsWith("application/x-www-form-urlencoded") &&
      !type.startsWith("multipart/form-data")
    )
      throw new HttpError(400, "invalid_input");
    const body = await bytes(req, 2048);
    const parts = await new Response(body, {
      headers: { "Content-Type": type },
    })
      .formData()
      .catch(() => null);
    if (
      !parts ||
      [...parts.keys()].length !== 1 ||
      parts.get("List-Unsubscribe") !== "One-Click"
    )
      throw new HttpError(400, "invalid_input");
    await rate("one-click", source(req), 90, 600);
    await applyCredential((await params).token, "UNSUBSCRIBE");
    return new Response(null, {
      status: 204,
      headers: { "Cache-Control": "no-store" },
    });
  });
}
