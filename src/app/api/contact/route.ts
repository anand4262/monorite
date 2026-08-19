import { NextRequest, NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validations";
import { isRateLimited } from "@/lib/rate-limit";
import { site } from "@/data/site";

export const runtime = "nodejs";

/**
 * POST /api/contact
 *
 * Security measures applied here, in order:
 *  1. Same-origin check — rejects cross-site requests that don't carry a
 *     matching Origin/Referer header (basic CSRF mitigation for a
 *     cookie-less form; belt-and-suspenders alongside SameSite defaults).
 *  2. IP-based rate limiting — throttles abusive/scripted submission.
 *  3. Zod schema validation — the server never trusts client-side checks.
 *  4. Honeypot field — a hidden "website" field that only bots fill in.
 *  5. Minimal time-to-submit check — rejects submissions faster than a
 *     human could plausibly type (a cheap bot signal).
 *
 * Email delivery is stubbed behind an env var so this works out of the box
 * without a third-party account; wire up Resend/SendGrid/etc. by filling in
 * RESEND_API_KEY in .env.local and completing the `sendEmail` function.
 */
export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");

  if (origin && host && !origin.includes(host)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a minute." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = contactFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid submission." },
      { status: 400 },
    );
  }

  const { name, email, company, phone, message, website, renderedAt } = parsed.data;

  // Honeypot tripped — pretend success so the bot doesn't learn anything,
  // but drop the submission silently.
  if (website) {
    return NextResponse.json({ ok: true });
  }

  // Reject submissions completed implausibly fast (< 2s from render).
  if (renderedAt && Date.now() - renderedAt < 2000) {
    return NextResponse.json({ error: "Please try submitting again." }, { status: 400 });
  }

  try {
    await sendEmail({ name, email, company, phone, message });
  } catch (error) {
    console.error("[contact] failed to send notification email:", error);
    return NextResponse.json(
      { error: "We couldn't send your message right now. Please email us directly." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}

async function sendEmail(fields: {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? site.email;
  const from = process.env.CONTACT_FROM_EMAIL ?? "no-reply@monorite.com";

  if (!apiKey) {
    // No provider configured yet — log server-side so submissions are never
    // silently lost during local development or before setup is complete.
    console.info("[contact] new submission (email provider not configured):", {
      to,
      from,
      ...fields,
    });
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to,
      from,
      reply_to: fields.email,
      subject: `New enquiry from ${fields.name}`,
      text: [
        `Name: ${fields.name}`,
        `Email: ${fields.email}`,
        fields.company ? `Company: ${fields.company}` : null,
        fields.phone ? `Phone: ${fields.phone}` : null,
        "",
        fields.message,
      ]
        .filter(Boolean)
        .join("\n"),
    }),
  });

  if (!res.ok) {
    throw new Error(`Email provider responded with ${res.status}`);
  }
}
