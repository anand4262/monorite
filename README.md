# Monorite — Agency Website

A premium, calm, dark-themed marketing site for an AI automation agency, built with Next.js 14 (App Router) and TypeScript. It includes a fully custom AI chat widget (with PDF upload, lead capture, and CTA nudging) and a real contact form, both backed by the same content the marketing pages render.

## Stack

- **Next.js 14** (App Router, Server Components by default)
- **TypeScript** (strict mode, `noUnusedLocals`/`noUnusedParameters` on)
- **Tailwind CSS** — design tokens in `tailwind.config.ts`
- **Framer Motion** — scroll reveals & micro-interactions
- **Embla Carousel** — swipeable/auto-playing carousels (work, services, founders)
- **Zod** — server-side form validation
- **OpenAI SDK** — chat replies, lead summarization, moderation
- **Resend** — contact form email delivery
- **Google Analytics 4** (`@next/third-parties`) — production-only

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in real values
npm run dev
```

Open http://localhost:3000.

## Environment variables

All of these are read server-side only (never in a client component) except
`NEXT_PUBLIC_SITE_URL`. See `.env.example` for the full template.

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Canonical site URL used for metadata, sitemap, canonical links, and OG image URLs. Falls back to `VERCEL_URL` (an internal deployment-hash domain) if unset — set this explicitly on every deployment target, including Vercel, or social previews and canonical tags will point at the wrong host. |
| `RESEND_API_KEY` | For contact form | Enables the contact form to actually send email. Without it, the form still validates and responds, but no email is delivered. |
| `CONTACT_TO_EMAIL` | For contact form | Inbox that receives contact form submissions. |
| `CONTACT_FROM_EMAIL` | For contact form | Resend "from" address (must be on a domain verified with Resend). |
| `OPENAI_API_KEY` | For the chat widget | Powers the chat widget and homepage chat demo (`/api/chat`). Without it, the chat UI still renders but replies with a clear "not configured" message instead of erroring. |
| `GOOGLE_SITE_VERIFICATION` | For Search Console | Renders a `google-site-verification` meta tag. See "Getting indexed" below. |
| `BING_SITE_VERIFICATION` | For Bing Webmaster Tools | Renders a `msvalidate.01` meta tag. See "Getting indexed" below. |
| `TELEGRAM_BOT_TOKEN` | For lead notifications | Sends a Telegram push notification the first time a chat conversation becomes a real lead. See "Lead notifications" below. |
| `TELEGRAM_CHAT_ID` | For lead notifications | Which Telegram chat receives that notification. |
| `SUPABASE_URL` | For the database | Durably stores every contact submission and chat lead. See "Database (Supabase)" below. |
| `SUPABASE_SERVICE_ROLE_KEY` | For the database | Full read/write access, server-only — never exposed to the client. See "Database (Supabase)" below. |

The Google Analytics measurement ID is intentionally hardcoded in `src/data/site.ts` (`googleAnalyticsId`) rather than an env var — GA IDs are public by design, and this keeps GA working the same way in every environment without extra Vercel config. `<GoogleAnalytics>` only renders when `NODE_ENV === "production"`, so local dev never sends events.

## Getting indexed

Metadata, sitemap, and structured data being correct doesn't get a site
crawled — that requires actually telling Google and Bing it exists. As of
this writing the site returns zero results for a `site:` search, meaning
it has not been indexed yet. To fix that:

1. **Google Search Console** ([search.google.com/search-console](https://search.google.com/search-console)) — add the site as a property, verify ownership (the "HTML tag" method matches the `GOOGLE_SITE_VERIFICATION` env var above — paste the `content` value from the tag Google gives you, redeploy, then click Verify), then submit `https://www.monorite.com/sitemap.xml` under Sitemaps and use URL Inspection → Request Indexing on the homepage.
2. **Bing Webmaster Tools** ([bing.com/webmasters](https://www.bing.com/webmasters)) — same idea; it also indexes for Yahoo and powers some AI answer engines. Can import verification directly from a connected Google Search Console account, or verify manually via `BING_SITE_VERIFICATION`.
3. **Google Business Profile** ([business.google.com](https://business.google.com)) — since this is a real local business (see the `ProfessionalService` JSON-LD in `layout.tsx`), a claimed and verified GBP listing is what actually drives the local map-pack results for searches like "AI automation agency Melbourne" — a well-optimized website alone does not.

## Lead notifications

When a chat conversation crosses the "substantial" threshold (three or
more visitor messages, or a shared PDF — see `shouldExtractLead` in
`src/server/chat/lead/intake.ts`), the team gets pushed a Telegram message
with the AI's read on what the visitor needs (service interest, a real
analysis of their situation and urgency, not just a one-line label) plus a
snapshot of the actual conversation, all in one notification — no need to
open a dashboard. This fires once per conversation, not once per message.

Leads are always captured and saved to the conversation store regardless
of whether this is configured — the Telegram push is purely an
on-top notification layer. To turn it on:

1. Message [@BotFather](https://t.me/BotFather) on Telegram, send `/newbot`, and follow the prompts (name + username). It replies with a bot token — that's `TELEGRAM_BOT_TOKEN`.
2. Message your new bot directly (search its username, hit Start) or add it to a group you want leads posted in.
3. Get the chat ID: visit `https://api.telegram.org/bot<TOKEN>/getUpdates` in a browser after sending the bot a message, and read `message.chat.id` from the JSON response (negative numbers are groups, positive are individual chats). That's `TELEGRAM_CHAT_ID`.
4. Set both in `.env.local` (or your deployment platform's env vars) and redeploy.

Reminder: the conversation store itself is in-memory (see "Known gotchas"
below). See "Database (Supabase)" below for durable storage of every lead.

## Database (Supabase)

Every contact form submission and every chat lead (with its full
transcript) is stored in Postgres via Supabase — separate from, and more
durable than, the in-memory `conversationStore` used mid-conversation.
Chat leads upsert by session, so the same row keeps updating with the
fuller analysis and transcript as a conversation continues; contact
submissions are one row per form send.

To turn it on:

1. Sign up at [supabase.com](https://supabase.com) (free tier) and create a new project (pick a region close to your customers, e.g. Sydney for an AU business — this can't be changed later without migrating). Save the database password somewhere safe; you won't need it for this setup, but Supabase will ask you to set one.
2. Wait for the project to finish provisioning (~2 minutes), then open the **SQL Editor** in the left sidebar and run:

   ```sql
   create table contact_submissions (
     id uuid primary key default gen_random_uuid(),
     name text not null,
     email text not null,
     company text,
     phone text,
     message text not null,
     created_at timestamptz not null default now()
   );

   create table chat_leads (
     id uuid primary key default gen_random_uuid(),
     session_id uuid not null unique,
     origin text not null,
     service_interest text,
     business_summary text,
     source_document text,
     contact_name text,
     contact_email text,
     contact_phone text,
     transcript jsonb not null,
     created_at timestamptz not null default now(),
     updated_at timestamptz not null default now()
   );
   ```

3. Go to **Project Settings → API**. Copy the **Project URL** (that's `SUPABASE_URL`) and the **`service_role`** secret key (that's `SUPABASE_SERVICE_ROLE_KEY` — NOT the `anon`/`public` key; this project only ever calls Supabase from server-side code, never the browser, so the full-access key is the right one and is never exposed to visitors).
4. Set both in `.env.local` (and on your deployment platform) and redeploy.

Once set, you can browse, search, and filter every submission and lead directly in Supabase's **Table Editor** — no admin page needed in this codebase.

Code-wise, this follows a simple model layer: `server/db/client.ts` is the
only place that constructs the Supabase client, and `server/db/models/`
holds one file per table (`contact-submission.ts`, `chat-lead.ts`), each
exporting typed functions that do exactly one query. Routes
(`api/contact/route.ts`) and the chat orchestrator call those functions —
they never import the Supabase client or write raw queries themselves.

## Project structure

```
src/
  app/                   # routes (App Router) — one folder per page
    api/chat/            # POST endpoint for the chat widget (+ PDF upload)
    api/contact/         # POST endpoint for the contact form
    ai-receptionist/      # standalone product page (not a homepage anchor)
    blog/, contact/, privacy/, services/, work/
  components/
    chat/                # ChatWidget, ChatProvider (state + GA events), ChatThread
    layout/              # Navbar, Footer, mobile menu
    ui/                  # Reusable primitives (Button, Card, Container, ...)
    sections/            # Page-level composed sections (Hero, Studio, Founders, ...)
  data/                  # Typed content: the single source of truth (see below)
  lib/                   # utils, zod schemas, rate limiting, seo helpers, analytics
  server/chat/           # the chat pipeline (see "Chat system architecture" below)
  server/db/             # database layer: client.ts (connection) + models/ (one file per table, all reads/writes go through these — routes and the chat orchestrator never call Supabase directly)
  types/                 # shared TypeScript types
```

### Content lives in `src/data/*.ts`

Every piece of copy, every array of cards/tiers/values, and every chat string
rendered anywhere on the site comes from a typed file in `src/data/`, not from
inline arrays in page or component files. This is deliberate: it's the one
place to edit copy, add a service, or rebrand — and it's also what the chat
system's knowledge base (`buildKnowledgeBase()`) reads from, so the AI never
knows something the site itself doesn't say.

| File | Powers |
| --- | --- |
| `site.ts` | Brand name, tagline, contact details, social links, legal name, GA ID |
| `nav.ts` | Navbar links |
| `services.ts`, `service-content.ts` | Services grid, service detail pages, trust-bar tool logos |
| `projects.ts` | Work/case studies carousel + detail pages |
| `testimonials.ts` | Testimonials section |
| `team.ts` | Founders section |
| `blog.ts` | Blog index + posts |
| `process.ts` | "How we work" process steps |
| `hero.ts` | Homepage hero floating cards |
| `studio.ts` | Studio section values |
| `ai-receptionist.ts` | AI Receptionist page tiers + transparency points |
| `call-sample.ts` | Sample call transcript (used on both the homepage demo and `/ai-receptionist`) |
| `chat.ts` | Chat widget greeting + starter suggestions |

If you're adding new copy anywhere on the site, add it to (or create) a file
here first, then import it — don't hand-write it inline in a component.

## Chat system architecture

The chat widget (`src/components/chat/`) talks to `POST /api/chat`
(`src/app/api/chat/route.ts`), which delegates everything to
`src/server/chat/orchestrator.ts`. The pipeline, in order:

1. **Input guardrails** (`guardrails/input-guardrails.ts`) — length/shape checks on the incoming message.
2. **Moderation** (`guardrails/moderation.ts`) — OpenAI moderation call.
3. **Knowledge retrieval** (`knowledge/build-knowledge-base.ts`, `knowledge/retriever.ts`) — pulls relevant chunks out of `src/data/*.ts` (the same content the pages render) plus any uploaded PDF text.
4. **Persona + completion** (`persona.ts`, `llm/provider.ts`) — builds the system prompt and calls the OpenAI chat completion.
5. **Output guardrails** (`guardrails/output-guardrails.ts`, `guardrails/strip-markdown.ts`) — trims/cleans the reply before it's returned.
6. **Lead capture** (`lead/intake.ts`, `lead/local-contact-extractor.ts`, `lead/telegram-notify.ts`) — fire-and-forget after the reply is already sent, so it never adds latency. Name/email/phone are pulled out of the visitor's own messages locally with regex (`local-contact-extractor.ts`) rather than sent to the LLM; a separate small LLM call (`intake.ts`) analyzes service interest and business context, and only once the conversation is substantial enough to be worth it (`shouldExtractLead`). Every qualifying turn upserts the lead (with its transcript) to the database via `server/db/models/chat-lead.ts`; the first time a lead is captured for a session, `telegram-notify.ts` also pushes that analysis plus a conversation snapshot to Telegram — see "Lead notifications" and "Database (Supabase)" above.
7. **Store** (`store/`) — an in-memory conversation/lead store (`store/memory-store.ts`) used mid-conversation (so a follow-up message can see earlier turns). **Not persistent** — it resets on every server restart/redeploy. The Supabase tables above are the actual durable record; this store isn't it.

The route also handles PDF uploads: `document-extractor.ts` (which wraps
`pdf-parse` and `@napi-rs/canvas`, listed in `next.config.mjs`'s
`serverComponentsExternalPackages`) is imported *dynamically*, only when the
request is `multipart/form-data`. This is load-bearing, not a style choice:
`pdf-parse` transitively pulls in `pdfjs-dist`, which crashes at import time
in a serverless runtime (`DOMMatrix is not defined`) if it's ever evaluated
eagerly — including via a barrel file that re-exports it. `src/server/chat/index.ts`
deliberately does **not** re-export anything PDF-related, so importing
`generateReply` from it can never drag `pdf-parse` in as a side effect.

GA4 events (`chat_opened`, `chat_started`, `chat_message_sent`,
`chat_response_received`, `chat_error`, `chat_cta_clicked`, `generate_lead`)
fire from `ChatProvider.tsx`/`ChatThread.tsx` via `src/lib/analytics.ts`'s
`trackEvent()`, which is a no-op outside the browser or before `gtag` has
loaded — safe to call unconditionally.

## Known gotchas

- **`/about`, `/services`, `/work` are permanent redirects** to homepage anchors (`/#studio`, `/#services`, `/#work` — see `next.config.mjs`), not real pages. `sitemap.ts` deliberately excludes them so search engines aren't given redirecting URLs.
- **The mid-conversation `conversationStore` is in-memory**, not a database — durable storage is a separate layer (Supabase, see "Database (Supabase)" above).
- **Without `OPENAI_API_KEY`, `RESEND_API_KEY`, `TELEGRAM_BOT_TOKEN`/`TELEGRAM_CHAT_ID`, or `SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY`**, the chat widget, contact form, lead notifications, and database storage all degrade gracefully (clear "not configured" messaging, or a silent no-op) instead of crashing — useful for running the site read-only in a fresh clone.
- **The OG image (`src/app/opengraph-image.png`) is a static, pre-baked file**, not a dynamic `next/og` route. This is intentional: WhatsApp in particular wouldn't reliably render the dynamic version (slow generation + RGBA alpha channel), so it was replaced with a hand-designed static PNG that mirrors the real homepage hero.

## Rebranding

Everything brand-specific (name, tagline, contact email, socials, legal name) is centralized in
`src/data/site.ts`. Update that one file to rename the agency.

## Security notes

- Strict security headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options,
  Referrer-Policy, Permissions-Policy) are set in `next.config.mjs`.
- The CSP's `script-src` includes `'unsafe-inline'` as a deliberate trade-off so every
  marketing page can stay statically generated (fast, cacheable, cheap to host). This is
  documented in detail in `next.config.mjs`. There is no `dangerouslySetInnerHTML` or
  user-generated HTML rendering anywhere in this codebase, which keeps the residual risk
  low. If you add a CMS or anything that renders untrusted HTML, switch to a nonce +
  middleware CSP (see the comment in `next.config.mjs` for the link), which is stricter
  but forces dynamic rendering on every page.
- The contact API route (`src/app/api/contact/route.ts`) validates all input with Zod,
  checks the request's Origin against its Host header, uses a honeypot field plus a
  minimum time-to-submit check, and applies a minimal in-memory rate limit per IP (swap
  for Upstash/Redis in production if you run multiple server instances).
- No secrets are ever imported into client components — only `NEXT_PUBLIC_*` vars reach
  the browser. `RESEND_API_KEY` and `OPENAI_API_KEY` are read only inside their
  respective API routes.

## Build

```bash
npm run build
npm run start
```

## Verify before deploying

```bash
npm run lint
npm run typecheck
```
