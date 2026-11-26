"use client";

import Link from "next/link";
import Script from "next/script";
import { useRef, useState } from "react";
import { accepted, consentCopy, consentVersion } from "@/lib/content";
import styles from "./waitlist.module.css";

type Widget = {
  render(el: HTMLElement, options: Record<string, unknown>): string;
  execute(el: HTMLElement): void;
  reset(id: string): void;
};
declare global {
  interface Window {
    turnstile?: Widget;
  }
}
const messages: Record<string, string> = {
  invalid_input: "Check your email address and consent.",
  challenge: "The security check could not be completed. Please try again.",
  policy_changed:
    "The consent terms changed. Reload the page and review them before trying again.",
  rate_limited: "Too many attempts. Please wait and try again.",
  unavailable:
    "Registration is temporarily unavailable. Please try again shortly.",
};
const checking = "Completing the security check…";
const loading = "The security check is loading. Please try again in a moment.";

export function WaitlistForm({
  className,
  siteKey,
  nonce,
}: {
  className: string;
  siteKey: string;
  nonce?: string;
}) {
  const [status, setStatus] = useState("");
  const [pending, setPending] = useState(false);
  const mount = useRef<HTMLDivElement>(null);
  const widget = useRef<string | undefined>(undefined);
  const widgetFailed = useRef(false);
  const submitting = useRef(false);
  const receiveToken = useRef<((token?: string) => void) | null>(null);
  const emailInput = useRef<HTMLInputElement>(null);

  function render() {
    if (!mount.current || !window.turnstile || widget.current !== undefined)
      return;
    try {
      widget.current = window.turnstile.render(mount.current, {
        sitekey: siteKey,
        action: "subscribe",
        execution: "execute",
        appearance: "interaction-only",
        "refresh-expired": "auto",
        "refresh-timeout": "auto",
        callback: (token: string) => receiveToken.current?.(token),
        "error-callback": () => {
          receiveToken.current?.();
          return true;
        },
        "unsupported-callback": () => receiveToken.current?.(),
      });
    } catch {
      widgetFailed.current = true;
    }
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    if (!siteKey || widgetFailed.current) {
      setStatus(messages.unavailable);
      return;
    }
    const api = window.turnstile;
    const container = mount.current;
    const widgetId = widget.current;
    if (!api || !container || widgetId === undefined) {
      setStatus(loading);
      return;
    }
    const form = event.currentTarget;
    const data = new FormData(form);
    submitting.current = true;
    setPending(true);
    try {
      for (let attempt = 0; attempt < 2; attempt++) {
        setStatus(checking);
        // The widget issues a fresh token for each POST. The timeout also
        // releases the form if the embedded widget stops responding.
        const token = await new Promise<string | undefined>((resolve) => {
          const deadline = setTimeout(() => receiveToken.current?.(), 120_000);
          receiveToken.current = (value) => {
            clearTimeout(deadline);
            receiveToken.current = null;
            resolve(value);
          };
          try {
            api.reset(widgetId);
            api.execute(container);
          } catch {
            receiveToken.current?.();
          }
        });
        if (!token) {
          setStatus(messages.challenge);
          return;
        }
        setStatus("Submitting…");
        const response = await fetch(form.action, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: data.get("email"),
            consent: data.get("consent") === "on",
            consentVersion,
            challengeToken: token,
          }),
        });
        if (response.status === 202) {
          form.reset();
          setStatus(accepted);
          return;
        }
        const result = await response.json().catch(() => null);
        const code = result?.error?.code;
        // Siteverify rejected the request before enrollment. It is safe to
        // submit once more with a new token and the original consent.
        if (
          response.status === 400 &&
          code === "challenge_expired" &&
          attempt === 0
        )
          continue;
        setStatus(
          code === "challenge_expired"
            ? messages.challenge
            : (messages[code] ?? messages.unavailable),
        );
        if (code === "invalid_input") emailInput.current?.focus();
        return;
      }
    } catch {
      setStatus(messages.unavailable);
    } finally {
      submitting.current = false;
      setPending(false);
    }
  }
  return (
    <div className={className}>
      {siteKey && (
        <Script
          id="turnstile"
          nonce={nonce}
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          onReady={render}
          onError={() => {
            widgetFailed.current = true;
            setStatus(messages.unavailable);
          }}
        />
      )}
      <form
        className={styles.form}
        onSubmit={submit}
        method="post"
        action="/api/v1/waitlist/subscribe"
        aria-label="Join the waitlist"
      >
        <div className={styles.fields}>
          <span className={styles.inputWrap}>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <rect x="2.5" y="5" width="19" height="14" rx="2" />
              <path d="m3 7 9 6 9-6m-18 11 6-6m12 6-6-6" />
            </svg>
            <input
              suppressHydrationWarning
              className={styles.email}
              type="email"
              ref={emailInput}
              name="email"
              aria-label="Email address"
              autoComplete="email"
              maxLength={320}
              required
              placeholder="Enter your email for early access"
            />
          </span>
          <button className={styles.send} type="submit" disabled={pending}>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 10a7 7 0 0 1 14 0v5l2 3H3l2-3zm5 11h4" />
            </svg>
            Notify Me
          </button>
        </div>
        <input
          suppressHydrationWarning
          type="hidden"
          name="consentVersion"
          value={consentVersion}
        />
        <div className={styles.consent}>
          <label>
            <input
              suppressHydrationWarning
              type="checkbox"
              name="consent"
              required
            />
            {consentCopy}
          </label>
          <Link href="/privacy">Privacy notice</Link>
        </div>
        <div ref={mount} className={styles.challenge} />
        <p className={styles.status} role="status">
          {status}
        </p>
        <noscript>
          Enable JavaScript to complete the security check or review the{" "}
          <Link href="/privacy">waitlist support information</Link>.
        </noscript>
      </form>
    </div>
  );
}
