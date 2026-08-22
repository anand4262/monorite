import OpenAI from "openai";
import { chatConfig } from "../config";
import { extractContactDetailsLocally } from "./local-contact-extractor";
import type { ChatMessage, ChatOrigin, LeadRecord } from "../types";

let client: OpenAI | null = null;
function getClient(): OpenAI {
  // Runs fire-and-forget after the reply's already been returned (see
  // orchestrator.ts), so it can't add latency the visitor waits on — but
  // still bounded rather than left to the SDK's 10-minute default, so a
  // stuck request doesn't linger indefinitely in the background.
  client ??= new OpenAI({ apiKey: process.env.OPENAI_API_KEY, timeout: 12_000, maxRetries: 1 });
  return client;
}

/** Only worth the extra LLM call once there's actually something to
 * summarize — a document was just shared, or the conversation has enough
 * turns that a visitor is clearly past small talk. */
export function shouldExtractLead(messages: ChatMessage[], hasDocument: boolean): boolean {
  return hasDocument || messages.filter((m) => m.role === "user").length >= 3;
}

/** A second, small LLM call that turns the transcript into an actual read
 * on the visitor — not just a one-line label, but what they need, why,
 * and anything urgent or notable — so the team gets the conversation
 * *understood*, not just logged. Contact details are deliberately NOT part
 * of this call: they're pulled locally instead (local-contact-extractor.ts)
 * so name/email/phone never have to be sent to the LLM provider just to
 * extract them back out again. Best-effort: a failure here never blocks
 * the chat reply itself (see orchestrator.ts), it just means the lead
 * isn't captured for that turn. */
export async function extractLead(
  sessionId: string,
  origin: ChatOrigin,
  messages: ChatMessage[],
  documentText?: string,
): Promise<LeadRecord | null> {
  const contact = extractContactDetailsLocally(messages);

  const base = {
    sessionId,
    origin,
    sourceDocument: documentText ? "pdf" : null,
    contactName: contact.name,
    contactEmail: contact.email,
    contactPhone: contact.phone,
    createdAt: new Date().toISOString(),
  };

  if (!process.env.OPENAI_API_KEY) {
    return { ...base, serviceInterest: null, businessSummary: null };
  }

  const transcript = messages.map((m) => `${m.role}: ${m.content}`).join("\n");
  const documentBlock = documentText ? `\n\nAttached document contents:\n${documentText}` : "";

  try {
    const completion = await getClient().chat.completions.create({
      model: chatConfig.model,
      temperature: 0,
      max_tokens: 350,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            'Analyze this support chat transcript for internal follow-up — the team reading this has NOT read the transcript themselves, so this is their only understanding of the conversation. Respond with strict JSON: {"serviceInterest": string|null, "businessSummary": string|null}. serviceInterest is the specific service they seem interested in, or null if unclear. businessSummary is a real analysis in 3-5 sentences: what they actually need and why, their type of business, any urgency or timeline mentioned, and what the team should say or do next when following up — based only on what they actually said, null if there isn\'t enough yet to say anything useful. Do not include any names, email addresses, or phone numbers in your response even if they appear in the transcript.',
        },
        { role: "user", content: `${transcript}${documentBlock}` },
      ],
    });

    const raw = completion.choices[0]?.message?.content;
    const parsed = raw
      ? (JSON.parse(raw) as { serviceInterest?: string | null; businessSummary?: string | null })
      : {};

    return { ...base, serviceInterest: parsed.serviceInterest ?? null, businessSummary: parsed.businessSummary ?? null };
  } catch (error) {
    console.error("Lead summary extraction failed:", error);
    return { ...base, serviceInterest: null, businessSummary: null };
  }
}
