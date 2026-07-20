import { execa } from "execa";

import type { CheckOutcome } from "./index.js";

const TIMEOUT_MS = 20_000;
const TIMEOUT_MESSAGE = "That took longer than 20 seconds. Something's stuck.";

export async function runCommandSucceeds(
  run: string,
  expectStdoutMatches: string | undefined,
  cwd: string
): Promise<CheckOutcome> {
  const subprocess = execa(run, { shell: true, cwd, reject: false });
  let timedOut = false;

  // execa's own `timeout` option only kills the immediate child. With
  // shell:true on Windows that's cmd.exe, not the real process it spawned —
  // killing cmd.exe leaves the actual command running (and its stdout pipe
  // open) until it finishes naturally, so the promise below wouldn't
  // resolve until the full runaway duration elapsed. Managing the deadline
  // here and killing the whole tree on timeout is what actually stops it.
  const timer = setTimeout(() => {
    timedOut = true;
    if (process.platform === "win32" && subprocess.pid) {
      execa("taskkill", ["/pid", String(subprocess.pid), "/T", "/F"], { reject: false });
    } else {
      subprocess.kill();
    }
  }, TIMEOUT_MS);

  const result = await subprocess;
  clearTimeout(timer);

  if (timedOut) {
    return { pass: false, message: TIMEOUT_MESSAGE };
  }
  if (result.exitCode !== 0) {
    return { pass: false };
  }
  if (expectStdoutMatches && !new RegExp(expectStdoutMatches).test(result.stdout)) {
    return { pass: false };
  }
  return { pass: true };
}
