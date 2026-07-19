# Afstim — Agent Rules

## Source of truth
1. This file
2. PLAN.md
3. docs/23_Authentication_Blueprint.md, docs/25_Implementation_Standards.md, docs/07A_DESIGN_LANGUAGE.md
Conflict → higher number in this list loses. Silence → STOP AND ASK.

## Locked versions
{
  "name": "afstim",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "postinstall": "prisma generate"
  },
  "dependencies": {
    "@auth/prisma-adapter": "^2.11.2",
    "@neondatabase/serverless": "^1.1.0",
    "@node-rs/argon2": "^2.0.2",
    "@prisma/adapter-neon": "^7.8.0",
    "@prisma/client": "^7.8.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^1.25.0",
    "next": "16.2.10",
    "next-auth": "^5.0.0-beta.31",
    "radix-ui": "^1.6.2",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "resend": "^6.17.2",
    "tailwind-merge": "^3.6.0",
    "ws": "^8.21.1",
    "zod": "^4.4.3"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@types/ws": "^8.18.1",
    "eslint": "^9",
    "eslint-config-next": "16.2.10",
    "prisma": "^7.8.0",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}


## Never do these
- Never add a dependency not already in package.json. Ask.
- Never upgrade a package.
- Never change prisma/schema.prisma outside a task that explicitly says to.
- Never import Prisma outside features/*/repositories/.
- Never add a check type beyond the seven in PLAN.md §7.
- Never add a route not in PLAN.md §10.
- Never use a hex colour, px value, or font not in PLAN.md §5.
- Never add: Docker, Redis, tRPC, GraphQL, a state library, CSS-in-JS, a UI kit
  other than shadcn/ui, an ORM other than Prisma, an auth lib other than Auth.js.
- Never add analytics SDKs, error trackers, or chat widgets.
- Never build: browser IDE, Monaco, in-browser terminal, payments, reputation,
  builder level, leaderboards, community, resume builder, portfolio, OAuth,
  light theme, notifications system, global search, admin CMS for missions.
- Never write a deployment step you have not verified. If you are unsure whether a
  dashboard menu, CLI flag, or config key exists as described, say so and stop.
  A confident wrong instruction in a mission costs a learner hours.
- Never invent product behaviour that is not documented. Record the idea, don't build it.
- Never mark a task complete without running the verification command.

## Always do these
- TypeScript strict. No `any`. No `@ts-ignore`.
- Zod-validate every API input and every mission frontmatter file.
- Layering: UI → Route Handler → Service → Repository → Prisma. Handlers stay thin.
- Every API response: { ok: true, data } or { ok: false, error: { code, message } }.
- Server Components by default. "use client" only for state, effects, or browser APIs.
- Files kebab-case. Components PascalCase. Constants UPPER_SNAKE_CASE.
- Files < 300 lines. Functions < 50 lines.
- Every user-facing string: sentence case, active voice, says what happens next.
- Errors never expose internals. Never log passwords, tokens, cookies, or secrets.

## Per-task protocol
1. Restate the task and the acceptance criteria in one sentence.
2. List the exact files you will create or modify. Wait if the list exceeds 8 files.
3. Implement.
4. Run: `npx tsc --noEmit && npm run lint && npm run build`
5. Report: files changed, how to verify by hand, anything you were unsure about.

## When unsure
Stop. Ask one specific question. Do not guess. Do not build "a reasonable default."
A wrong guess costs more to unwind than a question costs to answer.
