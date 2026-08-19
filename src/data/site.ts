/**
 * Single source of truth for brand identity and contact details.
 * Rename the agency by editing this file only — every page reads from here.
 */

const DEFAULT_SITE_URL = "https://www.monorite.com";

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
  name: "Monorite",
  legalName: "Monorite Solutions",
  tagline: "We study how your business runs. Then we build the systems that run it.",
  description:
    "Monorite helps trades, clinics, and local businesses still running on phone calls and spreadsheets get online, automate the busywork, and put AI voice and chat agents to work: websites, call assistants, custom CRMs, and the systems to run them.",
  url: resolveSiteUrl(),
  email: "support@monorite.com",
  phone: "0468 588 669",
  // Structured so it can back both the display string (`location`) and
  // schema.org PostalAddress in JSON-LD, instead of only a freeform string.
  address: {
    street: "17A Augusta Crescent",
    suburb: "Sunshine North",
    state: "VIC",
    postcode: "3020",
    country: "AU",
  },
  location: "17A Augusta Crescent, Sunshine North VIC 3020",
  social: {
    linkedin: "https://linkedin.com/company/monorite",
    twitter: "https://x.com/monorite",
    instagram: "https://instagram.com/monorite",
  },
  founded: 2023,
};

export type Site = typeof site;
