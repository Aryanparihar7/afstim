# Afstim — Module Manifest (M16–M41)

Compiled from `modules/M16.md` through `modules/M41.md`, plus `modules/M40b.md`
(present on disk, not in the original `modules/README.md` registry — see note
at M40b below). Each entry: Track/Depends/Blocks, Goal, Done-when, Founder
gate — verbatim from the source file. "Files you may touch" and other
scaffolding omitted by request.

None of these 27 files have been executed yet — see the confirmation at the
end of this document.

---

## M16 — CLI token issue

**Track:** Validation · **Depends:** M11 · **Blocks:** M17

### Goal
A learner can get a token that lets their terminal talk to Afstim as them.

### Done when
- [ ] tsc, lint, build pass
- [ ] `grep -ri "afs_" src --include=*.log` → nothing; token never logged
- [ ] Only the sha256 is in the DB

### Founder gate
1. Generate a token. It shows once. ☐
2. Refresh → it's gone forever, only metadata remains. ☐
3. Prisma Studio → `tokenHash` is a hash, not a token. ☐
4. Revoke → row shows revoked. ☐

---

## M17 — CLI scaffold + login

**Track:** Validation · **Depends:** M16 · **Blocks:** M18, M31

### Goal
`npx afstim login` works from a stranger's terminal.

### Done when
- [ ] `npm run build` in `cli/`
- [ ] `node dist/index.js login` works against localhost
- [ ] Config file is 0600
- [ ] Ctrl-C mid-prompt exits cleanly, no half-written config

### Founder gate
1. In a scratch folder: `node <path>/cli/dist/index.js login`. Paste your token. `✓ Logged in`. ☐
2. `cat ~/.afstim/config.json` → your token. `ls -l` → `-rw-------`. ☐
3. Paste a garbage token → one plain sentence, no stack trace. ☐
4. Turn off wifi → `status` → one plain sentence. ☐

---

## M18 — GET /api/v1/cli/current

**Track:** Validation · **Depends:** M17, M15 · **Blocks:** M19

### Goal
The CLI can ask "what am I supposed to be doing, and how do I know it worked?"

### Done when
- [ ] tsc, lint, build pass
- [ ] Response contains **zero** `remote_*` checks — agent proves it
- [ ] No token → 401 envelope

### Founder gate
1. `curl -H "Authorization: Bearer afs_..." https://<domain>/api/v1/cli/current` → your current mission. ☐
2. Scan the JSON. **No `remote_` anywhere.** ☐
3. Same curl without the header → 401, plain. ☐

---

## M19 — Local check runners

**Track:** Validation · **Depends:** M18 · **Blocks:** M20

### Goal
`npx afstim check` tells a learner the truth about their own machine.

### Done when
- [ ] `npm run build` in `cli/`
- [ ] All four types work against a real scratch project
- [ ] A command that sleeps 60s times out at 20s
- [ ] Running in `/tmp` (no package.json) refuses with a plain sentence

### Founder gate
1. Scratch folder → `afstim check` → real pass/fail against mission 1. ☐
2. Deliberately break something → the failing row shows **the hint you wrote**, not a stack trace. ☐
3. Watch the rows appear one at a time. **Does it feel good?** If it dumps all at once, reject. ☐
4. Run it in your Downloads folder → refuses politely. ☐

---

## M20 — POST /api/v1/cli/results

**Track:** Validation · **Depends:** M19 · **Blocks:** M21, M26

### Goal
What happened on the learner's machine reaches the website.

### Done when
- [ ] tsc, lint, build pass
- [ ] A `remote_*` id in the body → 400
- [ ] Wrong mission → 409 with a plain sentence
- [ ] Re-running check overwrites cleanly, doesn't append duplicates

### Founder gate
1. `afstim check` in the terminal → **refresh the mission page → the same results are there.** ☐
2. Prisma Studio → `checkResults` JSON matches your terminal. ☐
3. Run twice → `attempts` = 2, results = 3 rows not 6. ☐

---

## M21 — Server check runners + SSRF guard

