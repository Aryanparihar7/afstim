import { getLocalChecks, getMission } from "@/features/content/services/content-service";
import { getCurrentMission } from "@/features/progress/services/progress-service";
import type { CliCurrentDTO } from "@/features/validation/dto/cli-current-dto";

export async function getCliCurrentMission(userId: string): Promise<CliCurrentDTO | null> {
  const current = await getCurrentMission(userId);
  if (!current) return null;

  const mission = getMission(current.missionSlug);
  return {
    journeySlug: current.journeySlug,
    missionSlug: mission.slug,
    missionTitle: mission.title,
    missionOrder: mission.order,
    checks: getLocalChecks(current.missionSlug),
  };
}
