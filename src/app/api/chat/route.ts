import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isRateLimited } from "@/lib/rate-limit";
import { isSameOrigin } from "@/lib/security";
import { generateReply, chatConfig } from "@/server/chat";

export const runtime = "nodejs";
// Vercel's default serverless function limit (10s on Hobby) is shorter than
// this route's own internal REPLY_TIMEOUT_MS (15s in orchestrator.ts) — left
// unset, Vercel would kill a slow request and return an HTML error page
// before our own timeout logic ever gets to respond gracefully. This
// matches the platform limit to the app's own limit instead of fighting it.
export const maxDuration = 20;

const CHAT_MAX_REQUESTS_PER_MINUTE = 20;

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(2000),
});

const bodySchema = z.object({
  // The client only ever generates this via crypto.randomUUID() — enforce
  // that shape server-side rather than accepting an arbitrary string, so
  // malformed/adversarial session identifiers never reach the store.
  sessionId: z.string().uuid(),
  origin: z.enum(["demo", "widget"]),
  messages: z.array(messageSchema).min(1).max(chatConfig.maxHistoryMessages),
});

/**
 * POST /api/chat
 *
 * A thin HTTP boundary — request parsing, auth/abuse checks, and response
 * shaping only. All actual chat behavior (guardrails, retrieval, the LLM
 * call, persistence) lives in @/server/chat and is unit-testable on its
 * own without an HTTP request in the loop.
 *
 * Accepts either:
 *  - application/json: { sessionId, origin, messages }
 *  - multipart/form-data: sessionId, origin, messages (JSON string), file (PDF)
 *    — for "let me share a PDF about my business" style intake turns.
 */
export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(`chat:${ip}`, CHAT_MAX_REQUESTS_PER_MINUTE)) {
    return NextResponse.json(
      { error: "Too many messages. Please slow down a little." },
      { status: 429 },
    );
  }

  const contentType = request.headers.get("content-type") ?? "";
  let sessionId: string;
  let chatOrigin: unknown;
  let rawMessages: unknown;
  let attachedDocumentText: string | undefined;

  // pdf-parse pulls in pdfjs-dist, a large and historically fragile
  // dependency (it's already broken this route once in production via a
  // missing @napi-rs/canvas peer dependency). Importing it dynamically,
  // only on the branch that actually handles a file, means a plain text
  // message — the overwhelming majority of traffic — can never be taken
  // down by that module failing to load, now or if it breaks again later.
  const pdf = contentType.includes("multipart/form-data")
    ? await import("@/server/chat/knowledge/document-extractor")
    : null;

  try {
    if (contentType.includes("multipart/form-data") && pdf) {
      const form = await request.formData();
      sessionId = String(form.get("sessionId") ?? "");
      chatOrigin = String(form.get("origin") ?? "");
      rawMessages = JSON.parse(String(form.get("messages") ?? "[]"));

      const file = form.get("file");
      if (file instanceof File) {
        if (file.type !== "application/pdf") {
          return NextResponse.json({ error: "Only PDF attachments are supported." }, { status: 400 });
        }
        const buffer = Buffer.from(await file.arrayBuffer());
        const extracted = await pdf.extractPdfText(buffer);
        attachedDocumentText = extracted.text;
      }
    } else {
      const json = await request.json();
      sessionId = json.sessionId;
      chatOrigin = json.origin;
      rawMessages = json.messages;
    }
  } catch (error) {
    if (pdf && error instanceof pdf.DocumentTooLargeError) {
      return NextResponse.json({ error: "That PDF is too large (max 8MB)." }, { status: 413 });
    }
    if (pdf && error instanceof pdf.DocumentParseError) {
      return NextResponse.json({ error: "Couldn't read that PDF — is it a valid file?" }, { status: 422 });
    }
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse({ sessionId, origin: chatOrigin, messages: rawMessages });
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid message format." }, { status: 400 });
  }

  const result = await generateReply({
    sessionId: parsed.data.sessionId,
    ip,
    origin: parsed.data.origin,
    messages: parsed.data.messages,
    attachedDocumentText,
  });

  return NextResponse.json({ reply: result.reply, leadCaptured: result.leadCaptured, showCta: result.showCta });
}
