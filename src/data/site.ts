/**
 * Single source of truth for brand identity and contact details.
 * Rename the agency by editing this file only — every page reads from here.
 */

const DEFAULT_SITE_URL = "https://www.vantage-ai.example";

function resolveSiteUrl(): string {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL?.trim(),
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
    DEFAULT_SITE_URL,
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;
    try {
      return new URL(candidate).origin;
    } catch {
      continue;
    }
  }

  return DEFAULT_SITE_URL;
}

export const site = {
  name: "Vantage AI",
  legalName: "Vantage AI Solutions",
  tagline: "AI systems that run your business while you run your day.",
  description:
    "Vantage AI designs and builds AI-powered call assistants, automation, and custom software for service businesses — so nothing falls through the cracks.",
  url: resolveSiteUrl(),
  email: "hello@vantage-ai.example",
  phone: "+1 (555) 010-2024",
  location: "Remote-first — serving clients worldwide",
  social: {
    linkedin: "https://linkedin.com/company/vantage-ai",
    twitter: "https://x.com/vantageai",
    instagram: "https://instagram.com/vantageai",
  },
  founded: 2023,
};

export type Site = typeof site;
