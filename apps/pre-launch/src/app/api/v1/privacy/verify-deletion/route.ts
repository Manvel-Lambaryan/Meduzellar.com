import { z } from "zod";
import {
  handle,
  json,
  output,
  rate,
  sameOrigin,
  source,
} from "@/lib/security/http";
import { applyCredential } from "@/lib/waitlist/service";

export async function POST(req: Request) {
  return handle(async () => {
    sameOrigin(req);
    const { token } = z
      .strictObject({ token: z.string().length(97) })
      .parse(await json(req));
    await rate("verify-deletion", source(req), 30, 600);
    await applyCredential(token, "PRIVACY");
    return output({ ok: true }, 202);
  });
}
