"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/afstim/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/afstim/card";
import { Input } from "@/components/afstim/input";
import { registerSchema } from "@/features/auth/validators/register-schema";

type FieldErrors = Partial<Record<"email" | "password" | "form", string>>;

function validateEmail(value: string): string | undefined {
  const result = registerSchema.shape.email.safeParse(value);
  return result.success ? undefined : result.error.issues[0]?.message;
}

function validatePassword(value: string): string | undefined {
  const result = registerSchema.shape.password.safeParse(value);
  return result.success ? undefined : result.error.issues[0]?.message;
}

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errors, setErrors] = React.useState<FieldErrors>({});
  const [submitting, setSubmitting] = React.useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() === "" ? undefined : name,
          email,
          password,
        }),
      });
      const json = await res.json();

      if (!json.ok) {
        const field = (json.error?.field ?? "form") as keyof FieldErrors;
        setErrors({
          [field]: json.error?.message ?? "Something went wrong. Try again.",
        });
        return;
      }

      router.push(`/verify?email=${encodeURIComponent(email)}`);
    } catch {
      setErrors({
        form: "Something went wrong on our side. Try again in a moment.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create your account</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="register-name"
              className="text-[15px] font-medium text-text"
            >
              Name
            </label>
            <Input
              id="register-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="register-email"
              className="text-[15px] font-medium text-text"
            >
              Email
            </label>
            <Input
              id="register-email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              onBlur={() =>
                setErrors((prev) => ({ ...prev, email: validateEmail(email) }))
              }
              error={errors.email}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="register-password"
              className="text-[15px] font-medium text-text"
            >
              Password
            </label>
            <Input
              id="register-password"
              type="password"
              required
              minLength={10}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onBlur={() =>
                setErrors((prev) => ({
                  ...prev,
                  password: validatePassword(password),
                }))
              }
              error={errors.password}
            />
          </div>

          {errors.form ? <p className="text-sm text-fail">{errors.form}</p> : null}

          <Button type="submit" disabled={submitting}>
            {submitting ? "Creating account…" : "Create account"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
