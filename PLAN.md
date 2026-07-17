# Afstim — Implementation Plan v0.1

**Status:** Approved for build
**Supersedes:** All conflicting content in docs 00–25
**Audience:** A coding agent (Claude Code / Antigravity) + a non-coding founder reviewing output

---

## 0. How to use this document

**Founder:** Put this file at the repo root as `PLAN.md`. Copy Section 13 into `AGENTS.md` at the repo root. Give the agent **one phase at a time** from Section 12. Never say "build Afstim." Say "Do Phase 3, Task 3.2." After each phase, run the Verification Gate yourself before moving on.

**Agent:** This document is the source of truth. Where it conflicts with docs 00–25, **this document wins**. Where it is silent, **stop and ask** — do not invent. Read `AGENTS.md` before every task.

---

## 1. What Afstim v0.1 actually is

> A guided path that takes a person who can code but has never shipped, and gets them to a live URL with HTTPS, a real database, and a deploy pipeline — in about 10 missions, verified by a CLI, with an AI mentor that knows their exact situation.

**One journey. Ten missions. One CLI. One mentor. That is the product.**

The learner writes code **on their own machine, in their own VS Code**. Afstim is not an editor. Afstim is the map, the referee, and the mentor.

### Why no browser IDE

The docs specify a Monaco editor + in-browser terminal + preview. **That is cut, permanently, for v0.1.** Three reasons, in order of importance:

1. **It costs money we do not have.** A browser IDE means a sandboxed container per active learner. That is the single largest line item in a business with a ₹30–50k total budget. It is not a hard build — it is an impossible one.
2. **It is a remote-code-execution surface.** Free trial + arbitrary code execution + network access = crypto miners within weeks. We would be running an attack surface we cannot staff.
3. **It contradicts the thesis.** Afstim teaches how software is *really* shipped. Real shipping happens in a local terminal with real Git. A worse VS Code in a browser is the most off-thesis thing we could build.

The CLI is cheaper, safer, faster to build, **and more authentic**. This is not a compromise. It is the better product.

### The v0.1 surface, complete

| Ships in v0.1 | Explicitly not in v0.1 |
|---|---|
| Landing page (premium, monochrome) | Browser IDE / Monaco / terminal / preview |
| Email + password auth, email verification | Google / GitHub OAuth |
| One journey, ten missions (MDX files) | Admin CMS, journey builder, mission CRUD UI |
| `afstim` CLI: `login`, `check`, `explain`, `status` | Payments, Razorpay, subscriptions, trials |
| Server-side verification of live URLs | Reputation, Builder Level, leaderboards |
| Dashboard: current mission, progress | Personalized AI roadmap generation |
| AI Mentor (pull-only, capped) | Competency assessments / skip-ahead |
| Reflection capture | Notifications system, global search |
| Feedback form | Light theme, mobile mission flow |

---

## 2. Locked decisions (ADR-013 — Reconciliation)

The 33 existing docs contradict each other. These are resolved. Delete the losers from the repo.

| # | Decision | Kills |
|---|---|---|
| 1 | Product name is **Afstim**. | "ShipLab" everywhere |
| 2 | Design language is **`07A_DESIGN_LANGUAGE.md`** + Section 5 here | `07_Design_System.md` — delete |
| 3 | Stack is **Next.js App Router + TypeScript only**. No Python. | `08_Backend_Architecture.md` FastAPI — delete |
| 4 | Layering is **UI → Route Handler → Service → Repository → Prisma** (doc 25) | Any FastAPI service layer |
| 5 | Auth is **Auth.js v5 + Prisma + Argon2id, email/password only** (doc 23 ADRs) | Clerk; PRD §19's "Google + GitHub" |
| 6 | Roles are exactly **LEARNER, ADMIN**. Two. | Support / Moderator / Content Manager / Super Admin |
| 7 | **No Redis, no Upstash.** Rate limit with a DB counter. | ADR-010 |
| 8 | **No monorepo, no `packages/`.** Single Next.js app + one `cli/` folder. | Doc 21's monorepo |
| 9 | Missions are **content files in the repo**, not database rows. | Mission Library CRUD, doc 16 |
| 10 | AI Mentor is **pull-only** (learner asks). Not event-triggered. | PRD §29 auto-triggers on Run/Save/Error |
| 11 | Learner's journey target stack is **Next.js + Postgres + Vercel**. | FastAPI/Railway/Docker curriculum |
| 12 | **Dark theme only** in v0.1. | Doc 07's light+dark |
| 13 | Roadmap is Section 12 of this doc. | Doc 19 (11 phases) and doc 22 (12 sprints, incl. Community) |
| 14 | Scope: no Community, no Resume Builder, no Portfolio module. | Doc 22 Sprint 09; doc 25's scope list |

**Missing files referenced by doc 25 (`22_Design_Language.md`, `24_Authentication_Architecture_Audit.md`) do not exist. Remove those dependency lines.**

---

## 3. Technology

