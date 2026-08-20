import OpenAI from "openai";
import { chatConfig } from "./config";
import { extractContactDetailsLocally } from "./local-contact-extractor";
import type { ChatMessage, ChatOrigin, LeadRecord } from "./types";

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

/** A second, small LLM call that summarizes the conversation into what the
 * team actually wants to read — service interest and a plain-English
 * description of the visitor's business — rather than making a human
 * re-read the whole transcript. Contact details are deliberately NOT part
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
      max_tokens: 200,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            'Summarize this support chat transcript for internal follow-up. Respond with strict JSON: {"serviceInterest": string|null, "businessSummary": string|null}. serviceInterest is the specific service they seem interested in, or null if unclear. businessSummary is one or two sentences describing their business and what they need, based only on what they actually said — null if there isn\'t enough to summarize yet. Do not include any names, email addresses, or phone numbers in your response even if they appear in the transcript.',
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