**Track:** Validation · **Depends:** M20 · **Blocks:** M22
**Note:** ⚠ The highest-risk module in the build. Read every line.

### Goal
Afstim independently proves the learner's app is actually live on the actual internet.

### Done when
- [ ] tsc, lint, build pass
- [ ] **Agent demonstrates all of these rejected:** `http://x.com`, `https://localhost`, `https://127.0.0.1`, `https://169.254.169.254`, `https://192.168.1.1`, `https://user:pass@x.com`, `https://x.com:8080`, `file:///etc/passwd`
- [ ] A redirect from a public URL to `127.0.0.1` is **caught at the redirect**
- [ ] A 100MB response doesn't OOM the function

### Founder gate
1. Submit `http://localhost:3000` as your live URL → rejected. ☐
2. Submit `https://169.254.169.254` → rejected. ☐
3. Submit your real Vercel URL → passes. ☐
4. Submit a domain whose DNS you just changed → `PENDING` with the calm message, **not a red failure**. ☐
5. Ask the agent: *"can someone use Afstim to scan my hosting provider's internal network?"* Answer must be a specific no citing DNS resolution + IP checking. Vagueness → reject the module. ☐

---

## M22 — Verification decision service

**Track:** Validation · **Depends:** M21 · **Blocks:** M25, M28

### Goal
One place decides whether a mission is done. Nowhere else.

### Done when
- [ ] tsc, lint, build pass
- [ ] `grep -rn "VERIFIED" src --include=*.ts | grep -v verification-service | grep -v types` → only reads, no writes
- [ ] Calling twice fires one event
- [ ] Reflection under 40 chars → not verified, `blockedBy` says so

### Founder gate
1. Pass all checks, leave reflection empty → not verified, and it **tells you** reflection is missing. ☐
2. Write a reflection → verified. ☐
3. Take your site offline, reload the mission → **still verified**. ☐
4. `Event` has exactly one `mission_verified`. ☐

---

## M23 — Submissions UI + API

**Track:** Validation · **Depends:** M14, M04 · **Blocks:** M25

### Goal
The learner tells us their live URL so we can go look at it.

### Done when
- [ ] tsc, lint, build pass
- [ ] `localhost` rejected **at the input**, before any fetch
- [ ] Saving twice updates, doesn't duplicate

### Founder gate
1. Paste your Vercel URL → saves, checks re-run. ☐
2. Paste `http://localhost:3000` → the message tells you what to do instead, in plain words. ☐
3. Paste `banana` → *"That doesn't look like a URL."* ☐
4. Change it → the old one is replaced, not duplicated. ☐

---

## M24 — Reflection UI + API

**Track:** Validation · **Depends:** M14, M04 · **Blocks:** M25

### Goal
The learner writes one honest sentence about what just happened, before we call it done.

### Done when
- [ ] tsc, lint, build pass
- [ ] Under 40 chars → inline message, no submit
- [ ] Reflection block hidden while any check fails
- [ ] Saving a valid reflection with all checks passing → mission verifies

### Founder gate
1. Pass all checks → the reflection question appears. ☐
2. Type "hi" → *"A bit more than that."* ☐
3. Write a real answer → mission verifies, next mission unlocks. ☐
4. **Read your own reflection back a week later.** If it's useless, the question is wrong — that's content, fix it in M35. ☐

---

## M25 — Live check UI

**Track:** Validation · **Depends:** M22, M23, M24 · **Blocks:** M27
**Note:** This module completes the product. After it, Afstim works end to end.

### Goal
The learner runs `afstim check` in their terminal and watches the website update.

### Done when
- [ ] tsc, lint, build pass
- [ ] Backgrounding the tab stops polling — agent proves it in the network panel
- [ ] Polling stops after 90s, doesn't run forever
- [ ] Reduced motion → rows change with no transition

### Founder gate — **the big one**

Do a full mission as a learner. No shortcuts. No Prisma Studio.

