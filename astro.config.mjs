// @ts-check
import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import vercel from "@astrojs/vercel";
import { loadEnv } from "vite";

// Load .env into process.env for `astro dev` and `astro build`, so the
// contact endpoint reads its settings the same way it does in production.
const fileEnv = loadEnv(process.env.NODE_ENV ?? "development", process.cwd(), "");
for (const [key, value] of Object.entries(fileEnv)) {
  if (process.env[key] === undefined) process.env[key] = value;
}

// SITE_URL is used for canonical URLs and social-sharing metadata.
// Set it to your production domain (e.g. https://rehanulhaq.dev) at build time.
const site = process.env.SITE_URL || undefined;

export default defineConfig({
  site,
  // Pages are pre-rendered to static HTML; only /api/contact runs on the server.
  output: "static",
  // On Vercel (which sets VERCEL=1 during builds) use the Vercel adapter, so
  // /api/contact becomes a serverless function. Everywhere else, a Node server.
  adapter: process.env.VERCEL ? vercel() : node({ mode: "standalone" }),
  compressHTML: true,
  build: { inlineStylesheets: "auto" },
  devToolbar: { enabled: false },
});
