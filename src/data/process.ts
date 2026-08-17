import type { ProcessStep } from "@/types";

// Told as one concrete scenario instead of four generic phase labels — a
// customer's call at 9pm, answered, and booked before morning. It's a
// vivid illustration of the process, not the whole of what Monorite builds
// (see the homepage hero and services for the fuller picture).
export const process: ProcessStep[] = [
  {
    step: "01",
    title: "9:04pm — a call comes in",
    description:
      "A customer's pipe just burst. Your team's already home for the night.",
  },
  {
    step: "02",
    title: "The AI assistant answers",
    description:
      "Trained on your services, pricing, and scheduling — it sounds like your best CSR, not a robot.",
  },
  {
    step: "03",
    title: "It's booked before sunrise",
    description:
      "The job lands straight in your calendar. You walk in tomorrow to a full day, not a voicemail box.",
  },
];
