import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.email("Enter a valid email address."),
  password: z.string().min(10, "Use at least 10 characters."),
});

export type RegisterInput = z.infer<typeof registerSchema>;
