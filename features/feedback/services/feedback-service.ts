import { ApiException } from "@/lib/api/errors";
import { insertFeedback } from "@/features/feedback/repositories/feedback-repository";
import { isRateLimited } from "@/features/feedback/services/rate-limiter";
import type { FeedbackInput } from "@/features/feedback/validators/feedback-schema";

export async function submitFeedback(
  input: FeedbackInput,
  context: { ip: string; userId: string | null }
): Promise<void> {
  if (isRateLimited(context.ip)) {
    throw new ApiException("RATE_LIMITED");
  }

  await insertFeedback({
    category: input.category,
    message: input.message,
    email: input.email ? input.email : null,
    userId: context.userId,
  });
}
