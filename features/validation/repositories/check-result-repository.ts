import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export type CheckResultEntry = {
  id: string;
  state: "pass" | "fail";
  message: string | null;
  at: string;
};

export async function findCheckResultRow(userId: string, missionSlug: string) {
  return prisma.missionProgress.findUnique({
    where: { userId_missionSlug: { userId, missionSlug } },
    select: { checkResults: true, firstAttemptAt: true },
  });
}

export async function saveCheckResults(input: {
  userId: string;
  missionSlug: string;
  journeySlug: string;
  checkResults: CheckResultEntry[];
  setFirstAttemptAt: boolean;
}) {
  const now = new Date();
  return prisma.missionProgress.upsert({
    where: { userId_missionSlug: { userId: input.userId, missionSlug: input.missionSlug } },
    create: {
      userId: input.userId,
      journeySlug: input.journeySlug,
      missionSlug: input.missionSlug,
      status: "IN_PROGRESS",
      checkResults: input.checkResults as Prisma.InputJsonValue,
      attempts: 1,
      firstAttemptAt: now,
    },
    update: {
      checkResults: input.checkResults as Prisma.InputJsonValue,
      attempts: { increment: 1 },
      ...(input.setFirstAttemptAt ? { firstAttemptAt: now } : {}),
    },
  });
}
