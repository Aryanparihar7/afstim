# Afstim — Module Registry

**41 modules. One at a time. Never two.**

---

## How to use this

**Founder — the whole loop, every time:**

1. Open the registry table below. Find the lowest-numbered module whose dependencies are all ✅.
2. Say to the agent, exactly this and nothing more:
   > Read `AGENTS.md`, then read `modules/M07.md`. Implement M07. Do not touch any file outside its allowlist. Stop and ask if anything is unclear.
3. Agent implements, then runs its own "Done when" checks.
4. **You** run the Founder Gate. It's always something you can see or click. Never code review.
5. Gate passes → mark ✅ in the table below, commit, next module.
6. Gate fails → `git revert` to the last ✅, tell the agent exactly what you saw, retry.

**Never say "build Afstim." Never give two modules at once. Never skip a gate.**

If a module takes more than two attempts, it's specified wrong, not built wrong. Come back and split it.

---

## Why modules are vertical, not horizontal

You asked for backend / frontend / AI / agent as separate modules. That's a horizontal split and it would hurt you.

You can't code. You can only review by looking. A "backend module" produces nothing you can look at — you'd approve three weeks of invisible work on faith, and find out it was wrong when the UI finally landed on top of it.

Every module here is a **vertical slice**: schema → repository → service → route handler → UI, all in one, for one small feature. Inside a module the backend comes first. Across modules, never.

This is also what your own `20_AI_Development_Playbook.md` already approved: *"A feature is complete only when it works end-to-end."*

The exception is the Foundation track (M01–M05) — those are genuinely shared plumbing, so they come first and their gates are correspondingly small.

---

## The rules that stop hallucination

Each module file contains a **Files you may touch** list. This is the single most important line in the whole system.

- The agent may create or modify **only** those files.
- Anything else → it must stop and ask.
- If the agent edits a file outside the list, `git revert` immediately. No discussion. That's the drift starting.

Second most important: each module has **Out of scope**. Agents fill silence with invention. These sections are the silence-killers.

---

## Registry

Mark ✅ only after **you** pass the Founder Gate.

### Track F — Foundation

| ID | Module | Depends on | Agent time | Status |
|---|---|---|---|---|
| M00 | Repo, first deploy, your log | — | founder, 1 week | ☐ |
| M01 | Design tokens, fonts, globals | M00 | 2h | ☐ |
| M02 | UI primitives | M01 | 3h | ☐ |
| M03 | Prisma schema + migration + health | M00 | 2h | ☐ |
| M04 | API contract: envelope, errors, Zod | M03 | 2h | ☐ |
| M05 | Event log service | M03, M04 | 1h | ☐ |

### Track M — Marketing

| ID | Module | Depends on | Agent time | Status |
|---|---|---|---|---|
| M06 | Landing page | M02 | 4h | ☐ |
| M07 | Feedback form + API | M02, M04 | 2h | ☐ |

### Track A — Auth

| ID | Module | Depends on | Agent time | Status |
|---|---|---|---|---|
| M08 | Auth.js core + Argon2id + sessions | M03, M04 | 3h | ☐ |
| M09 | Register + verification email | M08, M02 | 4h | ☐ |
| M10 | Login, logout, lockout | M09 | 3h | ☐ |
| M11 | Route protection + access gate | M10 | 2h | ☐ |

### Track C — Content

| ID | Module | Depends on | Agent time | Status |
|---|---|---|---|---|
| M12 | Content loader + frontmatter schema | M04 | 3h | ☐ |
| M13 | Journey page | M12, M11, M02 | 3h | ☐ |
| M14 | Mission page shell | M13 | 3h | ☐ |
| M15 | Progress + unlock rules | M14, M05 | 3h | ☐ |

### Track V — Validation & CLI *(the hard track)*

