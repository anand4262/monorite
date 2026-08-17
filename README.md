# Monorite — Agency Website

A premium, calm, dark-themed marketing site for an AI automation agency, built with Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, and a React Three Fiber hero.

## Stack

- **Next.js 14** (App Router, Server Components by default)
- **TypeScript** (strict mode)
- **Tailwind CSS** — design tokens in `tailwind.config.ts`
- **Framer Motion** — scroll reveals & micro-interactions
- **React Three Fiber + drei** — the interactive 3D hero (client-only, code-split, respects `prefers-reduced-motion`)
- **Zod** — server-side form validation

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in real values
npm run dev
```

Open http://localhost:3000.

## Project structure

```
src/
  app/                # routes (App Router) — one folder per page
    api/contact/       # POST endpoint for the contact form
  components/
    layout/            # Navbar, Footer, mobile menu
    ui/                # Reusable primitives (Button, Card, Container, ...)
    three/              # The 3D hero scene (client components only)
    sections/            # Page-level composed sections (Hero, ServicesGrid, ...)
  data/                # Typed content: services, projects, testimonials, nav
  lib/                 # utils, zod schemas, rate limiting, seo helpers
  types/               # shared TypeScript types
```

Content lives in `src/data/*.ts` — edit those files to change copy, services,
case studies, or brand name/colors without touching component code.

## Rebranding

Everything brand-specific (name, tagline, contact email, socials) is centralized in
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
  the browser. `RESEND_API_KEY` / `FORM_SECRET` are read only inside the API route.

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
# monorite
