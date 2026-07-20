import { z } from "zod";

import {
  getCliTokens,
  issueCliToken,
  revokeUserCliToken,
} from "@/features/auth/services/cli-token-service";
import { apiHandler } from "@/lib/api/handler";
import { ok } from "@/lib/api/response";
import { parseBody } from "@/lib/api/validate";
import { requireActive } from "@/lib/auth/guards";

const revokeSchema = z.object({
  id: z.string().min(1),
});

export const GET = apiHandler(async () => {
  const session = await requireActive();
  const tokens = await getCliTokens(session.user.id);
  return ok({ tokens });
});

export const POST = apiHandler(async () => {
  const session = await requireActive();
  const token = await issueCliToken(session.user.id);
  return ok({ token }, 201);
});

export const DELETE = apiHandler(async (req: Request) => {
  const session = await requireActive();
  const { id } = await parseBody(req, revokeSchema);
  await revokeUserCliToken(session.user.id, id);
  return ok({ revoked: true });
});
