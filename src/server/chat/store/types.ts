import type { ChatMessage, ChatOrigin, ConversationRecord, LeadRecord } from "../types";

/** The persistence boundary — every store implementation (in-memory,
 * Postgres, whatever comes next) satisfies this same shape, so nothing
 * outside store/ needs to know which one is active. Swap the export in
 * store/index.ts to change backends without touching the orchestrator. */
export interface ConversationStore {
  appendTurn(
    sessionId: string,
    ip: string,
    origin: ChatOrigin,
    userMessage: ChatMessage,
    assistantMessage: ChatMessage,
  ): Promise<void>;
  getConversation(sessionId: string): Promise<ConversationRecord | null>;
  saveLead(lead: LeadRecord): Promise<void>;
  getLead(sessionId: string): Promise<LeadRecord | null>;
}
