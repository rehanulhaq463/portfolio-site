// Shared contact-form validation, used by the browser and the API route.
// Keep this file free of browser- or server-only APIs.

export interface ContactInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export type ContactField = keyof ContactInput;
export type FieldErrors = Partial<Record<ContactField, string>>;

export const LIMITS = {
  name: { min: 2, max: 100 },
  email: { max: 254 },
  subject: { min: 3, max: 150 },
  message: { min: 20, max: 5000 },
} as const;

// Pragmatic email check: one @, no spaces, a dot in the domain.
const EMAIL_RE = /^[^\s@"<>()[\]\\,;:]+@[^\s@"<>()[\]\\,;:]+\.[^\s@"<>()[\]\\,;:]{2,}$/;
// Control characters other than tab/newline (message) are never allowed.
const CONTROL_RE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

/** Trim and collapse input. Single-line fields lose any line breaks (blocks header injection). */
export function normalizeContact(raw: Record<string, unknown>): ContactInput {
  const oneLine = (v: unknown) => str(v).replace(/[\r\n]+/g, " ").replace(/\s{2,}/g, " ").trim();
  return {
    name: oneLine(raw.name),
    email: oneLine(raw.email).toLowerCase(),
    subject: oneLine(raw.subject),
    message: str(raw.message).replace(/\r\n?/g, "\n").trim(),
  };
}

export function validateContact(input: ContactInput): FieldErrors {
  const errors: FieldErrors = {};

  if (!input.name) errors.name = "Enter your full name.";
  else if (input.name.length < LIMITS.name.min) errors.name = `Name must be at least ${LIMITS.name.min} characters.`;
  else if (input.name.length > LIMITS.name.max) errors.name = `Name must be ${LIMITS.name.max} characters or fewer.`;
  else if (CONTROL_RE.test(input.name)) errors.name = "Name contains characters that aren't allowed.";

  if (!input.email) errors.email = "Enter your email address so I can reply.";
  else if (input.email.length > LIMITS.email.max || !EMAIL_RE.test(input.email))
    errors.email = "Enter a valid email address, like name@example.com.";

  if (!input.subject) errors.subject = "Add a subject.";
  else if (input.subject.length < LIMITS.subject.min)
    errors.subject = `Subject must be at least ${LIMITS.subject.min} characters.`;
  else if (input.subject.length > LIMITS.subject.max)
    errors.subject = `Subject must be ${LIMITS.subject.max} characters or fewer.`;
  else if (CONTROL_RE.test(input.subject)) errors.subject = "Subject contains characters that aren't allowed.";

  if (!input.message) errors.message = "Write a message.";
  else if (input.message.length < LIMITS.message.min)
    errors.message = `Message must be at least ${LIMITS.message.min} characters.`;
  else if (input.message.length > LIMITS.message.max)
    errors.message = `Message must be ${LIMITS.message.max} characters or fewer.`;
  else if (CONTROL_RE.test(input.message)) errors.message = "Message contains characters that aren't allowed.";

  return errors;
}

export function hasErrors(errors: FieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

/** Minimum time (ms) between the form loading and a submission. Bots are usually faster. */
export const MIN_FILL_MS = 2500;
