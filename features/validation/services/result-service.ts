import { track } from "@/features/analytics/services/event-service";
import { getLocalChecks } from "@/features/content/services/content-service";
import { getCurrentMission } from "@/features/progress/services/progress-service";
import type { CheckResultEntry } from "@/features/validation/repositories/check-result-repository";
import {
  findCheckResultRow,
  saveCheckResults,
} from "@/features/validation/repositories/check-result-repository";
import type { ResultInput } from "@/features/validation/validators/result-schema";
import { ApiException } from "@/lib/api/errors";

export async function submitCheckResults(
  userId: string,
  input: ResultInput
): Promise<{ checkResults: CheckResultEntry[] }> {
  const current = await getCurrentMission(userId);
  if (!current || current.missionSlug !== input.missionSlug) {
    throw new ApiException("CONFLICT", "That isn't your current mission.");
  }

  const validIds = new Set(getLocalChecks(input.missionSlug).map((check) => check.id));
  for (const result of input.results) {
    if (!validIds.has(result.id)) {
      throw new ApiException("VALIDATION_FAILED", "That check isn't part of this mission.");
    }
  }

  const existing = await findCheckResultRow(userId, input.missionSlug);
  const existingResults = Array.isArray(existing?.checkResults)
    ? (existing.checkResults as CheckResultEntry[])
    : [];

  const at = new Date().toISOString();
  const merged = new Map(existingResults.map((entry) => [entry.id, entry]));
  for (const result of input.results) {
    merged.set(result.id, { id: result.id, state: result.state, message: result.message, at });
  }
  const checkResults = [...merged.values()];

  await saveCheckResults({
    userId,
    missionSlug: input.missionSlug,
    journeySlug: current.journeySlug,
    checkResults,
    setFirstAttemptAt: !existing || existing.firstAttemptAt === null,
  });

  const passed = input.results.filter((result) => result.state === "pass").length;
  await track("check_run", userId, {
    missionSlug: input.missionSlug,
    passed,
    total: input.results.length,
  });

  return { checkResults };
}
