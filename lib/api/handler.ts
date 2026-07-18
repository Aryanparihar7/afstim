import { ApiException, ERROR_CODES } from "@/lib/api/errors";
import { fail } from "@/lib/api/response";

type RouteHandler<Args extends unknown[]> = (
  ...args: Args
) => Promise<Response> | Response;

export function apiHandler<Args extends unknown[]>(
  handler: RouteHandler<Args>
): RouteHandler<Args> {
  return async (...args: Args) => {
    try {
      return await handler(...args);
    } catch (error) {
      console.error(error);

      if (error instanceof ApiException) {
        return fail(error.code, error.message, error.status, error.field);
      }

      return fail("INTERNAL", ERROR_CODES.INTERNAL.message, ERROR_CODES.INTERNAL.status);
    }
  };
}
