import { HttpError, local, origin } from "@/lib/security/http";
const testSecret = "1x0000000000000000000000000000000AA";
export async function challenge(token: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) throw new HttpError(503, "unavailable");
  const test = secret === testSecret && local() && process.env.VERCEL !== "1";
  if (secret === testSecret && !test) throw new HttpError(503, "unavailable");
  let data: { success?: boolean; hostname?: string; action?: string };
  try {
    const reply = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: new URLSearchParams({ secret, response: token }),
        signal: AbortSignal.timeout(6000),
        cache: "no-store",
      },
    );
    if (!reply.ok) throw new Error();
    data = await reply.json();
  } catch {
    throw new HttpError(503, "unavailable");
  }
  const constrained = test
    ? data.hostname === "example.com" && !data.action
    : data.hostname === new URL(origin()).hostname &&
      data.action === "subscribe";
  if (data.success !== true || !constrained)
    throw new HttpError(400, "challenge");
}