**Runtime & framework**
- Next.js, App Router, TypeScript strict, React Server Components default
- Tailwind CSS + shadcn/ui
- Prisma ORM + PostgreSQL (Neon, free tier)
- Auth.js v5 (NextAuth), Credentials provider, database sessions, Argon2id (`@node-rs/argon2`)
- Zod for all validation
- MDX for mission content (`next-mdx-remote` or `@next/mdx` — agent picks one and records it)
- Resend for transactional email (free tier)
- Anthropic SDK for the mentor
- Vercel for hosting

**CLI**
- Node + TypeScript, distributed via `npx afstim@latest`
- `commander` (args), `execa` (running commands), `picocolors` (output). Nothing else.

**Version policy — read carefully.**
Do **not** trust any version number written in this document or in docs 00–25. Versions move. Instead:

1. Scaffold with `npx create-next-app@latest`.
2. Install dependencies at their current stable versions.
3. **Immediately** write the exact installed versions of every dependency into `AGENTS.md` under `## Locked versions`.
4. From that moment: **never upgrade, never change a major version, never swap a library** without an explicit instruction from the founder.

This single rule prevents most agent drift.

**Explicitly banned:** Docker, Kubernetes, Redis, tRPC, GraphQL, Turborepo/Nx, state libraries (Redux/Zustand/Jotai), any CSS-in-JS, any component library other than shadcn/ui, any ORM other than Prisma, any auth library other than Auth.js.

---

## 4. Repository structure

```
afstim/
├── AGENTS.md                  # agent rules — Section 13
├── PLAN.md                    # this file
├── .env.example
├── prisma/
│   └── schema.prisma
├── content/
│   └── journeys/
│       └── ship-your-first-app/
│           ├── journey.yaml
│           └── missions/
│               ├── 01-set-up-your-machine.mdx
│               └── ...
├── cli/                       # the afstim CLI (own package.json)
│   ├── package.json
│   └── src/
└── src/
    ├── app/
    │   ├── (marketing)/       # /, /pricing, /feedback
    │   ├── (auth)/            # /login, /register, /verify
    │   ├── (app)/             # /dashboard, /journey, /mission/[slug]
    │   └── api/
    │       └── v1/
    ├── components/
    │   ├── ui/                # shadcn primitives
    │   └── afstim/            # our components
    ├── features/
    │   ├── auth/
    │   ├── content/
    │   ├── progress/
    │   ├── validation/
    │   ├── mentor/
    │   └── feedback/
    └── lib/
```

Every folder under `features/` follows doc 25: `services/`, `repositories/`, `validators/`, `dto/`, `mappers/`, `types/`, `errors/`.

**Rule:** only `repositories/` may import Prisma. Ever. If a Route Handler or a component imports Prisma, the task is rejected.

---

## 5. Design system — monochrome

The brief is monochrome, clean, breathable, premium. Follow it exactly. **There is no brand hue.** Primary action = white on black. That constraint *is* the identity.

### Direction

The product's real world is the terminal. So the terminal is the design language — not as decoration, but as structure. **Mono type does the structural work** (eyebrows, labels, status, numbers, check names). Sans does the reading work (headings, prose). That encodes something true: this is a CLI-first product for people who are about to live in a terminal.

**Signature element:** the check list. A left-aligned, monospaced, live-ticking list of checks resolving from pending → pass. It is the emotional core of the product (the moment you learn you actually shipped), so it is the one thing that gets motion, and everything else stays silent.

### Tokens — `src/app/globals.css`

Dark only. No light theme in v0.1.

```css
:root {
  /* surfaces — near-black, not pure black */
  --bg:              #0A0A0B;
  --surface:         #111113;
  --surface-raised:  #17171A;
  --border:          #202024;
  --border-strong:   #2C2C32;

  /* text */
  --text:            #EFEFF1;   /* headings, primary */
  --text-muted:      #8B8B93;   /* body, secondary */
  --text-subtle:     #5A5A62;   /* captions, disabled */

  /* action — monochrome: white IS the accent */
  --action-bg:       #EFEFF1;
  --action-fg:       #0A0A0B;
  --action-hover:    #FFFFFF;

  /* functional — desaturated, used ONLY for check state */
  --pass:            #7FB08A;
  --fail:            #C97B7B;
  --pending:         #5A5A62;

  /* radius */
  --r-sm: 6px;  --r-md: 10px;  --r-lg: 14px;

  /* motion */
  --t-fast: 120ms;  --t-base: 200ms;
  --ease: cubic-bezier(0.16, 1, 0.3, 1);
}
```

**Functional colours appear on check states and nowhere else.** Not on buttons, not on badges, not on links. If green appears outside a check result, it is a bug.

### Type

- **Sans (headings + prose):** Instrument Sans — via `next/font/google`
- **Mono (labels, status, checks, numbers, code):** JetBrains Mono — via `next/font/google`

Do **not** use Inter or Geist. Both are the default look for this category; Geist in particular makes us read as a Vercel clone.

| Role | Face | Size / weight / tracking |
|---|---|---|
| Display (hero) | Sans | 56px / 500 / -0.03em |
| H1 | Sans | 36px / 500 / -0.02em |
| H2 | Sans | 24px / 500 / -0.01em |
| Body | Sans | 15px / 400 / 0 / line-height 1.65 |
| Eyebrow / label | **Mono** | 11px / 500 / 0.08em / uppercase |
| Check row | **Mono** | 13px / 400 |
| Code | Mono | 13px / 400 |

