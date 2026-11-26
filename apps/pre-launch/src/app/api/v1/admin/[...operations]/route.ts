import { z } from "zod";
import { operator } from "@/lib/security/operator";
import {
  handle,
  HttpError,
  json,
  output,
  rate,
  sameOrigin,
} from "@/lib/security/http";
import * as campaigns from "@/lib/campaigns/service";
import { db } from "@/lib/db/client";

type Params = { params: Promise<{ operations: string[] }> };
const uuid = z.uuid();
function idem(req: Request) {
  const key = req.headers.get("idempotency-key") ?? "";
  if (!/^[A-Za-z0-9_-]{16,96}$/.test(key))
    throw new HttpError(400, "invalid_input");
  return key;
}
export async function GET(req: Request, { params }: Params) {
  return handle(async () => {
    const { actor } = await operator(req);
    await rate("operator-read", actor, 120, 600);
    const [section, id, end] = (await params).operations;
    if (section !== "campaigns" || end) throw new HttpError(404, "not_found");
    if (!id) {
      const campaign = await db().campaign.findUnique({
        where: { key: "official-launch" },
        select: { id: true },
      });
      return output(campaign);
    }
    return output(await campaigns.status(uuid.parse(id)));
  });
}
export async function POST(req: Request, { params }: Params) {
  return handle(async (requestId) => {
    sameOrigin(req);
    const [section, id, action, extra] = (await params).operations;
    if (extra || (section !== "campaigns" && section !== "privacy-requests"))
      throw new HttpError(404, "not_found");
    const owner =
      section === "privacy-requests" ||
      ["approve", "pause", "resume", "cancel"].includes(action);
    const { actor } = await operator(req, {
      owner,
      fresh: owner || action === "test",
    });
    await rate("operator-write", actor, 35, 600);
    const value = await json(req);
    const context = { actor, requestId };
    if (section === "privacy-requests" && !id) {
      const { email, supportReference } = campaigns.privacyInput.parse(value);
      await campaigns.privacyRequest(email, supportReference, context);
      return output({ ok: true }, 202);
    }
    if (section === "campaigns" && !id)
      return output(
        await campaigns.create(campaigns.draft.parse(value), context),
        201,
      );
    const campaignId = uuid.parse(id);
    if (action === "revisions")
      return output(
        await campaigns.revise(
          campaignId,
          campaigns.draft.extend({ expectedRevision: uuid }).parse(value),
          context,
        ),
        201,
      );
    if (action === "preview")
      return output(
        await campaigns.preview(
          campaignId,
          campaigns.revisionSchema.parse(value).revisionId,
          context,
        ),
      );
    if (action === "test")
      return output(
        await campaigns.testSend(
          campaignId,
          campaigns.testSchema.parse(value),
          idem(req),
          context,
        ),
        202,
      );
    if (action === "approve")
      await campaigns.approve(
        campaignId,
        campaigns.approvalSchema.parse(value),
        idem(req),
        context,
      );
    else if (action === "pause" || action === "resume" || action === "cancel")
      await campaigns.change(
        campaignId,
        action,
        campaigns.changeSchema.parse(value).expectedState,
        idem(req),
        context,
      );
    else throw new HttpError(404, "not_found");
    return output({ ok: true }, 202);
  });
}
