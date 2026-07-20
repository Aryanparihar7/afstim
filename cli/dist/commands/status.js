import { ApiError, apiGet } from "../lib/api.js";
import { readConfig } from "../lib/config.js";
import { missionLine } from "../lib/ui.js";
const CURRENT_PATH = "/api/v1/cli/current";
export async function statusCommand() {
    const config = await readConfig();
    if (!config) {
        console.error("Not logged in. Run `afstim login` first.");
        process.exitCode = 1;
        return;
    }
    let current;
    try {
        current = await apiGet(config.apiUrl, CURRENT_PATH, config.token);
    }
    catch (error) {
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
