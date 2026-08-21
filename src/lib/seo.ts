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
  "AI automation agency",
  "AI phone receptionist",
  "AI chat assistant",
  "business automation",
  "website design and development",
  "custom business software",
  "workflow automation",
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
