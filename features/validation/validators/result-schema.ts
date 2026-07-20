import { z } from "zod";

export const resultSchema = z.object({
  missionSlug: z.string().min(1),
  results: z.array(
    z.object({
      id: z.string().min(1),
      state: z.enum(["pass", "fail"]),
      message: z.string().max(500).nullable(),
    })
  ),
});

export type ResultInput = z.infer<typeof resultSchema>;
