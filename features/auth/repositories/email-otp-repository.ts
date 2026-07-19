import { prisma } from "@/lib/prisma";

export async function createEmailOtp(input: {
  email: string;
  codeHash: string;
  expiresAt: Date;
}) {
  return prisma.emailOtp.create({ data: input });
}

export async function findActiveEmailOtp(email: string) {
  return prisma.emailOtp.findFirst({
    where: { email, consumedAt: null },
    orderBy: { createdAt: "desc" },
  });
}

export async function incrementEmailOtpAttempts(id: string) {
  return prisma.emailOtp.update({
    where: { id },
    data: { attempts: { increment: 1 } },
  });
}

export async function markEmailOtpConsumed(id: string) {
  return prisma.emailOtp.update({
    where: { id },
    data: { consumedAt: new Date() },
  });
}

// Resend supersedes whatever code was active — reuses `consumedAt` to mean
// "no longer usable," whether by successful verification or by being
// replaced, so no separate "invalidated" field is needed on the model.
export async function invalidateActiveEmailOtps(email: string): Promise<void> {
  await prisma.emailOtp.updateMany({
    where: { email, consumedAt: null },
    data: { consumedAt: new Date() },
  });
}
