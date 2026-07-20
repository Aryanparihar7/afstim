import { getRemoteChecks } from "@/features/content/services/content-service";
import type { Check } from "@/features/content/types";
import { getCurrentMission } from "@/features/progress/services/progress-service";
import { findSubmissionsForMission } from "@/features/validation/repositories/submission-repository";
import { runRemoteHttpOk } from "@/features/validation/runners/remote-http-ok";
import { runRemoteHttpsValid } from "@/features/validation/runners/remote-https-valid";
import { runRemoteRepoExists } from "@/features/validation/runners/remote-repo-exists";
import type { RunnerOutcome } from "@/features/validation/lib/url-guard";
import { ApiException } from "@/lib/api/errors";

const SUBMISSION_GRACE_MS = 24 * 60 * 60 * 1000;
const PROPAGATING_MESSAGE =
  "Still propagating. This can take a few hours. Nothing's wrong — come back later.";

export type RemoteCheckResult = {
  id: string;
  state: "pass" | "fail" | "pending";
  message: string | null;
};

type Submission = { value: string; createdAt: Date };

function parseSubmissionKind(from: string): string | null {
  const prefix = "submission:";
  return from.startsWith(prefix) ? from.slice(prefix.length) : null;
}

function runCheck(check: Check, value: string): Promise<RunnerOutcome> {
  switch (check.type) {
    case "remote_http_ok":
      return runRemoteHttpOk(value, check.expectStatus);
    case "remote_https_valid":
      return runRemoteHttpsValid(value);
    case "remote_repo_exists":
      return runRemoteRepoExists(value);
    default:
      throw new Error(`Unsupported remote check type: ${check.type}`);
  }
}

async function evaluateCheck(
  check: Check,
  submissionByKind: Map<string, Submission>
): Promise<RemoteCheckResult> {
  const kind = "from" in check ? parseSubmissionKind(check.from) : null;
  const submission = kind ? submissionByKind.get(kind) : undefined;

  if (!submission) {
    return { id: check.id, state: "pending", message: "Waiting on your submission for this mission." };
  }

  const outcome = await runCheck(check, submission.value);

  if (outcome.kind === "pass") {
    return { id: check.id, state: "pass", message: null };
  }
  if (outcome.kind === "fail") {
    return { id: check.id, state: "fail", message: outcome.message };
  }

  // connectivity_error: not the learner's fault, and never a hard block.
  if (check.type === "remote_repo_exists") {
    return { id: check.id, state: "pending", message: "Couldn't reach GitHub just now. Try rechecking in a moment." };
  }
  const age = Date.now() - submission.createdAt.getTime();
  if (age < SUBMISSION_GRACE_MS) {
    return { id: check.id, state: "pending", message: PROPAGATING_MESSAGE };
  }
  return { id: check.id, state: "fail", message: "We couldn't reach that address." };
}

export async function runRemoteChecks(
  userId: string,
  missionSlug: string
): Promise<{ checkResults: RemoteCheckResult[] }> {
  const current = await getCurrentMission(userId);
  if (!current || current.missionSlug !== missionSlug) {
    throw new ApiException("CONFLICT", "That isn't your current mission.");
  }

  const checks = getRemoteChecks(missionSlug);
  const submissions = await findSubmissionsForMission(userId, missionSlug);
  const submissionByKind = new Map(submissions.map((s) => [s.kind, s]));

  const checkResults = await Promise.all(
    checks.map((check) => evaluateCheck(check, submissionByKind))
  );

  return { checkResults };
}
