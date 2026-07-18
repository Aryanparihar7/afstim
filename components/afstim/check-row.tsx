"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type CheckState = "pending" | "pass" | "fail"

export interface CheckRowProps {
  state: CheckState
  label: string
  hint?: string
  className?: string
}

const MARKERS: Record<CheckState, string> = {
  pending: "○",
  pass: "✓",
  fail: "✗",
}

const MARKER_COLOR: Record<CheckState, string> = {
  pending: "text-pending",
  pass: "text-pass",
  fail: "text-fail",
}

function CheckRow({ state, label, hint, className }: CheckRowProps) {
  const prevState = React.useRef<CheckState>(state)
  const [fading, setFading] = React.useState(false)

  React.useEffect(() => {
    const wasPending = prevState.current === "pending"
    prevState.current = state

    if (wasPending && state === "pass") {
      setFading(true)
      const raf = requestAnimationFrame(() => setFading(false))
      return () => cancelAnimationFrame(raf)
    }
  }, [state])

  return (
    <div className={cn("flex flex-col gap-1 font-mono text-[13px]", className)}>
      <div className="flex items-start gap-2">
        <span
          key={state}
          className={cn(
            "shrink-0 transition-opacity duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
            MARKER_COLOR[state],
            fading ? "opacity-0" : "opacity-100"
          )}
        >
          {MARKERS[state]}
        </span>
        <span
          className={cn(
            "text-text",
            state === "pending" ? "font-normal" : "font-medium"
          )}
        >
          {label}
        </span>
      </div>
      {state === "fail" && hint ? (
        <p className="pl-5 text-muted">→ {hint}</p>
      ) : null}
    </div>
  )
}

export { CheckRow }
