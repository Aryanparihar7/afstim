import { prisma } from "@/lib/prisma";

export async function findSubmissionsForMission(userId: string, missionSlug: string) {
  return prisma.submission.findMany({
    where: { userId, missionSlug },
    select: { kind: true, value: true, createdAt: true },
  });
}
