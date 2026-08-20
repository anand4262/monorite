import type { ChatMessage } from "./types";

const EMAIL_PATTERN = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;
// Loose on purpose: covers "0468 588 669", "+61 468 588 669",
// "(03) 1234 5678" style formats without hard-coding one country's shape.
const PHONE_PATTERN = /(\+?\d[\d\s\-().]{7,}\d)/;
const NAME_PATTERN = /\b(?:my name is|i'?m|this is|i am)\s+([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)\b/;

/**
 * Pulls name/email/phone straight out of the visitor's own messages with
 * regex — deliberately NOT sent to the LLM. Contact details are the one
 * category of information from this conversation that stays fully local
 * ("our own brain") rather than passing through a third-party API call,
 * even though the rest of the message content already has to for the
 * conversation itself to work. Best-effort by nature (name detection in
 * particular will miss plenty of real phrasings) — that's the accepted
 * trade-off for not routing PII through an external model to extract it.
 */
export function extractContactDetailsLocally(messages: ChatMessage[]): {
  name: string | null;
  email: string | null;
  phone: string | null;
} {
  const userText = messages
    .filter((m) => m.role === "user")
    .map((m) => m.content)
    .join("\n");

  const email = userText.match(EMAIL_PATTERN)?.[0] ?? null;
  const phone = userText.match(PHONE_PATTERN)?.[0]?.trim() ?? null;
  const name = userText.match(NAME_PATTERN)?.[1] ?? null;

  return { name, email, phone };
}
