import type { ChatMessage, ChatOrigin, ConversationRecord, LeadRecord } from "../types";
import type { ConversationStore } from "./types";

/** Process-local, in-memory implementation. Same caveat as
 * lib/rate-limit.ts: resets on redeploy/restart and doesn't share state
 * across serverless instances, so it's a working default for development
 * and light traffic, not the final production backend. Swap the export in
 * store/index.ts for a real database-backed implementation satisfying the
 * same ConversationStore interface — nothing else in the service needs to
 * change. */
class MemoryConversationStore implements ConversationStore {
  private conversations = new Map<string, ConversationRecord>();
  private leads = new Map<string, LeadRecord>();

  async appendTurn(
    sessionId: string,
    ip: string,
    origin: ChatOrigin,
    userMessage: ChatMessage,
    assistantMessage: ChatMessage,
  ): Promise<void> {
    const now = new Date().toISOString();
    const existing = this.conversations.get(sessionId);

    if (existing) {
      existing.messages.push(userMessage, assistantMessage);
      existing.updatedAt = now;
      return;
    }

    this.conversations.set(sessionId, {
      sessionId,
      ip,
      // First-write-wins: origin reflects wherever the conversation
      // actually started, not whichever shell happens to send a later
      // message in it.
      origin,
      messages: [userMessage, assistantMessage],
      createdAt: now,
      updatedAt: now,
    });
  }

  async getConversation(sessionId: string): Promise<ConversationRecord | null> {
    return this.conversations.get(sessionId) ?? null;
  }

  async saveLead(lead: LeadRecord): Promise<void> {
    this.leads.set(lead.sessionId, lead);
  }

  async getLead(sessionId: string): Promise<LeadRecord | null> {
    return this.leads.get(sessionId) ?? null;
  }
}

export const memoryConversationStore = new MemoryConversationStore();
