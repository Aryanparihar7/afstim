import { readFile } from "node:fs/promises";
import { resolve, sep } from "node:path";
function isWithinCwd(cwd, target) {
    const base = resolve(cwd);
    const resolved = resolve(cwd, target);
    return resolved === base || resolved.startsWith(base + sep);
}
export async function runFileContains(path, pattern, cwd) {
    if (!isWithinCwd(cwd, path)) {
        return { pass: false };
    }
    let content;
    try {
        content = await readFile(resolve(cwd, path), "utf8");
    }
    catch {
        return { pass: false, message: "That file doesn't exist yet." };
    }
    return { pass: new RegExp(pattern).test(content) };
}
