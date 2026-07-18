import { after } from "next/server";

import { insertEvent } from "@/features/analytics/repositories/event-repository";
import type { EventType } from "@/features/analytics/types";

function writeEvent(
  type: EventType,
  userId: string | null,
  payload: Record<string, unknown>
): Promise<void> {
  return insertEvent(type, userId, payload).catch((error: unknown) => {
    console.error("[analytics] failed to track event", type, error);
  });
}

/**
 * Fire-and-forget analytics. Never throws, never adds latency to the caller.
 *
 * `payload` must never contain: email, password, token, error text, file
 * contents, or URLs from user submissions.
 */
export async function track(
  type: EventType,
  userId: string | null,
  payload: Record<string, unknown> = {}
): Promise<void> {
  try {
    after(() => writeEvent(type, userId, payload));
  } catch {
    // `after()` throws when called outside a request scope (e.g. a
    // background job). Fall back to a plain detached write.
    void writeEvent(type, userId, payload);
  }
}