Prose max width: **68 characters**. Never full-bleed text.

### Layout & space

4px base. Use only: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128.
Page max width 1120px. Content column 720px. Section rhythm: 96px desktop / 64px mobile.

### Motion

Only these move: check row resolving, page transition fade, disclosure expand, button press. Duration 120–200ms. **Respect `prefers-reduced-motion` — required, not optional.**

Banned: gradients (except one near-invisible radial in the hero, ≤4% opacity), glassmorphism, blur backdrops, glow, shadows above `0 1px 2px rgba(0,0,0,0.4)`, decorative icons, emoji in UI, animated illustrations.

### Copy rules

- Sentence case everywhere. Never Title Case buttons.
- Buttons name the outcome: "Start the journey", not "Get started". "Send feedback", not "Submit".
- Same verb across the flow: the button says "Verify", the result says "Verified".
- Errors state what happened and what to do. No apology, no vagueness.
- Empty states are invitations: "No missions verified yet. Mission 1 takes about 20 minutes."

---

## 6. Data model — `prisma/schema.prisma`

**The database stores people and progress. It does not store learning content.**

```prisma
generator client { provider = "prisma-client-js" }
datasource db { provider = "postgresql"; url = env("DATABASE_URL") }

enum Role          { LEARNER ADMIN }
enum AccessStatus  { PENDING ACTIVE REVOKED }
enum MissionStatus { LOCKED AVAILABLE IN_PROGRESS VERIFIED }
enum CheckState    { PENDING PASS FAIL }

model User {
  id             String        @id @default(cuid())
  email          String        @unique
  passwordHash   String
  name           String?
  emailVerified  DateTime?
  role           Role          @default(LEARNER)
  accessStatus   AccessStatus  @default(PENDING)   // manual gate; no payments in v0.1
  createdAt      DateTime      @default(now())

  aiCallsToday   Int           @default(0)
  aiCallsResetAt DateTime      @default(now())

  sessions       Session[]
  enrollments    Enrollment[]
  progress       MissionProgress[]
  cliTokens      CliToken[]
  submissions    Submission[]
  aiMessages     AiMessage[]
  events         Event[]
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@index([userId])
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  @@unique([identifier, token])
}

model Enrollment {
  id           String    @id @default(cuid())
  userId       String
  journeySlug  String                    // -> content/journeys/<slug>
  startedAt    DateTime  @default(now())
  completedAt  DateTime?
  user         User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([userId, journeySlug])
}

model MissionProgress {
  id             String        @id @default(cuid())
  userId         String
  journeySlug    String
  missionSlug    String
  status         MissionStatus @default(AVAILABLE)
  checkResults   Json          @default("[]")   // [{ id, state, message, at }]
  reflection     String?
  attempts       Int           @default(0)
  firstAttemptAt DateTime?
  verifiedAt     DateTime?
  updatedAt      DateTime      @updatedAt
  user           User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([userId, missionSlug])
  @@index([userId, journeySlug])
}

model CliToken {
  id         String    @id @default(cuid())
  userId     String
  tokenHash  String    @unique          // sha256 of the token; plaintext shown once
  label      String?
  lastUsedAt DateTime?
  createdAt  DateTime  @default(now())
  revokedAt  DateTime?
  user       User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@index([userId])
}

model Submission {                       // learner-declared URLs for server-side checks
  id          String   @id @default(cuid())
  userId      String
  missionSlug String
  kind        String                     // "public_url" | "repo_url"
  value       String
  createdAt   DateTime @default(now())
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@index([userId, missionSlug])
}

model AiMessage {
  id          String   @id @default(cuid())
  userId      String
  missionSlug String?
  role        String                     // "user" | "assistant"
  content     String
  tokensIn    Int      @default(0)
  tokensOut   Int      @default(0)
  createdAt   DateTime @default(now())
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@index([userId, createdAt])
}

model Feedback {
  id        String   @id @default(cuid())
  userId    String?
  category  String                       // bug | idea | confusing | other
  message   String
  email     String?
  createdAt DateTime @default(now())
}

model Event {                            // analytics. cheap, ours, no third party.
  id        String   @id @default(cuid())
  userId    String?
  type      String                       // mission_started | check_run | mission_verified | ...
  payload   Json     @default("{}")
  createdAt DateTime @default(now())
  user      User?    @relation(fields: [userId], references: [id], onDelete: SetNull)
  @@index([type, createdAt])
}
```

**No `Journey` table. No `Mission` table.** Content lives in `content/`. This deletes the entire admin CMS from the build.

---

## 7. Content engine — how missions are made

This was the founder's direct question: *dynamic or static?*

**Answer: static, file-based, version-controlled. Not dynamic. Not database-authored. Not AI-generated at runtime.**

Reasons: no CMS to build; content is reviewable in a PR; validation rules sit next to the prose they describe; a broken mission is a git revert; the agent authors missions as files. "AI-generated personalized roadmap" is theatre when there is one journey — cut it.

