const REQUEST_TIMEOUT_MS = 10_000;
export class ApiError extends Error {
    kind;
    constructor(message, kind) {
        super(message);
        this.kind = kind;
    }
}
export function resolveApiUrl() {
    return process.env.AFSTIM_API_URL ?? "https://afstim.com";
}
// Bearer auth, 10s timeout. Never throws a raw fetch/parse error — every
// failure becomes an ApiError with a plain, human message.
export async function apiGet(apiUrl, path, token) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    let response;
    try {
        response = await fetch(`${apiUrl}${path}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            signal: controller.signal,
        });
    }
    catch {
        throw new ApiError("Can't reach Afstim. Check your connection and try again.", "network");
    }
    finally {
        clearTimeout(timer);
    }
    const json = (await response.json().catch(() => null));
    if (!json || !json.ok) {
        const message = json && !json.ok ? json.error.message : "Something went wrong. Try again.";
        throw new ApiError(message, "response");
    }
    return json.data;
}
export async function apiPost(apiUrl, path, token, body) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    let response;
    try {
        response = await fetch(`${apiUrl}${path}`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify(body),
            signal: controller.signal,
        });
    }
    catch {
        throw new ApiError("Can't reach Afstim. Check your connection and try again.", "network");
    }
    finally {
        clearTimeout(timer);
    }
    const json = (await response.json().catch(() => null));
    if (!json || !json.ok) {
        const message = json && !json.ok ? json.error.message : "Something went wrong. Try again.";
        throw new ApiError(message, "response");
    }
    return json.data;
}