| ID | Module | Depends on | Agent time | Status |
|---|---|---|---|---|
| M16 | CLI token issue (web + API) | M11 | 2h | ☐ |
| M17 | CLI scaffold + login | M16 | 3h | ☐ |
| M18 | `GET /cli/current` | M17, M15 | 2h | ☐ |
| M19 | Local check runners (4 types) | M18 | 4h | ☐ |
| M20 | `POST /cli/results` + persist | M19 | 3h | ☐ |
| M21 | Server check runners + SSRF guard | M20 | 4h | ☐ |
| M22 | Verification decision service | M21 | 2h | ☐ |
| M23 | Submissions UI + API | M14, M04 | 3h | ☐ |
| M24 | Reflection UI + API | M14, M04 | 2h | ☐ |
| M25 | Live check UI (polling) | M22, M23, M24 | 3h | ☐ |
| M26 | Rate limits (DB counter) | M20 | 2h | ☐ |

### Track D — Dashboard

| ID | Module | Depends on | Agent time | Status |
|---|---|---|---|---|
| M27 | Dashboard | M15, M25 | 3h | ☐ |

### Track I — AI Mentor

| ID | Module | Depends on | Agent time | Status |
|---|---|---|---|---|
| M28 | Anthropic client + context builder | M15, M22 | 3h | ☐ |
| M29 | Mentor API + daily cap | M28, M26 | 3h | ☐ |
| M30 | Mentor panel UI | M29, M02 | 3h | ☐ |
| M31 | `afstim explain` | M29, M17 | 2h | ☐ |
| M32 | Admin: AI spend | M29 | 2h | ☐ |

### Track X — Admin

| ID | Module | Depends on | Agent time | Status |
|---|---|---|---|---|
| M33 | Admin shell + users + access toggle | M11 | 3h | ☐ |
| M34 | Admin events + feedback | M33, M05, M07 | 2h | ☐ |

### Track W — Mission authoring *(founder work)*

| ID | Module | Depends on | Agent time | Status |
|---|---|---|---|---|
| M35 | Missions 1–3 | M25, M00's log | founder, 4 days | ☐ |
| M36 | Missions 4–6 | M35 | founder, 4 days | ☐ |
| M37 | Missions 7–10 | M36 | founder, 5 days | ☐ |

### Track L — Launch

| ID | Module | Depends on | Agent time | Status |
|---|---|---|---|---|
| M38 | Playwright smoke test | M37 | 3h | ☐ |
| M39 | Legal pages (ToS, privacy, refund) | M06 | 2h | ☐ |
| M40 | Security pass | M38 | 4h | ☐ |
| M41 | Backup + restore drill | M40 | founder, 2h | ☐ |

---

## The critical path

Everything else can wait. This is the spine:

```
M00 → M03 → M04 → M08 → M09 → M10 → M11 → M12 → M13 → M14 → M15
                                                            ↓
                              M16 → M17 → M18 → M19 → M20 → M21 → M22 → M25
                                                                          ↓
                                                                        M35 → M36
                                                                                ↓
                                                              first learner ships
```

**M35 and M36 are the only modules that prove the business.** Everything before them is scaffolding. If you're ever unsure what to do next, it's whatever gets you to M36 fastest.

---

## Two modules are not agent work

**M00** and **M35–M37** are yours. An agent can build the entire platform. It cannot deploy for the first time on your behalf, and it cannot know which error made you want to quit at 2am. That knowledge is the product.

M00 produces `docs/log/phase-1.md`. M35–M37 turn that log into missions. If the log is thin, the missions will be generic, and generic missions are just another tutorial — which is the exact thing Afstim exists to replace.

---

## Milestones worth stopping for

| After | You have | Do this |
|---|---|---|
| M00 | A live site on your domain, and a log of your own errors | Post day 1 publicly |
| M06 | A landing page | Show 3 people. "What is this and who's it for?" |
| M11 | Real accounts | Register 3 friends |
| M15 | A readable journey | Read your own missions cold |
| M25 | **The product works end-to-end** | Do a full mission yourself, as a learner |
| M36 | Missions 1–6 | **Put 5 humans through it. Ask for money.** |
| M41 | Launch-ready | 20 learners |

The stop that matters is after M36. Five humans, mission 1 to a live URL. If under half get there, missions 1–6 are wrong — fix them before building M37. Do not add features to escape a content problem.