### Structure

`content/journeys/ship-your-first-app/journey.yaml`

```yaml
slug: ship-your-first-app
title: Ship your first app
objective: Take an idea from an empty folder to a live, HTTPS URL with a real database.
outcome: A public web app you built, deployed, and can change and redeploy in one command.
estimatedHours: 12
missions:
  - set-up-your-machine
  - create-and-commit
  - push-to-github
  - deploy-to-vercel
  - add-a-database
  - env-vars-in-production
  - build-a-real-feature
  - protect-a-route
  - ship-a-change
  - custom-domain           # optional flex
```

`content/journeys/ship-your-first-app/missions/04-deploy-to-vercel.mdx`

```mdx
---
slug: deploy-to-vercel
order: 4
title: Deploy to Vercel
objective: Get your app onto a public URL that anyone in the world can open.
capability: You can deploy a Next.js app from GitHub to production.
duration: 25
difficulty: beginner
prerequisites: [push-to-github]
optional: false
submissions:
  - kind: public_url
    label: Paste your live URL
    placeholder: https://your-app.vercel.app
checks:
  - id: build-passes
    type: command_succeeds
    label: Your app builds without errors
    run: npm run build
    hint: Read the first error in the output. That is the real one. The rest are echoes.
  - id: site-is-live
    type: remote_http_ok
    label: Your URL responds from the public internet
    from: submission:public_url
    expectStatus: 200
    hint: Open the URL in your phone's browser with wifi off. If it fails there, it isn't public yet.
  - id: https-valid
    type: remote_https_valid
    label: HTTPS is working with a valid certificate
    from: submission:public_url
    hint: Vercel issues this automatically. If it fails, the deploy probably hasn't finished.
reflection:
  - Your app is now running somewhere that isn't your laptop. What has to be true about your code for that to work?
  - If you closed your laptop right now, would the site stay up? Why?
---

## Why this mission exists

...prose, short, practical...

## What you're going to do

...steps...
```

### Check types — CLOSED SET

The agent may implement **exactly these seven**. Adding an eighth requires founder approval.

| Type | Runs | Definition |
|---|---|---|
| `command_succeeds` | CLI (local) | Run `run`. Pass if exit code 0. Optional `expectStdoutMatches` regex. |
| `file_exists` | CLI (local) | Glob `path` relative to project root. Pass if ≥1 match. |
| `file_contains` | CLI (local) | Regex `pattern` against `path`. Pass on match. |
| `http_ok` | CLI (local) | GET `url` (localhost). Pass on `expectStatus`. Optional `expectJsonPath`. |
| `remote_http_ok` | **Server** | GET the URL from a submission. Pass on `expectStatus`. |
| `remote_https_valid` | **Server** | TLS handshake + cert validity + not self-signed. |
| `remote_repo_exists` | **Server** | GitHub public API: repo exists, has ≥1 commit. |

### The validation design rule (this is the product)

> **Check outcomes, never names.**

Never assert that a function is called `healthCheck`. Assert that `GET /api/health` returns 200. Never assert a file is called `db.ts`. Assert that a query runs.

Over-strict checks make learners rage-quit; that is the #1 retention risk in this product. Loose checks make the promise a lie. Outcome-checking is the only path between them. Every check must be phrased so that **two learners with different code but working apps both pass.**

### Async checks (DNS)

`remote_*` checks may return `PENDING` (e.g. DNS propagating). A pending check **never blocks** — the mission stays open, the UI says "Still propagating. This can take up to a few hours. You can come back to this." A background re-check runs on next page load. No mission is ever hard-blocked on a third party's clock.

### Cheating

Learners can fake local checks. **Accept it. Build no anti-cheat.** Server-side checks cover the claims that matter (the site is live, HTTPS works, the repo exists). Faking a check only cheats yourself out of the thing you paid for. Do not build tamper-proofing — it costs weeks and protects nothing.

### Who writes the ten missions

The founder. From his own log while doing Phase 1 and Phase 9. **The missions are his real errors.** The agent formats them into MDX and writes the checks. The agent must never invent a deployment step it cannot verify — see `AGENTS.md`.

---

## 8. The CLI — `afstim`

```
npx afstim@latest login       # paste token from /settings/cli → saved to ~/.afstim/config.json
npx afstim@latest status      # what mission am I on, what's left
npx afstim@latest check       # run current mission's local checks, POST results
npx afstim@latest explain     # send last failure to the mentor, print the reply
```

**`check` flow**
1. Read token from `~/.afstim/config.json`. If absent → "Run `npx afstim login` first."
2. `GET /api/v1/cli/current` → `{ journeySlug, missionSlug, checks: [...] }` (local checks only; server checks are stripped)
3. Run each local check in the current working directory, in order, with a **20s timeout each**.
4. Print live, monospaced:
   ```
   ▸ Mission 4 — Deploy to Vercel

     ✓ Your app builds without errors
     ✗ Your URL responds from the public internet
       → Open the URL in your phone's browser with wifi off.

     1 of 3 passed. Run `npx afstim explain` if you're stuck.
   ```