1. Open mission 1 on one screen, terminal on the other. ☐
2. `npx afstim check`. **Watch the website update within 5 seconds.** ☐
3. Fail a check on purpose → the hint you wrote appears on the page. ☐
4. Fix it, re-run → the row goes green. ☐
5. Write the reflection → verified → mission 2 unlocks. ☐
6. Background the tab for 2 minutes → network panel shows **no polling**. ☐

**If step 2 feels good — if watching that row go green from your own terminal gives you something — the product works. That feeling is what you're selling. If it feels flat, stop and fix it here, before you build anything else.**

---

## M26 — Rate limits

**Track:** Validation · **Depends:** M20 · **Blocks:** M29

### Goal
One person can't cost you a month's budget in an afternoon.

### Done when
- [ ] tsc, lint, build pass
- [ ] 31 checks in an hour → 429 with a human sentence
- [ ] Concurrency test: 50 parallel requests on a limit of 30 → **exactly 30 pass**

### Founder gate
1. Loop `afstim check` 31 times → the 31st says something human. ☐
2. Ask the agent for the concurrency test result. **Exactly 30.** If it's 31+, the counter isn't atomic — reject. ☐
3. `grep -ri "redis\|upstash" src package.json` → nothing. ☐

---

## M27 — Dashboard

**Track:** Dashboard · **Depends:** M15, M25 · **Blocks:** —

### Goal
Log in, see one thing, click it.

### Done when
- [ ] tsc, lint, build pass
- [ ] One `<button>` above the fold. One.
- [ ] Loads in under 300ms server time

### Founder gate
1. Log in. **Count the things you could click.** More than 3 above the fold → too many. ☐
2. Squint at the screen. The one thing you should do is still obvious. ☐
3. Fresh account → the empty state makes you want to start. ☐
4. Nothing on this page is a number that goes up. (If reputation appeared, revert it.) ☐

---

## M28 — Anthropic client + context builder

**Track:** AI · **Depends:** M15, M22 · **Blocks:** M29

### Goal
Assemble exactly what the mentor needs to know, and nothing else.

### Done when
- [ ] tsc, lint, build pass
- [ ] Agent proves the 6k cap holds with a 50k-char error input
- [ ] No secret, path, or file content can reach the payload — agent walks you through why

### Founder gate
Ask the agent: *"print the exact JSON you'd send to Anthropic for mission 4 with a failing build."*

Read it yourself. Check:
1. Is anything in there you wouldn't want a stranger to see? ☐
2. Is the system prompt **word-for-word** from PLAN.md §9? ☐
3. Roughly how many tokens? Under 6k? ☐

---

## M29 — Mentor API + daily cap

**Track:** AI · **Depends:** M28, M26 · **Blocks:** M30, M31, M32

### Goal
The mentor answers, and it cannot bankrupt you.

### Done when
- [ ] tsc, lint, build pass
- [ ] Agent proves the cap check happens **before** the API call
- [ ] A failed Anthropic call does not consume a credit
- [ ] `tokensIn`/`tokensOut` come from the response, not a guess

### Founder gate
1. Ask a real question about a real failing check. The answer is **useful and short**. ☐
2. Ask 26 times. The 26th says something human. ☐
3. Prisma Studio → `AiMessage` has real token counts. ☐
4. Set `ANTHROPIC_API_KEY=garbage` → the mission page still loads, checks still run, the panel says the mentor is unavailable. **Learning never blocks on AI.** ☐
5. Confirm the failed call didn't burn a credit. ☐

---

## M30 — Mentor panel UI

**Track:** AI · **Depends:** M29, M02 · **Blocks:** —

### Goal
Asking for help takes one click and no explaining.

### Done when
- [ ] tsc, lint, build pass
- [ ] Hidden when nothing is failing
- [ ] Keyboard: tab to it, expand with Enter, submit with Cmd/Ctrl+Enter
- [ ] Remaining-count updates after each ask

### Founder gate
1. Fail a check → the mentor line appears **under that check**. ☐
2. Click. **You didn't type what mission you're on. It already knew.** ☐
3. Paste a real error → useful answer. ☐
4. Does it look like WhatsApp? If yes, reject. ☐
5. Ask yourself: *is this better than the ChatGPT tab?* If the only difference is it's worse, the system prompt is wrong — go back to M28. ☐

