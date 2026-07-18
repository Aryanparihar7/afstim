import { prisma } from "@/lib/prisma";
import type { FeedbackCategory } from "@/features/feedback/types";

export async function insertFeedback(input: {
  category: FeedbackCategory;
  message: string;
  email: string | null;
  userId: string | null;
}): Promise<void> {
  await prisma.feedback.create({
    data: {
      category: input.category,
      message: input.message,
      email: input.email,
      userId: input.userId,
    },
  });
}
