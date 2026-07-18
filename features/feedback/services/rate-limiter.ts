const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 3;

const hits = new Map<string, number[]>();

/**
 * In-memory, per-IP sliding-window limiter — explicitly sanctioned for this
 * endpoint by M07 ("fine at this scale, do not add Redis"). Not shared
 * across serverless instances, not durable across restarts. A real
 * cross-instance limiter is M26's job.
 */
export function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }

  recent.push(now);
  hits.set(ip, recent);
  return false;
}
