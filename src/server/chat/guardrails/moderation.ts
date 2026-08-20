import OpenAI from "openai";
import type { GuardrailResult } from "../types";

let client: OpenAI | null = null;
function getClient(): OpenAI {
  // Runs concurrently with the completion call (see orchestrator.ts) —
  // Promise.all only resolves once both do, so an unbounded moderation
  // call would stall a reply even after the completion itself finished.
  // Same reasoning as llm/provider.ts's client.
  client ??= new OpenAI({ apiKey: process.env.OPENAI_API_KEY, timeout: 8_000, maxRetries: 1 });
  return client;
}

/** Runs the message through OpenAI's purpose-built moderation classifier
 * (hate, harassment, threats, self-harm, sexual content involving
 * minors, etc.) rather than a hand-rolled keyword/slur list — those are
 * both easy to evade and prone to false-positiving on ordinary language,
 * where a model trained specifically for this does meaningfully better.
 * Free to call, so there's no cost reason not to run it on every turn.
 * Mild profanity or frustration alone does not get flagged by this — the
 * bar is genuine abuse/harassment/threats, matching the persona's "don't
 * disengage just because someone's annoyed" instruction. */
export async function checkModeration(message: string): Promise<GuardrailResult> {
  try {
    const result = await getClient().moderations.create({ input: message });
    const flagged = result.results[0]?.flagged ?? false;

    if (flagged) {
      return {
        allowed: false,
        reason: "I'm not able to help with that. Happy to answer anything about Monorite's services though.",
      };
    }

    return { allowed: true };
  } catch (error) {
    // Moderation being unreachable shouldn't block a legitimate visitor —
    // fail open here and let the persona's own tone instructions and the
    // output guardrail be the backstop for this turn.
    console.error("Moderation check failed:", error);
    return { allowed: true };
  }
}
