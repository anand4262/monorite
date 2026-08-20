/**
 * Minimal in-memory fixed-window rate limiter for the contact API route.
 *
 * NOTE: this resets whenever the server process restarts and is scoped per
 * instance, so it's a reasonable baseline for a single-server deployment or
 * light traffic — but it will NOT correctly share state across multiple
 * serverless instances. For production at scale, swap this for a shared
 * store such as Upstash Redis (`@upstash/ratelimit`) keyed the same way.
 */

const WINDOW_MS = 60_000; // 1 minute
const DEFAULT_MAX_REQUESTS = 5;

const hits = new Map<string, { count: number; windowStart: number }>();

export function isRateLimited(key: string, maxRequests = DEFAULT_MAX_REQUESTS): boolean {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    hits.set(key, { count: 1, windowStart: now });
    return false;
  }

  entry.count += 1;
  if (entry.count > maxRequests) {
    return true;
  }

  return false;
}

// Periodically clear stale entries so the map doesn't grow unbounded.
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of hits.entries()) {
    if (now - entry.windowStart > WINDOW_MS * 5) {
      hits.delete(key);
    }
  }
}, WINDOW_MS * 5).unref?.();
