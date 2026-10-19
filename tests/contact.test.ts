// Unit tests for contact-form validation and the server handler.
// Run with: npm test   (Node 22.18+ runs TypeScript test files directly)

import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { normalizeContact, validateContact, MIN_FILL_MS } from "../src/lib/contact.ts";
import { handleContact, resetRateLimits } from "../src/lib/contact-handler.ts";

const valid = {
  name: "Ayesha Khan",
  email: "Ayesha@Example.com",
  subject: "Backend role",
  message: "Hi Rehan, I'd like to talk about a payments engineering role.",
};

const NOW = 1_800_000_000_000;
const ENV_OK = { RESEND_API_KEY: "re_test", CONTACT_TO_EMAIL: "to@example.com", CONTACT_FROM_EMAIL: "Portfolio <from@example.com>" };

function req(body: unknown, headers: Record<string, string> = {}) {
  return new Request("http://localhost:4321/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json", host: "localhost:4321", origin: "http://localhost:4321", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

beforeEach(() => resetRateLimits());

test("normalize trims, lowercases email, strips line breaks from single-line fields", () => {
  const n = normalizeContact({ ...valid, subject: "Hello\r\nBcc: x@y.com", name: "  Ayesha  " });
  assert.equal(n.name, "Ayesha");
  assert.equal(n.email, "ayesha@example.com");
  assert.equal(n.subject.includes("\n"), false);
});

test("valid input has no errors", () => {
  assert.deepEqual(validateContact(normalizeContact(valid)), {});
});

test("each field reports a specific error", () => {
  const e = validateContact(normalizeContact({ name: "", email: "nope", subject: "a", message: "short" }));
  assert.ok(e.name && e.email && e.subject && e.message);
  assert.match(e.email!, /valid email/);
  assert.match(e.message!, /at least 20/);
});

test("overlong message is rejected", () => {
  const e = validateContact(normalizeContact({ ...valid, message: "x".repeat(5001) }));
  assert.ok(e.message);
});

test("handler: 503 not_configured when no email provider is set (nothing claimed as sent)", async () => {
  const res = await handleContact(req({ ...valid, startedAt: NOW - 10_000 }), { env: {}, now: () => NOW });
  assert.equal(res.status, 503);
  const body = await res.json();
  assert.equal(body.ok, false);
  assert.equal(body.code, "not_configured");
});

test("handler: 422 with field errors for invalid input", async () => {
  const res = await handleContact(req({ ...valid, email: "bad", startedAt: NOW - 10_000 }), { env: ENV_OK, now: () => NOW });
  assert.equal(res.status, 422);
  const body = await res.json();
  assert.ok(body.errors.email);
});

test("handler: honeypot submissions are dropped without sending", async () => {
  let called = false;
  const fetchImpl = (async () => {
    called = true;
    return new Response("{}", { status: 200 });
  }) as typeof fetch;
  const res = await handleContact(req({ ...valid, website: "http://spam", startedAt: NOW - 10_000 }), { env: ENV_OK, now: () => NOW, fetchImpl });
  assert.equal(res.status, 200);
  assert.equal(called, false);
});

test("handler: too-fast submissions are rejected", async () => {
  const res = await handleContact(req({ ...valid, startedAt: NOW - (MIN_FILL_MS - 500) }), { env: ENV_OK, now: () => NOW });
  assert.equal(res.status, 400);
  assert.equal((await res.json()).code, "too_fast");
});

test("handler: cross-origin requests are refused", async () => {
  const res = await handleContact(req({ ...valid, startedAt: NOW - 10_000 }, { origin: "https://evil.example" }), { env: ENV_OK, now: () => NOW });
  assert.equal(res.status, 403);
});

test("handler: non-JSON and malformed bodies are rejected", async () => {
  const r1 = await handleContact(req("name=x", { "content-type": "application/x-www-form-urlencoded" }), { env: ENV_OK, now: () => NOW });
  assert.equal(r1.status, 415);
  const r2 = await handleContact(req("{not json"), { env: ENV_OK, now: () => NOW });
  assert.equal(r2.status, 400);
});

test("handler: sends through Resend with reply_to set, and reports success", async () => {
  let sent: { url: string; body: any; auth: string | null } | null = null;
  const fetchImpl = (async (url: string, init: RequestInit) => {
    sent = { url, body: JSON.parse(String(init.body)), auth: new Headers(init.headers).get("authorization") };
    return new Response(JSON.stringify({ id: "1" }), { status: 200 });
  }) as unknown as typeof fetch;
  const res = await handleContact(req({ ...valid, startedAt: NOW - 10_000 }), { env: ENV_OK, now: () => NOW, fetchImpl });
  assert.equal(res.status, 200);
  assert.equal((await res.json()).ok, true);
  assert.ok(sent);
  assert.equal(sent!.url, "https://api.resend.com/emails");
  assert.equal(sent!.auth, "Bearer re_test");
  assert.deepEqual(sent!.body.to, ["to@example.com"]);
  assert.equal(sent!.body.reply_to, "ayesha@example.com");
});

test("handler: provider failure returns 502 and does not claim success", async () => {
  const fetchImpl = (async () => new Response("err", { status: 500 })) as typeof fetch;
  const origError = console.error;
  console.error = () => {};
  const res = await handleContact(req({ ...valid, startedAt: NOW - 10_000 }), { env: ENV_OK, now: () => NOW, fetchImpl });
  console.error = origError;
  assert.equal(res.status, 502);
  assert.equal((await res.json()).ok, false);
});

test("handler: rate limits after 5 messages from one address", async () => {
  const fetchImpl = (async () => new Response("{}", { status: 200 })) as typeof fetch;
  let last = 0;
  for (let i = 0; i < 6; i++) {
    const res = await handleContact(req({ ...valid, startedAt: NOW - 10_000 }), { env: ENV_OK, now: () => NOW, fetchImpl, clientIp: "1.2.3.4" });
    last = res.status;
  }
  assert.equal(last, 429);
});
