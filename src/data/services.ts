import {
  Phone,
  Star,
  CalendarClock,
  SearchCheck,
  LayoutDashboard,
  Workflow,
  BrainCircuit,
  Plug,
  LifeBuoy,
} from "lucide-react";
import type { Service } from "@/types";

export const services: Service[] = [
  {
    slug: "ai-call-text-assistant",
    name: "AI Call & Text Assistant",
    category: "Customer Engagement",
    icon: Phone,
    shortDescription:
      "Answers customer calls and messages instantly, day or night, and captures every booking.",
    description:
      "Your AI assistant answers customer calls and messages instantly, understands your business's real hours, services, and policies, and captures bookings — every enquiry sent straight to you, day or night.",
    outcomes: ["Zero missed calls", "Faster response times", "More booked jobs"],
    bullets: [
      "Trained on your actual services, pricing, and availability",
      "Handles calls and SMS/web chat from one system",
      "Escalates complex requests to your team instantly",
      "Every conversation logged and summarized for you",
    ],
  },
  {
    slug: "automated-review-requests",
    name: "Automated Review Requests",
    category: "Customer Engagement",
    icon: Star,
    shortDescription:
      "Turns every completed job into a review request, sent automatically.",
    description:
      "Automated Review Requests turn every completed job into a review request, sent automatically — building your reputation without you lifting a finger.",
    outcomes: ["More 5-star reviews", "Stronger online reputation", "Zero manual follow-up"],
    bullets: [
      "Triggers the moment a job is marked complete",
      "Routes happy customers to Google, Yelp, or Facebook",
      "Flags unhappy customers privately before they go public",
      "Tracks response rates over time",
    ],
  },
  {
    slug: "booking-appointment-reminders",
    name: "Booking & Appointment Reminders",
    category: "Customer Engagement",
    icon: CalendarClock,
    shortDescription: "Automated SMS reminders that cut down no-shows.",
    description:
      "Automated SMS reminders that cut down no-shows for appointment-based businesses — sent at the right time, every time, with zero manual work.",
    outcomes: ["Fewer no-shows", "Higher schedule utilization", "Less admin time"],
    bullets: [
      "Configurable reminder windows (24hr, 2hr, custom)",
      "Two-way SMS so customers can confirm or reschedule",
      "Syncs with your existing booking or calendar system",
      "Reduces last-minute cancellations",
    ],
  },
  {
    slug: "business-process-discovery",
    name: "Business Process Discovery",
    category: "Strategy",
    icon: SearchCheck,
    shortDescription:
      "We map how your business actually operates before recommending any technology.",
    description:
      "We map how your business actually operates — where time gets lost, where things fall through the cracks — before recommending any technology at all.",
    outcomes: ["A clear map of your operations", "Prioritized fixes", "No wasted tech spend"],
    bullets: [
      "Shadowing and interviews with your team",
      "Identifies bottlenecks and manual busywork",
      "Honest recommendation — sometimes that's no new software",
      "A written roadmap you own, regardless of what you build next",
    ],
  },
  {
    slug: "custom-business-software",
    name: "Custom Business Software",
    category: "Build",
    icon: LayoutDashboard,
    shortDescription:
      "Staff portals, customer portals, and operations dashboards built around how you work.",
    description:
      "Staff portals, customer portals, operations dashboards, booking systems — built around how your business actually works, not a generic template.",
    outcomes: ["Software that fits your workflow", "One system instead of five", "Room to grow"],
    bullets: [
      "Custom dashboards for operations and reporting",
      "Staff and customer-facing portals",
      "Built to integrate with your existing tools",
      "Owned by you — no lock-in to a rigid platform",
    ],
  },
  {
    slug: "business-process-automation",
    name: "Business Process Automation",
    category: "Build",
    icon: Workflow,
    shortDescription:
      "Lead management, onboarding, quoting, invoicing, and reporting — connected end-to-end.",
    description:
      "Lead management, client onboarding, quoting, invoicing, and reporting — connected and automated end-to-end so nothing needs re-entering by hand.",
    outcomes: ["Hours saved every week", "Fewer data-entry errors", "Faster turnaround"],
    bullets: [
      "Automates handoffs between tools and teams",
      "Removes duplicate data entry",
      "Built-in error checks and audit trails",
      "Scales without adding headcount",
    ],
  },
  {
    slug: "ai-business-solutions",
    name: "AI Business Solutions",
    category: "AI & Integration",
    icon: BrainCircuit,
    shortDescription:
      "Voice agents, internal knowledge assistants, and document intelligence, applied where they matter.",
    description:
      "Voice agents, internal knowledge assistants, document intelligence — AI applied wherever it creates real, measurable value, not just for the sake of it.",
    outcomes: ["Faster internal answers", "Less time on paperwork", "AI that earns its keep"],
    bullets: [
      "Internal assistants trained on your documents and policies",
      "Document intelligence for contracts, invoices, and forms",
      "Voice agents for inbound and outbound calls",
      "Measured against a clear before/after metric",
    ],
  },
  {
    slug: "systems-integration",
    name: "Systems Integration",
    category: "AI & Integration",
    icon: Plug,
    shortDescription:
      "Connecting the tools you already use into one coherent workflow.",
    description:
      "Connecting the tools you already use — Xero, Microsoft 365, Google Workspace, CRMs, job-management platforms — into one coherent workflow.",
    outcomes: ["One source of truth", "No more copy-pasting between apps", "Fewer dropped handoffs"],
    bullets: [
      "Native integrations with accounting, CRM, and job-management tools",
      "Two-way sync where it makes sense",
      "Built on stable, documented APIs — not fragile scraping",
      "Monitored so you're alerted if a sync ever fails",
    ],
  },
  {
    slug: "ongoing-support",
    name: "Ongoing Support",
    category: "Support",
    icon: LifeBuoy,
    shortDescription: "Direct access to the people who built your system — not a support queue.",
    description:
      "Direct access to the people who built your system — not a support queue. When something needs adjusting as your business grows, we're already familiar with how it works.",
    outcomes: ["Fast turnarounds", "No re-explaining your business", "A system that evolves with you"],
    bullets: [
      "Direct line to your original build team",
      "Proactive monitoring, not just reactive fixes",
      "Regular check-ins as your business changes",
      "Flexible retainers — pay for what you need",
    ],
  },
];

export function getServiceBySlug(slug: string) {
  return services.find((service) => service.slug === slug);
}
