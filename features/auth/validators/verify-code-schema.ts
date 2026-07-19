import { z } from "zod";

export const verifyCodeSchema = z.object({
  code: z.string().regex(/^\d{6}$/, "Enter the 6-digit code."),
});

export type VerifyCodeInput = z.infer<typeof verifyCodeSchema>;
