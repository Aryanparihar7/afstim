import { z } from "zod";

export const feedbackSchema = z.object({
  category: z.enum(["bug", "idea", "confusing", "other"]),
  message: z
    .string()
    .min(10, "Tell us a bit more — at least 10 characters.")
    .max(2000, "Keep it under 2000 characters."),
  email: z
    .union([z.email("Enter a valid email address."), z.literal("")])
    .optional(),
});

export type FeedbackInput = z.infer<typeof feedbackSchema>;
