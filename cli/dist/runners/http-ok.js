const TIMEOUT_MS = 10_000;
export async function runHttpOk(url, expectStatus, expectJsonPath) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    let response;
    try {
        response = await fetch(url, { signal: controller.signal });
    }
    catch {
        return { pass: false };
    }
    finally {
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
async function resolveJsonPath(response, path) {
    const body = await response.json().catch(() => null);
    return path.split(".").reduce((value, key) => {
        if (value === null || typeof value !== "object")
            return undefined;
        return value[key];
    }, body);
}
