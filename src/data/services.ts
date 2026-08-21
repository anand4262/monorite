import {
  Globe,
  Phone,
  LayoutDashboard,
  Workflow,
  LifeBuoy,
} from "lucide-react";
import type { Service } from "@/types";

export const services: Service[] = [
  {
    slug: "website-online-presence",
    name: "Website & Online Presence",
    category: "Digital Presence",
    icon: Globe,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1400&q=80&auto=format&fit=crop",
    shortDescription:
      "A fast, SEO-ready website built to bring in work, not sit there as a digital brochure.",
    description:
      "A website that shows up on Google, loads fast on every device, and turns a visitor into an enquiry. It's wired into the same CRM, call assistant, and booking system as everything else we build for you.",
    seoTitle: "Website Design for Trades & Local Business",
    seoDescription:
      "SEO-ready websites for trades, clinics, and local businesses in Melbourne. Fast on every device, built to bring in enquiries, not just look good.",
    outcomes: ["More inbound enquiries", "Higher search visibility", "One connected system, not a standalone brochure site"],
    bullets: [
      "Fast on every phone, tablet, and screen",
      "Structured for SEO, built to be found for what your customers actually search",
      "Enquiry forms that reach you instantly, so no lead slips through",
      "Wired into the same CRM, call assistant, and booking system you already use with us",
    ],
  },
  {
    slug: "ai-assistants",
    name: "AI Assistants",
    category: "Customer Engagement",
    icon: Phone,
    image: "https://images.unsplash.com/photo-1766066014237-00645c74e9c6?w=1400&q=80&auto=format&fit=crop",
    shortDescription:
      "Answers customer calls and messages instantly, and puts AI to work internally too.",
    description:
      "Your AI assistant answers customer calls and messages instantly, understands your business's real hours, services, and policies, and captures bookings. Every enquiry is sent straight to you, day or night. The same approach extends internally: assistants trained on your documents and policies, and document intelligence for contracts, invoices, and forms.",
    seoTitle: "AI Receptionist & Chat Assistant for Trades",
    seoDescription:
      "Monorite's AI phone receptionist and chat assistant for trades and local businesses. Answers every call and message, captures bookings, never misses a lead.",
    outcomes: ["Zero missed calls", "Faster response times", "AI applied wherever it earns its keep"],
    bullets: [
      "Trained on your actual services, pricing, and availability",
      "Handles calls and SMS/web chat from one system",
      "Escalates complex requests to your team instantly",
      "Internal knowledge assistants and document intelligence, measured against a clear before/after",
    ],
  },
  {
    slug: "custom-business-software",
    name: "Custom Business Software",
    category: "Build",
    icon: LayoutDashboard,
    image: "https://images.unsplash.com/photo-1763718528755-4bca23f82ac3?w=1400&q=80&auto=format&fit=crop",
    shortDescription:
      "Staff portals, customer portals, and operations dashboards built around how you work.",
    description:
      "Staff portals, customer portals, operations dashboards, booking systems, all built around how your business actually works, not a generic template.",
    seoTitle: "Custom Business Software & Staff Portals",
    seoDescription:
      "Custom staff portals, customer portals, and operations dashboards built around how your business actually works, not a generic off-the-shelf template.",
    outcomes: ["Software that fits your workflow", "One system instead of five", "Room to grow"],
    bullets: [
      "Custom dashboards for operations and reporting",
      "Staff and customer-facing portals",
      "Built to integrate with your existing tools",
      "Owned by you, no lock-in to a rigid platform",
    ],
  },
  {
    slug: "workflow-systems-automation",
    name: "Workflow & Systems Automation",
    category: "Build",
    icon: Workflow,
    image: "https://images.unsplash.com/photo-1743385779347-1549dabf1320?w=1400&q=80&auto=format&fit=crop",
    shortDescription:
      "Connecting the tools you already use and automating the manual steps between them.",
    description:
      "Lead management, onboarding, quoting, invoicing, and reporting, connected end-to-end so nothing needs re-entering by hand. That means wiring the tools you already use (Xero, Microsoft 365, Google Workspace, CRMs, job-management platforms) into one coherent workflow, and automating the handoffs between them.",
    seoTitle: "Workflow & Business Process Automation",
    seoDescription:
      "Workflow automation for trades and local businesses: connecting Xero, Microsoft 365, CRMs, and job-management tools so nothing needs re-entering by hand.",
    outcomes: ["Hours saved every week", "One source of truth, not five disconnected tools", "Fewer dropped handoffs"],
    bullets: [
      "Automates handoffs between tools and teams",
      "Removes duplicate data entry",
      "Native integrations with accounting, CRM, and job-management tools, built on stable APIs",
      "Monitored so you're alerted if a sync ever fails",
    ],
  },
  {
    slug: "ongoing-support",
    name: "Ongoing Support",
    category: "Support",
    icon: LifeBuoy,
    image: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=1400&q=80&auto=format&fit=crop",
    shortDescription: "Direct access to the people who built your system, not a support queue.",
    description:
      "Direct access to the people who built your system, not a support queue. When something needs adjusting as your business grows, we're already familiar with how it works.",
    seoTitle: "Ongoing Support for Websites & AI Systems",
    seoDescription:
      "Direct access to the Monorite team that built your website, AI receptionist, or automation, not a support queue. Fast turnarounds as your business grows.",
    outcomes: ["Fast turnarounds", "No re-explaining your business", "A system that evolves with you"],
    bullets: [
      "Direct line to your original build team",
      "Proactive monitoring, not just reactive fixes",
      "Regular check-ins as your business changes",
      "Flexible retainers, pay for what you need",
    ],
  },
];

export function getServiceBySlug(slug: string) {
  return services.find((service) => service.slug === slug);
}
