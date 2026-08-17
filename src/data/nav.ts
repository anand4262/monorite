import type { NavItem } from "@/types";

export const mainNav: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export const footerNav: { title: string; links: NavItem[] }[] = [
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Work", href: "/work" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "AI Call & Text Assistant", href: "/services/ai-call-text-assistant" },
      { label: "Business Process Automation", href: "/services/business-process-automation" },
      { label: "Custom Business Software", href: "/services/custom-business-software" },
      { label: "Systems Integration", href: "/services/systems-integration" },
    ],
  },
];
