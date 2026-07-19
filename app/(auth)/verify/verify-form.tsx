"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/afstim/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/afstim/card";
import { Input } from "@/components/afstim/input";
import { resendVerificationCode } from "@/features/auth/services/verification-actions";

type ResendStatus = "idle" | "sending" | "sent" | "rate_limited";

export function VerifyForm({ email }: { email: string | null }) {
  const router = useRouter();
  const [code, setCode] = React.useState("");
  const [verifying, setVerifying] = React.useState(false);
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [resendStatus, setResendStatus] = React.useState<ResendStatus>("idle");

  async function handleVerify(event: React.FormEvent) {
    event.preventDefault();
    setVerifying(true);
    setError(undefined);

    try {
      const res = await fetch("/api/v1/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const json = await res.json();

      if (!json.ok) {
        setError(json.error?.message ?? "Something went wrong. Try again.");
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("Something went wrong on our side. Try again in a moment.");
    } finally {
      setVerifying(false);
    }
  }

  async function handleResend() {
    setResendStatus("sending");
    const result = await resendVerificationCode(email ?? undefined);
    setResendStatus(result.sent ? "sent" : "rate_limited");
  }

  if (!email) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>No pending verification found.</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[15px] leading-[1.65] text-muted">
            Register or log in again to get a new code.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Enter the code we sent to {email}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <form onSubmit={handleVerify} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="verify-code" className="text-[15px] font-medium text-text">
              Code
            </label>
            <Input
              id="verify-code"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              required
              value={code}
              onChange={(event) =>
                setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
              }
              error={error}
            />
          </div>
          <Button type="submit" disabled={verifying || code.length !== 6}>
            {verifying ? "Verifying…" : "Verify"}
          </Button>
        </form>
        <div className="flex flex-col gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="w-fit"
            disabled={resendStatus === "sending"}
            onClick={handleResend}
          >
            {resendStatus === "sending" ? "Sending…" : "Resend code"}
          </Button>
          {resendStatus === "sent" ? (
            <p className="text-sm text-pass">Sent. Check your inbox.</p>
          ) : null}
          {resendStatus === "rate_limited" ? (
            <p className="text-sm text-fail">
              Too many requests. Try again in a moment.
            </p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
