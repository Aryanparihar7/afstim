import { createHash, randomInt } from "node:crypto";
import { cookies, headers } from "next/headers";
import { encode } from "next-auth/jwt";

import {
  createEmailOtp,
  findActiveEmailOtp,
  incrementEmailOtpAttempts,
  markEmailOtpConsumed,
} from "@/features/auth/repositories/email-otp-repository";
import {
  findUserByEmail,
  markEmailVerified,
  prismaAdapter,
} from "@/features/auth/repositories/user-repository";
import { track } from "@/features/analytics/services/event-service";
import { sendVerificationEmail } from "@/features/email/services/email-service";
import { env } from "@/lib/env";

const OTP_EXPIRY_MS = 15 * 60 * 1000;
const OTP_MAX_ATTEMPTS = 5;

const PENDING_EMAIL_COOKIE = "pending-verification-email";
const PENDING_EMAIL_COOKIE_MAX_AGE_SECONDS = 20 * 60;

// Must match auth.ts's own session lifetime — this is the same
// JWT-pointer-to-DB-session design, just minted from a different entry
// point (a verified code) instead of the Credentials authorize() flow.
const SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

function hashCode(code: string): string {
  return createHash("sha256").update(code).digest("hex");
}

function generateCode(): string {
  return randomInt(100000, 999999).toString();
}

async function isSecureRequest(): Promise<boolean> {
  const requestHeaders = await headers();
  const forwardedProto = requestHeaders.get("x-forwarded-proto");
  return forwardedProto
    ? forwardedProto === "https"
    : env.AUTH_URL.startsWith("https://");
}

export async function setPendingVerificationCookie(email: string): Promise<void> {
  const secure = await isSecureRequest();
  const cookieStore = await cookies();
  cookieStore.set(PENDING_EMAIL_COOKIE, email, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure,
    maxAge: PENDING_EMAIL_COOKIE_MAX_AGE_SECONDS,
  });
}

export async function readPendingVerificationEmail(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(PENDING_EMAIL_COOKIE)?.value ?? null;
}

export async function clearPendingVerificationCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(PENDING_EMAIL_COOKIE);
}

/**
 * Shared by registration and resend: generates a code, stores its hash
 * (never the plaintext), and emails the plaintext code. The plaintext never
 * touches the database or a log line.
 */
export async function issueEmailOtp(email: string, name: string | null = null): Promise<void> {
  const code = generateCode();
  await createEmailOtp({
    email,
    codeHash: hashCode(code),
    expiresAt: new Date(Date.now() + OTP_EXPIRY_MS),
  });
  await sendVerificationEmail(email, code, name);
}

type VerifyResult =
  | { ok: true }
  | { ok: false; reason: "no_code" | "wrong" | "too_many_attempts" };

async function mintSessionCookie(
  userId: string,
  email: string,
  name: string | null
): Promise<void> {
  const sessionToken = crypto.randomUUID();
  await prismaAdapter.createSession?.({
    sessionToken,
    userId,
    expires: new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000),
  });

  const secure = await isSecureRequest();
  const cookieName = secure
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";

  const jwt = await encode({
    secret: env.AUTH_SECRET,
    salt: cookieName,
    maxAge: SESSION_MAX_AGE_SECONDS,
    token: { sub: userId, sessionToken, email, name },
  });

  const cookieStore = await cookies();
  cookieStore.set(cookieName, jwt, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure,
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

/**
 * `email` must come from the pending-verification cookie, never from
 * request input — callers are responsible for that boundary. Never reveals
 * how many attempts remain, only whether the code is now dead.
 */
export async function verifyEmailOtp(
  email: string,
  code: string
): Promise<VerifyResult> {
  const record = await findActiveEmailOtp(email);
  if (!record || record.expiresAt < new Date()) {
    return { ok: false, reason: "no_code" };
  }
  if (record.attempts >= OTP_MAX_ATTEMPTS) {
    return { ok: false, reason: "too_many_attempts" };
  }

  if (hashCode(code) !== record.codeHash) {
    await incrementEmailOtpAttempts(record.id);
    const nowDead = record.attempts + 1 >= OTP_MAX_ATTEMPTS;
    return { ok: false, reason: nowDead ? "too_many_attempts" : "wrong" };
  }

  const user = await findUserByEmail(email);
  if (!user) return { ok: false, reason: "no_code" };

  await markEmailOtpConsumed(record.id);
  await markEmailVerified(user.id);
  await mintSessionCookie(user.id, user.email, user.name);
  await clearPendingVerificationCookie();
  await track("email_verified", user.id);

  return { ok: true };
}

const RESEND_WINDOW_MS = 60 * 60 * 1000;
const RESEND_MAX_PER_WINDOW = 3;
const resendHits = new Map<string, number[]>();

export function isResendRateLimited(email: string): boolean {
  const now = Date.now();
  const recent = (resendHits.get(email) ?? []).filter(
    (t) => now - t < RESEND_WINDOW_MS
  );

  if (recent.length >= RESEND_MAX_PER_WINDOW) {
    resendHits.set(email, recent);
    return true;
  }

  recent.push(now);
  resendHits.set(email, recent);
  return false;
}