5. `POST /api/v1/cli/results` with `{ missionSlug, results: [{id, state, message}] }`
6. Server runs the `remote_*` checks, merges, decides `VERIFIED`, returns final state.

**Security:** the CLI runs commands **the mission file declares**, on the learner's own machine. It never executes strings from the API response body beyond the declared `run` field of a known check type. The API is authenticated by a hashed bearer token. Rate limit: 30 check runs/hour/user, counted in the DB.

**The CLI never writes to the learner's project. It only reads and runs.**

---

## 9. AI Mentor

### Cost reality first

Doc 11 / PRD §29 fire the AI on Run, Save, Deploy, and every Error. A beginner produces dozens of errors an hour. At a ₹10k AI budget, that model is bankrupt before the first paying user. **It is cut.**

### The model: pull, not push

The mentor speaks **only when asked** — the learner clicks "Ask the mentor" in the mission page, or runs `npx afstim explain`. This is cheaper *and* better pedagogy: they attempt first, then ask.

### What the mentor actually sells

Not restraint. The learner has ChatGPT in the next tab; a mentor that withholds answers just loses to alt-tab and breeds resentment. **The mentor sells context.** It already knows: which mission, which check failed, the exact error text, what they've already completed, what mission comes next. That is something the next tab cannot do.

So: **answer the question, then tie it back to the mission and the next step.** Be a senior engineer sitting next to them, not a quiz master.

### Request assembly — server side, capped

Context (built in `features/mentor/services/context.ts`, hard cap **6,000 tokens**):
- mission slug, title, objective (from MDX frontmatter)
- the failing check's `id`, `label`, `hint`
- learner-supplied error text — **truncated to 2,000 chars**
- last 4 turns of this mission's conversation
- learner's completed-mission slugs (names only)

Never send: whole files, whole repos, env vars, tokens, the learner's password hash.

### Model and limits

- Model: **`claude-haiku-4-5`** for everything. No escalation tier in v0.1.
- `max_tokens: 700`
- **Hard cap: 25 mentor calls/day/user**, via `User.aiCallsToday` + `aiCallsResetAt`. On cap: "You've hit today's mentor limit. It resets at midnight." Not an error — a boundary.
- Log `tokensIn`/`tokensOut` on every call to `AiMessage`. **Founder must be able to see spend per user by day.** Build `/admin/ai` as a plain table in Phase 7.
- If the Anthropic API fails: the mission page still works, the mentor panel shows "The mentor is unavailable right now. Your work is unaffected." Learning never blocks on AI.

### System prompt (use verbatim)

```
You are the Afstim mentor. You help people who can already code but have never
deployed anything ship their first real app.

You are given the learner's exact situation: their current mission, the check that
failed, and their error text. Use it. Never ask them to re-explain context you have.

How you answer:
- Answer the actual question first. Do not withhold the answer to make a teaching
  point. They have other AI tools; being useful is why they are here.
- Then explain why it happened, in one or two sentences, in terms of what is
  running where.
- Then tell them the single next thing to do.
- If their error text does not match the mission they are on, say so plainly.
- If you do not know, say you do not know. Never invent a deploy step, a CLI flag,
  a dashboard menu path, or a config key. A confident wrong answer here costs them
  hours and costs us their trust.

Tone: a senior engineer sitting next to them. Plain words. No cheerleading, no
apologising, no emoji. Short.
```

### What the founder must supply

| Key | Where | Cost |
|---|---|---|
| `ANTHROPIC_API_KEY` | console.anthropic.com → API keys | Start with **$10 (~₹850)** of credit. Nothing else. |

Set a **spend limit in the Anthropic console**. Not optional.

---

## 10. Route map

**Pages**

| Route | Auth | Purpose |
|---|---|---|
| `/` | public | Landing |
| `/feedback` | public | Feedback form |
| `/login`, `/register`, `/verify`, `/verify/[token]` | public | Auth |
| `/dashboard` | learner | Current mission + progress |
| `/journey/ship-your-first-app` | learner | Mission list, locked/available/verified |
| `/mission/[slug]` | learner | Mission content, checks, submissions, reflection, mentor |
| `/settings/cli` | learner | Generate / revoke CLI token |
| `/admin/users` | admin | Grant/revoke access (manual, replaces payments) |
| `/admin/ai` | admin | AI spend per user per day |
| `/admin/events` | admin | Raw funnel table |

**API — all under `/api/v1/`**

| Method | Route | Auth |
|---|---|---|
| POST | `/auth/register` | public |
| POST | `/auth/verify` | public |
| GET | `/cli/current` | CLI token |
| POST | `/cli/results` | CLI token |
| POST | `/cli/explain` | CLI token |
| POST | `/missions/[slug]/submission` | session |
| POST | `/missions/[slug]/reflection` | session |
| POST | `/missions/[slug]/recheck` | session |
| POST | `/mentor/ask` | session |
| POST | `/feedback` | public |

Every response: `{ ok: true, data }` or `{ ok: false, error: { code, message } }`. No exceptions. No stack traces, ever.

---

## 11. Accounts and keys to create (founder, before Phase 1)

