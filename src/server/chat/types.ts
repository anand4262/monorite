export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

/** Which shell the conversation started in — the homepage's always-on
 * "live demo" panel (curious/evaluating) vs. the site-wide floating
 * widget (came with intent to ask something). Captured once, from
 * whichever shell sends the first message, and fixed for the life of the
 * conversation even if the visitor later interacts via the other shell. */
export type ChatOrigin = "demo" | "widget";

/** One retrievable unit of ground-truth about the business — a service, a
 * project, an FAQ entry, or a company fact. The "brain" retrieves the
 * top-scoring chunks for a query and only those are handed to the LLM as
 * context, instead of dumping the entire knowledge base into every prompt. */
export interface KnowledgeChunk {
  id: string;
  category: "service" | "project" | "faq" | "company";
  /** Plain-text content the LLM will read, already written as prose. */
  text: string;
  /** Lowercased keywords used for retrieval scoring — see retriever.ts. */
  keywords: string[];
}

export interface GuardrailResult {
  allowed: boolean;
  /** User-facing message to show instead of calling the LLM, when blocked. */
  reason?: string;
}

export interface ConversationRecord {
  sessionId: string;
  ip: string;
  origin: ChatOrigin;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

/** A structured record of what a visitor is asking for, distinct from the
 * raw message log — this is what the team actually reads to follow up,
 * built by summarizing the conversation (and any uploaded document) once
 * there's enough signal to be useful, not on every single turn. */
export interface LeadRecord {
  sessionId: string;
  origin: ChatOrigin;
  serviceInterest: string | null;
  businessSummary: string | null;
  sourceDocument: string | null;
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  createdAt: string;
}

export interface GenerateReplyInput {
  sessionId: string;
  ip: string;
  origin: ChatOrigin;
  messages: ChatMessage[];
  /** Text already extracted from an uploaded PDF for this turn, if any. */
  attachedDocumentText?: string;
}

export interface GenerateReplyResult {
  reply: string;
  blocked: boolean;
  /** True when this turn's user message contained a name, email, or phone
   * number the local extractor could find — a fast synchronous check, not
   * a guarantee the full async lead (extractLead in intake.ts) was saved.
   * Good enough for client-side "fire a generate_lead analytics event"
   * purposes without adding latency to the reply. */
  leadCaptured: boolean;
  /** Same threshold as shouldExtractLead (intake.ts) — once a conversation
   * is substantial enough to be worth summarizing into a lead, it's also
   * substantial enough to offer a real "book a project" CTA in the UI,
   * rather than showing one from the very first message. */
  showCta: boolean;
}
