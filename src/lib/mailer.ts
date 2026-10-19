// Server-only. Sends contact messages through Resend's HTTP API (no SDK needed).
// Credentials come from environment variables and never reach the browser.

import type { ContactInput } from "./contact";

export interface MailConfig {
  apiKey: string;
  to: string;
  from: string;
}

/** Returns the config, or null when the form hasn't been connected to an email service yet. */
export function readMailConfig(env: Record<string, string | undefined> = process.env): MailConfig | null {
  const apiKey = env.RESEND_API_KEY?.trim();
  const to = env.CONTACT_TO_EMAIL?.trim();
  const from = env.CONTACT_FROM_EMAIL?.trim();
  if (!apiKey || !to || !from) return null;
  return { apiKey, to, from };
}

export class MailError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
    this.name = "MailError";
  }
}

export async function sendContactEmail(input: ContactInput, cfg: MailConfig, fetchImpl: typeof fetch = fetch) {
  const text = [
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `Subject: ${input.subject}`,
    "",
    input.message,
    "",
    "Sent from the contact form on your portfolio site.",
  ].join("\n");

  let res: Response;
  try {
    res = await fetchImpl("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cfg.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: cfg.from,
        to: [cfg.to],
        reply_to: input.email,
        subject: `Portfolio contact: ${input.subject}`,
        text,
      }),
      signal: AbortSignal.timeout(10_000),
    });
  } catch (err) {
    throw new MailError(`Email provider unreachable: ${(err as Error).name}`);
  }

  if (!res.ok) {
    throw new MailError(`Email provider returned ${res.status}`, res.status);
  }
}
