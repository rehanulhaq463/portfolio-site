# Muhammad Rehan Ul Haq — portfolio

Personal portfolio for a Senior Software Engineer in fintech and payment systems. A single page built with [Astro](https://astro.build): it is pre-rendered to static HTML, and one small server endpoint (`/api/contact`) handles the contact form.

## Quick start

Requires Node.js 22.12 or newer.

```bash
npm install
npm run dev        # http://localhost:4321 with hot reload
npm test           # contact-form validation and handler tests
npm run build      # static pages + Node server in ./dist
npm start          # serve the production build on http://localhost:4321
```

## Replacing the photo

Crop to 4:5 and export 480×600 and 800×1000 versions as WebP and JPEG into `public/images/` with the same file names (or update `profile.photo`).

## Where things live

| What | Where |
| --- | --- |
| Name, hero intro, About copy, quick facts, nav, photo | `src/data/profile.ts` |
| Jobs, education, certifications | `src/data/experience.ts` |
| Skill groups | `src/data/skills.ts` |
| Projects (title, employer, category, short description, tags; `featured` spans two columns) | `src/data/projects.ts` |
| Thesis | `src/data/thesis.ts` |
| Section layouts | `src/components/*.astro` |
| Portrait photo (4:5 crops, WebP + JPEG) | `public/images/` and `profile.photo` in `profile.ts` |
| Colors, type scale, spacing | `src/styles/global.css` (tokens at the top) |
| Resume files served for download | `public/resume/` |
| Contact validation (shared by browser and server) | `src/lib/contact.ts` |
| Contact request handling, spam checks, rate limit | `src/lib/contact-handler.ts` |
| Email delivery (Resend HTTP API) | `src/lib/mailer.ts` |

To update content, edit the files in `src/data/` only; the components read from them. To replace the resume, overwrite the PDF in `public/resume/` keeping the same name (or update `resumePdf` in `profile.ts`). Only the PDF is offered for download.

## Contact form

**Status out of the box: not connected.** Until the three variables below are set, the form validates input but tells visitors plainly that the message was *not* sent and shows your email address instead. It never reports a fake success.

### Connect it (Resend)

1. Create an account at [resend.com](https://resend.com) and verify a domain you own (Resend → Domains). Sending only works from a verified domain.
2. Create an API key (Resend → API Keys, "Sending access" is enough).
3. Copy `.env.example` to `.env` for local use, or add the variables in your host's dashboard for production:

   ```
   RESEND_API_KEY=re_...
   CONTACT_TO_EMAIL=rehanulhaq463@gmail.com
   CONTACT_FROM_EMAIL=Portfolio <contact@your-verified-domain>
   ```

4. Restart the server and send a test message. Replies go straight to the visitor, because the email's `reply_to` is set to their address.

`.env` is git-ignored. The key is read only on the server (`process.env`) and is never included in browser code.

### What protects the form

- Client-side validation with inline, field-specific errors; the same rules run again on the server.
- Honeypot field that real visitors never see; filled-in submissions are dropped.
- Minimum fill time (2.5 s) between page load and submit.
- Same-origin check on the `Origin` header (add other origins in `CONTACT_ALLOWED_ORIGINS` if needed).
- JSON only, 16 KB body limit, line breaks stripped from single-line fields (no header injection).
- In-memory rate limit: 5 messages per IP per 15 minutes. It resets on restart and isn't shared between instances; put a CDN or WAF rate limit in front if the site gets real traffic.
- Delivery failures are logged without the visitor's details.

### Using another provider

Replace the body of `sendContactEmail()` in `src/lib/mailer.ts` (e.g. Postmark, SendGrid, or SMTP via Nodemailer) and update `readMailConfig()` with that provider's variables. Nothing else needs to change.

## Deployment

Set `SITE_URL` (for example `https://rehanulhaq.dev`) at **build time** so canonical links and the social-sharing image use absolute URLs.

### Any Node host (Render, Railway, Fly.io, a VPS)

```bash
npm ci
SITE_URL=https://your-domain npm run build
npm start                # or: node ./dist/server/entry.mjs
```

Set `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`, and `PORT`/`HOST` in the host's environment. Behind Nginx, proxy to the Node port and forward `Host`/`X-Forwarded-*` headers.

### Docker

```bash
docker build --build-arg SITE_URL=https://your-domain -t rehan-portfolio .
docker run -p 4321:4321 --env-file .env rehan-portfolio
```

### Vercel (free Hobby plan, recommended)

The project is already Vercel-ready: when Vercel builds it (it sets `VERCEL=1`), `astro.config.mjs` switches to the `@astrojs/vercel` adapter and `/api/contact` becomes a serverless function. Nothing to change.

1. Push the repo to GitHub, then in Vercel: **Add New → Project → Import** the repo (preset: Astro, Node 22.x).
2. Add `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` and `SITE_URL` under **Settings → Environment Variables**, then redeploy.

Without your own domain, use `CONTACT_FROM_EMAIL="Portfolio <onboarding@resend.dev>"` and set `CONTACT_TO_EMAIL` to the email on your Resend account (Resend only delivers from that sender to the account owner).

To test the Vercel build locally: `VERCEL=1 npm run build` (output in `.vercel/output`).

### Static-only hosting (GitHub Pages, S3)

Static hosts can't run `/api/contact`. The site still works and the form explains that the message couldn't be sent and shows your email. To make it functional, deploy the endpoint somewhere that runs Node, or swap the form's `fetch` URL for a form service.

## Testing

- `npm test` runs 13 unit tests for validation and the handler: field errors, honeypot, timing check, origin check, malformed bodies, provider success (with `reply_to`), provider failure (502), not-configured (503), and rate limiting.
- The build was also checked in a headless browser: section order and nav links, the portrait loading, all 10 project cards and the employer filters, experience dates matched against the resume, light/dark toggle and persistence, CTAs, resume downloads, the mobile menu, form states (validation, loading, not configured, success, server errors, network failure), keyboard skip link, scroll reveal and reduced motion, no horizontal scroll at 390/820/1280/1920 px, and an axe-core WCAG 2 A/AA audit in both themes (no violations).

## Content rules

- Facts come from the resume and from what Rehan has described about each project. Nothing is invented: no metrics, logos, testimonials, or public repo links.
- Client names (other than RAW Bank, which is on the public resume), endpoints, credentials, internal class names, and source code are deliberately left out.
- The thesis appears on the site only, not on the resume.
