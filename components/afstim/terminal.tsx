import * as React from "react"

import { cn } from "@/lib/utils"

function Terminal({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-md border border-border bg-surface p-4 font-mono text-[13px] text-text",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function TerminalLine({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex gap-2", className)} {...props}>
      <span className="text-subtle">$</span>
      <span>{children}</span>
    </div>
  )
}

export { Terminal, TerminalLine }
