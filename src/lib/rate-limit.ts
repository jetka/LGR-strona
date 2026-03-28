/**
 * Simple in-memory rate limiter for login brute-force protection.
 * Max `limit` attempts per `windowMs` per unique key (IP address).
 * 
 * In production, replace with Redis-based rate limiter (e.g. @upstash/ratelimit).
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitEntry>();

// Cleanup stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.resetTime) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000);

export function rateLimit(key: string, limit: number = 5, windowMs: number = 15 * 60 * 1000): {
  success: boolean;
  remaining: number;
  resetIn: number;
} {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetTime) {
    store.set(key, { count: 1, resetTime: now + windowMs });
    return { success: true, remaining: limit - 1, resetIn: windowMs };
  }

  if (entry.count >= limit) {
    return { success: false, remaining: 0, resetIn: entry.resetTime - now };
  }

  entry.count++;
  return { success: true, remaining: limit - entry.count, resetIn: entry.resetTime - now };
}
