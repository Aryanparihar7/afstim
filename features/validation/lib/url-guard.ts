import dns from "node:dns/promises";
import https from "node:https";
import type { IncomingHttpHeaders, IncomingMessage } from "node:http";
import { pathToFileURL } from "node:url";

// The one message a caller may ever show the learner. Never say which
// rule fired — that teaches an attacker the ruleset (M21 spec).
export const PUBLIC_URL_REJECTION_MESSAGE = "That URL has to be a public https address.";

const BLOCKED_HOSTNAMES = new Set(["localhost", "metadata.google.internal"]);
const BLOCKED_HOSTNAME_SUFFIXES = [".local", ".internal"];

const MAX_BODY_BYTES = 1_048_576;
const DEFAULT_TIMEOUT_MS = 10_000;
const DEFAULT_MAX_REDIRECTS = 3;

type RejectReason =
  | "scheme"
  | "credentials"
  | "port"
  | "hostname_blocked"
  | "private_ip"
  | "dns_failed"
  | "connection_failed"
  | "timeout"
  | "body_too_large"
  | "too_many_redirects";

const CONNECTIVITY_REASONS = new Set<RejectReason>(["dns_failed", "connection_failed", "timeout"]);

export class UrlGuardRejection extends Error {
  reason: RejectReason;
  constructor(reason: RejectReason) {
    super(PUBLIC_URL_REJECTION_MESSAGE);
    this.name = "UrlGuardRejection";
    this.reason = reason;
  }
}

export function isConnectivityRejection(error: unknown): boolean {
  return error instanceof UrlGuardRejection && CONNECTIVITY_REASONS.has(error.reason);
}

/** Every rejection logs its real reason server-side, once, here. Never sent to the client. */
function makeRejection(reason: RejectReason, detail?: unknown): UrlGuardRejection {
  console.error("[url-guard] rejected", { reason, detail });
  return new UrlGuardRejection(reason);
}

function reject(reason: RejectReason, detail?: unknown): never {
  throw makeRejection(reason, detail);
}

// ---- IPv4 range check ----

const IPV4_BLOCKS: [string, number][] = [
  ["10.0.0.0", 8],
  ["172.16.0.0", 12],
  ["192.168.0.0", 16],
  ["127.0.0.0", 8],
  ["169.254.0.0", 16],
  ["0.0.0.0", 8],
  ["100.64.0.0", 10], // shared address space (carrier-grade NAT / some cloud providers)
  ["192.0.0.0", 24], // IETF protocol assignments
  ["198.18.0.0", 15], // benchmarking
  ["240.0.0.0", 4], // reserved
];

function ipv4ToInt(ip: string): number {
  return ip.split(".").reduce((acc, octet) => (acc << 8) | Number(octet), 0) >>> 0;
}

function isPrivateIPv4(ip: string): boolean {
  const value = ipv4ToInt(ip);
  return IPV4_BLOCKS.some(([base, prefix]) => {
    const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
    return (value & mask) === (ipv4ToInt(base) & mask);
  });
}

// ---- IPv6 parsing + range check ----

function dottedIPv4ToHextets(ipv4: string): [number, number] {
  const parts = ipv4.split(".").map(Number);
  return [(parts[0] << 8) | parts[1], (parts[2] << 8) | parts[3]];
}

function parseIPv6Hextets(ip: string): number[] {
  const clean = ip.split("%")[0]; // strip zone id, e.g. fe80::1%eth0
  const parseGroups = (groups: string[]): number[] =>
    groups.flatMap((g) => (g.includes(".") ? dottedIPv4ToHextets(g) : [parseInt(g, 16)]));

  if (!clean.includes("::")) {
    return parseGroups(clean.split(":"));
  }

  const [headStr, tailStr] = clean.split("::");
  const head = headStr ? parseGroups(headStr.split(":")) : [];
  const tail = tailStr ? parseGroups(tailStr.split(":")) : [];
  const missing = Math.max(8 - head.length - tail.length, 0);
  return [...head, ...Array(missing).fill(0), ...tail];
}

