import type { CheckOutcome } from "./index.js";

const TIMEOUT_MS = 10_000;

export async function runHttpOk(
  url: string,
  expectStatus: number,
  expectJsonPath: string | undefined
): Promise<CheckOutcome> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(url, { signal: controller.signal });
  } catch {
    return { pass: false };
  } finally {
    clearTimeout(timer);
  }

  if (response.status !== expectStatus) {
    return { pass: false };
  }

  if (expectJsonPath && (await resolveJsonPath(response, expectJsonPath)) === undefined) {
    return { pass: false };
  }

  return { pass: true };
}

async function resolveJsonPath(response: Response, path: string): Promise<unknown> {
  const body: unknown = await response.json().catch(() => null);
  return path.split(".").reduce<unknown>((value, key) => {
    if (value === null || typeof value !== "object") return undefined;
    return (value as Record<string, unknown>)[key];
  }, body);
}
