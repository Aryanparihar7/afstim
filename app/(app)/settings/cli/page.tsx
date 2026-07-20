"use client";

import * as React from "react";

import { Badge } from "@/components/afstim/badge";
import { Button } from "@/components/afstim/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/afstim/card";
import { Eyebrow } from "@/components/afstim/eyebrow";
import { Terminal, TerminalLine } from "@/components/afstim/terminal";

type CliToken = {
  id: string;
  createdAt: string;
  lastUsedAt: string | null;
  revokedAt: string | null;
};

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString();
}

export default function CliSettingsPage() {
  const [tokens, setTokens] = React.useState<CliToken[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [reloadKey, setReloadKey] = React.useState(0);
  const [generating, setGenerating] = React.useState(false);
  const [newToken, setNewToken] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [error, setError] = React.useState<string | undefined>(undefined);

  // Fetch only ever runs in the browser (effects don't run during SSR),
  // which is required here — a relative fetch() has no origin to resolve
  // against on the server. `ignore` guards against a stale response
  // landing after a newer reload was already triggered.
  React.useEffect(() => {
    let ignore = false;

    fetch("/api/v1/cli/tokens")
      .then((res) => res.json())
      .then((json) => {
        if (ignore) return;
        if (json.ok) setTokens(json.data.tokens);
        setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [reloadKey]);

  async function handleGenerate() {
    setGenerating(true);
    setError(undefined);
    setCopied(false);

    const res = await fetch("/api/v1/cli/tokens", { method: "POST" });
    const json = await res.json();

    if (!json.ok) {
      setError(json.error?.message ?? "Something went wrong. Try again.");
      setGenerating(false);
      return;
    }

    setNewToken(json.data.token);
    setGenerating(false);
    setReloadKey((key) => key + 1);
  }

  async function handleCopy() {
    if (!newToken) return;
    await navigator.clipboard.writeText(newToken);
    setCopied(true);
  }

  async function handleRevoke(id: string) {
    const res = await fetch("/api/v1/cli/tokens", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const json = await res.json();
    if (json.ok) {
      setReloadKey((key) => key + 1);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-[720px] flex-col gap-8 px-4 py-12 sm:px-6">
      <header className="flex flex-col gap-2">
        <Eyebrow>CLI access</Eyebrow>
        <h1 className="text-[36px] font-medium tracking-[-0.02em] text-text">
          CLI tokens
        </h1>
        <p className="text-[15px] leading-[1.65] text-muted">
          This token lets afstim on your machine check your work.
        </p>
      </header>

      <div className="flex flex-col gap-4">
        <Button onClick={handleGenerate} disabled={generating} className="w-fit">
          {generating ? "Generating…" : "Generate a token"}
        </Button>

        {error ? <p className="text-sm text-fail">{error}</p> : null}

        {newToken ? (
          <div className="flex flex-col gap-2">
            <Terminal>
              <TerminalLine>{newToken}</TerminalLine>
            </Terminal>
            <div className="flex items-center gap-3">
              <Button type="button" variant="secondary" size="sm" onClick={handleCopy}>
                {copied ? "Copied" : "Copy"}
              </Button>
              <p className="text-sm text-muted">Copy this now. You won&apos;t see it again.</p>
            </div>
          </div>
        ) : null}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Existing tokens</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {loading ? (
            <p className="text-[15px] text-muted">Loading…</p>
          ) : tokens.length === 0 ? (
            <p className="text-[15px] text-muted">No tokens yet.</p>
          ) : (
            tokens.map((token) => (
              <div
                key={token.id}
                className="flex items-center justify-between gap-4 border-b border-border pb-3 last:border-b-0 last:pb-0"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-[15px] text-text">
                    Created {formatDate(token.createdAt)}
                  </span>
                  <span className="text-[13px] text-subtle">
                    {token.lastUsedAt
                      ? `Last used ${formatDate(token.lastUsedAt)}`
                      : "Never used"}
                  </span>
                </div>
                {token.revokedAt ? (
                  <Badge>Revoked</Badge>
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRevoke(token.id)}
                  >
                    Revoke
                  </Button>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
