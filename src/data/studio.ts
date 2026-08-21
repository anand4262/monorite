import { Target, HeartHandshake, ShieldCheck } from "lucide-react";
import type { StudioValue } from "@/types";

export const studioValues: StudioValue[] = [
  {
    icon: Target,
    title: "Process before technology",
    description:
      "We diagnose before we prescribe. If the honest answer is 'you don't need AI for this,' we'll say so.",
  },
  {
    icon: HeartHandshake,
    title: "Built around your business",
    description:
      "No generic templates. Every system is designed around how your team actually operates today.",
  },
  {
    icon: ShieldCheck,
    title: "Direct access, always",
    description:
      "You work with the people who build your system, during launch and long after, no support ticket queue.",
  },
];
