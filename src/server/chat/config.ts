/** Central, single-source config for the chat service — every tunable
 * lives here instead of scattered across the module. */
export const chatConfig = {
  model: "gpt-4o-mini",
  temperature: 0.5,
  maxOutputTokens: 300,
  /** Hard cap on conversation length sent to the LLM (oldest trimmed). */
  maxHistoryMessages: 20,
  maxMessageLength: 2000,
  /** Guardrail limit distinct from history length — the max a single
   * inbound message may be before it's rejected outright. */
  rateLimit: {
    windowRequests: 20,
    windowLabel: "minute",
  },
  /** Company/service/project chunks are always fully included (see
   * retriever.ts) — this only caps the FAQ category, which is large
   * enough that relevance selection is worth it. */
  faqRetrievalTopK: 3,
} as const;
