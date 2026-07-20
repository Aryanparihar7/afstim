"use server";

import { invalidateActiveEmailOtps } from "@/features/auth/repositories/email-otp-repository";
import { findUserByEmail } from "@/features/auth/repositories/user-repository";
import {
  isResendRateLimited,
  issueEmailOtp,
  readPendingVerificationEmail,
  setPendingVerificationCookie,
} from "@/features/auth/services/verification-service";
import { z } from "zod";

/**
 * Server Action, invoked directly from the /verify page's client component.
 * A dedicated file (rather than living alongside the rest of
 * verification-service.ts) because Next.js requires Server Actions reachable
 * from a Client Component to live in their own "use server" module — mixing
 * them into a file that a Client Component also imports for other exports
 * pulls server-only code (next/headers, Prisma) into the client bundle.
 *
 * Reads the pending-verification cookie first. `fallbackEmail` is only used
 * when that cookie is absent — the one case being the M10 login redirect to
 * `/verify?email=...` for an unverified user, which never sets this cookie.
 * Always returns the same shape regardless of whether the email exists or
 * is already verified — never confirm ownership.
 */
export async function resendVerificationCode(
  fallbackEmail?: string
): Promise<{ sent: true } | { sent: false; reason: "rate_limited" }> {
  const cookieEmail = await readPendingVerificationEmail();
  const parsed = z.email().safeParse(cookieEmail ?? fallbackEmail ?? "");
  if (!parsed.success) {
    return { sent: true };
  }

  if (isResendRateLimited(parsed.data)) {
    return { sent: false, reason: "rate_limited" };
  }

  const user = await findUserByEmail(parsed.data);
  if (!user || user.emailVerified) {
    return { sent: true };
  }

  await invalidateActiveEmailOtps(parsed.data);
  await issueEmailOtp(parsed.data, user.name);

  if (!cookieEmail) {
    await setPendingVerificationCookie(parsed.data);
  }

  return { sent: true };
}
