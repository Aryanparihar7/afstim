import { runRemoteChecks } from "@/features/validation/services/remote-check-service";
import { ApiException } from "@/lib/api/errors";
import { apiHandler } from "@/lib/api/handler";
import { ok } from "@/lib/api/response";
import { requireActive } from "@/lib/auth/guards";

const WINDOW_MS = 60 * 1000;
const lastRequestAt = new Map<string, number>();

/**
 * ponytail: in-memory, per-instance 1/min/mission limit — same stopgap
 * shape as features/feedback/services/rate-limiter.ts, sanctioned until
 * M26's durable RateCounter replaces it.
 */
function isRateLimited(key: string): boolean {
  const now = Date.now();
  const last = lastRequestAt.get(key);
  if (last !== undefined && now - last < WINDOW_MS) {
    return true;
  }
  lastRequestAt.set(key, now);
  return false;
}

export const POST = apiHandler(
  async (_req: Request, context: { params: Promise<{ slug: string }> }) => {
    const session = await requireActive();
    const { slug } = await context.params;

    if (isRateLimited(`${session.user.id}:${slug}`)) {
      throw new ApiException("RATE_LIMITED");
    }

    const data = await runRemoteChecks(session.user.id, slug);
    return ok(data);
  }
);
