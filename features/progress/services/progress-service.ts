import { track } from "@/features/analytics/services/event-service";
import { listMissions } from "@/features/content/services/content-service";
import type { MissionMeta } from "@/features/content/types";
import type { MissionProgressDTO } from "@/features/progress/dto/mission-progress-dto";
import { toMissionProgressDTO } from "@/features/progress/mappers/mission-progress-mapper";
import {
  findMissionProgressByJourney,
  upsertEnrollment,
  upsertMissionProgressStart,
} from "@/features/progress/repositories/progress-repository";
import { computeUnlockStatus } from "@/features/progress/services/unlock-service";

const JOURNEY_SLUG = "ship-your-first-app";

export type MissionRowState = "VERIFIED" | "IN_PROGRESS" | "AVAILABLE" | "LOCKED";

export type MissionRow = {
  slug: string;
  order: number;
  title: string;
  capability: string;
  duration: number;
  optional: boolean;
  state: MissionRowState;
  blockerLabel?: string;
};

export type JourneyProgress = {
  verifiedCount: number;
  totalCount: number;
  hasAnyProgress: boolean;
  rows: MissionRow[];
};

function toRowBase(mission: MissionMeta) {
  return {
    slug: mission.slug,
    order: mission.order,
    title: mission.title,
    capability: mission.capability,
    duration: mission.duration,
    optional: mission.optional,
  };
}

/**
 * A mission unlocks when every non-optional prerequisite is VERIFIED.
 * Optional missions never block anything, even if listed as a
 * prerequisite. Missions with no stored progress row are computed
 * from scratch here, not read from a status column — that's what lets
 * flipping one row in Prisma Studio unlock the next mission with no
 * other write.
 */
export async function getJourneyProgress(
  userId: string,
  journeySlug: string
): Promise<JourneyProgress> {
  const missions = listMissions(journeySlug);
  const progressRows = await findMissionProgressByJourney(userId, journeySlug);

  const statusBySlug = new Map(progressRows.map((row) => [row.missionSlug, row.status]));
  const missionBySlug = new Map(missions.map((mission) => [mission.slug, mission]));

  const verifiedSlugs = new Set(
    progressRows.filter((row) => row.status === "VERIFIED").map((row) => row.missionSlug)
  );

  const rows: MissionRow[] = missions.map((mission) => {
    const stored = statusBySlug.get(mission.slug);

    if (stored === "VERIFIED") {
      return { ...toRowBase(mission), state: "VERIFIED" };
    }
    if (stored === "IN_PROGRESS") {
      return { ...toRowBase(mission), state: "IN_PROGRESS" };
    }

    const unlockStatus = computeUnlockStatus(mission, missionBySlug, verifiedSlugs);
    if (!unlockStatus.unlocked) {
      return {
        ...toRowBase(mission),
        state: "LOCKED",
        blockerLabel: `Finish mission ${unlockStatus.blockedBy.order} first.`,
      };
    }

    return { ...toRowBase(mission), state: "AVAILABLE" };
  });

  return {
    verifiedCount: rows.filter((row) => row.state === "VERIFIED").length,
    totalCount: rows.length,
    hasAnyProgress: progressRows.length > 0,
    rows,
  };
}

/**
 * Folds "on first enrollment" into whichever call happens first — there's
 * no separate enrollment trigger anywhere in the app; starting mission 1
 * enrolls you.
 */
export async function ensureEnrollment(userId: string, journeySlug: string) {
  const { enrollment, justCreated } = await upsertEnrollment({ userId, journeySlug });
  if (justCreated) {
    await track("journey_started", userId);
  }
  return enrollment;
}

/**
 * Idempotent: viewing the same mission twice (refresh, two tabs) upserts
 * on `@@unique([userId, missionSlug])` and never touches `attempts` or
 * resets anything on the repeat path. `track()` only fires the first time,
 * detected atomically by the repository (see upsertMissionProgressStart).
 */
export async function startMission(userId: string, missionSlug: string) {
  await ensureEnrollment(userId, JOURNEY_SLUG);

  const { progress, justCreated } = await upsertMissionProgressStart({
    userId,
    journeySlug: JOURNEY_SLUG,
    missionSlug,
  });
  if (justCreated) {
    await track("mission_started", userId);
  }
  return progress;
}

/**
 * Thin, DTO-safe read — no content-service merge, no LOCKED/blocker
 * computation (that's getJourneyProgress's job for the UI). Just a safe
 * projection of whatever MissionProgress rows exist.
 */
export async function getProgress(
  userId: string,
  journeySlug: string
): Promise<MissionProgressDTO[]> {
  const rows = await findMissionProgressByJourney(userId, journeySlug);
  return rows.map(toMissionProgressDTO);
}

/**
 * The lowest-order mission that is not VERIFIED and is unlocked — the
 * single value the dashboard's one button is driven by.
 */
export async function getCurrentMission(
  userId: string
): Promise<{ journeySlug: string; missionSlug: string } | null> {
  const missions = listMissions(JOURNEY_SLUG);
  const progressRows = await findMissionProgressByJourney(userId, JOURNEY_SLUG);

  const verifiedSlugs = new Set(
    progressRows.filter((row) => row.status === "VERIFIED").map((row) => row.missionSlug)
  );
  const missionBySlug = new Map(missions.map((mission) => [mission.slug, mission]));

  for (const mission of missions) {
    if (verifiedSlugs.has(mission.slug)) continue;
    if (computeUnlockStatus(mission, missionBySlug, verifiedSlugs).unlocked) {
      return { journeySlug: JOURNEY_SLUG, missionSlug: mission.slug };
    }
  }
  return null;
}
