import { AlertTriangle, PhoneCall, Ear, ShieldCheck } from "lucide-react";
import type { ReceptionistTier, TransparencyPoint } from "@/types";

/** The three ways the AI phone receptionist classifies and routes an
 * incoming call — see /ai-receptionist. */
export const receptionistTiers: ReceptionistTier[] = [
  {
    icon: AlertTriangle,
    label: "Life-safety",
    example: "Gas leak, smoke, electric shock, injury",
    response:
      "The agent's first response is always \"if anyone is in danger, hang up and call 000 now,\" before anything else. It still captures details and notifies the tradie.",
  },
  {
    icon: PhoneCall,
    label: "Urgent trade job",
    example: "Burst pipe, no water, no power",
    response:
      "Triggers a live transfer to the tradie's mobile. If unanswered within 20 seconds, the agent takes a detailed message, sends an urgent SMS, and tells the caller when to expect a callback. Never silence.",
  },
  {
    icon: Ear,
    label: "Standard",
    example: "Routine booking, general enquiry",
    response:
      "Normal capture flow: name, job type, address, and preferred time, confirmed with the caller and sent straight to the tradie.",
  },
];

export const receptionistTransparencyPoints: TransparencyPoint[] = [
  {
    icon: ShieldCheck,
    title: "Upfront disclosure",
    description:
      "Every call opens with a clear statement that the caller is speaking with an AI assistant and that the call may be recorded. No pretending to be human.",
  },
  {
    icon: PhoneCall,
    title: "Real fallbacks, not silence",
    description:
      "If a transfer goes unanswered or the system has an issue, the caller is never left hanging. A message, an SMS, or a clear next step every time.",
  },
  {
    icon: Ear,
    title: "Personally reviewed, not a black box",
    description:
      "Every call is reviewed personally during the pilot, not a support ticket queue, not a faceless SaaS dashboard.",
  },
];
