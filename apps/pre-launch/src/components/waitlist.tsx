"use client";

import Link from "next/link";
import Script from "next/script";
import { useRef, useState } from "react";
import { accepted, consentCopy, consentVersion } from "@/lib/content";
import styles from "./waitlist.module.css";

type Widget = {
  render(el: HTMLElement, options: Record<string, unknown>): string;
  reset(id: string): void;
};
declare global {
  interface Window {
    turnstile?: Widget;
  }
}
const messages: Record<string, string> = {
  invalid_input: "Check your email address and consent.",
  challenge: "The security check needs to be refreshed. Please try again.",
  policy_changed:
    "The consent terms changed. Reload the page and review them before trying again.",
  rate_limited: "Too many attempts. Please wait and try again.",
  unavailable:
    "Registration is temporarily unavailable. Please try again shortly.",
};
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
  const [token, setToken] = useState("");
  const mount = useRef<HTMLDivElement>(null);
  const widget = useRef<string | undefined>(undefined);
  const emailInput = useRef<HTMLInputElement>(null);
  function render() {
    if (!mount.current || !window.turnstile || widget.current !== undefined)
      return;
    widget.current = window.turnstile.render(mount.current, {
      sitekey: siteKey,
      action: "subscribe",
      callback: setToken,
      "expired-callback": () => setToken(""),
      "error-callback": () => {
        setToken("");
        setStatus(messages.challenge);
      },
    });
  }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    if (!token) {
      setStatus(messages.challenge);
      return;
    }
    const form = event.currentTarget;
    const data = new FormData(form);
    setPending(true);
    setStatus("Submitting…");
    try {
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
      } else {
        const result = await response.json();
        const code = result.error?.code;
        setStatus(messages[code] ?? messages.unavailable);
        if (code === "invalid_input") emailInput.current?.focus();
      }
    } catch {
      setStatus(messages.unavailable);
    } finally {
      setPending(false);
      setToken("");
      if (widget.current) window.turnstile?.reset(widget.current);
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
          onError={() => setStatus(messages.unavailable)}
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
