import Link from "next/link";

import { cn } from "@/lib/utils";

export type MissionListItemState = "VERIFIED" | "IN_PROGRESS" | "AVAILABLE" | "LOCKED";

export interface MissionListItemProps {
  slug: string;
  order: number;
  title: string;
  capability: string;
  duration: number;
  state: MissionListItemState;
  blockerLabel?: string;
}

function MissionListItem({
  slug,
  order,
  title,
  capability,
  duration,
  state,
  blockerLabel,
}: MissionListItemProps) {
  const isLocked = state === "LOCKED";
  const orderLabel = String(order).padStart(2, "0");

  const row = (
    <div
      aria-disabled={isLocked ? "true" : undefined}
      className={cn(
        "flex items-center gap-4 rounded-md border-l-2 border-l-transparent px-4 py-3",
        state === "IN_PROGRESS" && "border-l-border-strong",
        !isLocked && "hover:bg-surface"
      )}
    >
      <span className="w-6 shrink-0 font-mono text-[13px] text-subtle">{orderLabel}</span>
      <span className="w-4 shrink-0 text-center font-mono text-[13px]" aria-hidden="true">
        {state === "VERIFIED" ? <span className="text-pass">✓</span> : null}
        {isLocked ? <span className="text-subtle">○</span> : null}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span
          className={cn(
            "truncate text-[15px] font-medium",
            state === "VERIFIED" && "text-muted",
            isLocked && "text-subtle",
            (state === "AVAILABLE" || state === "IN_PROGRESS") && "text-text"
          )}
        >
          {title}
        </span>
        <span className="text-[15px] text-muted">{capability}</span>
        {isLocked && blockerLabel ? (
          <span className="text-[13px] text-subtle">{blockerLabel}</span>
        ) : null}
      </div>
      <span className="shrink-0 font-mono text-[13px] text-subtle">{duration} min</span>
    </div>
  );

  if (isLocked) {
    return <li>{row}</li>;
  }

  return (
    <li>
      <Link href={`/mission/${slug}`}>{row}</Link>
    </li>
  );
}

export { MissionListItem };
