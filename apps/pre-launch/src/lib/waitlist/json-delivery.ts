import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { credential, seal, unseal } from "@/lib/security/crypto";
import { local, origin } from "@/lib/security/http";
import { authorizeMail, claimMail, finishMail } from "./json-service";

function mailConfiguration():
  { directory: string } | { apiKey: string; from: string } | undefined {
  if (
    process.env.VERCEL !== "1" &&
    local() &&
    process.env.WAITLIST_LOCAL_DIRECTORY
  )
    return { directory: process.env.WAITLIST_LOCAL_DIRECTORY } as const;
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.WAITLIST_FROM_EMAIL?.trim();
  if (
    apiKey &&
    from &&
    !local() &&
    process.env.RESEND_WEBHOOK_SECRET?.trim() &&
    (process.env.CRON_SECRET?.length ?? 0) >= 32
  )
    return { apiKey, from } as const;
}

export function deliveryConfigured() {
  return Boolean(mailConfiguration());
}

export async function deliverWaitlistMail() {
  const configuration = mailConfiguration();
  if (!configuration) return;
  const job = await claimMail();
  if (!job) return;
  const target = await authorizeMail(job.id, job.lease);
  if (!target) return;
  const { proof, subscriber } = target;
  const to = unseal(subscriber.ciphertext, proof.lookup);
  const token = credential(proof.purpose, job.id, proof.generation);
  const verify = proof.purpose === "VERIFY";
  const link = origin() + (verify ? "/verify#" : "/unsubscribe#") + token;
  const subject = verify
    ? "Confirm your Meduzellar early access"
    : "Your Meduzellar email is confirmed";
  const text = verify
    ? "Confirm your email to join the Meduzellar waitlist: " + link
    : "Your email is confirmed. We will contact you once when Meduzellar launches.\n\nUnsubscribe: " +
      link;
  const headers =
    !verify && !local()
      ? {
          "List-Unsubscribe":
            "<" + origin() + "/api/v1/waitlist/one-click/" + token + ">",
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        }
      : undefined;
  let sent = false;
  try {
    if ("directory" in configuration) {
      const domain = process.env.LOCAL_TEST_MAIL_DOMAIN ?? "example.test";
      if (!/^[a-z0-9.-]+\.test$/.test(domain) || !to.endsWith("@" + domain))
        throw new Error("Synthetic address required");
      const captures = join(configuration.directory, "captured-mail");
      await mkdir(captures, { recursive: true, mode: 0o700 });
      const message = seal(
        JSON.stringify({ to, subject, text }),
        "waitlist-mail:" + job.id,
      );
      await writeFile(
        join(captures, job.id + ".json"),
        JSON.stringify({ message }),
        {
          flag: "wx",
          mode: 0o600,
          flush: true,
        },
      ).catch((error: NodeJS.ErrnoException) => {
        if (error.code !== "EEXIST") throw error;
      });
      sent = true;
    } else {
      const reply = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + configuration.apiKey,
          "Content-Type": "application/json",
          "Idempotency-Key": "meduzellar-waitlist/" + job.id,
        },
        body: JSON.stringify({
          from: configuration.from,
          to: [to],
          subject,
          text,
          headers,
        }),
        signal: AbortSignal.timeout(6000),
        cache: "no-store",
      });
      sent = reply.ok;
    }
  } catch {
    // The committed job remains recoverable through the same idempotency key.
  }
  if (!sent)
    console.warn(
      JSON.stringify({ event: "waitlist_delivery_retry", jobId: job.id }),
    );
  await finishMail(job.id, job.lease, sent);
}

export async function tryWaitlistDelivery() {
  try {
    await deliverWaitlistMail();
  } catch {
    console.error(JSON.stringify({ event: "waitlist_delivery_unavailable" }));
  }
}
