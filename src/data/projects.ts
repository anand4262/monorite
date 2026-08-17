import type { Project } from "@/types";

export const projects: Project[] = [
  {
    slug: "reyes-plumbing-call-assistant",
    client: "Reyes Plumbing & Rooter",
    industry: "Home Services",
    title: "Turning missed calls into booked jobs",
    summary:
      "An AI call assistant that answers every enquiry, quotes standard jobs, and books appointments directly into the team's calendar.",
    challenge:
      "Reyes Plumbing was missing roughly 1 in 4 incoming calls during business hours and nearly all of them after hours — each one a potential job going to a competitor.",
    solution:
      "We deployed an AI call and text assistant trained on their service list, pricing bands, and service area, integrated directly with their scheduling system so bookings appear instantly for dispatch.",
    results: [
      { label: "Missed calls", value: "-92%" },
      { label: "After-hours bookings", value: "+41" },
      { label: "Time to answer", value: "<2s" },
    ],
    services: ["ai-call-text-assistant", "systems-integration"],
  },
  {
    slug: "clearline-dental-intake-overhaul",
    client: "Clearline Dental Group",
    industry: "Healthcare",
    title: "Rebuilding patient intake from the ground up",
    summary:
      "A full process discovery engagement followed by a custom patient portal and automated appointment reminders across five locations.",
    challenge:
      "Patient intake was spread across paper forms, a legacy scheduling tool, and manual reminder calls — creating errors and a high no-show rate.",
    solution:
      "After two weeks of process discovery across all five locations, we built a unified patient portal with digital intake, synced it to their practice management software, and layered in automated SMS reminders.",
    results: [
      { label: "No-show rate", value: "-63%" },
      { label: "Intake time", value: "-18 min" },
      { label: "Locations live", value: "5" },
    ],
    services: ["business-process-discovery", "custom-business-software", "booking-appointment-reminders"],
  },
  {
    slug: "whitfield-auto-reputation-engine",
    client: "Whitfield Auto Care",
    industry: "Automotive",
    title: "Tripling review volume without lifting a finger",
    summary:
      "An automated review-request pipeline triggered directly from job completion, with private routing for unhappy customers.",
    challenge:
      "Whitfield had excellent service but only a handful of online reviews — front-desk staff never had time to ask, and follow-up was inconsistent.",
    solution:
      "We connected their job-management system to an automated review flow: happy customers are routed to Google and Facebook, while flagged concerns go straight to the GM privately, before they go public.",
    results: [
      { label: "Reviews per month", value: "3x" },
      { label: "Average rating", value: "4.6 → 4.9" },
      { label: "Staff time spent", value: "0 hrs" },
    ],
    services: ["automated-review-requests"],
  },
  {
    slug: "lindqvist-home-services-integration",
    client: "Lindqvist Home Services",
    industry: "Home Services",
    title: "One workflow instead of five disconnected tools",
    summary:
      "Connecting Xero, their CRM, and their scheduling platform into a single automated flow for quoting, invoicing, and reporting.",
    challenge:
      "Leads, quotes, jobs, and invoices lived in four different systems that didn't talk to each other, so the team was re-typing the same information all day.",
    solution:
      "We built native integrations between their CRM, scheduling tool, and Xero, automating the handoff from quote to job to invoice, with monitoring that alerts the team if any sync ever fails.",
    results: [
      { label: "Manual data entry", value: "-30 hrs/mo" },
      { label: "Invoice turnaround", value: "-4 days" },
      { label: "Systems unified", value: "4 → 1 workflow" },
    ],
    services: ["systems-integration", "business-process-automation"],
  },
];

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}
