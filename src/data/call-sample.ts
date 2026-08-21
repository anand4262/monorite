/**
 * The one sample call script used both on /ai-receptionist (as a text
 * transcript) and in the homepage VoiceAgentSample audio player. Kept in
 * one place after having to hand-edit both copies in sync twice already —
 * next time the script changes, it only needs to change here.
 */
export interface CallSampleLine {
  speaker: "agent" | "caller";
  text: string;
}

export const callSample: CallSampleLine[] = [
  {
    speaker: "agent",
    text: "Thanks for calling, this is Mike on the after hours line, this call may be recorded. Go ahead and tell me what's going on.",
  },
  { speaker: "caller", text: "Hi, is this the plumber? My kitchen's flooding, a pipe's burst under the sink." },
  { speaker: "agent", text: "Sorry to hear that. Is anyone in danger, or is it just the water?" },
  { speaker: "caller", text: "Just water, but it's a lot of it." },
];
