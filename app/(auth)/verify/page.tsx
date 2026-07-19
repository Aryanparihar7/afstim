import { readPendingVerificationEmail } from "@/features/auth/services/verification-service";

import { VerifyForm } from "./verify-form";

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const pendingEmail = await readPendingVerificationEmail();
  const { email: fallbackEmail } = await searchParams;

  return <VerifyForm email={pendingEmail ?? fallbackEmail ?? null} />;
}
