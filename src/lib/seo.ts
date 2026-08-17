import type { Metadata } from "next";
import { site } from "@/data/site";

interface PageSeoInput {
  title: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
}

/**
 * Builds a consistent Metadata object for a page, including OpenGraph and
 * Twitter card data, and a canonical URL derived from NEXT_PUBLIC_SITE_URL.
 */
export function buildMetadata({ title, description, path = "", noIndex }: PageSeoInput): Metadata {
  const url = `${site.url}${path}`;
  const fullTitle = title === site.name ? title : `${title} | ${site.name}`;
  const desc = description ?? site.description;

  return {
    title: fullTitle,
    description: desc,
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
