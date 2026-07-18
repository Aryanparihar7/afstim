export const ERROR_CODES = {
  UNAUTHENTICATED: { status: 401, message: "You need to sign in to do that." },
  FORBIDDEN: { status: 403, message: "You don't have permission to do that." },
  NOT_FOUND: { status: 404, message: "That doesn't exist." },
  VALIDATION_FAILED: { status: 400, message: "Check your input and try again." },
  RATE_LIMITED: { status: 429, message: "Too many requests. Try again in a moment." },
  CONFLICT: { status: 409, message: "That already exists." },
  UPSTREAM_UNAVAILABLE: {
    status: 503,
    message: "A service we depend on is unavailable. Try again in a moment.",
  },
  INTERNAL: {
    status: 500,
    message: "Something went wrong on our side. Try again in a moment.",
  },
} as const;

export type ErrorCode = keyof typeof ERROR_CODES;

export class ApiException extends Error {
  code: ErrorCode;
  status: number;
  field?: string;

  constructor(code: ErrorCode, message?: string, field?: string) {
    super(message ?? ERROR_CODES[code].message);
    this.code = code;
    this.status = ERROR_CODES[code].status;
    this.field = field;
  }
}
