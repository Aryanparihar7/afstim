import tls from "node:tls";

import {
  assertPublicHttpsUrl,
  isConnectivityRejection,
  PUBLIC_URL_REJECTION_MESSAGE,
  UrlGuardRejection,
  type RunnerOutcome,
} from "@/features/validation/lib/url-guard";

const TIMEOUT_MS = 10_000;

const CERT_ERROR_CODES = new Set([
  "CERT_HAS_EXPIRED",
  "DEPTH_ZERO_SELF_SIGNED_CERT",
  "SELF_SIGNED_CERT_IN_CHAIN",
  "ERR_TLS_CERT_ALTNAME_INVALID",
  "UNABLE_TO_VERIFY_LEAF_SIGNATURE",
]);

export async function runRemoteHttpsValid(url: string): Promise<RunnerOutcome> {
  let guarded: { url: URL; ip: string };
  try {
    guarded = await assertPublicHttpsUrl(url);
  } catch (error) {
    if (error instanceof UrlGuardRejection && isConnectivityRejection(error)) {
      return { kind: "connectivity_error" };
    }
    return { kind: "fail", message: PUBLIC_URL_REJECTION_MESSAGE };
  }

  // Node's default TLS verification already enforces chain validity, expiry,
  // and hostname match against `servername` — a clean handshake is a pass.
  return new Promise((resolve) => {
    const socket = tls.connect(
      {
        host: guarded.ip,
        port: 443,
        servername: guarded.url.hostname,
        rejectUnauthorized: true,
        timeout: TIMEOUT_MS,
      },
      () => {
        socket.end();
        resolve({ kind: "pass" });
      }
    );

    socket.on("timeout", () => {
      socket.destroy();
      resolve({ kind: "connectivity_error" });
    });

    socket.on("error", (error: NodeJS.ErrnoException) => {
      if (error.code && CERT_ERROR_CODES.has(error.code)) {
        resolve({ kind: "fail", message: "The certificate isn't valid for this address." });
        return;
      }
      resolve({ kind: "connectivity_error" });
    });
  });
}
