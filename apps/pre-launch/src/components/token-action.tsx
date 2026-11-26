"use client";

import { useState } from "react";

type Action = "verify" | "unsubscribe" | "verify-deletion";
const copy = {
  verify: { label: "Confirm email", success: "Your email is confirmed." },
  unsubscribe: { label: "Unsubscribe", success: "You have been unsubscribed." },
  "verify-deletion": {
    label: "Confirm deletion request",
    success: "Your deletion request is scheduled.",
  },
};
export function TokenAction({
  action,
  initialToken = "",
}: {
  action: Action;
  initialToken?: string;
}) {
  const [code, setCode] = useState(initialToken);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [complete, setComplete] = useState(false);
  function initialize(form: HTMLFormElement | null) {
    if (!form || !location.hash) return;
    const fragment = location.hash.slice(1);
    history.replaceState(null, "", location.pathname);
    queueMicrotask(() => setCode(fragment));
  }
  return (
    <form
      ref={initialize}
      onSubmit={async (event) => {
        event.preventDefault();
        setBusy(true);
        setStatus("");
        try {
          const section = action === "verify-deletion" ? "privacy" : "waitlist";
          const response = await fetch(`/api/v1/${section}/${action}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: code.trim() }),
          });
          if (response.ok) {
            setComplete(true);
            setCode("");
            setStatus(copy[action].success);
          } else
            setStatus(
              response.status === 400
                ? "This code is invalid or has expired."
                : "The request could not be completed. Please try again.",
            );
        } catch {
          setStatus("The request could not be completed. Please try again.");
        } finally {
          setBusy(false);
        }
      }}
    >
      {!complete && (
        <>
          <label htmlFor="code">Confirmation code</label>
          <input
            id="code"
            type="password"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            required
            minLength={97}
            maxLength={97}
            autoComplete="off"
          />
          <p>
            <button disabled={busy}>
              {busy ? "Please wait…" : copy[action].label}
            </button>
          </p>
        </>
      )}
      <p role="status">{status}</p>
    </form>
  );
}
