import { getSupabase } from "../client";
import type { ChatMessage, LeadRecord } from "@/server/chat/types";

/** Durably persists a chat lead (unlike the in-memory conversationStore,
 * which resets on every redeploy) — upserted by session_id, so the row
 * keeps updating with the fuller analysis and transcript as a
 * conversation continues, rather than one row per turn. Best-effort: a
 * failure here must never affect the chat reply already sent to the
 * visitor, so it only logs, never throws. No-ops silently when Supabase
 * isn't configured. */
export async function upsertChatLead(lead: LeadRecord, messages: ChatMessage[]): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;

  const { error } = await supabase.from("chat_leads").upsert(
    {
      session_id: lead.sessionId,
      origin: lead.origin,
      service_interest: lead.serviceInterest,
      business_summary: lead.businessSummary,
      source_document: lead.sourceDocument,
      contact_name: lead.contactName,
      contact_email: lead.contactEmail,
      contact_phone: lead.contactPhone,
      transcript: messages,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "session_id" },
  );

  if (error) {
    console.error("Failed to save chat lead to Supabase:", error.message);
  }
}
