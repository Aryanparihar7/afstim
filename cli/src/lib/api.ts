const REQUEST_TIMEOUT_MS = 10_000;

type ApiEnvelope<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code: string; message: string } };

export class ApiError extends Error {
  kind: "network" | "response";

  constructor(message: string, kind: "network" | "response") {
    super(message);
    this.kind = kind;
  }
}

export function resolveApiUrl(): string {
  return process.env.AFSTIM_API_URL ?? "https://afstim.com";
}

// Bearer auth, 10s timeout. Never throws a raw fetch/parse error — every
// failure becomes an ApiError with a plain, human message.
export async function apiGet<T>(apiUrl: string, path: string, token?: string): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${apiUrl}${path}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      signal: controller.signal,
    });
  } catch {
    throw new ApiError("Can't reach Afstim. Check your connection and try again.", "network");
  } finally {
    clearTimeout(timer);
  }

  const json = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (!json || !json.ok) {
    const message = json && !json.ok ? json.error.message : "Something went wrong. Try again.";
    throw new ApiError(message, "response");
  }

  return json.data;
}

export async function apiPost<T>(
  apiUrl: string,
  path: string,
  token: string,
  body: unknown
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${apiUrl}${path}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch {
    throw new ApiError("Can't reach Afstim. Check your connection and try again.", "network");
  } finally {
    clearTimeout(timer);
  }

  const json = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (!json || !json.ok) {
    const message = json && !json.ok ? json.error.message : "Something went wrong. Try again.";
    throw new ApiError(message, "response");
  }

  return json.data;
}
