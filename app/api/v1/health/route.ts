import { apiHandler } from "@/lib/api/handler";
import { ApiException } from "@/lib/api/errors";
import { ok } from "@/lib/api/response";
import { prisma } from "@/lib/prisma";

export const GET = apiHandler(async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    throw new ApiException("UPSTREAM_UNAVAILABLE", "Database is not reachable.");
  }

  return ok({
    db: "ok",
    commit: process.env.VERCEL_GIT_COMMIT_SHA ?? "local",
  });
});
