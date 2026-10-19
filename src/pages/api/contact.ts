import type { APIRoute } from "astro";
import { handleContact } from "../../lib/contact-handler.ts";

// Runs on the server for every request; the rest of the site is static.
export const prerender = false;

export const POST: APIRoute = async ({ request, clientAddress }) => {
  let ip = "unknown";
  try {
    ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || clientAddress || "unknown";
  } catch {
    /* clientAddress can throw on some runtimes */
  }
  return handleContact(request, { clientIp: ip });
};

export const ALL: APIRoute = () =>
  new Response(JSON.stringify({ ok: false, code: "method_not_allowed", message: "Use POST." }), {
    status: 405,
    headers: { "Content-Type": "application/json", Allow: "POST" },
  });
