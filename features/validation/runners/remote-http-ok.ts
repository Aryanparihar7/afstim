import {
  guardedGet,
  isConnectivityRejection,
  PUBLIC_URL_REJECTION_MESSAGE,
  UrlGuardRejection,
  type RunnerOutcome,
} from "@/features/validation/lib/url-guard";

export async function runRemoteHttpOk(url: string, expectStatus: number): Promise<RunnerOutcome> {
  try {
    const response = await guardedGet(url);
    if (response.status !== expectStatus) {
      return { kind: "fail", message: `Expected HTTP ${expectStatus}, got ${response.status}.` };
    }
    return { kind: "pass" };
  } catch (error) {
    if (error instanceof UrlGuardRejection && isConnectivityRejection(error)) {
      return { kind: "connectivity_error" };
    }
    return { kind: "fail", message: PUBLIC_URL_REJECTION_MESSAGE };
  }
}
