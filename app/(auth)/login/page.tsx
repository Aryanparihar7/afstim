"use client";

import * as React from "react";
import Link from "next/link";

import { Button } from "@/components/afstim/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/afstim/card";
import { Input } from "@/components/afstim/input";
import { loginUser } from "@/features/auth/services/login-service";

export default function LoginPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | undefined>();
  const [submitting, setSubmitting] = React.useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(undefined);

    const result = await loginUser(email, password);
    // On success, loginUser() has already redirected server-side.
    setError(result.message);
    setSubmitting(false);
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Log in</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="login-email"
              className="text-[15px] font-medium text-text"
            >
              Email
            </label>
            <Input
              id="login-email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="login-password"
              className="text-[15px] font-medium text-text"
            >
              Password
            </label>
            <Input
              id="login-password"
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          {error ? <p className="text-sm text-fail">{error}</p> : null}

          <Button type="submit" disabled={submitting}>
            {submitting ? "Logging in…" : "Log in"}
          </Button>

          <p className="text-sm text-muted">
            New here?{" "}
            <Link href="/register" className="text-text hover:text-muted">
              Create an account
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
