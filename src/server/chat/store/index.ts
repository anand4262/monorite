import { memoryConversationStore } from "./memory-store";
import type { ConversationStore } from "./types";

/** Single switch point for the persistence backend. Currently the
 * in-memory store; point this at a real database-backed implementation
 * once one exists, and every caller (the orchestrator) picks it up with
 * no other changes. */
export const conversationStore: ConversationStore = memoryConversationStore;

export type { ConversationStore } from "./types";
