import * as React from "react"

import { Input as UiInput } from "@/components/ui/input"
import { Textarea as UiTextarea } from "@/components/ui/textarea"

export interface InputProps extends React.ComponentProps<typeof UiInput> {
  error?: string
}

function Input({ id, error, ...props }: InputProps) {
  const generatedId = React.useId()
  const inputId = id ?? generatedId
  const errorId = error ? `${inputId}-error` : undefined

  return (
    <div className="flex flex-col gap-1.5">
      <UiInput
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        {...props}
      />
      {error ? (
        <p id={errorId} className="text-sm text-fail">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export interface TextareaProps extends React.ComponentProps<typeof UiTextarea> {
  error?: string
}

function Textarea({ id, error, ...props }: TextareaProps) {
  const generatedId = React.useId()
  const inputId = id ?? generatedId
  const errorId = error ? `${inputId}-error` : undefined

  return (
    <div className="flex flex-col gap-1.5">
      <UiTextarea
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        {...props}
      />
      {error ? (
        <p id={errorId} className="text-sm text-fail">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export { Input, Textarea }
