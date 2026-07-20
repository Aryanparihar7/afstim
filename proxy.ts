import NextAuth from "next-auth";
import { NextResponse } from "next/server";

import authConfig from "@/auth.config";

// Edge-safe: reads the JWT's role/accessStatus/emailVerified claims
// directly, no Prisma call. See the comment on authConfig for why this
// has to stay a separate, lighter NextAuth instance from `@/auth`.
const { auth } = NextAuth(authConfig);

const PUBLIC_EXACT = new Set(["/", "/feedback"]);
const PUBLIC_PREFIXES = ["/verify"];
const GUEST_ONLY = new Set(["/login", "/register"]);

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_EXACT.has(pathname)) return true;
  return PUBLIC_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  if (GUEST_ONLY.has(pathname)) {
    // Only a fully verified session counts as "logged in" here — otherwise
    // an unverified session would bounce forever between /login and the
    // (app) gate below, which redirects unverified sessions back to /login.
    if (session?.user?.emailVerified) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (!session?.user || session.user.role !== "ADMIN") {
      const url = req.nextUrl.clone();
      url.pathname = "/admin-route-not-found";
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  // Everything else is the (app) group.
  if (!session?.user || !session.user.emailVerified) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/pending") {
    if (session.user.accessStatus === "ACTIVE") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  if (session.user.accessStatus !== "ACTIVE") {
    return NextResponse.redirect(new URL("/pending", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.[\\w]+$).*)"],
};
