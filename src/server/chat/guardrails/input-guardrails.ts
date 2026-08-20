import type { GuardrailResult } from "../types";

/** Patterns aimed at overriding the system prompt or extracting it —
 * classic prompt-injection phrasing. Not a foolproof defense (no keyword
 * list is), but it catches the common, low-effort attempts and costs
 * nothing to run before spending an LLM call on them. */
const INJECTION_PATTERNS = [
  /ignore (all|the|your|previous|above) instructions/i,
  /disregard (all|the|your|previous|above) (instructions|rules|prompt)/i,
  /you are now/i,
  /reveal (your|the) (system prompt|instructions|prompt)/i,
  /repeat (your|the) (system prompt|instructions above)/i,
  /act as (a|an) (?!.*monorite)/i,
];

/** Runs before the LLM is ever called. Cheap, synchronous, no network —
 * the point is to reject obviously bad input without spending a token or
 * a request against the LLM provider. */
export function checkInput(message: string): GuardrailResult {
  const trimmed = message.trim();

  if (trimmed.length === 0) {
    return { allowed: false, reason: "Message can't be empty." };
  }

  if (INJECTION_PATTERNS.some((pattern) => pattern.test(trimmed))) {
    return {
      allowed: false,
      reason: "I can't do that. Happy to help with anything about Monorite though.",
    };
  }

  return { allowed: true };
}
