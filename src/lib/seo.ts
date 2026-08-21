import type { Metadata } from "next";
import { site } from "@/data/site";

interface PageSeoInput {
  title: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
  /** Extra terms specific to this page, added on top of the site-wide
   * defaults below. No modern social platform (WhatsApp/Facebook/LinkedIn/
   * X/iMessage) reads meta keywords for link previews, and Google hasn't
   * used it for ranking in over a decade — it's included anyway since it's
   * free and some minor tools/aggregators still read it, but title and
   * description (already sent via openGraph/twitter below) are what
   * actually drive what shows up when a link is shared. */
  keywords?: string[];
}

const DEFAULT_KEYWORDS = [
  "AI automation agency Melbourne",
  "AI phone receptionist for trades",
  "AI receptionist for tradies",
  "website design for local business",
  "AI chat assistant",
  "custom business software Melbourne",
  "workflow automation agency",
  site.name,
];

/**
 * Builds a consistent Metadata object for a page, including OpenGraph and
 * Twitter card data, and a canonical URL derived from NEXT_PUBLIC_SITE_URL.
 */
export function buildMetadata({
  title,
  description,
  path = "",
  noIndex,
  keywords,
}: PageSeoInput): Metadata {
  const url = `${site.url}${path}`;
  const fullTitle = title === site.name ? title : `${title} | ${site.name}`;
  const desc = description ?? site.description;

  return {
    title: fullTitle,
    description: desc,
    keywords: Array.from(new Set([...(keywords ?? []), ...DEFAULT_KEYWORDS])),
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description: desc,
      url,
      siteName: site.name,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
    },
  };
}

/** schema.org Organization + LocalBusiness JSON-LD, rendered once in the
 * root layout. Backs local-search rich results (knowledge panel, map pack)
 * with the same NAP (name/address/phone) data used on the contact page. */
export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.name,
    legalName: site.legalName,
    description: site.description,
    url: site.url,
    email: site.email,
    telephone: site.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.suburb,
      addressRegion: site.address.state,
      postalCode: site.address.postcode,
      addressCountry: site.address.country,
    },
    sameAs: Object.values(site.social),
    foundingDate: String(site.founded),
  };
}

/** schema.org FAQPage JSON-LD from a page's existing on-screen Q&A content
 * (the FaqAccordion data) — makes those questions eligible for a rich
 * result/expandable snippet without duplicating the copy anywhere. */
export function buildFaqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

/** schema.org Service JSON-LD for a service detail page, linking back to the
 * agency as `provider` so it can back a service-area rich result. */
export function buildServiceJsonLd(service: { name: string; description: string; slug: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    url: `${site.url}/services/${service.slug}`,
    provider: { "@type": "ProfessionalService", name: site.name, url: site.url },
    areaServed: { "@type": "City", name: site.address.suburb },
  };
}

/** schema.org BreadcrumbList JSON-LD. `items` excludes the implicit Home
 * entry, which this always prepends. */
export function buildBreadcrumbJsonLd(items: { name: string; path: string }[]) {
  const all = [{ name: "Home", path: "" }, ...items];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${site.url}${item.path}`,
    })),
  };
}

/** schema.org BlogPosting JSON-LD for a blog post detail page. */
export function buildBlogPostingJsonLd(post: {
  title: string;
  excerpt: string;
  date: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    url: `${site.url}/blog/${post.slug}`,
    author: { "@type": "Organization", name: site.name, url: site.url },
    publisher: { "@type": "Organization", name: site.name, url: site.url },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${site.url}/blog/${post.slug}` },
  };
}
