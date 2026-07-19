import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import "next-auth/jwt";
import { z } from "zod";

import authConfig from "@/auth.config";
import {
  findUserByEmail,
  prismaAdapter,
} from "@/features/auth/repositories/user-repository";
import { verifyPassword } from "@/features/auth/services/password-service";
import { env } from "@/lib/env";

declare module "next-auth" {
  interface Session {
    user: { id: string } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sessionToken?: string;
  }
}

const credentialsSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

const SESSION_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;
const REFRESH_THRESHOLD_MS = 24 * 60 * 60 * 1000;

/**
 * Auth.js refuses `session.strategy: "database"` when Credentials is the
 * only provider (verified in @auth/core's own assertConfig — it 500s every
 * request otherwise). So the config below uses "jwt", but the JWT is kept
 * deliberately thin: just a pointer (`sessionToken`) to a real row in the
 * `Session` table, created and checked here by hand. The database row is
 * the actual authority — delete it and the next request is rejected, same
 * as a native database session would behave. This is what ADR-008's
 * "revocable, database-backed sessions" means in practice under this
 * constraint.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: prismaAdapter,
  secret: env.AUTH_SECRET,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(rawCredentials) {
        const parsed = credentialsSchema.safeParse(rawCredentials);
        if (!parsed.success) return null;

        const user = await findUserByEmail(parsed.data.email);
        const isValid = await verifyPassword(
          parsed.data.password,
          user?.passwordHash ?? null
        );

        // Identical shape, identical timing either way — never signal
        // which of "no such user" or "wrong password" it was.
        if (!user || !isValid) return null;

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        const sessionToken = crypto.randomUUID();
        await prismaAdapter.createSession?.({
          sessionToken,
          userId: user.id,
          expires: new Date(Date.now() + SESSION_MAX_AGE_MS),
        });
        token.sessionToken = sessionToken;
        token.sub = user.id;
        return token;
      }

      if (!token.sessionToken) return null;

      const result = await prismaAdapter.getSessionAndUser?.(
        token.sessionToken
      );
      if (!result || result.session.expires < new Date()) return null;

      const remainingMs = result.session.expires.getTime() - Date.now();
      if (remainingMs < SESSION_MAX_AGE_MS - REFRESH_THRESHOLD_MS) {
        await prismaAdapter.updateSession?.({
          sessionToken: token.sessionToken,
          expires: new Date(Date.now() + SESSION_MAX_AGE_MS),
        });
      }

      return token;
    },
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  events: {
    async signOut(message) {
      const sessionToken =
        "token" in message ? message.token?.sessionToken : undefined;
      if (sessionToken) {
        await prismaAdapter.deleteSession?.(sessionToken);
      }
    },
  },
});
