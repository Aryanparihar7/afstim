"use client";

import * as React from "react";

import { Button } from "@/components/afstim/button";
import { Card, CardContent } from "@/components/afstim/card";
import { Input, Textarea } from "@/components/afstim/input";
import { FEEDBACK_CATEGORIES, type FeedbackCategory } from "@/features/feedback/types";
import { cn } from "@/lib/utils";

type FieldErrors = Partial<Record<"category" | "message" | "email" | "form", string>>;

function FeedbackForm() {
  const [category, setCategory] = React.useState<FeedbackCategory>("bug");
  const [message, setMessage] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState<FieldErrors>({});
  const [sent, setSent] = React.useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setErrors({});
    setSubmitting(true);

    try {
      const res = await fetch("/api/v1/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          message,
          email: email.trim() === "" ? undefined : email,
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

      setSent(true);
    } catch {
      setErrors({
        form: "Something went wrong on our side. Try again in a moment.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <Card className="max-w-md">
        <CardContent>
          <p className="text-[15px] leading-[1.65] text-text">
            Sent. Thank you — this is read by one person and that person is
            me.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md">
      <CardContent>
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
          <fieldset className="flex flex-col gap-2">
            <legend className="text-[15px] font-medium text-text">
              Category
            </legend>
            <div className="flex flex-col gap-2">
              {FEEDBACK_CATEGORIES.map((option) => (
                <label
                  key={option.value}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 text-[15px] text-text",
                    category === option.value && "border-border-strong"
                  )}
                >
                  <input
                    type="radio"
                    name="category"
                    value={option.value}
                    checked={category === option.value}
                    onChange={() => setCategory(option.value)}
                    className="accent-text"
                  />
                  {option.label}
                </label>
              ))}
            </div>
            {errors.category ? (
              <p className="text-sm text-fail">{errors.category}</p>
            ) : null}
          </fieldset>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="feedback-message"
              className="text-[15px] font-medium text-text"
            >
              Message
            </label>
            <Textarea
              id="feedback-message"
              required
              minLength={10}
              maxLength={2000}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              error={errors.message}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="feedback-email"
              className="text-[15px] font-medium text-text"
            >
              Only if you want a reply.
            </label>
            <Input
              id="feedback-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              error={errors.email}
            />
          </div>

          {errors.form ? (
            <p className="text-sm text-fail">{errors.form}</p>
          ) : null}

          <Button type="submit" disabled={submitting}>
            {submitting ? "Sending…" : "Send feedback"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export { FeedbackForm };
