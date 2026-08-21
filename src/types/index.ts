import type { LucideIcon } from "lucide-react";

export interface Service {
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  description: string;
  icon: LucideIcon;
  outcomes: string[];
  bullets: string[];
  /** Real, freely-licensed photo used behind the service's carousel card
   * and detail-page hero, treated with the site's monochrome duotone wash. */
  image: string;
}

export interface Project {
  slug: string;
  client: string;
  industry: string;
  title: string;
  summary: string;
  challenge: string;
  solution: string;
  results: { label: string; value: string }[];
  services: string[];
  /** Only set for projects with a real, publicly verifiable live site or
   * store listing — not every case study has one. */
  visitUrl?: string;
  stack?: string[];
  /** Real cover photo/screenshot used as the card & hero background, in
   * place of the abstract gradient placeholder. */
  image?: string;
  /** Small square app icon/logo, shown as a badge next to the title. */
  icon?: string;
  /** Additional real screenshots for a gallery on the project detail page. */
  screenshots?: string[];
  /** Aspect ratio of `image`/`screenshots` — portrait for phone app
   * captures, landscape for website banners. Drives card sizing so
   * portrait screenshots aren't squeezed into a wide, shallow box. */
  orientation?: "portrait" | "landscape";
  /** Story-driven build process specific to this project (discovery, build,
   * launch, result) — shown on the detail page instead of generic prose. */
  journey?: ProcessStep[];
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

export interface StudioValue {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface ReceptionistTier {
  icon: LucideIcon;
  label: string;
  example: string;
  response: string;
}

export interface TransparencyPoint {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  date: string;
  readingTime: string;
  category: string;
}

export interface NavItem {
  label: string;
  href: string;
}
