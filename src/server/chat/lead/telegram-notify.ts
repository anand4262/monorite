import type { ChatMessage, LeadRecord } from "../types";

// Telegram's sendMessage hard limit is 4096 characters. Budgeted so the
// worst case (max-length AI analysis + a full transcript snapshot, every
// field present) stays comfortably under that: these two constants bound
// the one field with genuinely unbounded input (a long back-and-forth, or
// a visitor pasting a big block of text). Truncating the final assembled
// HTML string instead of budgeting each piece would risk cutting mid-tag
// and breaking Telegram's HTML parser entirely, so this bounds the input
// instead of the output.
const MAX_TRANSCRIPT_MESSAGES = 8;
const MAX_MESSAGE_CHARS = 220;

/** Escapes the handful of characters Telegram's HTML parse mode treats as
 * markup, so a lead's own words (business summary, name, transcript) can
 * never break the message formatting or get silently dropped. */
function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function formatLine(label: string, value: string | null): string | null {
  if (!value) return null;
  return `<b>${label}:</b> ${escapeHtml(value)}`;
}

function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max).trim()}…` : text;
}

/** Condensed, readable transcript — the "snapshot" half of the
 * notification, sitting alongside the AI's analysis so the team can see
 * the visitor's actual words, not just a summary of them. Keeps only the
 * most recent turns on long conversations, since the last few messages
 * are what's actually relevant to following up right now. */
function buildTranscriptSnapshot(messages: ChatMessage[]): string {
  const recent = messages.slice(-MAX_TRANSCRIPT_MESSAGES);
  const omitted = messages.length - recent.length;
  const lines = recent.map((m) => {
    const speaker = m.role === "user" ? "Visitor" : "Assistant";
    return `<i>${speaker}:</i> ${escapeHtml(truncate(m.content, MAX_MESSAGE_CHARS))}`;
  });
  return omitted > 0 ? [`<i>(${omitted} earlier message${omitted === 1 ? "" : "s"} omitted)</i>`, ...lines].join("\n") : lines.join("\n");
}

/** Fire-and-forget push notification for a newly captured lead — the team
 * reads this off their phone instead of having to check the (in-memory,
 * non-persistent) conversation store. Pairs the AI's analysis (what the
 * visitor needs and why) with a real transcript snapshot (what they
 * actually said), so the notification alone is enough to understand the
 * conversation without opening anything else. Silently no-ops when the bot
 * isn't configured, same graceful-degradation pattern as the OpenAI/Resend
 * integrations elsewhere in this codebase. Never throws: a failure here
 * must never affect the chat reply already sent to the visitor. */
export async function notifyTelegram(lead: LeadRecord, messages: ChatMessage[]): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const lines = [
    "🔔 <b>New lead from the chat widget</b>",
    "",
    formatLine("Service interest", lead.serviceInterest),
    formatLine("Analysis", lead.businessSummary),
    formatLine("Name", lead.contactName),
    formatLine("Email", lead.contactEmail),
    formatLine("Phone", lead.contactPhone),
    formatLine("Source", lead.sourceDocument === "pdf" ? "Shared a PDF" : null),
    formatLine("Started from", lead.origin === "demo" ? "Homepage demo" : "Chat widget"),
    "",
    "<b>Conversation snapshot</b>",
    buildTranscriptSnapshot(messages),
  ].filter((line): line is string => line !== null);

  const text = lines.join("\n");

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
      signal: AbortSignal.timeout(8_000),
    });
    if (!res.ok) {
      console.error("Telegram lead notification failed:", res.status, await res.text());
    }
  } catch (error) {
    console.error("Telegram lead notification failed:", error);
  }
}
