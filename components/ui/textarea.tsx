import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "min-h-24 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text outline-none transition-colors placeholder:text-subtle focus-visible:border-border-strong disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-fail",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