---

## M31 — afstim explain

**Track:** AI · **Depends:** M29, M17 · **Blocks:** —

### Goal
Help without leaving the terminal.

### Done when
- [ ] `npm run build` in `cli/`
- [ ] Ctrl-C at the prompt exits cleanly, no half request
- [ ] Piped input works: `cat err.txt | npx afstim explain`

### Founder gate
1. Break your build → `npx afstim explain` → paste the error → useful answer, in your terminal. ☐
2. You never told it the mission. ☐
3. Ctrl-C mid-paste → clean exit. ☐
4. Does this beat alt-tabbing to ChatGPT? **Be honest.** If not, it's the prompt (M28), not the CLI. ☐

---

## M32 — Admin: AI spend

**Track:** AI · **Depends:** M29 · **Blocks:** —

### Goal
You can see what the mentor cost you today, in rupees, before the bill arrives.

### Done when
- [ ] tsc, lint, build pass
- [ ] Learner hitting `/admin/ai` → 404
- [ ] Unconfigured pricing shows the warning, doesn't show a fake ₹0.00

### Founder gate
1. **Go to anthropic.com/pricing. Fill in the three constants yourself.** ☐
2. Ask 5 questions → refresh → the cost is roughly what you'd expect. ☐
3. Compare against the real Anthropic console after a day. Within ~20%? ☐
4. **Set a hard spend limit in the Anthropic console.** This dashboard is a mirror, not a brake. ☐

---

## M33 — Admin shell + users + access

**Track:** Admin · **Depends:** M11 · **Blocks:** M34

### Goal
You decide who gets in.

### Done when
- [ ] tsc, lint, build pass
- [ ] Learner → `/admin/users` → 404
- [ ] Access change writes an Event with the actor
- [ ] Prisma only in repositories

### Founder gate
1. `/admin/users` → your accounts. ☐
2. Flip a test account PENDING → ACTIVE. **In its browser, refresh → they're in.** ☐
3. Set REVOKED → they're out on next navigation. ☐
4. Log in as a learner → `/admin` → 404. ☐
5. There is no impersonate button. ☐

---

## M34 — Admin events + feedback

**Track:** Admin · **Depends:** M33, M05, M07 · **Blocks:** —

### Goal
You can answer the only question that matters: **how many people reach a live URL?**

### Done when
- [ ] tsc, lint, build pass
- [ ] Funnel counts distinct users, not events
- [ ] Learner → 404

### Founder gate
1. `/admin/events` → the funnel matches reality (you know how many accounts exist). ☐
2. Send feedback from a phone → it's in `/admin/feedback` within a refresh. ☐
3. **Point at the mission-4 number.** That's your business. Everything else on the page is trivia. ☐

---

## M35 — Missions 1–3

**Track:** Authoring · **Depends:** M25, M00's log · **Blocks:** not stated in file (M36 depends on it) · **Founder work, ~4 days**

### Goal
The first three missions are real, and they came from your own errors.

### Done when
No "Done when" section in this file — M35 is founder-authored content, not agent code; it uses "Founder gate" only.

