import { createHash, randomBytes } from "node:crypto";

import type { AccessStatus } from "@prisma/client";

import {
  countLiveCliTokens,
  createCliToken,
  findCliTokenByHash,
  listCliTokensByUser,
  revokeCliToken,
  touchCliTokenLastUsed,
} from "@/features/auth/repositories/cli-token-repository";
import { ApiException } from "@/lib/api/errors";

const TOKEN_PREFIX = "afs_";
const MAX_LIVE_TOKENS = 5;

export type CliTokenSummary = {
  id: string;
  createdAt: Date;
  lastUsedAt: Date | null;
  revokedAt: Date | null;
};

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/**
 * Plaintext is returned once, to the caller only — never persisted,
 * never logged. Only its sha256 (tokenHash) reaches the database.
 */
export async function issueCliToken(userId: string): Promise<string> {
  const liveCount = await countLiveCliTokens(userId);
  if (liveCount >= MAX_LIVE_TOKENS) {
    throw new ApiException("VALIDATION_FAILED", "Revoke one first.");
  }

  const token = `${TOKEN_PREFIX}${randomBytes(32).toString("hex")}`;
  await createCliToken({ userId, tokenHash: hashToken(token) });
  return token;
}

export async function getCliTokens(userId: string): Promise<CliTokenSummary[]> {
  return listCliTokensByUser(userId);
}

export async function revokeUserCliToken(
  userId: string,
  tokenId: string
): Promise<void> {
  await revokeCliToken(tokenId, userId);
}

export type CliAuth = {
  userId: string;
  email: string;
  name: string | null;
  accessStatus: AccessStatus;
};

/**
 * Hashes the incoming bearer and looks it up — never trusts a raw token
 * string beyond this call.
 */
export async function verifyCliToken(bearerToken: string): Promise<CliAuth | null> {
  const record = await findCliTokenByHash(hashToken(bearerToken));
  if (!record || record.revokedAt) return null;
  await touchCliTokenLastUsed(record.id);
  return {
    userId: record.userId,
    email: record.user.email,
    name: record.user.name,
    accessStatus: record.user.accessStatus,
  };
}

/**
 * The bearer-token equivalent of lib/auth/guards.ts's requireActive() — CLI
 * requests carry no session cookie, so they need their own gate.
 */
export async function requireCliAuth(req: Request): Promise<CliAuth> {
  const header = req.headers.get("authorization");
  const token = header?.startsWith("Bearer ") ? header.slice(7).trim() : null;
  const auth = token ? await verifyCliToken(token) : null;
  if (!auth) {
    throw new ApiException("UNAUTHENTICATED");
  }
  if (auth.accessStatus !== "ACTIVE") {
    throw new ApiException("FORBIDDEN", "Your access isn't open yet.");
  }
  return auth;
}