| Service | Plan | Cost | Why |
|---|---|---|---|
| GitHub | Free | ₹0 | Repo |
| Vercel | Hobby | ₹0 | Hosting |
| Neon | Free | ₹0 | Postgres |
| Resend | Free (3k/mo) | ₹0 | Verification emails |
| Anthropic | Pay-as-you-go | **~₹850** | Mentor |
| Your domain | owned | ₹0 | Already bought |

**Total to launch: about ₹850.** No ads. No sandbox fleet. No Railway. No Redis.

`.env.example`:
```
DATABASE_URL=
AUTH_SECRET=
AUTH_URL=
RESEND_API_KEY=
EMAIL_FROM=
ANTHROPIC_API_KEY=
AFSTIM_PUBLIC_URL=
```

---

## 12. Build phases

Give the agent **one task at a time**. Do not proceed past a Verification Gate until you personally checked it.

---

### Phase 0 — Reconcile the docs *(founder, 1 hour, no code)*

- Rename every "ShipLab" → "Afstim" in `docs/`.
- Delete `07_Design_System.md`, `08_Backend_Architecture.md`, `19_Development_Roadmap.md`, `22_Product_Development_Roadmap.md`.
- Save this file as `docs/26_Implementation_Plan.md` and `PLAN.md`.
- Add Section 2 (ADR-013) to `23_Authentication_Blueprint.md`.

**Gate:** No file in `docs/` mentions FastAPI, Clerk, Monaco, ShipLab, or Community.

---

### Phase 1 — Foundation, and the founder's first deploy

> **This phase is the product.** You are about to do, for the first time, the exact thing Afstim exists to teach. Keep a raw log — every error verbatim, every dead end, every moment you nearly gave up. `docs/log/phase-1.md`. **That file becomes missions 1–10.** Nothing else in this plan can be written correctly without it.

| Task | Detail |
|---|---|
| 1.1 | `npx create-next-app@latest afstim` — TS, Tailwind, App Router, `src/`. Push to GitHub. |
| 1.2 | Write `AGENTS.md` (Section 13). Record locked versions. |
| 1.3 | Import repo into Vercel. Deploy. Confirm `*.vercel.app` loads. |
| 1.4 | Point your domain at Vercel. Wait for DNS. Confirm HTTPS. |
| 1.5 | Neon project → `DATABASE_URL` into Vercel env vars + `.env`. |
| 1.6 | Prisma init, paste Section 6 schema, `prisma migrate dev --name init`. |
| 1.7 | `/api/v1/health` returns `{ ok: true, data: { db: "ok", commit: <sha> } }`. |
| 1.8 | shadcn/ui init. Fonts + tokens from Section 5 into `globals.css`. |

**Gate (founder, by hand):**
1. `https://<yourdomain>` loads over HTTPS with a padlock. ✅
2. `https://<yourdomain>/api/v1/health` shows `db: "ok"`. ✅
3. Change text on the homepage → `git push` → the live site changes within 2 minutes. ✅
4. `docs/log/phase-1.md` has **at least 15 real errors** in it. ✅

*If gate 4 is empty, you did it too easily or you didn't write it down. The log is the asset.*

---

### Phase 2 — Design system + landing + feedback

| Task | Detail |
|---|---|
| 2.1 | Tokens → Tailwind theme. Ban raw hex in components (ESLint rule). |
| 2.2 | Primitives: `Button`, `Input`, `Card`, `Badge`, `CheckRow`, `Eyebrow`, `Terminal`. |
| 2.3 | `/` landing. |
| 2.4 | `/feedback` + `POST /api/v1/feedback` → `Feedback` table. |
| 2.5 | Responsive to 375px. Keyboard focus visible everywhere. `prefers-reduced-motion` honoured. |

**Landing structure** (only this — no testimonials we don't have, no logos we don't have):

```
eyebrow (mono):   AFSTIM
display:          You can code. You've never shipped.
sub:              Ten missions. Your own editor. A live URL with your name on it.
[Start the journey]  [See the missions]

THE SIGNATURE — a real terminal transcript, checks resolving one by one:
  $ npx afstim check
  ▸ Mission 4 — Deploy to Vercel
    ✓ Your app builds without errors
    ✓ Your URL responds from the public internet
    ✓ HTTPS is working with a valid certificate
    Mission verified.

What you'll have at the end   → the 6 concrete artifacts
The ten missions              → the real list, mono, numbered (it IS a sequence)
How it works                  → your editor / our checks / a mentor who knows the mission
Who this is for               → honest: you know some code, you've never deployed
FAQ
Footer
```

**Gate:** Show 3 people. Ask "what does this do and who is it for?" If they can't answer in one sentence, the hero is wrong. Fix before Phase 3.

---

### Phase 3 — Auth

Follow `23_Authentication_Blueprint.md`. Email + password only.

| Task | Detail |
|---|---|
| 3.1 | Auth.js v5 + Prisma adapter + DB sessions + Argon2id. |
| 3.2 | `/register` → Zod validation → user → verification email via Resend. |
| 3.3 | `/verify/[token]` — single-use, expiring. |
| 3.4 | `/login`, logout, session refresh. |
| 3.5 | Middleware: `(app)` and `/admin` require session + `emailVerified`. `/admin` requires `role: ADMIN`. |
| 3.6 | Failed-login lockout: 5 attempts / 15 min, DB counter. |
| 3.7 | `accessStatus` gate: `PENDING` users see "You're on the list. We'll open your access shortly." |

