/**
 * Decorative labels scattered around the homepage hero headline — a loose,
 * atmospheric echo of what Monorite builds, not a literal copy of the
 * services list in services.ts (the wording and count deliberately differ).
 */
export interface HeroFloatingCard {
  label: string;
  /** Tailwind position/rotation classes for this card's placement. */
  className: string;
}

export const heroFloatingCards: HeroFloatingCard[] = [
  { label: "WEBSITE BUILD", className: "left-[6%] top-[14%] -rotate-6" },
  { label: "AI CALL AGENT", className: "left-[26%] top-[4%] rotate-3" },
  { label: "CRM SYSTEM", className: "right-[8%] top-[10%] rotate-6" },
  { label: "REVIEW AUTOMATION", className: "left-[4%] top-[60%] rotate-3" },
  { label: "PROCESS DISCOVERY", className: "right-[5%] top-[58%] -rotate-3" },
  { label: "LAUNCH SUPPORT", className: "right-[22%] top-[78%] rotate-6" },
];