/** ::ffff:a.b.c.d (and its all-hex form) unwrapped to the plain IPv4 string it carries. */
function unwrapIPv4MappedIPv6(hextets: number[]): string | null {
  if (hextets.length !== 8) return null;
  if (hextets[0] || hextets[1] || hextets[2] || hextets[3] || hextets[4]) return null;
  if (hextets[5] !== 0xffff) return null;
  const a = (hextets[6] >> 8) & 0xff;
  const b = hextets[6] & 0xff;
  const c = (hextets[7] >> 8) & 0xff;
  const d = hextets[7] & 0xff;
  return `${a}.${b}.${c}.${d}`;
}

function isPrivateIPv6Hextets(hextets: number[]): boolean {
  if (hextets.slice(0, 7).every((h) => h === 0) && hextets[7] === 1) return true; // ::1
  if ((hextets[0] & 0xfe00) === 0xfc00) return true; // fc00::/7
  if ((hextets[0] & 0xffc0) === 0xfe80) return true; // fe80::/10
  return false;
}

function isIPv4(ip: string): boolean {
  return /^\d{1,3}(\.\d{1,3}){3}$/.test(ip);
}

/** Unwraps IPv4-mapped IPv6 before checking so ::ffff:127.0.0.1 is caught the same as 127.0.0.1. */
export function isPrivateOrReservedIp(ip: string): boolean {
  if (isIPv4(ip)) return isPrivateIPv4(ip);

  const hextets = parseIPv6Hextets(ip);
  const mapped = unwrapIPv4MappedIPv6(hextets);
  if (mapped) return isPrivateIPv4(mapped);
  return isPrivateIPv6Hextets(hextets);
}

// ---- The guard ----

async function resolveAllAddresses(hostname: string): Promise<string[]> {
  let records;
  try {
    records = await dns.lookup(hostname, { all: true, verbatim: true });
  } catch {
    reject("dns_failed", hostname);
  }
  return records.map((r) => r.address);
}

export async function assertPublicHttpsUrl(rawUrl: string): Promise<{ url: URL; ip: string }> {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    reject("scheme", rawUrl);
  }

  if (url.protocol !== "https:") reject("scheme", url.protocol);
  if (url.username || url.password) reject("credentials");
  if (url.port !== "" && url.port !== "443") reject("port", url.port);

  const hostname = url.hostname.toLowerCase();
  if (
    BLOCKED_HOSTNAMES.has(hostname) ||
    BLOCKED_HOSTNAME_SUFFIXES.some((suffix) => hostname.endsWith(suffix))
  ) {
    reject("hostname_blocked", hostname);
  }

  const addresses = await resolveAllAddresses(hostname);
  if (addresses.length === 0) reject("dns_failed", hostname);
  for (const address of addresses) {
    if (isPrivateOrReservedIp(address)) reject("private_ip", address);
  }

  return { url, ip: addresses[0] };
}

type RawResponse = { status: number; headers: IncomingHttpHeaders; res: IncomingMessage };

function requestOnce(url: URL, ip: string, timeoutMs: number): Promise<RawResponse> {
  return new Promise((resolvePromise, rejectPromise) => {
    const req = https.request(
      {
        host: ip,
        port: 443,
        path: url.pathname + url.search,
        method: "GET",
        servername: url.hostname,
        headers: { Host: url.hostname },
        timeout: timeoutMs,
        rejectUnauthorized: true,
      },
      (res) => resolvePromise({ status: res.statusCode ?? 0, headers: res.headers, res })
    );
    req.on("timeout", () => req.destroy(new Error("timeout")));
    req.on("error", rejectPromise);
    req.end();
  });
}

function readCappedBody(res: IncomingMessage): Promise<Buffer> {
  return new Promise((resolvePromise, rejectPromise) => {
    const chunks: Buffer[] = [];
    let total = 0;
    res.on("data", (chunk: Buffer) => {
      total += chunk.length;
      if (total > MAX_BODY_BYTES) {
        res.destroy();
        rejectPromise(makeRejection("body_too_large"));
        return;
      }
      chunks.push(chunk);
    });
    res.on("end", () => resolvePromise(Buffer.concat(chunks)));
    res.on("error", rejectPromise);
  });
}

export type GuardedResponse = {
  status: number;
  headers: IncomingHttpHeaders;
  ip: string;
  readBody: () => Promise<Buffer>;
};

