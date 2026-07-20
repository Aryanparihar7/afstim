import { requireCliAuth } from "@/features/auth/services/cli-token-service";
import { apiHandler } from "@/lib/api/handler";
import { ok } from "@/lib/api/response";

export const GET = apiHandler(async (req: Request) => {
  const auth = await requireCliAuth(req);
  return ok({ email: auth.email, name: auth.name });
});
