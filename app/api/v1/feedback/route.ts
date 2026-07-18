import { submitFeedback } from "@/features/feedback/services/feedback-service";
import { feedbackSchema } from "@/features/feedback/validators/feedback-schema";
import { apiHandler } from "@/lib/api/handler";
import { ok } from "@/lib/api/response";
import { parseBody } from "@/lib/api/validate";

function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return req.headers.get("x-real-ip") ?? "unknown";
}

export const POST = apiHandler(async (req: Request) => {
  const input = await parseBody(req, feedbackSchema);

  // No session/auth system exists yet (Auth.js lands in a later module),
  // so there is never a session to attach. Always null until then.
  const userId: string | null = null;

  await submitFeedback(input, { ip: getClientIp(req), userId });

  return ok({ sent: true }, 201);
});