**Gate:** Register with a real email → receive the mail → verify → land on dashboard. Open `/dashboard` in a logged-out incognito window → redirected to login. Verify link twice → second one fails.

---

### Phase 4 — Content engine + mission pages

| Task | Detail |
|---|---|
| 4.1 | `features/content`: read `content/journeys/**`, parse frontmatter (Zod schema per Section 7), fail the **build** on an invalid mission file. |
| 4.2 | Two placeholder missions to prove the pipeline. |
| 4.3 | `/journey/ship-your-first-app` — list with LOCKED / AVAILABLE / VERIFIED. |
| 4.4 | `/mission/[slug]` — objective, prose, check list (all PENDING), submission inputs, reflection box, mentor panel (stub). |
| 4.5 | `MissionProgress` created on first view. Unlock rule: prerequisites VERIFIED. |

**Gate:** A mission file with a typo in frontmatter **breaks the build with a readable error**. Mission 2 is locked until Mission 1 is verified.

---

### Phase 5 — CLI + validation *(the hard one)*

| Task | Detail |
|---|---|
| 5.1 | `cli/` package. `commander`, `execa`, `picocolors`. Nothing else. |
| 5.2 | `/settings/cli` → generate token, show plaintext **once**, store sha256. |
| 5.3 | `afstim login` → `~/.afstim/config.json` (mode 600). |
| 5.4 | `GET /api/v1/cli/current` — bearer auth, returns local checks only. |
| 5.5 | Local runners: `command_succeeds`, `file_exists`, `file_contains`, `http_ok`. 20s timeout each. |
| 5.6 | `POST /api/v1/cli/results` → persist to `checkResults`. |
| 5.7 | Server runners: `remote_http_ok`, `remote_https_valid`, `remote_repo_exists`. **10s timeout, 3 redirects max, no private IPs / localhost / metadata endpoints (SSRF guard).** |
| 5.8 | Verification service: all non-optional checks PASS **and** reflection non-empty → `VERIFIED`. |
| 5.9 | Live check state on the mission page (poll every 3s while any check is PENDING; stop after 60s). |
| 5.10 | Rate limit: 30 checks/hour/user, DB counter. |

**Gate:**
1. In a scratch folder, `npx afstim check` on Mission 1 → real pass/fail, and the website reflects it within 5 seconds. ✅
2. Submit `http://localhost:3000` as a public URL → **rejected by the SSRF guard**. ✅
3. Submit a dead URL → `remote_http_ok` fails with a human message, not a stack trace. ✅

---

### Phase 6 — Dashboard + progress

| Task | Detail |
|---|---|
| 6.1 | `/dashboard`: one card — current mission, one button "Continue mission". |
| 6.2 | Journey progress: `n of 10 verified`. Mono. That's it. |
| 6.3 | Empty state: "Mission 1 takes about 20 minutes. Start when you have a clear hour." |
| 6.4 | `Event` writes: `mission_started`, `check_run`, `mission_verified`, `mentor_asked`, `reflection_saved`. |

**No reputation. No builder level. No streaks. No confetti.** One button.

**Gate:** Log in → the single most obvious thing on screen is the next action.

---

### Phase 7 — AI Mentor

| Task | Detail |
|---|---|
| 7.1 | `features/mentor`: context builder (6k cap), Anthropic client, `claude-haiku-4-5`. |
| 7.2 | `POST /api/v1/mentor/ask` — session auth, daily cap, log `AiMessage` with token counts. |
| 7.3 | Mentor panel on `/mission/[slug]`. Pre-fills the failing check. Textarea for the error. Not a chat app — a help panel. |
| 7.4 | `afstim explain` → `POST /api/v1/cli/explain` → prints reply in terminal. |
| 7.5 | `/admin/ai` — table: user, date, calls, tokens in/out, **estimated ₹**. |
| 7.6 | Graceful failure: API down → panel says so, page still works. |

**Gate:**
1. Ask 3 real questions. Answers are useful, short, and reference the actual mission. ✅
2. Ask 26 times → capped cleanly at 25. ✅
3. `/admin/ai` shows your spend in rupees. ✅
4. Pull the API key → the mission page still loads and checks still run. ✅

---

### Phase 8 — Admin + access

| Task | Detail |
|---|---|
| 8.1 | `/admin/users` — list, search, flip `accessStatus` PENDING↔ACTIVE↔REVOKED. |
| 8.2 | `/admin/events` — raw table, filter by type. |
| 8.3 | `/admin/feedback` — list, mark read. |

**No payments in v0.1.** A learner pays you by UPI; you flip a switch. Twenty users. That's not a hack — it's the correct amount of engineering for twenty users, and it means no company registration, no Razorpay mandate rules, no RBI e-mandate compliance, before you know anyone will pay at all.

---

