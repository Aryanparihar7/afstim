import type { NextAuthConfig } from "next-auth";

const THIRTY_DAYS_SECONDS = 30 * 24 * 60 * 60;
const ONE_DAY_SECONDS = 24 * 60 * 60;

// Edge-safe config only — no Prisma, no Argon2. Providers with Node-only
// authorize() logic (and the callbacks that touch the database) are added
// in auth.ts. This split exists so a future middleware.ts can import this
// file alone without pulling in Node-only dependencies.
export default {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: THIRTY_DAYS_SECONDS,
    updateAge: ONE_DAY_SECONDS,
  },
  providers: [],
} satisfies NextAuthConfig;
