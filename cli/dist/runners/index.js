import { runCommandSucceeds } from "./command-succeeds.js";
import { runFileContains } from "./file-contains.js";
import { runFileExists } from "./file-exists.js";
import { runHttpOk } from "./http-ok.js";
export async function runCheck(check, cwd) {
    switch (check.type) {
        case "command_succeeds":
            return runCommandSucceeds(check.run, check.expectStdoutMatches, cwd);
        case "file_exists":
            return runFileExists(check.path, cwd);
        case "file_contains":
            return runFileContains(check.path, check.pattern, cwd);
        case "http_ok":
            return runHttpOk(check.url, check.expectStatus, check.expectJsonPath);
    }
}
