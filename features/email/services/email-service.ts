import { Resend } from "resend";

import { env } from "@/lib/env";

// RESEND_API_KEY / EMAIL_FROM are optional in lib/env.ts (nothing needed
// them before this module). lib/env.ts isn't in this module's file list,
// so the requirement is enforced here instead, at the point of use.
function getClient(): { resend: Resend; from: string } {
  if (!env.RESEND_API_KEY || !env.EMAIL_FROM) {
    throw new Error(
      "RESEND_API_KEY and EMAIL_FROM must be set to send email. Check .env against .env.example."
    );
  }
  return { resend: new Resend(env.RESEND_API_KEY), from: env.EMAIL_FROM };
}

function siteUrl(): string {
  return env.AFSTIM_PUBLIC_URL ?? env.AUTH_URL;
}

export async function sendVerificationEmail(
  to: string,
  code: string,
  name: string | null = null
): Promise<void> {
  const { resend, from } = getClient();

  const { error } = await resend.emails.send({
    from,
    to,
    subject: "Verify your email for Afstim",
    text: `Hyy ${name || "there"}!,\n\nEnter this code to confirm this is you. It expires in 15 minutes.\n\n${code}\n\nIf you didn't request this, ignore this email.`,
  });

  if (error) {
    throw new Error(`Failed to send verification email: ${error.message}`);
  }
}

export async function sendAccountExistsEmail(to: string, name: string | null = null): Promise<void> {
  const { resend, from } = getClient();
  const link = `${siteUrl()}/login`;

  const { error } = await resend.emails.send({
    from,
    to,
    subject: "Welcome back! or Someone tried to register with your email",
    
    text: `Hyy ${name || "there"}!,\n\nSomeone just tried to create an Afstim account with this email address. If that was you, you already have an account — sign in instead.\n\n${link}`,
  });

  if (error) {
    throw new Error(`Failed to send account-exists email: ${error.message}`);
  }
}
