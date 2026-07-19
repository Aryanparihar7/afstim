import { PrismaAdapter } from "@auth/prisma-adapter";

import { prisma } from "@/lib/prisma";

// The only Prisma-touching adapter instance for auth. auth.ts imports this
// instead of `lib/prisma` directly, so Prisma access for the auth module
// stays inside features/auth/repositories/ as AGENTS.md requires.
export const prismaAdapter = PrismaAdapter(prisma);

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser(input: {
  email: string;
  name: string | null;
  passwordHash: string;
}) {
  return prisma.user.create({
    data: {
      email: input.email,
      name: input.name,
      passwordHash: input.passwordHash,
    },
  });
}

export async function markEmailVerified(userId: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { emailVerified: new Date() },
  });
}

export async function createVerificationToken(input: {
  identifier: string;
  token: string;
  expires: Date;
}) {
  return prisma.verificationToken.create({ data: input });
}

export async function findVerificationToken(token: string) {
  return prisma.verificationToken.findUnique({ where: { token } });
}

export async function deleteVerificationToken(token: string) {
  // Single-use: callers rely on this failing silently if the row is
  // already gone (double-submit, race, or already-consumed link).
  await prisma.verificationToken
    .delete({ where: { token } })
    .catch(() => undefined);
}
