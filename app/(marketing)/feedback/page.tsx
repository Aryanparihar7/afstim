import type { Metadata } from "next";

import { FeedbackForm } from "@/features/feedback/components/feedback-form";

export const metadata: Metadata = {
  title: "Feedback — Afstim",
  description: "Tell us what's broken, confusing, or missing.",
};

export default function FeedbackPage() {
  return (
    <section className="mx-auto max-w-[720px] px-4 py-16 sm:px-6 sm:py-24">
      <h1 className="text-[36px] font-medium tracking-[-0.02em] text-text">
        Feedback
      </h1>
      <p className="mt-3 max-w-[42ch] text-[15px] leading-[1.65] text-muted">
        Tell us what&rsquo;s wrong. Under 20 seconds, no account needed.
      </p>
      <div className="mt-8">
        <FeedbackForm />
      </div>
    </section>
  );
}
