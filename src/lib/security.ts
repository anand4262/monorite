import type { NextRequest } from "next/server";

/**
 * Same-origin check for state-changing API routes (contact form, chat) —
 * basic CSRF mitigation for cookie-less endpoints. Compares the Origin
 * header's host to the request's own Host header EXACTLY, not by
 * substring: `origin.includes(host)` (the previous implementation, in
 * both /api/contact and /api/chat) is exploitable — an Origin of
 * "https://evilmonorite.com" contains "monorite.com" as a substring and
 * would incorrectly pass. Malformed/unparseable Origin headers are
 * treated as a mismatch (fail closed), not ignored.
 *
 * If there's no Origin header at all, the request is allowed through —
 * some legitimate same-site requests omit it — matching the previous
 * behavior rather than introducing a stricter policy than was asked for.
 */
export function isSameOrigin(request: NextRequest): boolean {
  const originHeader = request.headers.get("origin");
  const host = request.headers.get("host");

  if (!originHeader) return true;
  if (!host) return false;

  try {
    return new URL(originHeader).host === host;
  } catch {
    return false;
  }
}
