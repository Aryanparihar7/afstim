"use client"

import * as React from "react"

import { Button } from "@/components/afstim/button"
import { Input, Textarea } from "@/components/afstim/input"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/afstim/card"
import { Badge } from "@/components/afstim/badge"
import { Eyebrow } from "@/components/afstim/eyebrow"
import { CheckRow } from "@/components/afstim/check-row"
import { Terminal, TerminalLine } from "@/components/afstim/terminal"
import { Label } from "@/components/ui/label"

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-4">
      <Eyebrow>{title}</Eyebrow>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  )
}

function CheckRowDemo() {
  const [state, setState] = React.useState<"pending" | "pass" | "fail">(
    "pending"
  )

  return (
    <div className="flex flex-col gap-3">
      <CheckRow state={state} label="Your app builds without errors" />
      <Button
        variant="secondary"
        size="sm"
        className="w-fit"
        onClick={() => setState((s) => (s === "pass" ? "pending" : "pass"))}
      >
        Toggle pending / pass
      </Button>
    </div>
  )
}

export default function ComponentsPreviewPage() {
  return (
    <main className="mx-auto flex max-w-[720px] flex-col gap-16 px-6 py-16">
      <Section title="Button">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary" size="md">
            Primary md
          </Button>
          <Button variant="primary" size="sm">
            Primary sm
          </Button>
          <Button variant="secondary" size="md">
            Secondary md
          </Button>
          <Button variant="secondary" size="sm">
            Secondary sm
          </Button>
          <Button variant="ghost" size="md">
            Ghost md
          </Button>
          <Button variant="ghost" size="sm">
            Ghost sm
          </Button>
          <Button variant="primary" size="md" disabled>
            Disabled
          </Button>
        </div>
      </Section>

      <Section title="Input / Textarea">
        <div className="flex max-w-sm flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="demo-input">Email</Label>
            <Input id="demo-input" placeholder="you@example.com" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="demo-input-error">Email</Label>
            <Input
              id="demo-input-error"
              defaultValue="not-an-email"
              error="Enter a valid email address."
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="demo-textarea">Message</Label>
            <Textarea id="demo-textarea" placeholder="Say something" />
          </div>
        </div>
      </Section>

      <Section title="Card">
        <Card className="max-w-sm">
          <CardHeader>
            <CardTitle>Deploy to Vercel</CardTitle>
            <CardDescription>Get your app onto a public URL.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted">3 checks, about 25 minutes.</p>
          </CardContent>
          <CardFooter>
            <Button size="sm">Continue mission</Button>
          </CardFooter>
        </Card>
      </Section>

      <Section title="Badge">
        <div className="flex flex-wrap items-center gap-3">
          <Badge>Default</Badge>
          <Badge variant="pass">Pass</Badge>
          <Badge variant="fail">Fail</Badge>
          <Badge variant="pending">Pending</Badge>
        </div>
      </Section>

      <Section title="Eyebrow">
        <Eyebrow>Afstim</Eyebrow>
      </Section>

      <Section title="CheckRow">
        <div className="flex flex-col gap-3">
          <CheckRow state="pending" label="Your app builds without errors" />
          <CheckRow
            state="pass"
            label="Your URL responds from the public internet"
          />
          <CheckRow
            state="fail"
            label="HTTPS is working with a valid certificate"
            hint="Vercel issues this automatically. If it fails, the deploy probably hasn't finished."
          />
        </div>
        <CheckRowDemo />
      </Section>

      <Section title="Terminal">
        <Terminal>
          <TerminalLine>npx afstim check</TerminalLine>
          <div className="mt-2 flex flex-col gap-1">
            <CheckRow state="pass" label="Your app builds without errors" />
            <CheckRow
              state="pass"
              label="Your URL responds from the public internet"
            />
            <CheckRow
              state="pass"
              label="HTTPS is working with a valid certificate"
            />
          </div>
        </Terminal>
      </Section>
    </main>
  )
}
