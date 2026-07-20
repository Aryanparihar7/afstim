import type { MissionProgressDTO } from "@/features/progress/dto/mission-progress-dto";
import type { findMissionProgressByJourney } from "@/features/progress/repositories/progress-repository";

type MissionProgressRow = Awaited<ReturnType<typeof findMissionProgressByJourney>>[number];

export function toMissionProgressDTO(row: MissionProgressRow): MissionProgressDTO {
  return {
    missionSlug: row.missionSlug,
    status: row.status,
    attempts: row.attempts,
    firstAttemptAt: row.firstAttemptAt ? row.firstAttemptAt.toISOString() : null,
    verifiedAt: row.verifiedAt ? row.verifiedAt.toISOString() : null,
  };
}