/**
 * Resolves, validates, and connects by the validated IP — re-validating
 * on every redirect hop. Never reads the body unless the caller asks, and
 * caps it at 1MB when it does, so a 100MB response can't OOM the function.
 */
export async function guardedGet(
  rawUrl: string,
  opts: { maxRedirects?: number; timeoutMs?: number } = {}
): Promise<GuardedResponse> {
  const maxRedirects = opts.maxRedirects ?? DEFAULT_MAX_REDIRECTS;
  const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  let currentUrl = rawUrl;
  for (let redirects = 0; ; redirects++) {
    const { url, ip } = await assertPublicHttpsUrl(currentUrl);

    let response: RawResponse;
    try {
      response = await requestOnce(url, ip, timeoutMs);
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code;
      reject(code === "ETIMEDOUT" ? "timeout" : "connection_failed", code);
    }

    const isRedirect = response.status >= 300 && response.status < 400;
    const location = Array.isArray(response.headers.location)
      ? response.headers.location[0]
      : response.headers.location;

    if (isRedirect && location) {
      response.res.resume(); // discard the body of the hop we're leaving
      if (redirects >= maxRedirects) reject("too_many_redirects", currentUrl);
      currentUrl = new URL(location, url).toString();
      continue;
    }

    return {
      status: response.status,
      headers: response.headers,
      ip,
      readBody: () => readCappedBody(response.res),
    };
  }
}

export type RunnerOutcome =
  | { kind: "pass" }
  | { kind: "fail"; message: string }
  | { kind: "connectivity_error" };

// ---- Self-check ----
// Runs only when this file is executed directly: `tsx features/validation/lib/url-guard.ts`.
// Never runs on normal Next.js import.
async function selfCheck() {
  const assert = (condition: boolean, label: string) => {
    console.log(condition ? `ok   ${label}` : `FAIL ${label}`);
    if (!condition) process.exitCode = 1;
  };

  console.log("-- pure range checks (offline) --");
  assert(isPrivateOrReservedIp("127.0.0.1"), "127.0.0.1 is private");
  assert(isPrivateOrReservedIp("10.1.2.3"), "10.1.2.3 is private");
  assert(isPrivateOrReservedIp("192.168.1.1"), "192.168.1.1 is private");
  assert(isPrivateOrReservedIp("169.254.169.254"), "169.254.169.254 (metadata) is private");
  assert(isPrivateOrReservedIp("100.64.0.1"), "100.64.0.1 (shared addr space) is private");
  assert(isPrivateOrReservedIp("192.0.0.5"), "192.0.0.5 (IETF protocol assignment) is private");
  assert(isPrivateOrReservedIp("198.18.0.1"), "198.18.0.1 (benchmarking) is private");
  assert(isPrivateOrReservedIp("240.0.0.1"), "240.0.0.1 (reserved) is private");
  assert(isPrivateOrReservedIp("::1"), "::1 is private");
  assert(isPrivateOrReservedIp("fe80::1"), "fe80::1 is private");
  assert(isPrivateOrReservedIp("fc00::1"), "fc00::1 is private");
  assert(isPrivateOrReservedIp("::ffff:127.0.0.1"), "::ffff:127.0.0.1 (mapped) is private");
  assert(isPrivateOrReservedIp("::ffff:7f00:1"), "::ffff:7f00:1 (mapped, hex form) is private");
  assert(!isPrivateOrReservedIp("8.8.8.8"), "8.8.8.8 is public");

  console.log("\n-- live guard demonstration --");
  const cases: string[] = [
    "http://x.com",
    "https://localhost",
    "https://127.0.0.1",
    "https://[::ffff:127.0.0.1]",
    "https://169.254.169.254",
    "https://192.168.1.1",
    "https://100.64.0.1",
    "https://user:pass@x.com",
    "https://x.com:8080",
    "file:///etc/passwd",
  ];

  for (const rawUrl of cases) {
    try {
      const { ip } = await assertPublicHttpsUrl(rawUrl);
      console.log(`ALLOWED ${rawUrl} -> ${ip}`);
    } catch (error) {
      const reason = error instanceof UrlGuardRejection ? error.reason : "unknown";
      console.log(`REJECTED ${rawUrl} (${reason})`);
    }
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  selfCheck();
}
