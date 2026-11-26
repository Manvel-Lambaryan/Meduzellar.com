import { afterEach, expect, it, vi } from "vitest";

vi.mock("@vercel/blob", async (importOriginal) => {
  const sdk = await importOriginal<typeof import("@vercel/blob")>();
  return { ...sdk, get: vi.fn(), put: vi.fn() };
});
import { BlobPreconditionFailedError, get, put } from "@vercel/blob";
import { z } from "zod";
import { updateJson } from "@/lib/waitlist/json-storage";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetAllMocks();
});

it("re-reads the private object after an ETag conflict and retains the competing write", async () => {
  vi.stubEnv("BLOB_READ_WRITE_TOKEN", "fixture-token");
  const schema = z.object({ values: z.array(z.string()) });
  function object(values: string[], etag: string) {
    const body = JSON.stringify({ values });
    return {
      statusCode: 200 as const,
      stream: new Response(body).body!,
      headers: new Headers(),
      blob: {
        url: "https://example.test/waitlist.json", downloadUrl: "https://example.test/waitlist.json",
        pathname: "waitlist.json", contentType: "application/json", contentDisposition: "",
        cacheControl: "private", size: body.length, etag, uploadedAt: new Date(),
      },
    };
  }
  vi.mocked(get).mockResolvedValueOnce(object(["before"], "old"))
    .mockResolvedValueOnce(object(["before", "competing"], "new"));
  vi.mocked(put).mockRejectedValueOnce(new BlobPreconditionFailedError())
    .mockResolvedValueOnce(object([], "committed").blob);

  await updateJson("waitlist.json", schema, () => ({ values: [] }), (data) => {
    data.values.push("current");
    return { value: undefined, changed: true };
  });
  expect(get).toHaveBeenCalledWith("waitlist.json", expect.objectContaining({ access: "private", useCache: false }));
  expect(put).toHaveBeenNthCalledWith(1, "waitlist.json", expect.any(String),
    expect.objectContaining({ ifMatch: "old", access: "private", allowOverwrite: true }));
  expect(put).toHaveBeenNthCalledWith(2, "waitlist.json", JSON.stringify({ values: ["before", "competing", "current"] }) + "\n",
    expect.objectContaining({ ifMatch: "new", access: "private", allowOverwrite: true }));
});

it("never overwrites an existing object during initial creation", async () => {
  vi.stubEnv("BLOB_READ_WRITE_TOKEN", "fixture-token");
  vi.mocked(get).mockResolvedValueOnce(null);
  const schema = z.object({ count: z.number() });
  await updateJson("waitlist-limits.json", schema, () => ({ count: 0 }), (state) => {
    state.count++;
    return { value: state.count, changed: true };
  });
  expect(put).toHaveBeenCalledWith("waitlist-limits.json", '{"count":1}\n',
    expect.objectContaining({ access: "private", addRandomSuffix: false, allowOverwrite: false }));
});
