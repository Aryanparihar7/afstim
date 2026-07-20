import { requireCliAuth } from "@/features/auth/services/cli-token-service";
import { submitCheckResults } from "@/features/validation/services/result-service";
import { resultSchema } from "@/features/validation/validators/result-schema";
import { apiHandler } from "@/lib/api/handler";
import { ok } from "@/lib/api/response";
import { parseBody } from "@/lib/api/validate";

export const POST = apiHandler(async (req: Request) => {
  const auth = await requireCliAuth(req);
  const input = await parseBody(req, resultSchema);
  const data = await submitCheckResults(auth.userId, input);
  return ok(data);
});
