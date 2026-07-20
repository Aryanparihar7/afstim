import { existsSync } from "node:fs";
import { join } from "node:path";

import { ApiError, apiGet, apiPost } from "../lib/api.js";
import { readConfig } from "../lib/config.js";
import { failLine, missionLine, passLine } from "../lib/ui.js";
import type { Check } from "../runners/index.js";
import { runCheck } from "../runners/index.js";

const CURRENT_PATH = "/api/v1/cli/current";
const RESULTS_PATH = "/api/v1/cli/results";

type CurrentMission = {
  missionSlug: string;
  missionOrder: number;
  missionTitle: string;
  checks: Check[];
} | null;

type ResultEntry = { id: string; state: "pass" | "fail"; message: string | null };

export async function checkCommand(): Promise<void> {
  const config = await readConfig();
  if (!config) {
    console.error("Not logged in. Run `afstim login` first.");
    process.exitCode = 1;
    return;
  }

  const cwd = process.cwd();
  if (!existsSync(join(cwd, "package.json")) && !existsSync(join(cwd, ".git"))) {
    console.error("Run this from your project folder.");
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

  let failures = 0;
  const results: ResultEntry[] = [];
  for (const check of current.checks) {
    const outcome = await runCheck(check, cwd);
    if (outcome.pass) {
      console.log(passLine(check.label));
      results.push({ id: check.id, state: "pass", message: null });
    } else {
      failures += 1;
      console.log(failLine(check.label, outcome.message ?? check.hint));
      results.push({ id: check.id, state: "fail", message: outcome.message ?? check.hint });
    }
  }

  try {
    await apiPost(config.apiUrl, RESULTS_PATH, config.token, {
      missionSlug: current.missionSlug,
      results,
    });
  } catch (error) {
    console.error(
      error instanceof ApiError
        ? `Couldn't sync results to Afstim: ${error.message}`
        : "Couldn't sync results to Afstim."
    );
  }

  process.exitCode = failures > 0 ? 1 : 0;
}
