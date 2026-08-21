/** The chat assistant's opening line, shown before a visitor sends
 * anything. Kept as plain content here rather than inside ChatProvider so
 * it can be edited without touching client-state logic. */
export const chatGreeting =
  "Hey — I'm Monorite's assistant. Ask me about our services, a project we've built, or how this works.";

/** Canned starter questions shown once, before the first real message. */
export const chatSuggestions = [
  "What services do you offer?",
  "Can you build me a website?",
  "Tell me about a project you've shipped",
];
