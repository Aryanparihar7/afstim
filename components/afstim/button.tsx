import * as React from "react"

import { Button as UiButton } from "@/components/ui/button"

function Button(props: React.ComponentProps<typeof UiButton>) {
  return <UiButton {...props} />
}

export { Button }
