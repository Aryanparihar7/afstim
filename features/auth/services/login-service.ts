"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { signIn, signOut } from "@/auth";
import {
  clearAttemptsForEmail,
  countRecentFailuresByEmail,
  countRecentFailuresByIp,
  recordLoginAttempt,
} from "@/features/auth/repositories/login-attempt-repository";
import { findUserByEmail } from "@/features/auth/repositories/user-repository";
import { verifyPassword } from "@/features/auth/services/password-service";
import {
  hasValidEmailOtp,
  issueEmailOtp,
  setPendingVerificationCookie,
} from "@/features/auth/services/verification-service";

const LOCKOUT_WINDOW_MS = 15 * 60 * 1000;
const EMAIL_FAILURE_LIMIT = 5;
const IP_FAILURE_LIMIT = 20;

const GENERIC_FAILURE_MESSAGE = "That email and password don't match.";
const LOCKED_MESSAGE = "Too many attempts. Try again in 15 minutes.";

async function getClientIp(): Promise<string> {
  const requestHeaders = await headers();
  const forwardedFor = requestHeaders.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return requestHeaders.get("x-real-ip") ?? "unknown";
}

async function isLocked(email: string, ip: string): Promise<boolean> {
  const since = new Date(Date.now() - LOCKOUT_WINDOW_MS);
  const [emailFailures, ipFailures] = await Promise.all([
    countRecentFailuresByEmail(email, since),
    countRecentFailuresByIp(ip, since),
  ]);
  return emailFailures >= EMAIL_FAILURE_LIMIT || ipFailures >= IP_FAILURE_LIMIT;
}

type LoginResult = { ok: false; message: string };

/**
 * Server Action. Lockout is checked by the raw attempted email string, not
 * by whether that email has an account — so probing a nonexistent email
 * repeatedly locks the same way a real one does, and never reveals which
 * case it was.
 *
 * Password is verified here directly (same `verifyPassword`/timing-equalized
 * primitive auth.ts's authorize() uses) *before* ever calling signIn(),
 * specifically so the unverified-email decision can be made without first
 * creating a session. Cookies set by signIn() land on the outgoing response,
 * but signOut() determines "the current session" from the *incoming*
 * request's cookies — so a signIn()-then-signOut() in the same request
 * can't see what it just created and silently leaves the session live.
 * Checking verification first avoids that trap entirely.
 */
export async function loginUser(
  email: string,
  password: string
): Promise<LoginResult> {
  const ip = await getClientIp();

  if (await isLocked(email, ip)) {
    return { ok: false, message: LOCKED_MESSAGE };
  }

  const user = await findUserByEmail(email);
  const isValid = await verifyPassword(password, user?.passwordHash ?? null);

  if (!user || !isValid) {
    await recordLoginAttempt({ email, ip, success: false });
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }

  // Credentials are correct — a legitimate attempt regardless of what
  // happens next, so it clears the email's failure count.
  await recordLoginAttempt({ email, ip, success: true });
  await clearAttemptsForEmail(email);

  if (!user.emailVerified) {
    if (!(await hasValidEmailOtp(user.email))) {
      await issueEmailOtp(user.email, user.name);
    }
    await setPendingVerificationCookie(user.email);
    redirect(`/verify?email=${encodeURIComponent(email)}`);
  }

  // Establish the real session through Auth.js's normal flow (re-verifies
  // the same credentials via authorize() — a harmless, idempotent check).
  try {
    await signIn("credentials", { email, password, redirect: false });
  } catch {
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }

  // TEMP: redirect to first journey until Dashboard module ships.
  redirect("/journey/ship-your-first-app");
}

export async function logoutUser(): Promise<void> {
  await signOut({ redirect: false });
  redirect("/");
}
