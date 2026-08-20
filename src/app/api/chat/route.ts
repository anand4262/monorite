import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isRateLimited } from "@/lib/rate-limit";
import { isSameOrigin } from "@/lib/security";
import {
  generateReply,
  extractPdfText,
  DocumentTooLargeError,
  DocumentParseError,
  chatConfig,
} from "@/server/chat";

export const runtime = "nodejs";

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

  try {
    if (contentType.includes("multipart/form-data")) {
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
        const extracted = await extractPdfText(buffer);
        attachedDocumentText = extracted.text;
      }
    } else {
      const json = await request.json();
      sessionId = json.sessionId;
      chatOrigin = json.origin;
      rawMessages = json.messages;
    }
  } catch (error) {
    if (error instanceof DocumentTooLargeError) {
      return NextResponse.json({ error: "That PDF is too large (max 8MB)." }, { status: 413 });
    }
    if (error instanceof DocumentParseError) {
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

  return NextResponse.json({ reply: result.reply });
}
