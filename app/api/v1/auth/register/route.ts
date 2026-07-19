import { registerUser } from "@/features/auth/services/registration-service";
import { registerSchema } from "@/features/auth/validators/register-schema";
import { apiHandler } from "@/lib/api/handler";
import { ok } from "@/lib/api/response";
import { parseBody } from "@/lib/api/validate";

export const POST = apiHandler(async (req: Request) => {
  const input = await parseBody(req, registerSchema);
  await registerUser(input);
  return ok({ registered: true });
});
