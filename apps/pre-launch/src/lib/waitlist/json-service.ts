import { randomUUID } from "node:crypto";
import { z } from "zod";
import { consentCopy, consentVersion } from "@/lib/content";
import {
  credential,
  fromToken,
  hash,
  lookup,
  mac,
  makeSelector,
  same,
  seal,
} from "@/lib/security/crypto";
import { HttpError } from "@/lib/security/http";
import { updateJson } from "./json-storage";

const day = 86_400_000;
const stamp = z.number().int().nonnegative();
const digest = z.string().regex(/^[a-f0-9]{64}$/);
const selector = z.string().regex(/^[a-f0-9]{32}$/);
const member = z.strictObject({
  ciphertext: z.string().regex(/^v1\.[a-f0-9]{24}\.[a-f0-9]+\.[a-f0-9]{32}$/),
  state: z.enum(["PENDING", "ACTIVE", "UNSUBSCRIBED"]),
  generation: z.number().int().positive(),
  registeredAt: stamp,
  confirmedAt: stamp.optional(),
  unsubscribedAt: stamp.optional(),
  consent: z
    .array(
      z.strictObject({
        at: stamp,
        generation: z.number().int().positive(),
        kind: z.enum(["GRANTED", "VERIFIED", "REVOKED"]),
        version: z.string().min(1),
        contentHash: digest,
      }),
    )
    .min(1),
  verificationAttempts: z.array(stamp).max(3),
  verifying: selector.optional(),
});
const token = z.strictObject({
  lookup: digest,
  generation: z.number().int().positive(),
  digest,
  purpose: z.enum(["VERIFY", "UNSUBSCRIBE"]),
  expiresAt: stamp.optional(),
  consumedAt: stamp.optional(),
});
const job = z.strictObject({
  token: selector,
  dueAt: stamp,
  attempts: stamp,
  firstAttemptAt: stamp.optional(),
  leaseId: z.uuid().optional(),
  leaseUntil: stamp.optional(),
});
const schema = z.strictObject({
  version: z.literal(1),
  subscribers: z.record(digest, member),
  tokens: z.record(selector, token),
  outbox: z.record(selector, job),
  suppression: z.record(digest, stamp),
});
type Document = z.infer<typeof schema>;
type Member = z.infer<typeof member>;
type Purpose = z.infer<typeof token>["purpose"];
type Job = z.infer<typeof job>;

function change<R>(
  mutate: (state: Document) => { value: R; changed: boolean },
) {
  return updateJson<Document, R>(
    "waitlist.json",
    schema,
    () => ({
      version: 1,
      subscribers: {},
      tokens: {},
      outbox: {},
      suppression: {},
    }),
    mutate,
  );
}
const unchanged = { value: undefined, changed: false };
const saved = { value: undefined, changed: true };

function consent(
  current: Member,
  kind: Member["consent"][number]["kind"],
  at: number,
) {
  const grant = current.consent.findLast(
    (entry) =>
      entry.generation === current.generation && entry.kind === "GRANTED",
  );
  current.consent.push({
    at,
    generation: current.generation,
    kind,
    version: kind === "GRANTED" ? consentVersion : grant!.version,
    contentHash: kind === "GRANTED" ? hash(consentCopy) : grant!.contentHash,
  });
}

function issue(
  state: Document,
  id: string,
  current: Member,
  purpose: Purpose,
  now: number,
) {
  const key = makeSelector();
  state.tokens[key] = {
    lookup: id,
    generation: current.generation,
    purpose,
    digest: hash(credential(purpose, key, current.generation)),
    ...(purpose === "VERIFY" ? { expiresAt: now + day } : {}),
  };
  state.outbox[key] = { token: key, attempts: 0, dueAt: now };
  return key;
}

export async function enroll(email: string) {
  const id = lookup(email);
  await change((state) => {
    const now = Date.now();
    const existing = state.subscribers[id];
    if (existing?.state === "ACTIVE" || state.suppression[id] !== undefined)
      return unchanged;
    const attempts =
      existing?.verificationAttempts.filter((time) => now - time < day) ?? [];
    if (
      attempts.length >= 3 ||
      (attempts.length && now - attempts.at(-1)! < 30 * 60_000)
    )
      return unchanged;
    const current = existing ?? {
      ciphertext: seal(email, id),
      state: "PENDING",
      generation: 1,
      registeredAt: now,
      consent: [],
      verificationAttempts: [],
    };
    if (!existing || current.state === "UNSUBSCRIBED" || now - current.registeredAt >= 14 * day) {
      if (existing) current.generation++;
      current.state = "PENDING";
      current.registeredAt = now;
      delete current.confirmedAt;
      delete current.unsubscribedAt;
      consent(current, "GRANTED", now);
    }
    if (current.verifying) {
      delete state.tokens[current.verifying];
      delete state.outbox[current.verifying];
    }
    current.verificationAttempts = [...attempts, now];
    current.verifying = issue(state, id, current, "VERIFY", now);
    state.subscribers[id] = current;
    return saved;
  });
}

