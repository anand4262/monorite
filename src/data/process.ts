import type { ProcessStep } from "@/types";

// The real journey from an actual case study (a cable & internet operator
// who tracked subscribers on paper — see src/data/projects.ts,
// cable-pulse-crm) rather than an invented scenario. Chosen over a website
// story for this section specifically because it's about digitizing a
// business process end-to-end, which is what "How we work" is meant to
// demonstrate.
export const process: ProcessStep[] = [
  {
    step: "01",
    title: "Discovery",
    description:
      "We spent time understanding how the business actually tracked subscribers day to day, village by village, mostly on paper.",
  },
  {
    step: "02",
    title: "Design & build",
    description:
      "We designed a simple app around that existing workflow: organize by village, record payments in seconds, calculate dues automatically.",
  },
  {
    step: "03",
    title: "Offline-first engineering",
    description:
      "Field connectivity isn't always reliable, so the app was built to work fully offline and sync automatically once back online.",
  },
  {
    step: "04",
    title: "Result",
    description:
      "The business now runs its books from a phone instead of a notebook, live and in use across Andhra Pradesh and Telangana.",
  },
];
