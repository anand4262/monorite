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

The Google Analytics measurement ID is intentionally hardcoded in `src/data/site.ts` (`googleAnalyticsId`) rather than an env var — GA IDs are public by design, and this keeps GA working the same way in every environment without extra Vercel config. `<GoogleAnalytics>` only renders when `NODE_ENV === "production"`, so local dev never sends events.

## Getting indexed

Metadata, sitemap, and structured data being correct doesn't get a site
crawled — that requires actually telling Google and Bing it exists. As of
this writing the site returns zero results for a `site:` search, meaning
it has not been indexed yet. To fix that:

1. **Google Search Console** ([search.google.com/search-console](https://search.google.com/search-console)) — add the site as a property, verify ownership (the "HTML tag" method matches the `GOOGLE_SITE_VERIFICATION` env var above — paste the `content` value from the tag Google gives you, redeploy, then click Verify), then submit `https://www.monorite.com/sitemap.xml` under Sitemaps and use URL Inspection → Request Indexing on the homepage.
2. **Bing Webmaster Tools** ([bing.com/webmasters](https://www.bing.com/webmasters)) — same idea; it also indexes for Yahoo and powers some AI answer engines. Can import verification directly from a connected Google Search Console account, or verify manually via `BING_SITE_VERIFICATION`.
3. **Google Business Profile** ([business.google.com](https://business.google.com)) — since this is a real local business (see the `ProfessionalService` JSON-LD in `layout.tsx`), a claimed and verified GBP listing is what actually drives the local map-pack results for searches like "AI automation agency Melbourne" — a well-optimized website alone does not.

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
6. **Lead capture** (`lead/intake.ts`, `lead/local-contact-extractor.ts`) — fire-and-forget after the reply is already sent, so it never adds latency. Name/email/phone are pulled out of the visitor's own messages locally with regex (`local-contact-extractor.ts`) rather than sent to the LLM; a separate small LLM call (`intake.ts`) only summarizes service interest and business context, and only once the conversation is substantial enough to be worth it (`shouldExtractLead`).
7. **Store** (`store/`) — an in-memory conversation/lead store (`store/memory-store.ts`). **Not persistent** — it resets on every server restart/redeploy. Swap in a real database if leads need to survive that.

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
- **The conversation/lead store is in-memory**, not a database — see "Chat system architecture" above.
- **Without `OPENAI_API_KEY` or `RESEND_API_KEY`**, the chat widget and contact form both degrade gracefully (clear "not configured" messaging) instead of crashing — useful for running the site read-only in a fresh clone.
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
