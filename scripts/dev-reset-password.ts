/**
 * Dev-only. Not wired into any page or API route — terminal use only.
 * Usage: npx tsx scripts/dev-reset-password.ts <email> <newPassword>
 */
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

import { hashPassword } from "@/features/auth/services/password-service";
import {
  findUserByEmail,
  updatePasswordHashByEmail,
} from "@/features/auth/repositories/user-repository";

async function main() {
  const [email, newPassword] = process.argv.slice(2);
  if (!email || !newPassword) {
    console.error("Usage: npx tsx scripts/dev-reset-password.ts <email> <newPassword>");
    process.exit(1);
  }

  const user = await findUserByEmail(email);
  if (!user) {
    console.error(`No user found with email ${email}`);
    process.exit(1);
  }

  const passwordHash = await hashPassword(newPassword);
  await updatePasswordHashByEmail(email, passwordHash);

  console.log(`Password reset for ${email} (user ${user.id})`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
