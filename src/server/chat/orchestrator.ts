import { chatConfig } from "./config";
import { buildPersonaPrompt } from "./persona";
import { buildKnowledgeBase } from "./knowledge/build-knowledge-base";
import { retrieve } from "./knowledge/retriever";
import { checkInput } from "./guardrails/input-guardrails";
import { checkOutput } from "./guardrails/output-guardrails";
import { checkModeration } from "./guardrails/moderation";
import { complete, isConfigured } from "./llm/provider";
import { conversationStore } from "./store";
import { shouldExtractLead, extractLead } from "./intake";
import { extractContactDetailsLocally } from "./local-contact-extractor";
import type { GenerateReplyInput, GenerateReplyResult } from "./types";

// A hard ceiling on the moderation+completion step, independent of
// whatever timeout/retry config the OpenAI SDK client happens to have.
// This is what actually caps worst-case reply latency — the per-client
// timeouts in llm/provider.ts and guardrails/moderation.ts reduce how
// often this gets hit, but this is the guarantee that a visitor is never
// left waiting past a known, fixed bound no matter what goes wrong
// upstream.
const REPLY_TIMEOUT_MS = 15_000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Timed out after ${ms}ms`)), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

/**
 * The chat service's single entry point: query → guardrail → brain
 * (retrieval) → persona + LLM → guardrail → store. The API route (the
 * only caller) never touches any of the pieces above directly — it just
 * calls this and returns the result, so the HTTP layer stays a thin
 * transport concern and the actual chat logic stays testable and
 * swappable on its own.
 *
 * Latency budget matters here (this blocks a visitor watching a typing
 * indicator), so anything that doesn't have to be on the critical path
 * isn't: moderation and the completion call run concurrently rather than
 * sequentially (below), and persistence/lead-extraction happen after the
 * reply is already returned, not before.
 */
export async function generateReply(input: GenerateReplyInput): Promise<GenerateReplyResult> {
  const latestUserMessage = input.messages.at(-1);
  if (!latestUserMessage || latestUserMessage.role !== "user") {
    return { reply: "Something went wrong on my end. Try sending that again.", blocked: true, leadCaptured: false, showCta: false };
  }

  // 1. Guardrail the input with cheap synchronous checks (prompt-injection
  //    patterns) before spending anything on a network call.
  const inputCheck = checkInput(latestUserMessage.content);
  if (!inputCheck.allowed) {
    return { reply: inputCheck.reason ?? "I can't help with that.", blocked: true, leadCaptured: false, showCta: false };
  }

  if (!isConfigured()) {
    return {
      reply: "Chat isn't configured yet. Set OPENAI_API_KEY to enable it. You can also reach us directly at /contact.",
      blocked: true,
      leadCaptured: false,
      showCta: false,
    };
  }

  // 2. Brain: retrieve the knowledge chunks most relevant to this query
  //    (and to the attached document, if any) — synchronous, no network —
  //    so the LLM is only ever shown the handful of facts that matter for
  //    this turn, not asked to "know" the whole business from memory.
  const knowledgeBase = buildKnowledgeBase();
  const retrievalQuery = input.attachedDocumentText
    ? `${latestUserMessage.content} ${input.attachedDocumentText.slice(0, 500)}`
    : latestUserMessage.content;
  const relevantChunks = retrieve(retrievalQuery, knowledgeBase);

  const systemPrompt = [
    buildPersonaPrompt(),
    "",
    "Relevant context for this conversation:",
    ...relevantChunks.map((c) => `- ${c.text}`),
    input.attachedDocumentText
      ? [
          "",
          "The visitor just attached a document and you have already read it in full.",
          "Its extracted contents, exactly as read:",
          input.attachedDocumentText,
          "",
          "You have full access to this text. Never say you can't view, open, or read PDFs or documents,",
          "and never ask the visitor to describe what's in it instead of you reading it yourself.",
          "Respond using what's actually in the document above.",
        ].join("\n")
      : "",
  ].join("\n");

  const history = input.messages.slice(-chatConfig.maxHistoryMessages);

  // 3. Moderation and generation run concurrently rather than
  //    moderate-then-generate: for the overwhelming majority of messages
  //    (not flagged), this roughly halves time-to-reply. The trade-off is
  //    a wasted completion call on the rare flagged message, which is a
  //    cost worth paying for consistently fast replies on everything else.
  let reply: string;
  try {
    const [moderation, raw] = await withTimeout(
      Promise.all([checkModeration(latestUserMessage.content), complete(systemPrompt, history)]),
      REPLY_TIMEOUT_MS,
    );

    if (!moderation.allowed) {
      return { reply: moderation.reason ?? "I can't help with that.", blocked: true, leadCaptured: false, showCta: false };
    }

    reply = checkOutput(raw ?? "");
  } catch (error) {
    console.error("Chat completion failed:", error);
    return {
      reply: "I'm having a brief connection issue. You can keep typing, or reach us directly at /contact.",
      blocked: true,
      leadCaptured: false,
      showCta: false,
    };
  }

  // 4. Return immediately — persistence and lead extraction happen after,
  //    never adding to the latency the visitor is waiting on. Currently
  //    safe because the store is in-memory/same-process (see store/); once
  //    that's swapped for a real database, wrap these in a platform
  //    keep-alive primitive (e.g. @vercel/functions' waitUntil) so a
  //    serverless instance can't freeze mid-write after the response is
  //    already sent.
  const assistantMessage = { role: "assistant" as const, content: reply };

  void conversationStore.appendTurn(input.sessionId, input.ip, input.origin, latestUserMessage, assistantMessage);

  const conversationIsSubstantial = shouldExtractLead(input.messages, Boolean(input.attachedDocumentText));

  if (conversationIsSubstantial) {
    void extractLead(
      input.sessionId,
      input.origin,
      [...input.messages, assistantMessage],
      input.attachedDocumentText,
    ).then((lead) => {
      if (lead) void conversationStore.saveLead(lead);
    });
  }

  // Synchronous, local, no network — safe to check on the critical path
  // without the latency cost of waiting on the async extractLead call
  // above. Only checks this turn's message, not the whole history, so it
  // reads as "contact details just given," not "ever given in this chat."
  const contact = extractContactDetailsLocally([latestUserMessage]);
  const leadCaptured = Boolean(contact.name || contact.email || contact.phone);

  return { reply, blocked: false, leadCaptured, showCta: conversationIsSubstantial };
}
