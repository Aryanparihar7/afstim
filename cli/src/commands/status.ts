import { ApiError, apiGet } from "../lib/api.js";
import { readConfig } from "../lib/config.js";
import { missionLine } from "../lib/ui.js";

const CURRENT_PATH = "/api/v1/cli/current";

// missionOrder/missionTitle match /api/v1/cli/current's documented shape.
// verifiedCount/totalMissions aren't in that shape yet (that endpoint is
// M18's, not built at the time this command was written) — read
// defensively so "n of 10 verified" only prints once the data exists.
type CurrentMission = {
  missionOrder: number;
  missionTitle: string;
  verifiedCount?: number;
  totalMissions?: number;
} | null;

export async function statusCommand(): Promise<void> {
  const config = await readConfig();
  if (!config) {
    console.error("Not logged in. Run `afstim login` first.");
    process.exitCode = 1;
    return;
  }

  let current: CurrentMission;
  try {
    current = await apiGet<CurrentMission>(config.apiUrl, CURRENT_PATH, config.token);
  } catch (error) {
    console.error(error instanceof ApiError ? error.message : "Something went wrong. Try again.");
    process.exitCode = 1;
    return;
  }

  if (!current) {
    console.log("No current mission. You're all caught up.");
    return;
  }

  console.log(missionLine(current.missionOrder, current.missionTitle));
  if (typeof current.verifiedCount === "number" && typeof current.totalMissions === "number") {
    console.log(`${current.verifiedCount} of ${current.totalMissions} verified`);
  }
}
