import { prisma } from "@/lib/prisma";

export async function createCliToken(input: {
  userId: string;
  tokenHash: string;
}) {
  return prisma.cliToken.create({ data: input });
}

export async function countLiveCliTokens(userId: string): Promise<number> {
  return prisma.cliToken.count({ where: { userId, revokedAt: null } });
}

export async function listCliTokensByUser(userId: string) {
  return prisma.cliToken.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: { id: true, createdAt: true, lastUsedAt: true, revokedAt: true },
  });
}

export async function findCliTokenByHash(tokenHash: string) {
  return prisma.cliToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });
}

// Scoped by userId in the where clause, not fetch-then-compare — an id
// that isn't the caller's simply matches zero rows.
export async function revokeCliToken(id: string, userId: string): Promise<void> {
  await prisma.cliToken.updateMany({
    where: { id, userId },
    data: { revokedAt: new Date() },
  });
}

export async function touchCliTokenLastUsed(id: string): Promise<void> {
  await prisma.cliToken.update({
    where: { id },
    data: { lastUsedAt: new Date() },
  });
}
