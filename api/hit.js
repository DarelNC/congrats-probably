import { buildEvent } from "./_event.js";

const MAX_BODY = 1024;
const TIMEOUT_MS = 3000;

// The one server-side piece of this project: it holds the collector key so the
// browser never has to. The game never waits on it, see docs/rules.md.
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const raw = typeof req.body === "string" ? req.body : JSON.stringify(req.body ?? {});
  if (raw.length > MAX_BODY) return res.status(413).end();
  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    return res.status(400).end();
  }
  if (!body || typeof body !== "object") return res.status(400).end();

  const url = process.env.COLLECTOR_URL;
  const key = process.env.COLLECTOR_KEY;
  if (url && key) {
    try {
      const event = buildEvent({
        headers: req.headers,
        ref: body.ref,
        src: body.src,
        now: Date.now(),
        salt: process.env.VISITOR_SALT || "congrats-probably",
      });
      if (event) {
        const collected = await fetch(`${url}/collect`, {
          method: "POST",
          headers: { "content-type": "application/json", "x-api-key": key },
          body: JSON.stringify(event),
          signal: AbortSignal.timeout(TIMEOUT_MS),
        });
        if (!collected.ok) console.error(`analytics: collector answered ${collected.status}`);
      }
    } catch (err) {
      console.error("analytics: could not reach the collector", err);
    }
  }
  return res.status(204).end();
}
