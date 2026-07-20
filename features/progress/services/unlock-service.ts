import { listMissions } from "@/features/content/services/content-service";
import type { MissionMeta } from "@/features/content/types";
import { findMissionProgressByJourney } from "@/features/progress/repositories/progress-repository";

const JOURNEY_SLUG = "ship-your-first-app";

export type UnlockStatus =
  | { unlocked: true }
  | { unlocked: false; blockedBy: MissionMeta };

/**
 * Pure — no DB access. A mission unlocks when every non-optional
 * prerequisite is VERIFIED. Optional missions are filtered out before the
 * check, so they never gate anything even if listed as a prerequisite.
 */
export function computeUnlockStatus(
  mission: MissionMeta,
  missionBySlug: Map<string, MissionMeta>,
  verifiedSlugs: Set<string>
): UnlockStatus {
  const unmet = mission.prerequisites
    .map((slug) => missionBySlug.get(slug))
    .filter((prereq): prereq is MissionMeta => Boolean(prereq))
    .filter((prereq) => !prereq.optional)
    .filter((prereq) => !verifiedSlugs.has(prereq.slug))
    .sort((a, b) => a.order - b.order);

  if (unmet.length > 0) {
    return { unlocked: false, blockedBy: unmet[0] };
  }
  return { unlocked: true };
}

export async function isUnlocked(userId: string, missionSlug: string): Promise<boolean> {
  const missions = listMissions(JOURNEY_SLUG);
  const mission = missions.find((m) => m.slug === missionSlug);
  if (!mission) return false;

  const progressRows = await findMissionProgressByJourney(userId, JOURNEY_SLUG);
  const verifiedSlugs = new Set(
    progressRows.filter((row) => row.status === "VERIFIED").map((row) => row.missionSlug)
  );
  const missionBySlug = new Map(missions.map((m) => [m.slug, m]));

  return computeUnlockStatus(mission, missionBySlug, verifiedSlugs).unlocked;
}
