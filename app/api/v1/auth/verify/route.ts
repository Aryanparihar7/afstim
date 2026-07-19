import {
  readPendingVerificationEmail,
  verifyEmailOtp,
} from "@/features/auth/services/verification-service";
import { verifyCodeSchema } from "@/features/auth/validators/verify-code-schema";
import { ApiException } from "@/lib/api/errors";
import { apiHandler } from "@/lib/api/handler";
import { ok } from "@/lib/api/response";
import { parseBody } from "@/lib/api/validate";

const REASON_MESSAGES = {
  no_code: "That code isn't valid anymore. Request a new one.",
  wrong: "That code doesn't match. Try again.",
  too_many_attempts: "Too many attempts. Request a new code.",
} as const;

export const POST = apiHandler(async (req: Request) => {
  const { code } = await parseBody(req, verifyCodeSchema);

  const email = await readPendingVerificationEmail();
  if (!email) {
    throw new ApiException(
      "VALIDATION_FAILED",
      "Enter your email again to get a new code.",
      "code"
    );
  }

  const result = await verifyEmailOtp(email, code);
  if (!result.ok) {
    throw new ApiException("VALIDATION_FAILED", REASON_MESSAGES[result.reason], "code");
  }

  return ok({ verified: true });
});
