// Server-only request handler for the contact form, kept framework-free so it can be
// unit-tested and reused on other runtimes (e.g. a Vercel or Netlify function).

import { normalizeContact, validateContact, hasErrors, MIN_FILL_MS } from "./contact.ts";
import { readMailConfig, sendContactEmail, MailError } from "./mailer.ts";

const MAX_BODY_BYTES = 16 * 1024;
const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_MAX = 5;
const hits = new Map<string, number[]>();

export interface HandlerDeps {
  env?: Record<string, string | undefined>;
  fetchImpl?: typeof fetch;
  now?: () => number;
  clientIp?: string;
}

function json(status: number, body: unknown, extra: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...extra },
  });
}

function rateLimited(ip: string, now: number): boolean {
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_MAX) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  // Keep the map from growing without bound on a long-lived server.
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (!v.some((t) => now - t < RATE_WINDOW_MS)) hits.delete(k);
  }
  return false;
}

export function resetRateLimits() {
  hits.clear();
}

export async function handleContact(request: Request, deps: HandlerDeps = {}): Promise<Response> {
  const env = deps.env ?? process.env;
  const now = deps.now ?? Date.now;
  const ip = deps.clientIp || "unknown";

  // Same-origin only: browsers always send Origin on cross-site POSTs.
  const origin = request.headers.get("origin");
  if (origin) {
    let sameOrigin = false;
    try {
      // Compare with the Host the browser used (proxies pass it as X-Forwarded-Host).
      const host =
        request.headers.get("x-forwarded-host")?.split(",")[0]?.trim() ||
        request.headers.get("host") ||
        new URL(request.url).host;
      sameOrigin = new URL(origin).host === host;
    } catch {
      sameOrigin = false;
    }
    const allowed = (env.CONTACT_ALLOWED_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean);
    if (!sameOrigin && !allowed.includes(origin)) {
      return json(403, { ok: false, code: "forbidden_origin", message: "This form only accepts messages from this site." });
    }
  }

  if (!(request.headers.get("content-type") || "").includes("application/json")) {
    return json(415, { ok: false, code: "unsupported_type", message: "Send the form as JSON." });
  }

  const length = Number(request.headers.get("content-length") || 0);
  if (length > MAX_BODY_BYTES) {
    return json(413, { ok: false, code: "too_large", message: "That message is too long to send." });
  }

  let raw: Record<string, unknown>;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY_BYTES) {
      return json(413, { ok: false, code: "too_large", message: "That message is too long to send." });
    }
    const parsed = JSON.parse(text);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("not an object");
    raw = parsed as Record<string, unknown>;
  } catch {
    return json(400, { ok: false, code: "bad_request", message: "The form data couldn't be read. Reload the page and try again." });
  }

  // Honeypot: real visitors never see or fill this field. Drop silently.
  if (typeof raw.website === "string" && raw.website.trim() !== "") {
    return json(200, { ok: true });
  }

  const startedAt = Number(raw.startedAt);
  if (!Number.isFinite(startedAt) || now() - startedAt < MIN_FILL_MS) {
    return json(400, {
      ok: false,
      code: "too_fast",
      message: "That was sent too quickly to be checked. Wait a moment and send it again.",
    });
  }

  if (rateLimited(ip, now())) {
    return json(
      429,
      { ok: false, code: "rate_limited", message: "Too many messages from your connection. Try again in 15 minutes." },
      { "Retry-After": "900" }
    );
  }

  const input = normalizeContact(raw);
  const errors = validateContact(input);
  if (hasErrors(errors)) {
    return json(422, { ok: false, code: "invalid", message: "Some fields need attention.", errors });
  }

  const cfg = readMailConfig(env);
  if (!cfg) {
    return json(503, {
      ok: false,
      code: "not_configured",
      message: "This form isn't connected to an email service yet, so your message was not sent.",
    });
  }

  try {
    await sendContactEmail(input, cfg, deps.fetchImpl);
  } catch (err) {
    // Log the failure without any of the visitor's details.
    console.error("[contact] send failed:", err instanceof MailError ? err.message : "unknown error");
    return json(502, {
      ok: false,
      code: "send_failed",
      message: "Your message couldn't be delivered right now. Nothing was sent.",
    });
  }

  return json(200, { ok: true, message: "Message sent." });
}
