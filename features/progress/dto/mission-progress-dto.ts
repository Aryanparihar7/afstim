export type MissionProgressDTO = {
  missionSlug: string;
  status: "LOCKED" | "AVAILABLE" | "IN_PROGRESS" | "VERIFIED";
  attempts: number;
  firstAttemptAt: string | null;
  verifiedAt: string | null;
};
