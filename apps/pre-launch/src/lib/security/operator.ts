import { createClerkClient, verifyToken } from "@clerk/nextjs/server";
import { db } from "@/lib/db/client";
import { HttpError, origin } from "@/lib/security/http";

function hasFactors(fva: unknown): fva is [number, number] {
  return (
    Array.isArray(fva) &&
    fva.length === 2 &&
    fva.every((value) => Number.isInteger(value) && value >= 0)
  );
}
export function freshFactor(fva: unknown, issuedAt: number, now = Date.now()) {
  if (
    !hasFactors(fva) ||
    !Number.isSafeInteger(issuedAt) ||
    issuedAt * 1000 > now + 5000
  )
    return false;
  return fva[1] * 60_000 + Math.max(0, now - issuedAt * 1000) <= 600_000;
}
export async function signedOperatorClaims(
  token: string,
  issuer: string,
  jwtKey: string,
) {
  const claims = await verifyToken(token, {
    jwtKey,
    authorizedParties: [origin()],
  });
  if (
    claims.iss !== issuer ||
    claims.azp !== origin() ||
    !claims.sid ||
    !claims.sub ||
    !hasFactors(claims.fva)
  )
    throw new HttpError(401, "authentication_required");
  return claims;
}
export async function operator(
  req: Request,
  options: { fresh?: boolean; owner?: boolean } = {},
) {
  const issuer = process.env.CLERK_ISSUER;
  const secretKey = process.env.CLERK_SECRET_KEY;
  const jwtKey = process.env.CLERK_JWT_KEY?.replaceAll("\\n", "\n");
  if (!issuer || !secretKey || !jwtKey)
    throw new HttpError(401, "authentication_required");
  const header = req.headers.get("authorization");
  const token = header?.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token || token.length > 8192)
    throw new HttpError(401, "authentication_required");
  const clerk = createClerkClient({ secretKey });
  let claims: Awaited<ReturnType<typeof signedOperatorClaims>>;
  try {
    claims = await signedOperatorClaims(token, issuer, jwtKey);
    const session = await clerk.sessions.getSession(claims.sid);
    if (session.status !== "active" || session.userId !== claims.sub)
      throw new Error();
  } catch {
    throw new HttpError(401, "authentication_required");
  }
  const grant = await db().operatorGrant.findUnique({
    where: { issuer_subject: { issuer, subject: claims.sub } },
  });
  if (
    !grant ||
    grant.revokedAt ||
    (options.owner && grant.role !== "OWNER") ||
    (options.fresh && !freshFactor(claims.fva, claims.iat))
  )
    throw new HttpError(403, "forbidden");
  return { actor: `${issuer}|${claims.sub}`, role: grant.role };
}
