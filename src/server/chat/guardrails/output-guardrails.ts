import { chatConfig } from "../config";
import { projects } from "@/data/projects";
import { stripMarkdown } from "./strip-markdown";

const MAX_OUTPUT_CHARS = 1200;

// Pulled from the real project data, not hand-copied, so this can't drift
// out of sync with what actually gets added/renamed in projects.ts.
const REAL_CLIENT_NAMES = projects.map((p) => p.client.toLowerCase());

/** Phrasing the model uses when describing a specific, completed piece of
 * work — this is exactly the failure pattern that produced a fabricated
 * "health and wellness startup" case study: generic-sounding project talk
 * with no real client name behind it. If the reply reads like it's
 * describing a specific project but names none of our actual clients,
 * it's fabricated by construction — there is no legitimate case where a
 * true answer about our own work wouldn't be able to name which one. */
const PROJECT_CLAIM_PATTERNS = [
  /\bwe (recently |just )?(completed|built|shipped|delivered|launched|developed)\b/i,
  /\bone of our (clients|projects|customers)\b/i,
  /\bwe worked with\b/i,
  /\ba (recent |past )?project (we|for)\b/i,
  /\brecently (completed|built|shipped|delivered|launched)\b/i,
];

const PROJECT_CLAIM_FALLBACK =
  "I don't want to describe a project without the real details in front of me — take a look at our actual case studies at /work, or ask me about one by name.";

/** Phrases that would mean the model is committing to something it has no
 * authority to commit to — a specific price, a contractual guarantee, a
 * deadline. The persona prompt already tells it not to do this; this is
 * the backstop for when it does anyway. */
const OVERCOMMIT_PATTERNS = [/\bguarantee(d)?\b/i, /\bwe promise\b/i, /\bcontract(ually)?\b/i];

/** Backstop for the persona's confidentiality rules — catches the model
 * self-identifying its underlying provider/model even though it's been
 * told not to. Regex can't reliably rewrite an in-context leak, so this
 * replaces the whole reply with the same deflection the persona is meant
 * to give naturally, rather than trying to surgically redact it. */
const TECH_STACK_LEAK_PATTERNS = [
  /\bopenai\b/i,
  /\bgpt-?[0-9]/i,
  /\bchatgpt\b/i,
  /\banthropic\b/i,
  /\bclaude\b/i,
  /\bas an ai language model\b/i,
  /\bi(’|')?m (a |an )?(large )?language model\b/i,
];

const OVERCOMMIT_FALLBACK =
  "I don't want to overstate that without the team weighing in. Best to confirm specifics at /contact.";

const TECH_STACK_FALLBACK =
  "I'm Monorite's own assistant, built in-house for this site. I can't get into the technical stack, but happy to talk about what it can do for your business.";

/** Runs on the LLM's raw output before it reaches the client. Never lets a
 * malformed, empty, overlong, overcommitting, or confidentiality-leaking
 * reply through as-is. */
export function checkOutput(rawReply: string): string {
  const reply = stripMarkdown(rawReply.trim());

  if (!reply) {
    return "Sorry, I didn't catch that. Could you rephrase?";
  }

  if (TECH_STACK_LEAK_PATTERNS.some((pattern) => pattern.test(reply))) {
    return TECH_STACK_FALLBACK;
  }

  const soundsLikeAProjectClaim = PROJECT_CLAIM_PATTERNS.some((pattern) => pattern.test(reply));
  const namesARealClient = REAL_CLIENT_NAMES.some((name) => reply.toLowerCase().includes(name));
  if (soundsLikeAProjectClaim && !namesARealClient) {
    return PROJECT_CLAIM_FALLBACK;
  }

  if (OVERCOMMIT_PATTERNS.some((pattern) => pattern.test(reply))) {
    return OVERCOMMIT_FALLBACK;
  }

  if (reply.length > MAX_OUTPUT_CHARS) {
    return `${reply.slice(0, MAX_OUTPUT_CHARS).trim()}…`;
  }

  return reply;
}

export function withinHistoryLimit(count: number): boolean {
  return count <= chatConfig.maxHistoryMessages;
}
