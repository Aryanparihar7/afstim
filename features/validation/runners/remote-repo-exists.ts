import type { RunnerOutcome } from "@/features/validation/lib/url-guard";

// GitHub's actual owner/repo naming rules — whitelisted, not blacklisted,
// so nothing resembling path traversal or an unexpected character can
// reach the request path built below.
const OWNER_RE = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/;
const REPO_RE = /^[A-Za-z0-9._-]{1,100}$/;
const TIMEOUT_MS = 10_000;

function parseOwnerRepo(value: string): { owner: string; repo: string } | null {
  const withoutProtocol = value.trim().replace(/^https?:\/\/(www\.)?github\.com\//i, "");
  const withoutSuffix = withoutProtocol.replace(/\.git$/i, "").replace(/\/+$/, "");
  const parts = withoutSuffix.split("/");
  if (parts.length !== 2) return null;

  const [owner, repo] = parts;
  if (!OWNER_RE.test(owner) || !REPO_RE.test(repo)) return null;
  // "." and ".." are RFC 3986 dot-segments — the URL parser collapses them
  // out of the request path, so a repo value of ".." would silently hit a
  // different GitHub endpoint than the one built below. Neither is a real
  // GitHub name, so rejecting them costs nothing.
  if (owner === "." || owner === ".." || repo === "." || repo === "..") return null;
  return { owner, repo };
}

// This runner never calls url-guard: the host is the hardcoded
// api.github.com, never learner-influenced, so there's no SSRF surface —
// only the owner/repo strings are learner input, and those are whitelisted
// above before they ever touch a URL.
async function githubGet(path: string): Promise<{ status: number; json: unknown }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`https://api.github.com${path}`, {
      signal: controller.signal,
      headers: { Accept: "application/vnd.github+json", "User-Agent": "afstim" },
    });
    const json = res.status === 200 ? await res.json().catch(() => null) : null;
    return { status: res.status, json };
  } finally {
    clearTimeout(timer);
  }
}

export async function runRemoteRepoExists(value: string): Promise<RunnerOutcome> {
  const parsed = parseOwnerRepo(value);
  if (!parsed) {
    return { kind: "fail", message: "That doesn't look like a GitHub repository." };
  }
  const owner = encodeURIComponent(parsed.owner);
  const repo = encodeURIComponent(parsed.repo);

  try {
    const repoRes = await githubGet(`/repos/${owner}/${repo}`);
    if (repoRes.status === 404) {
      return { kind: "fail", message: "That repository isn't public, or doesn't exist." };
    }
    if (repoRes.status !== 200) {
      return { kind: "connectivity_error" };
    }

    const commitsRes = await githubGet(`/repos/${owner}/${repo}/commits?per_page=1`);
    if (commitsRes.status !== 200 || !Array.isArray(commitsRes.json) || commitsRes.json.length === 0) {
      return { kind: "fail", message: "That repository has no commits yet." };
    }

    return { kind: "pass" };
  } catch {
    return { kind: "connectivity_error" };
  }
}
