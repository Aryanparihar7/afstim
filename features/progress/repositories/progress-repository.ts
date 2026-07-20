import { prisma } from "@/lib/prisma";

export async function findMissionProgressByJourney(userId: string, journeySlug: string) {
  return prisma.missionProgress.findMany({
    where: { userId, journeySlug },
    select: { missionSlug: true, status: true, attempts: true, firstAttemptAt: true, verifiedAt: true },
  });
}

/**
 * Atomic upsert on `@@unique([userId, journeySlug])` — no check-then-insert.
 * `startedAt` is only ever set by the `create` branch (the `update` branch
 * is a no-op), so comparing the row's `startedAt` against the timestamp
 * generated just before the call tells us whether *this* call is the one
 * that created the row, even under concurrent requests.
 */
export async function upsertEnrollment(input: { userId: string; journeySlug: string }) {
  const startedAt = new Date();
  const enrollment = await prisma.enrollment.upsert({
    where: { userId_journeySlug: { userId: input.userId, journeySlug: input.journeySlug } },
    create: { userId: input.userId, journeySlug: input.journeySlug, startedAt },
    update: {},
  });
  return { enrollment, justCreated: enrollment.startedAt.getTime() === startedAt.getTime() };
}

/**
 * Same atomic-upsert pattern on `@@unique([userId, missionSlug])`, using
 * `firstAttemptAt` as the create-only marker. `update: {}` never bumps
 * `attempts` or resets anything on a repeat view — Prisma's `@updatedAt`
 * still stamps `updatedAt`, which is harmless and not what idempotency
 * here is protecting against.
 */
export async function upsertMissionProgressStart(input: {
  userId: string;
  journeySlug: string;
  missionSlug: string;
}) {
  const firstAttemptAt = new Date();
  const progress = await prisma.missionProgress.upsert({
    where: {
      userId_missionSlug: { userId: input.userId, missionSlug: input.missionSlug },
    },
    create: {
      userId: input.userId,
      journeySlug: input.journeySlug,
      missionSlug: input.missionSlug,
      status: "IN_PROGRESS",
      firstAttemptAt,
    },
    update: {},
  });
  return {
    progress,
    justCreated: progress.firstAttemptAt?.getTime() === firstAttemptAt.getTime(),
  };
}