export async function useWaitlistToken(proof: string, purpose: Purpose) {
  const key = fromToken(proof);
  if (!key) throw new HttpError(400, "invalid_token");
  await change((state) => {
    const issued = state.tokens[key];
    const current = issued && state.subscribers[issued.lookup];
    const now = Date.now();
    if (
      !issued ||
      !current ||
      issued.purpose !== purpose ||
      !same(issued.digest, hash(proof)) ||
      (issued.purpose === "VERIFY" && issued.expiresAt === undefined) ||
      (issued.expiresAt !== undefined && issued.expiresAt <= now)
    )
      throw new HttpError(400, "invalid_token");
    if (purpose === "UNSUBSCRIBE") {
      if (current.state === "UNSUBSCRIBED") return unchanged;
      current.state = "UNSUBSCRIBED";
      current.unsubscribedAt = now;
      consent(current, "REVOKED", now);
      for (const [jobId, pending] of Object.entries(state.outbox)) {
        if (state.tokens[pending.token]?.lookup === issued.lookup)
          delete state.outbox[jobId];
      }
      return saved;
    }
    if (state.suppression[issued.lookup] !== undefined)
      throw new HttpError(400, "invalid_token");
    if (current.generation !== issued.generation)
      throw new HttpError(400, "invalid_token");
    if (issued.consumedAt && current.state === "ACTIVE") return unchanged;
    if (current.state !== "PENDING" || current.verifying !== key)
      throw new HttpError(400, "invalid_token");
    issued.consumedAt = now;
    current.state = "ACTIVE";
    current.confirmedAt = now;
    consent(current, "VERIFIED", now);
    delete state.outbox[key];
    issue(state, issued.lookup, current, "UNSUBSCRIBE", now);
    return saved;
  });
}

function eligible(state: Document, pending: Job, now: number) {
  const proof = state.tokens[pending.token];
  const subscriber = proof && state.subscribers[proof.lookup];
  if (
    !proof ||
    !subscriber ||
    state.suppression[proof.lookup] !== undefined ||
    proof.generation !== subscriber.generation ||
    (proof.purpose === "VERIFY" && proof.expiresAt === undefined) ||
    (proof.expiresAt !== undefined && proof.expiresAt <= now) ||
    pending.attempts >= 5 ||
    (pending.firstAttemptAt && now - pending.firstAttemptAt >= day - 60_000)
  )
    return;
  const expected = proof.purpose === "VERIFY" ? "PENDING" : "ACTIVE";
  if (subscriber.state !== expected) return;
  return { proof, subscriber };
}

export async function suppressWaitlistAddresses(addresses: string[]) {
  await change((state) => {
    let changed = false;
    for (const address of addresses) {
      const id = lookup(address);
      if (!state.subscribers[id] || state.suppression[id] !== undefined)
        continue;
      state.suppression[id] = Date.now();
      for (const [jobId, pending] of Object.entries(state.outbox)) {
        if (state.tokens[pending.token]?.lookup === id)
          delete state.outbox[jobId];
      }
      changed = true;
    }
    return { value: undefined, changed };
  });
}

export function claimMail() {
  return change((state) => {
    const now = Date.now();
    const expired = new Set(
      Object.entries(state.subscribers)
        .filter(([, subscriber]) =>
          subscriber.state === "PENDING"
            ? now - subscriber.registeredAt >= 14 * day
            : subscriber.state === "UNSUBSCRIBED" &&
              subscriber.unsubscribedAt !== undefined &&
              now - subscriber.unsubscribedAt >= 30 * day,
        )
        .map(([id]) => id),
    );
    let changed = expired.size > 0;
    for (const id of expired) delete state.subscribers[id];
    for (const [id, proof] of Object.entries(state.tokens)) {
      if (!expired.has(proof.lookup)) continue;
      delete state.tokens[id];
      delete state.outbox[id];
    }
    for (const [id, pending] of Object.entries(state.outbox)) {
      if ((pending.leaseUntil ?? 0) > now) continue;
      if (!eligible(state, pending, now)) {
        delete state.outbox[id];
        changed = true;
        continue;
      }
      if (pending.dueAt > now) continue;
      pending.leaseId = randomUUID();
      pending.leaseUntil = now + 90_000;
      return { changed: true, value: { id, lease: pending.leaseId } };
    }
    return { changed, value: undefined };
  });
}

export function authorizeMail(id: string, lease: string) {
  return change((state) => {
    const pending = state.outbox[id];
    const now = Date.now();
    if (
      !pending ||
      pending.leaseId !== lease ||
      (pending.leaseUntil ?? 0) <= now
    )
      return unchanged;
    const target = eligible(state, pending, now);
    if (!target) return unchanged;
    pending.firstAttemptAt ??= now;
    pending.attempts++;
    return { changed: true, value: target };
  });
}

export async function finishMail(id: string, lease: string, sent: boolean) {
  await change((state) => {
    const pending = state.outbox[id];
    if (pending?.leaseId !== lease) return unchanged;
    if (sent) delete state.outbox[id];
    else {
      delete pending.leaseId;
      delete pending.leaseUntil;
      pending.dueAt =
        Date.now() +
        [1, 5, 15, 45, 120][Math.min(Math.max(0, pending.attempts - 1), 4)] *
          60_000;
    }
    return saved;
  });
}

const limits = z.strictObject({
  version: z.literal(1),
  buckets: z.record(
    digest,
    z.strictObject({
      count: stamp,
      expires: stamp,
    }),
  ),
});

export async function waitlistRate(
  scope: string,
  identity: string,
  limit: number,
  seconds: number,
) {
  await updateJson<z.infer<typeof limits>, undefined>(
    "waitlist-limits.json",
    limits,
    () => ({ version: 1, buckets: {} }),
    (state) => {
      const now = Date.now();
      const duration = seconds * 1000;
      const start = Math.floor(now / duration) * duration;
      const expires = start + duration;
      const key = mac("RATE_KEY", JSON.stringify([scope, identity, start]));
      const current = state.buckets[key]?.count ?? 0;
      if (current >= limit)
        throw new HttpError(
          429,
          "rate_limited",
          Math.max(1, Math.ceil((expires - now) / 1000)),
        );
      for (const [id, bucket] of Object.entries(state.buckets))
        if (bucket.expires <= now) delete state.buckets[id];
      state.buckets[key] = { count: current + 1, expires };
      return saved;
    },
  );
}
