import { NextResponse } from "next/server";

export type ApiSuccess<T> = { ok: true; data: T };
export type ApiError = {
  ok: false;
  error: { code: string; message: string; field?: string };
};

export function ok<T>(data: T, status = 200): Response {
  return NextResponse.json<ApiSuccess<T>>({ ok: true, data }, { status });
}

export function fail(
  code: string,
  message: string,
  status: number,
  field?: string
): Response {
  return NextResponse.json<ApiError>(
    { ok: false, error: { code, message, ...(field ? { field } : {}) } },
    { status }
  );
}
