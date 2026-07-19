import {
  createUser,
  findUserByEmail,
} from "@/features/auth/repositories/user-repository";
import { hashPassword } from "@/features/auth/services/password-service";
import {
  issueEmailOtp,
  setPendingVerificationCookie,
} from "@/features/auth/services/verification-service";
import type { RegisterInput } from "@/features/auth/validators/register-schema";
import { track } from "@/features/analytics/services/event-service";
import { sendAccountExistsEmail } from "@/features/email/services/email-service";

/**
 * Always returns void and takes roughly the same time whether the email is
 * new or already registered — the caller (the route handler) sends back the
 * exact same success response either way. Never confirm an email exists.
 */
export async function registerUser(input: RegisterInput): Promise<void> {
  const existing = await findUserByEmail(input.email);

  // Hash unconditionally, before branching: this is the dominant CPU cost
  // between "create a user" and "email already exists," so equalizing it
  // here closes the timing side-channel regardless of which branch runs.
  const passwordHash = await hashPassword(input.password);

  if (existing) {
    await sendAccountExistsEmail(existing.email, existing.name);
    return;
  }

  const user = await createUser({
    email: input.email,
    name: input.name ?? null,
    passwordHash,
  });

  await issueEmailOtp(user.email, user.name);
  await setPendingVerificationCookie(user.email);
  await track("account_created", user.id);
}
