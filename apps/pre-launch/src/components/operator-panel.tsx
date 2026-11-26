"use client";

import { useAuth, SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

type RecordView = {
  campaign: {
    id: string;
    state: string;
    activeRevisionId: string;
    revisions: { id: string; subject: string; launchUrl: string }[];
  };
  totals: { kind: string; state: string; _count: number }[];
};
type Preview = {
  subject: string;
  body: string;
  digest: string;
  estimate: number;
  asOf: string;
  revisionId: string;
};
export function OperatorPanel() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [record, setRecord] = useState<RecordView | null>(null);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);
  const pendingKeys = useRef(new Map<string, string>());
  const call = useCallback(
    async (path: string, body?: Record<string, unknown>) => {
      const token = await getToken({ skipCache: true });
      if (!token) throw new Error("Sign in to continue.");
      const requestKey = body ? path + JSON.stringify(body) : "";
      const key = body
        ? (pendingKeys.current.get(requestKey) ?? crypto.randomUUID())
        : "";
      if (body) pendingKeys.current.set(requestKey, key);
      const response = await fetch(
        "/api/v1/admin/" + path,
        body
          ? {
              method: "POST",
              headers: {
                Authorization: "Bearer " + token,
                "Content-Type": "application/json",
                "Idempotency-Key": key,
              },
              body: JSON.stringify(body),
            }
          : { headers: { Authorization: "Bearer " + token } },
      );
      if (!response.ok) {
        if (response.status === 403)
          throw new Error(
            "Your role or recent second-factor verification does not authorize this action.",
          );
        if (response.status === 409)
          throw new Error(
            "The campaign has changed or a required preview or delivery test is missing.",
          );
        throw new Error("The operation could not be completed.");
      }
      pendingKeys.current.delete(requestKey);
      return response.json();
    },
    [getToken],
  );
  const refresh = useCallback(async () => {
    const entry = await call("campaigns");
    setRecord(entry ? await call("campaigns/" + entry.id) : null);
    setReady(true);
  }, [call]);
  useEffect(() => {
    if (!isSignedIn) return;
    const load = window.setTimeout(() => {
      void refresh().catch((error) => setMessage(error.message));
    }, 0);
    return () => window.clearTimeout(load);
  }, [isSignedIn, refresh]);
  async function run(task: () => Promise<unknown>) {
    if (busy) return;
    setBusy(true);
    setMessage("");
    try {
      await task();
      await refresh();
      setMessage("Operation completed.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Operation failed.");
    } finally {
      setBusy(false);
    }
  }
  if (!isLoaded) return <p role="status">Loading…</p>;
  if (!isSignedIn)
    return <Link href="/operator/sign-in">Sign in to the operator portal</Link>;
  const campaign = record?.campaign;
  const revision = campaign?.revisions.find(
    (value) => value.id === campaign.activeRevisionId,
  );
  const path = campaign ? "campaigns/" + campaign.id : "campaigns";
  return (
    <>
      <SignOutButton>
        <button>Sign out</button>
      </SignOutButton>
      <p role="status">{message}</p>
      <fieldset disabled={busy || !ready}>
        <legend>Official launch</legend>
        {(!campaign || campaign.state === "DRAFT") && (
          <form
            key={revision?.id}
            onSubmit={(event) => {
              event.preventDefault();
              const data = new FormData(event.currentTarget);
              void run(async () => {
                await call(revision ? path + "/revisions" : path, {
                  subject: data.get("subject"),
                  launchUrl: data.get("url"),
                  bodyVersion: "launch-v1",
                  ...(revision ? { expectedRevision: revision.id } : {}),
                });
                setPreview(null);
              });
            }}
          >
            <label>
              Subject
              <input
                name="subject"
                maxLength={120}
                required
                defaultValue={
                  revision?.subject ?? "Meduzellar is officially live!"
                }
              />
            </label>
            <label>
              Approved launch URL
              <input
                type="url"
                name="url"
                required
                defaultValue={revision?.launchUrl ?? "https://meduzellar.test/"}
              />
            </label>
            <button>
              {revision ? "Save new revision" : "Create campaign"}
            </button>
          </form>
        )}
        {campaign && revision && (
          <>
            <p>Campaign status: {campaign.state}</p>
            <button
              onClick={() =>
                void run(async () =>
                  setPreview(
                    await call(path + "/preview", { revisionId: revision.id }),
                  ),
                )
              }
            >
              Preview revision
            </button>
            {campaign.state === "DRAFT" && (
              <button
                onClick={() =>
                  void run(() =>
                    call(path + "/test", {
                      revisionId: revision.id,
                      testRecipientId: "local-review",
                    }),
                  )
                }
              >
                Queue test capture
              </button>
            )}
            {preview?.revisionId === revision.id && (
              <section>
                <h2>{preview.subject}</h2>
                <p>{preview.body}</p>
                <p>Eligible recipients: {preview.estimate}</p>
                {campaign.state === "DRAFT" && (
                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      const data = new FormData(event.currentTarget);
                      void run(() =>
                        call(path + "/approve", {
                          revisionId: revision.id,
                          digest: preview.digest,
                          maxRecipients: Number(data.get("max")),
                          confirm: data.get("confirm") === "on",
                        }),
                      );
                    }}
                  >
                    <label>
                      Maximum recipients
                      <input
                        type="number"
                        name="max"
                        min="1"
                        max="1000"
                        required
                      />
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        name="confirm"
                        required
                        style={{ width: "auto" }}
                      />{" "}
                      Approve this revision for synthetic local capture
                    </label>
                    <button>Approve launch notification</button>
                  </form>
                )}
              </section>
            )}
            {!["DRAFT", "COMPLETED", "CANCELED"].includes(campaign.state) && (
              <>
                <button
                  onClick={() =>
                    void run(() =>
                      call(
                        path +
                          (campaign.state === "PAUSED" ? "/resume" : "/pause"),
                        { expectedState: campaign.state },
                      ),
                    )
                  }
                >
                  {campaign.state === "PAUSED" ? "Resume" : "Pause"}
                </button>
                <button
                  onClick={() => {
                    if (confirm("Cancel this campaign permanently?"))
                      void run(() =>
                        call(path + "/cancel", {
                          expectedState: campaign.state,
                        }),
                      );
                  }}
                >
                  Cancel
                </button>
              </>
            )}
            {!!record.totals.length && (
              <ul>
                {record.totals.map((total) => (
                  <li key={total.kind + total.state}>
                    {total.kind} {total.state} · {total._count}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
        <p>
          <button onClick={() => void run(refresh)}>Refresh status</button>
        </p>
      </fieldset>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          void run(() =>
            call("privacy-requests", {
              type: "deletion",
              email: data.get("email"),
              supportReference: data.get("reference"),
            }),
          );
        }}
      >
        <h2>Privacy request</h2>
        <label>
          Email address
          <input type="email" name="email" required />
        </label>
        <label>
          Support reference
          <input name="reference" minLength={8} maxLength={80} required />
        </label>
        <button disabled={busy}>Queue verification</button>
      </form>
    </>
  );
}