### Phase 9 — Write the ten missions *(founder-led, the real work)*

Open `docs/log/phase-1.md`. Turn your errors into missions.

| # | Mission | Capability | Key checks |
|---|---|---|---|
| 1 | Set up your machine | Tools that a real deploy needs | `command_succeeds`: node, git, gh |
| 2 | Create and commit | Git is a safety net, not a chore | `file_exists`, `command_succeeds`: git log |
| 3 | Push to GitHub | Your code lives somewhere that isn't you | `remote_repo_exists` |
| 4 | Deploy to Vercel | **A public URL exists** | `remote_http_ok`, `remote_https_valid` |
| 5 | Add a database | Real data, not a JSON file | `command_succeeds`: a query runs |
| 6 | Env vars in production | Secrets don't live in code | `remote_http_ok` on `/api/health` → `db: ok` |
| 7 | Build a real feature | Form → DB → list, in production | `http_ok` POST then GET |
| 8 | Protect a route | Not everything is public | `http_ok`: 401 anon, 200 authed |
| 9 | Ship a change | Push → live in 2 minutes | commit sha in prod matches HEAD |
| 10 | Custom domain *(optional)* | DNS and HTTPS aren't magic | `remote_https_valid` on their domain |

**Mission 4 is the moment the promise is kept.** Everything before it is setup; everything after is depth. Vercel's `*.vercel.app` is already public + HTTPS, so **the custom domain is optional** — the core promise never depends on a learner having a credit card.

**Rules for writing these:**
- If you did not personally hit it, do not write it.
- Every check phrased so two different working apps both pass.
- Every hint is something you actually said out loud when it happened to you.
- Ship 3 missions, test on 1 human, then write the rest.

---

### Phase 10 — Launch

| Task | Detail |
|---|---|
| 10.1 | Playwright smoke test: register → verify → mission 1 → check → verified. Runs in CI. |
| 10.2 | Manual pass on the Gate list of every phase. |
| 10.3 | Security: no Prisma outside repositories; every route validates with Zod; no stack traces; SSRF guard live; tokens hashed. |
| 10.4 | ToS, Privacy, Refund pages. **India's DPDP Act 2023 applies to you** — say what you collect and why. |
| 10.5 | Neon backup + a written restore procedure you have actually run once. |
| 10.6 | 20 learners in. Watch `/admin/events` daily. |

**Launch metric — the only one:** *of the people who start Mission 1, how many reach a live URL at Mission 4?* If it is under 50%, missions 1–4 are wrong. Fix them before anything else. Do not add features.

---

## 13. `AGENTS.md` — copy this to the repo root

```markdown
# Afstim — Agent Rules

## Source of truth
1. This file
2. PLAN.md
3. docs/23_Authentication_Blueprint.md, docs/25_Implementation_Standards.md, docs/07A_DESIGN_LANGUAGE.md
Conflict → higher number in this list loses. Silence → STOP AND ASK.

## Locked versions
<!-- Fill in on first install. Never change without founder approval. -->

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
```

---

## 14. What this plan deliberately does not solve

Being honest about this matters more than the plan looking complete.

1. **Price.** There isn't one, in 33 documents or in this one. Phase 8's manual UPI + switch is a way to *discover* the price from 20 humans, not a payment system. The real question — *is this a ₹3,000 one-time thing or a ₹500/month thing?* — is answered by them, not by us. **Ask for money at Mission 4, when the URL goes live. Not at day 7.**
2. **Retention.** The KPI in the Product Bible ("users who launch an app") is a one-time event. A one-time event and a monthly subscription are at war. This plan doesn't resolve that — it just refuses to build a subscription before we know.
3. **Content decay.** Vercel and Neon will change their dashboards. Missions will break. That is a permanent recurring cost of this business, not a bug, and no architecture removes it.
4. **Distribution.** Not in this plan because it isn't code. The honest version: build in public while doing Phase 1 and Phase 9. *"I know how to code. I'd never deployed anything. Day 6: DNS finally propagated."* Your inexperience is an unfair advantage with a short shelf life — in three months you won't be able to write those posts honestly. Spend it now.

---

## 15. The sequence, in one screen

```
Phase 0   Reconcile docs                  1 hour      founder
Phase 1   Foundation + YOUR first deploy  1 week      founder + agent   ← the real one
Phase 2   Design + landing + feedback     1 week      agent
Phase 3   Auth                            4 days      agent
Phase 4   Content engine + mission pages  4 days      agent
Phase 5   CLI + validation                1.5 weeks   agent             ← the hard one
Phase 6   Dashboard                       2 days      agent
Phase 7   AI mentor                       4 days      agent
Phase 8   Admin + manual access           2 days      agent
Phase 9   Write the 10 missions           2 weeks     founder           ← the product
Phase 10  Launch                          1 week      both
                                          ─────────
                                          ~9 weeks    ~₹850
```

Two phases are founder work, not agent work: **1 and 9.** They are also the two that decide whether Afstim is real. An agent can build the whole platform. It cannot deploy for the first time on your behalf, and it cannot know which error made you want to quit at 2am.

That knowledge is the product. Everything in this document is scaffolding around it.
