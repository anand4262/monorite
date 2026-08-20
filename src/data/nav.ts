import type { NavItem } from "@/types";

// Order matches the actual section order on the homepage (see page.tsx):
// Services -> Work -> Studio -> Founders. Blog/Contact are separate pages,
// not anchors, so they stay last regardless.
export const mainNav: NavItem[] = [
  { label: "Services", href: "/#services" },
  { label: "Work", href: "/#work" },
  { label: "Studio", href: "/#studio" },
  { label: "Founders", href: "/#founders" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export const footerNav: { title: string; links: NavItem[] }[] = [
  {
    title: "Company",
    links: [
      { label: "Work", href: "/#work" },
      { label: "Studio", href: "/#studio" },
      { label: "Founders", href: "/#founders" },
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
