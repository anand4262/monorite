import type { NavItem } from "@/types";

export const mainNav: NavItem[] = [
  { label: "Studio", href: "/#studio" },
  { label: "Services", href: "/#services" },
  { label: "Work", href: "/#work" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export const footerNav: { title: string; links: NavItem[] }[] = [
  {
    title: "Company",
    links: [
      { label: "Studio", href: "/#studio" },
      { label: "Work", href: "/#work" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Website & Online Presence", href: "/services/website-online-presence" },
      { label: "AI Assistants", href: "/services/ai-assistants" },
      { label: "Custom Business Software", href: "/services/custom-business-software" },
      { label: "Workflow & Systems Automation", href: "/services/workflow-systems-automation" },
      { label: "Ongoing Support", href: "/services/ongoing-support" },
      { label: "AI Phone Receptionist (pilot)", href: "/ai-receptionist" },
    ],
  },
];
