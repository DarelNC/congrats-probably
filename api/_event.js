import { createHash } from "node:crypto";

const BOT = /bot|crawl|spider|slurp|preview|fetch|curl|wget|python-requests|httpclient|okhttp|headless|lighthouse|facebookexternalhit|embedly|whatsapp|telegram|discord|slack|skype|vkshare|pinterest|monitor|uptime/i;
const MAX_SRC = 32;

const deviceClass = (ua) => {
  if (/ipad|tablet|android(?!.*mobile)/i.test(ua)) return "tablet";
  if (/mobi|iphone|ipod|android/i.test(ua)) return "mobile";
  return "desktop";
};

const bareHost = (host) => (host ? host.toLowerCase().replace(/:\d+$/, "").replace(/^www\./, "") || null : null);

export function refHost(raw, ownHost) {
  if (typeof raw !== "string" || !raw) return null;
  try {
    const host = bareHost(new URL(raw).hostname);
    return host && host !== bareHost(ownHost) ? host : null;
  } catch {
    return null;
  }
}

export function cleanSource(raw) {
  if (typeof raw !== "string") return null;
  const s = raw.trim().toLowerCase();
  return s.length > 0 && s.length <= MAX_SRC && /^[a-z0-9_.-]+$/.test(s) ? s : null;
}

const visitorId = ({ ip, ua, salt, now }) => {
  const day = new Date(now).toISOString().slice(0, 10);
  return createHash("sha256").update(`${salt}|${day}|${ip}|${ua}`).digest("hex").slice(0, 16);
};

/**
 * Request facts in, a page-view event out, or null for traffic that should
 * not be counted (bots, prefetches). `headers` is Node's plain lowercase
 * header object.
 */
export function buildEvent({ headers, ref, src, now, salt }) {
  const ua = String(headers["user-agent"] || "");
  if (!ua || BOT.test(ua)) return null;
  if (/prefetch|prerender/i.test(`${headers["sec-purpose"] || ""}${headers.purpose || ""}`)) return null;

  const country = String(headers["x-vercel-ip-country"] || "");
  const forwarded = String(headers["x-forwarded-for"] || "");
  const ip = (forwarded ? forwarded.split(",")[0].trim() : String(headers["x-real-ip"] || "")) || "";
  const ownHost = String(headers["x-forwarded-host"] || headers.host || "");
  return {
    t: now,
    type: "view",
    country: /^[A-Z]{2}$/.test(country) ? country : null,
    device: deviceClass(ua),
    visitor: visitorId({ ip, ua, salt, now }),
    ref: refHost(ref, ownHost),
    src: cleanSource(src),
  };
}
