import {
  createCipheriv,
  createDecipheriv,
  createHash,
  createHmac,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";
import { domainToASCII } from "node:url";
const names = {
  VERIFY: "VERIFY_KEY",
  UNSUBSCRIBE: "UNSUBSCRIBE_KEY",
  PRIVACY: "PRIVACY_KEY",
} as const;
export type Purpose = keyof typeof names;
function key(name: string) {
  const value = process.env[name] ?? "";
  if (!/^[0-9a-f]{64}$/i.test(value))
    throw new Error("Security configuration unavailable");
  return Buffer.from(value, "hex");
}
export const hash = (s: string) => createHash("sha256").update(s).digest("hex");
export const mac = (name: string, s: string) =>
  createHmac("sha256", key(name)).update(s).digest("hex");
export function same(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}
export const lookup = (email: string) => mac("LOOKUP_KEY", email);
export const fromToken = (token: string) =>
  /^[a-f0-9]{32}\.[a-f0-9]{64}$/.test(token) ? token.split(".")[0] : "";
export const makeSelector = () => randomBytes(16).toString("hex");
export function credential(
  purpose: Purpose,
  selector: string,
  generation: number,
  version = 1,
) {
  if (version !== 1) throw new Error("Token key unavailable");
  return `${selector}.${mac(names[purpose], `v${version}:${purpose}:${selector}:${generation}`)}`;
}
export function seal(value: string, scope: string) {
  const iv = randomBytes(12);
  const c = createCipheriv("aes-256-gcm", key("ADDRESS_KEY"), iv);
  c.setAAD(Buffer.from(scope));
  return [
    "v1",
    iv.toString("hex"),
    Buffer.concat([c.update(value, "utf8"), c.final()]).toString("hex"),
    c.getAuthTag().toString("hex"),
  ].join(".");
}
export function unseal(value: string, scope: string) {
  const [version, iv, text, tag] = value.split(".");
  if (version !== "v1") throw new Error("Encryption key unavailable");
  const d = createDecipheriv(
    "aes-256-gcm",
    key("ADDRESS_KEY"),
    Buffer.from(iv, "hex"),
  );
  d.setAAD(Buffer.from(scope));
  d.setAuthTag(Buffer.from(tag, "hex"));
  return Buffer.concat([
    d.update(Buffer.from(text, "hex")),
    d.final(),
  ]).toString("utf8");
}
export function normalizeEmail(input: string) {
  const value = input.trim();
  const at = value.lastIndexOf("@");
  if (at < 1 || at > 64) return null;
  const local = value.slice(0, at);
  const domain = domainToASCII(value.slice(at + 1)).toLowerCase();
  if (
    !/^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*$/.test(
      local,
    ) ||
    !/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])$/.test(
      domain,
    ) ||
    /[\s:/#?%\\]/.test(value.slice(at + 1)) ||
    domain.length > 253 ||
    local.length + domain.length > 253
  )
    return null;
  return `${local}@${domain}`;
}
