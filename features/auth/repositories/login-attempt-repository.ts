import { prisma } from "@/lib/prisma";

export async function recordLoginAttempt(input: {
  email: string;
  ip: string;
  success: boolean;
}): Promise<void> {
  await prisma.loginAttempt.create({ data: input });
}

export async function countRecentFailuresByEmail(
  email: string,
  since: Date
): Promise<number> {
  return prisma.loginAttempt.count({
    where: { email, success: false, createdAt: { gte: since } },
  });
}

export async function countRecentFailuresByIp(
  ip: string,
  since: Date
): Promise<number> {
  return prisma.loginAttempt.count({
    where: { ip, success: false, createdAt: { gte: since } },
  });
}

export async function clearAttemptsForEmail(email: string): Promise<void> {
  await prisma.loginAttempt.deleteMany({ where: { email } });
}
