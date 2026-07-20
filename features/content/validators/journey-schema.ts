import { z } from "zod";

export const journeySchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  objective: z.string().min(1),
  outcome: z.string().min(1),
  estimatedHours: z.number().positive(),
  missions: z.array(z.string().min(1)).min(1),
});

export type Journey = z.infer<typeof journeySchema>;
