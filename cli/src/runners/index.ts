import { runCommandSucceeds } from "./command-succeeds.js";
import { runFileContains } from "./file-contains.js";
import { runFileExists } from "./file-exists.js";
import { runHttpOk } from "./http-ok.js";

export type Check =
  | {
      id: string;
      label: string;
      hint: string;
      type: "command_succeeds";
      run: string;
      expectStdoutMatches?: string;
    }
  | { id: string; label: string; hint: string; type: "file_exists"; path: string }
  | {
      id: string;
      label: string;
      hint: string;
      type: "file_contains";
      path: string;
      pattern: string;
    }
  | {
      id: string;
      label: string;
      hint: string;
      type: "http_ok";
      url: string;
      expectStatus: number;
      expectJsonPath?: string;
    };

export type CheckOutcome = { pass: true } | { pass: false; message?: string };

export async function runCheck(check: Check, cwd: string): Promise<CheckOutcome> {
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
