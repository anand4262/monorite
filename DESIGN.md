# Design System — Monorite

## Product Context
- **What this is:** A B2B marketing site for an automation/AI agency.
- **Who it's for:** Owners of non-digital local businesses (trades, clinics, real estate, fitness studios) — not technical, skeptical of "AI hype," need to trust the agency understands their specific business before buying.
- **Space/industry:** Business process automation, AI voice/chat agents, custom CRM/software — adjacent to the "AI agency" category, which is heavily saturated with generic, visually-interchangeable sites.
- **Project type:** Marketing site (Next.js 14 App Router).
- **The memorable thing:** After seeing this site, a visitor should think *"they actually understand my business"* — not "cool AI demo." Every design decision below serves this.

## Aesthetic Direction
- **Direction:** Modern operations-consultancy — confident, editorial type, systems/network visual language. Explicitly not a generic AI-startup SaaS template.
- **Decoration level:** Intentional — one recurring motif (connected-dot/network texture, echoing "systems that connect") rather than decorative filler.
- **Mood:** Serious but warm. Dark and confident like the reference below, but grounded in "we studied your business" rather than "AI hype."
- **Reference site:** https://sparkssurge.com.au/ — studied for its craft, not copied: a floating pill nav instead of a full-bleed navbar, a centered (not split) hero, an ambient glow/particle background, and — its best move — a scroll-pinned horizontal carousel where the focused card is lit and neighbors fade into darkness. Monorite borrows this *mechanism* but swaps sparkssurge's purple for amber/ember and its generic particle field for a connected-dot network pattern that reads as "systems," not decoration.
- **Explicitly rejected in this process:** (1) purple/violet — the single most common "AI-generated site" tell; (2) a vintage/scrapbook treatment (torn paper, handwriting, sepia photos) — read as "old-skool," not modern; (3) a split two-column hero (text-left/image-right) — the generic default agency-site template, regardless of color or type choices.

## Typography
- **Display/Hero:** Fraunces — warm serif, large sizes, genuine italic for emphasis. A deliberate departure: almost no AI-agency competitor uses a serif hero; it signals credibility and warmth over "tech startup."
- **Body:** Instrument Sans — clean, human, legible. Not Inter (overused/generic default).
- **UI/Labels/eyebrow text:** Space Mono — already used on the current site, ties to the "systems/process" identity, sets tag-like labels apart from prose.
- **Data/Tables:** Space Mono with `font-variant-numeric: tabular-nums`.
- **Loading:** Google Fonts (`next/font/google`), matching current site's font-loading approach.
- **Scale:** Hero 64–72px / 600, H2 40px / 600, H3 24–28px / 600, Body 17–18px / 400, Label/mono 13px / 400 (uppercase, tracked).

## Color
- **Approach:** Restrained — one accent, everything else neutral.
- **Mode:** Dark-first (the approved direction is a full dark theme, not a light theme with a dark toggle). Keep the existing light-mode `ThemeToggle` as a secondary option, but dark is now the default/primary experience.
- **Background:** `#111111` — near-black canvas (extracted from approved mockup).
- **Text (primary):** `#FFFFFF` on dark; use a warm off-white (`#F2EFE9`) in practice rather than pure white, for less eye strain.
- **Accent (primary/CTA):** `#FFA500` — amber, filled buttons, primary links.
- **Accent (secondary/glow):** `#F58634` — slightly deeper amber-orange, used for highlighted headline phrases, icon strokes, and the connected-dot network texture glow.
- **Neutrals:** Warm dark grays for card surfaces, stepping up from the `#111111` base (e.g. `#1A1714`, `#211D18`) rather than pure grayscale, to stay warm rather than cool/sterile.
- **Semantic:** success `#4ADE80`, warning `#F59E0B` (close to accent, use sparingly to avoid confusion), error `#F2472F`, info `#4A9EFF`.
- **Light mode (secondary):** parchment/bone canvas `#F7F3EC`, near-black ink `#181410`, same amber accent family desaturated ~10% for contrast on light backgrounds.

## Spacing
- **Base unit:** 8px.
- **Density:** Comfortable-to-spacious — editorial breathing room, not cramped SaaS density.
- **Scale:** 2xs(4) xs(8) sm(12) md(16) lg(24) xl(32) 2xl(48) 3xl(64) 4xl(96).

## Layout
- **Approach:** Hybrid — centered, poster-like hero and statement sections; grid-disciplined for service/process/industry content below the fold.
- **Nav:** Floating pill nav (rounded container, detached from viewport edges), not a full-bleed bar — matches the current site's "dock" concept but must render on an opaque/blurred background at all times (see Motion note on the nav-overlap bug already fixed).
- **Grid:** 12-column, max content width 1200px, generous gutters.
- **Border radius:** sm 6px, md 10px, lg 16px, pill/full 9999px (nav, buttons).
- **Signature section pattern:** the "focus carousel" — a horizontal, scroll-pinned or arrow-navigated row of cards where the active/centered card is enlarged with a glowing amber border and neighbors are dimmed/blurred. Use for the industries-we-serve section; consider reusing for case studies.

## Motion
- **Approach:** Intentional-to-expressive. Keep existing Framer Motion scroll-reveals; add the focus-carousel as the signature new interaction.
- **Easing:** enter `ease-out`, exit `ease-in`, move `ease-in-out`.
- **Duration:** micro 50–100ms, short 150–250ms, medium 250–400ms, long 400–700ms.
- **Respect `prefers-reduced-motion`** throughout (already the pattern on the current site's 3D hero — carry it forward to the carousel and background texture).

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-08-17 | Full visual redesign initiated | User found the existing site "AI-generated" in look and copy; wanted a modern agency feel |
| 2026-08-17 | Rejected purple/violet accent | #1 most common AI-slop tell; also the existing site's accent, contributing to the "generic" feel |
| 2026-08-17 | Rejected vintage/scrapbook direction (round 1) | User feedback: "old-skool," even though it avoided looking AI-generated |
| 2026-08-17 | Rejected split two-column hero (rounds 1–2) | User feedback: reusing the same generic-agency layout skeleton regardless of color/font is still "old-skool" |
| 2026-08-17 | Approved: dark charcoal + amber, centered hero, floating pill nav, connected-dot network texture, focus-carousel for industries | Closest to sparkssurge's craft quality without copying its purple palette or generic particle field; directly reflects "we understand systems" positioning |

