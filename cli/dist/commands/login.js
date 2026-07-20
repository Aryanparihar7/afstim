import { ApiError, apiGet, resolveApiUrl } from "../lib/api.js";
import { writeConfig } from "../lib/config.js";
import { CancelledError, printSuccess, promptMasked } from "../lib/ui.js";
const WHOAMI_PATH = "/api/v1/cli/whoami";
const BAD_TOKEN_MESSAGE = "That token isn't valid. Generate a new one at https://afstim.com/settings/cli";
export async function loginCommand() {
    const apiUrl = resolveApiUrl();
    let token;
    try {
        token = (await promptMasked("Paste your token from https://afstim.com/settings/cli: ")).trim();
    }
    catch (error) {
        if (error instanceof CancelledError) {
            process.exit(130);
        }
        throw error;
    }
    if (!token) {
        console.error(BAD_TOKEN_MESSAGE);
        process.exitCode = 1;
        return;
    }
    let whoami;
    try {
        whoami = await apiGet(apiUrl, WHOAMI_PATH, token);
    }
    catch (error) {
        // A network failure gets its own message; any response failure
        // (401, 404, malformed envelope) means the token didn't work.
        if (error instanceof ApiError && error.kind === "network") {
            console.error(error.message);
        }
        else {
            console.error(BAD_TOKEN_MESSAGE);
        }
        process.exitCode = 1;
        return;
    }
    await writeConfig({ token, apiUrl, email: whoami.email });
    printSuccess(`✓ Logged in as ${whoami.email}`);
}
