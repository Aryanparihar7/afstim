import { ApiException } from "@/lib/api/errors";
import { insertFeedback } from "@/features/feedback/repositories/feedback-repository";
import { isRateLimited } from "@/features/feedback/services/rate-limiter";
import type { FeedbackInput } from "@/features/feedback/validators/feedback-schema";
import { sendFeedbackNotificationEmail } from "@/features/email/services/email-service";

export async function submitFeedback(
  input: FeedbackInput,
  context: { ip: string; userId: string | null }
): Promise<void> {
  if (isRateLimited(context.ip)) {
    throw new ApiException("RATE_LIMITED");
  }

  const email = input.email ? input.email : null;

  await insertFeedback({
    category: input.category,
    message: input.message,
    email,
    userId: context.userId,
  });

  await sendFeedbackNotificationEmail({
    category: input.category,
    message: input.message,
    email,
  });
}
