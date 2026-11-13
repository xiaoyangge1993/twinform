/* Twinform license verification. The public key and Gumroad product id are safe to publish.
   Private signing keys must never be shipped with the site. */
const PUBLIC_KEY_HEX = "ba5503b2bb506e850709a1654ad3a60848e339ed86818de10b179f2969b264d0";

const PREFIX = "TF1_";
const VERSION = 1;
const GUMROAD_PRODUCT_ID = "e3yHwtMEOKjHnWsEa3Hthg==";
const GUMROAD_URL = "https://xiaoxiaoyang.gumroad.com/l/eirdia";
const GUMROAD_VERIFY_URL = "https://api.gumroad.com/v2/licenses/verify";

function normalizeLicense(code) {
  return String(code || "")
    .trim()
    .replace(/\s+/g, "")
    .replace(/^tf1_/i, "TF1_");
}

function isSignedCode(code) {
  return normalizeLicense(code).startsWith(PREFIX);
}

function fromB64url(s) {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + pad;
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function hexToBytes(hex) {
  const clean = hex.trim();
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  return out;
}

function decodePayload(buf) {
  if (!buf || buf.length < 8) return null;
  const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  const version = view.getUint8(0);
  if (version !== VERSION) return null;
  const issuedAt = view.getUint32(1);
  const nonce = (view.getUint8(5) << 16) | (view.getUint8(6) << 8) | view.getUint8(7);
  return { version, issuedAt, nonce };
}

async function importPublicKey() {
  if (!PUBLIC_KEY_HEX || PUBLIC_KEY_HEX.length !== 64) {
    throw new Error("Public key is not configured");
  }
  if (!crypto.subtle) {
    throw new Error("Web Crypto is unavailable");
  }
  return crypto.subtle.importKey("raw", hexToBytes(PUBLIC_KEY_HEX), { name: "Ed25519" }, false, ["verify"]);
}

function fromBytesToB64url(buf) {
  let s = "";
  for (let i = 0; i < buf.length; i++) s += String.fromCharCode(buf[i]);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function verifySigned(norm) {
  let buf;
  try {
    buf = fromB64url(norm.slice(PREFIX.length));
  } catch {
    return { ok: false, reason: "encoding" };
  }
  if (buf.length !== 72) return { ok: false, reason: "length" };
  const payload = buf.subarray(0, 8);
  const signature = buf.subarray(8);
  const parsed = decodePayload(payload);
  if (!parsed) return { ok: false, reason: "version" };
  try {
    const key = await importPublicKey();
    const ok = await crypto.subtle.verify({ name: "Ed25519" }, key, signature, payload);
    return ok
      ? { ok: true, source: "tf1", payload: parsed, normalized: PREFIX + fromBytesToB64url(buf) }
      : { ok: false, reason: "signature" };
  } catch (err) {
    return { ok: false, reason: "crypto", detail: String(err && err.message ? err.message : err) };
  }
}

function flagOn(obj, name) {
  if (!obj || typeof obj !== "object") return false;
  const v = obj[name];
  return v === true || v === "true" || v === 1 || v === "1";
}

function isRevokedPurchase(data) {
  const purchase = data && data.purchase && typeof data.purchase === "object" ? data.purchase : {};
  const names = ["refunded", "chargebacked", "disputed", "chargeback"];
  return names.some((name) => flagOn(data, name) || flagOn(purchase, name));
}

async function verifyGumroad(norm) {
  let res;
  try {
    const body = new URLSearchParams();
    body.set("product_id", GUMROAD_PRODUCT_ID);
    body.set("license_key", norm);
    body.set("increment_uses_count", "false");
    res = await fetch(GUMROAD_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
  } catch (err) {
    return { ok: false, reason: "network", detail: String(err && err.message ? err.message : err) };
  }
  let data;
  try {
    data = await res.json();
  } catch {
    return { ok: false, reason: res.ok ? "network" : "gumroad" };
  }
  if (!data || data.success !== true) return { ok: false, reason: "gumroad" };
  if (isRevokedPurchase(data)) return { ok: false, reason: "revoked" };
  return { ok: true, source: "gumroad", normalized: norm };
}

async function verifyLicense(code) {
  const norm = normalizeLicense(code);
  if (!norm) return { ok: false, reason: "empty" };
  if (isSignedCode(norm)) return verifySigned(norm);
  return verifyGumroad(norm);
}

window.TwinformLicense = {
  PUBLIC_KEY_HEX,
  GUMROAD_PRODUCT_ID,
  GUMROAD_URL,
  normalize: normalizeLicense,
  isSigned: isSignedCode,
  verify: verifyLicense,
};