### Founder gate
1. `npm run build` passes (M12's validator agrees your files are valid). ☐
2. **Do all three yourself, in a fresh folder, following only your own words.** ☐
3. **Give them to one real person.** Watch them. Say nothing. Write down every place they hesitate. ☐
4. That person reaches mission 3 without you helping. ☐

If step 3 hurts to watch — good. That's the most valuable four hours in this entire project. Every hesitation is a bug in your writing.

---

## M36 — Missions 4–6

**Track:** Authoring · **Depends:** M35 · **Blocks:** not stated in file · **Founder work, ~4 days**
**Note:** Mission 4 is where Afstim keeps its promise. Everything else is scaffolding around it.

### Goal
A learner has a live URL, HTTPS, and a real database in production.

### Done when
No "Done when" section in this file (founder-authored content). The closest equivalent is folded into "Founder gate — the real one" below.

### Founder gate — **the real one**
1. `npm run build` passes. ☐
2. Do 1→6 yourself in a fresh folder, following only your words. ☐
3. **Put five real people through missions 1–6.**
4. **Count how many reach a live URL at mission 4.**

**Then ask them for money.**

Not a survey. Not "would you pay?" A number, a UPI QR, and silence. What they do next is the only honest signal you will get in this entire project.

- 3+ of 5 reach mission 4 → the product works
- 3+ of 5 pay → **you have a business.** Build M37.
- Fewer → the missions are wrong, or the price is, or the thing itself is. **Do not build M37 to escape this.** Fix it here. Adding features to avoid a content problem is how the next 18 months disappear.

---

## M37 — Missions 7–10

**Track:** Authoring · **Depends:** M36 · **Blocks:** not stated in file · **Founder work, ~5 days**
**Note:** Do not start this until M36's gate passed. If people didn't pay at mission 6, more missions won't fix it.

### Goal
Depth. The learner can now change a live system without fear.

### Done when
No "Done when" section in this file (founder-authored content) — see "Founder gate" below.

### Founder gate
1. Build passes. ☐
2. **Do all ten yourself, fresh folder, only your words.** ☐
3. The five people from M36 finish 7–10. ☐
4. **At least one of them says something like "I could do this again on my own."** That's the Definition of Success from your own PRD §92 — capability, not engagement. If nobody says it, the journey taught steps instead of understanding, and you need to go back to the reflections. ☐

---

## M38 — Playwright smoke test + publish CLI

**Track:** Launch · **Depends:** M37 · **Blocks:** M40

### Goal
The critical path can't break silently, and strangers can install the CLI.

### Done when
- [ ] The smoke test passes locally and in CI
- [ ] Deliberately breaking verification → the test goes red
- [ ] `npx afstim@latest --version` works from a fresh machine

### Founder gate
1. Push a commit → GitHub Actions goes green. ☐
2. Break `verification-service` on purpose, push → **CI goes red before Vercel deploys.** ☐
3. On a friend's laptop: `npx afstim@latest login` → works. ☐

---

## M39 — Legal pages

**Track:** Launch · **Depends:** M06 · **Blocks:** —

### Goal
You can legally take money from a stranger in India.

### Done when
No "Done when" section in this file — the closest equivalent is "Founder gate" below.

### Founder gate
1. Read all three aloud. Any sentence you don't understand → rewrite it. ☐
2. Privacy page lists **every** third party that touches user data. Check it against your `.env`. ☐
3. Ask a CA about a sole proprietorship. ☐
4. Every page is linked from the footer. ☐

---

## M40 — Security pass

**Track:** Launch · **Depends:** M38 · **Blocks:** M41

### Goal
Nothing embarrassing. Nothing expensive. Nothing that ends the company.

### Done when
No "Done when" checklist section — M40 is structured as an audit checklist instead (Layering / Auth / SSRF / Secrets / Cost / Errors, each with its own `- [ ]` items) that the agent produces as `docs/security-audit.md`. Reproduced here since it functions the same way:
- [ ] `grep -rn "@prisma/client" src/app src/components` → **empty**
- [ ] Every `/api/v1` route wrapped in `handler.ts`
- [ ] Every route Zod-validates its input
- [ ] No business logic in route handlers
- [ ] Every `(app)` page requires session + `emailVerified`
- [ ] Every private API calls a guard — **middleware alone is not enough**
- [ ] `/admin` returns 404 to non-admins, not 403
- [ ] Login: wrong email and wrong password are indistinguishable
- [ ] Verification tokens single-use and expiring
- [ ] CLI tokens stored hashed, never logged
- [ ] `url-guard` runs before every outbound fetch **and after every redirect**
- [ ] DNS resolved and the **resolved IP** checked, not just the hostname string
- [ ] `169.254.169.254` rejected (cloud metadata)
- [ ] Response body capped at 1MB
- [ ] Applied on submission input **and** at fetch time
- [ ] `grep -rn "sk-\|afs_\|postgres://" src cli` → **empty**
- [ ] No secret in any `Event.payload` or log line
- [ ] `.env` gitignored; `.env.example` has no real values
- [ ] Anthropic console has a **hard spend limit**
- [ ] Mentor cap checked before the API call
- [ ] Rate limits atomic (50 parallel on limit 30 → exactly 30)
- [ ] Polling stops on hidden tab and after 90s
- [ ] No stack trace reachable from any endpoint — agent proves with real requests
- [ ] `INTERNAL` always returns the generic sentence

### Founder gate
1. Read `docs/security-audit.md`. **Every line is PASS or has a plan.** ☐
2. Any FAIL on SSRF or Secrets → **do not launch.** Everything else can wait. ☐
3. Try it yourself: `curl` a private API with no cookie, submit `http://169.254.169.254`, request a route that throws. **See a plain sentence every time.** ☐
4. Confirm the Anthropic spend limit is set. ☐

---

## M40b — Password reset flow

**Track:** Launch · **Depends:** M40 · **Blocks:** M41

**This module is not in `modules/README.md`'s original 41-module registry.** It exists only as this file, added later (still untracked in git as of this manifest). Its own "Why this exists" section explains it was found missing during development, after the registry was written:

> M10 deliberately deferred this for 20-user manual support. Found during development: the person locked out can be the founder mid-build with no one to email. Real users need a self-serve path before M36's five humans arrive — nobody paying you should be permanently locked out.

### Goal
A learner who forgets their password can get back in without emailing you.

### Done when
No "Done when" section in this file — it goes straight from "Out of scope" to "Founder gate."

### Founder gate
1. Request a reset for a real account → email arrives with a link. ☐
2. Click it → set a new password → log in with the new one. ☐
3. Try the same link twice → second use rejected. ☐
4. Request reset for an email that doesn't exist → identical response, no leak. ☐
5. Old password no longer works after reset. ☐

---

## M41 — Backup + restore drill

**Track:** Launch · **Depends:** M40 · **Blocks:** launch · **Founder work, ~2h**

### Goal
You have restored the database once, on purpose, before you had to.

### Done when
No "Done when" section in this file (founder-only operational drill) — see "Founder gate" below.

### Founder gate
1. You restored a database. With your hands. ☐
2. `docs/runbook-restore.md` exists, and you wrote it **while** doing it, so it's true. ☐
3. You know the number: restoring takes ___ minutes. ☐
4. A `.sql` file exists on your laptop, not only in the cloud. ☐

---

## Confirmation: pre-generated specs, zero corresponding code

Checked the actual repo tree against every "Files you may touch" path across M16–M41 and M40b. None of the following exist:

- `cli/` (M17–M19, M31, M38) — entire CLI package absent
- `features/validation/` (M18–M26) — absent
- `features/mentor/` (M28–M32) — absent
- `features/admin/` (M33–M34) — absent
- `app/admin/` (M32–M34) — absent
- `app/(app)/dashboard/` (M27) — absent
- `app/(app)/settings/` (M16) — absent
- `app/(auth)/forgot-password/`, `app/(auth)/reset-password/` (M40b) — absent
- `e2e/`, `playwright.config.ts`, `.github/workflows/` (M38) — absent
- `docs/security-audit.md`, `docs/runbook-restore.md` (M40, M41) — absent
- `app/(marketing)/terms/`, `/privacy/`, `/refunds/` (M39) — absent

One partial exception in `prisma/schema.prisma`: the `CliToken`, `Submission`, and `AiMessage` models (needed by M16, M23, and M28+ respectively) are already defined — likely added during initial schema design rather than as part of executing those modules. `RateCounter` (M26) is **not** present, so even that head start is incomplete.

**Answer: the file list does not stop before M16 — all 26 spec files (M16–M41) plus M40b exist and are fully written. None of their corresponding application code has been built.** These are specs waiting to be executed, one at a time, per `modules/README.md`'s process (finish M15's registry row, then start M16), not a description of work already done.
