import { resolve, sep } from "node:path";

import fg from "fast-glob";

import type { CheckOutcome } from "./index.js";

function isWithinCwd(cwd: string, target: string): boolean {
  const base = resolve(cwd);
  const resolved = resolve(cwd, target);
  return resolved === base || resolved.startsWith(base + sep);
}

export async function runFileExists(path: string, cwd: string): Promise<CheckOutcome> {
  if (!isWithinCwd(cwd, path)) {
    return { pass: false };
  }
  const matches = await fg(path, { cwd, dot: true });
  return { pass: matches.length > 0 };
}
