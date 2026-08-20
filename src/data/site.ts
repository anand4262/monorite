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
  /** What the team actually builds with — surfaced to the chat assistant's
   * knowledge base so it can answer capability questions ("do you build
   * mobile apps?") without guessing. Not the specific LLM/vendor stack
   * behind the chat assistant itself; see the persona's confidentiality
   * rules for that distinction. */
  technologies: [
    "HTML",
    "CSS",
    "Tailwind CSS",
    "JavaScript",
    "jQuery",
    "AJAX",
    "React",
    "Next.js",
    "React Native",
    "Bootstrap",
    "Node.js",
    "Express",
    "PHP",
    "Laravel",
    "Java (Enterprise APIs, Spring Boot, Hibernate)",
    "Postman",
    "PostgreSQL",
    "MySQL",
    "MongoDB",
    "WordPress",
    "Strapi",
    "RAG / AI-LLM integration",
    "Git & GitHub",
    "AWS",
    "CI/CD",
    "SEO",
  ],
  social: {
    linkedin: "https://linkedin.com/company/monorite",
    twitter: "https://x.com/monorite",
    instagram: "https://instagram.com/monorite",
  },
  founded: 2023,
};

export type Site = typeof site;
