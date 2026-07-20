import type { Session } from "next-auth";

import { auth } from "@/auth";
import { ApiException } from "@/lib/api/errors";

/**
 * For use inside API route handlers only. Middleware protects pages;
 * these protect routes. A route that needs auth must call one of these —
 * middleware never runs for `/api/**`.
 */
export async function requireSession(): Promise<Session> {
  const session = await auth();
  if (!session?.user) {
    throw new ApiException("UNAUTHENTICATED");
  }
  return session;
}

export async function requireActive(): Promise<Session> {
  const session = await requireSession();
  if (session.user.accessStatus !== "ACTIVE") {
    throw new ApiException("FORBIDDEN");
  }
  return session;
}

/**
 * 404, not 403 — same "admin routes should not admit they exist" rule
 * the page-level gate follows.
 */
export async function requireAdmin(): Promise<Session> {
  const session = await requireSession();
  if (session.user.role !== "ADMIN") {
    throw new ApiException("NOT_FOUND");
  }
  return session;
}
