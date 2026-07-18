import type { z } from "zod";

import { ApiException } from "@/lib/api/errors";

export async function parseBody<T>(req: Request, schema: z.ZodType<T>): Promise<T> {
  const json = await req.json().catch(() => {
    throw new ApiException("VALIDATION_FAILED", "Request body must be valid JSON.");
  });

  const result = schema.safeParse(json);
  if (!result.success) {
    const issue = result.error.issues[0];
    const field = issue.path.length > 0 ? issue.path.join(".") : undefined;
    throw new ApiException("VALIDATION_FAILED", issue.message, field);
  }

  return result.data;
}
