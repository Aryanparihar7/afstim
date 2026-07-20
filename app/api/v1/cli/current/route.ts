import { requireCliAuth } from "@/features/auth/services/cli-token-service";
import { getCliCurrentMission } from "@/features/validation/services/check-plan-service";
import { apiHandler } from "@/lib/api/handler";
import { ok } from "@/lib/api/response";

export const GET = apiHandler(async (req: Request) => {
  const auth = await requireCliAuth(req);
  const data = await getCliCurrentMission(auth.userId);
  return ok(data);
});
