import * as React from "react"

import { cn } from "@/lib/utils"

function Eyebrow({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "font-mono text-[11px] font-medium tracking-[0.08em] text-subtle uppercase",
        className
      )}
      {...props}
    />
  )
}

export { Eyebrow }
