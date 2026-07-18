import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type { EventType } from "@/features/analytics/types";

export async function insertEvent(
  type: EventType,
  userId: string | null,
  payload: Record<string, unknown>
): Promise<void> {
  await prisma.event.create({
    data: {
      type,
      userId,
      payload: payload as Prisma.InputJsonValue,
    },
  });
}
