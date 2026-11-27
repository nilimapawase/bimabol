# BimaBol — today prompt runbook (Fri 27)

Copy-paste manual for **Day 1** in `D:\voice-kit`. Track progress in [ROUND2_THREE_DAY_TRACKER.md](ROUND2_THREE_DAY_TRACKER.md).

---

## 1. Doc map (all under `docs/` except README)

| File | Use |
|------|-----|
| [docs/SPEC.md](SPEC.md) | **Build truth** — every agent reads this |
| [docs/BimaBol_Round2_Master_Plan.md](BimaBol_Round2_Master_Plan.md) | Gates, Vercel, video, deck, submission §11–14 |
| [docs/VOICE_KIT_END_TO_END.md](VOICE_KIT_END_TO_END.md) | What the starter already does (A1) |
| [docs/round1.txt](round1.txt) | Facts for DECK (Chat B) |
| [docs/PLAN.md.md](PLAN.md.md) | Original starter plan |
| [README.md](../README.md) | Root only — Chat B appends; Chat E polishes |
| **This file** | Today's prompts and gates |
| **Tracker** | [ROUND2_THREE_DAY_TRACKER.md](ROUND2_THREE_DAY_TRACKER.md) |

**Path rule:** In every agent prompt below, `docs/SPEC.md` means the file at `D:\voice-kit\docs\SPEC.md` (not repo root).

**Protected docs:** Chat B may add `docs/DECK.md` and `docs/DEMO_SCRIPT.md` but must **not** delete or overwrite this runbook or the tracker.

---

## 2. How to use Cursor (deep)

| Who | Mode | Model | When |
|-----|------|-------|------|
| You | Terminal (`cmd`) | — | S0, GATE1/2/3, `npm test`, git push |
| Build | **Agent** | Composer 2.5 Fast | A1, B, A2, C-fix, D, E, TRACK, fixes |
| Review | **Ask** | Grok 4.7 Medium | C-ASK only |
| Re-scope | **Plan** | — | Only if A1 fails twice → A1a then A1b |

**Workspace:** Open folder `D:\voice-kit`. Location **This PC** (not Cloud). Auto off. No Multitask. **One new chat per prompt block.**

**Parallel rule:** Only **A1** and **B** run together (different paths). Do **not** `git add` for Round 2 code until **both** A1 and B have stopped.

**After each Agent chat:** `npm run build` and `npm test` (once A1 added tests). Then run **§TRACK** or tick the tracker manually.

**Round 1 vs Round 2:** No Sarvam, no `/api/extract` in this build (deck: future options). Helpline **14447**, WhatsApp **917065514447**.

---

## 3. Repo inventory (starter → BimaBol)

### Root

`package.json` (`voice-starter`, no `test` yet), `vite.config.ts`, `index.html`, tsconfigs, `.gitignore`, `README.md`. Git: **no commits yet** (baseline in S0).

### `src/` (reuse vs build)

| Reuse | Extend / new |
|-------|----------------|
| `speech/*`, `ui/MicButton`, `ui/Shell`, `flow/intents`, `parse/*` basics | Dexie, domain clock/hash, report parser, routes |
| Privacy, mic, offline banner patterns | `Home`, `/report`, `/case/:id`, `/about` |
| `FlowPage` / `useStepFlow` patterns | Case script, ticket, evidence, export |
| `storage/store.ts` localStorage | Migrate cases to Dexie (privacy flag stays localStorage) |

### Missing until Round 2 chats

Dexie, Vitest, Docker/nginx/CI, `npm test`, BimaBol routes, tamper log, operator mode.

---

## 4. Today's definition of done (Day 1)

- [ ] `npm run build` and `npm test` pass locally
- [ ] Gate 2 typed flow (§GATE2)
- [ ] `docker compose up --build` on clean clone → `http://localhost:8080`, no `.env`
- [ ] Public `bimabol` pushed; Actions green
- [ ] Tracker: Day 1 **12/12** (or honest partial with notes)

**Not required tonight:** YouTube, deck PDF, portal submit, full Android pass (Day 2).

---

## 5. Step sequence (today)

| # | ID | Who | Mode | Model | After | ~min | Section |
|---|-----|-----|------|-------|-------|------|---------|
| 0 | 00-INIT | You | — | — | P0 docs exist | 1 | Confirm this file + tracker exist |
| 1 | S0 | You | — | — | 00-INIT | 30 | §S0 |
| 2 | A1 | Agent | Agent | Composer 2.5 | S0 | 55 | §8.1 |
| 3 | B | Agent | Agent | Composer 2.5 | S0 | 55 | §8.2 (parallel #2) |
| 4 | VERIFY | You | — | — | A1+B | 10 | `npm run build` + `npm test` |
| 5 | GATE1 | You | — | — | VERIFY | 15 | §GATE1 |
| 6 | TRACK | Agent | Agent | Fast | GATE1 | 3 | §TRACK |
| 7 | A2 | Agent | Agent | Composer 2.5 | GATE1 | 55 | §8.3 |
| 8 | GATE2 | You | — | — | A2 | 35 | §GATE2 |
| 9 | TRACK | Agent | — | — | GATE2 | 3 | §TRACK |
| 10 | C-ASK | You | Ask | Grok 4.7 | GATE2 | 20 | §8.4 ask |
| 11 | C-FIX | Agent | Agent | Grok 4.7 | C-ASK | 25 | §8.4 fix |
| 12 | GATE3 | You | — | — | C-FIX | 30 | §GATE3 |
| 13 | TRACK | Agent | — | — | GATE3 | 3 | §TRACK |
| 14 | D1-12 | You | — | — | CI green | 5 | Update tracker Day 1 sign-off |

**First chat after S0:** open **two** new Agent chats — paste **§8.1** in one, **§8.2** in the other.

---

## §S0 — Setup (you, before any Agent chat)

Use **cmd** in `D:\voice-kit`.

1. `node -v`, `git --version`, `docker --version`
2. Baseline commit **before** Round 2 app commits (history shows starter):

```bat
cd /d D:\voice-kit
git status
git ls-files | findstr /i "node_modules dist .env"
git commit -m "Voice starter kit baseline (before Round 2)"
```

Second command must print **nothing**. If it lists `node_modules` or `dist`: `git rm -r --cached node_modules dist` and ensure `.gitignore` lists them.

3. **SPEC:** Already at `docs/SPEC.md` — do not duplicate to root unless Chat E adds a one-line pointer.
4. **round1:** Already at `docs/round1.txt`.
5. **VOICE_KIT_END_TO_END:** Already at `docs/VOICE_KIT_END_TO_END.md`.
6. Create empty public GitHub repo **`bimabol`** (no README/.gitignore from GitHub). Then:

```bat
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/bimabol.git
```

(Skip `remote add` if already set.)

7. Cursor: Agent, This PC, Composer 2.5 Fast, Auto off.
8. Verify helpline **14447** and WhatsApp **7065514447** once on official pages.

Tick **D1-01** in the tracker.

---

## §8.1 — Chat A1 (core app)

**Agent** · Composer 2.5 Fast · run **at the same time** as §8.2

```text
Read docs/SPEC.md, the existing code and docs/VOICE_KIT_END_TO_END.md. Rename the package to bimabol. Do ONLY: Dexie storage migration, domain logic (clock, event time, hash-chained event log), parser extensions (crops, loss types, 36 districts, time phrases, numbers), the /report flow (steps 1-6), the Home page with case cards and clocks, the safety text, and Vitest tests for parser, clock and hash chain.

Rules: do not touch Dockerfile, nginx, .github, docs, README or .gitignore. Add dexie and vitest only; keep dependencies minimal. In package.json set the script "test" to "vitest run" and keep "build" working. Run npm install (not npm ci) so package-lock.json stays in sync. Write the domain logic (clock, parser, event time, hash chain) as pure functions with an injectable "now" and no Dexie imports, so tests need no browser. Use canonical JSON with sorted keys for the hash chain. Use WebCrypto SHA-256. Parser tests: 25 sentences (10 Marathi, 10 Hindi, 5 mixed).

Run npm install, npm run build and npm test; fix every error; then stop and list what to test. State assumptions at the end; do not ask questions.
```

**Done when:** `npm run build` and `npm test` pass; agent lists what to test.

### A1a (if A1 failed twice — run first)

```text
Read docs/SPEC.md, the existing code and docs/VOICE_KIT_END_TO_END.md. Rename the package to bimabol. Do ONLY: add dexie and vitest, the Dexie storage migration (keep the privacy-dismissed flag in localStorage), domain logic (clock, event time, hash-chained event log) as pure functions with an injectable "now" and no Dexie imports, canonical JSON with sorted keys, and Vitest tests for clock and hash chain (valid chain, tamper detected). Set the script "test" to "vitest run". Do not touch Dockerfile, nginx, .github, docs, README or .gitignore. Run npm install, npm run build and npm test; fix every error; then stop and list what to test. State assumptions at the end; do not ask questions.
```

### A1b (after A1a)

```text
Read docs/SPEC.md and the current code. Do ONLY: parser extensions (crops, loss types, 36 districts with fuzzy match and folding, time phrases, numbers, mixed speech), the /report flow (steps 1-6), the Home page with case cards and clocks, the safety text, and Vitest parser tests with 25 sentences (10 Marathi, 10 Hindi, 5 mixed) plus intent tests. Do not touch Dockerfile, nginx, .github, docs, README or .gitignore. Run npm run build and npm test; fix every error; then stop and list what to test. State assumptions at the end; do not ask questions.
```

---

## §8.2 — Chat B (infra + docs)

**Agent** · Composer 2.5 Fast · parallel with A1

```text
Read docs/SPEC.md. Do ONLY infrastructure and docs. Do not edit src/ or package.json and do not run npm or docker. You may read package.json.

Create:
- Dockerfile: multi-stage; stage 1 is a Node alpine image whose major version satisfies the Vite version in package.json, running npm ci and npm run build; stage 2 is the alpine nginx-unprivileged image serving dist on 8080 with SPA fallback and no-cache for the service worker (sw.js).
- nginx/nginx.conf with the SPEC security headers (CSP, Permissions-Policy, X-Content-Type-Options, Referrer-Policy, X-Frame-Options), all with "always". nginx does not inherit add_header into a location that defines its own add_header, so repeat the security headers in every such location or use an include file. Also server_tokens off and gzip.
- docker-compose.yml: service bimabol, port 8080:8080, cap_drop ALL, no-new-privileges, healthcheck using wget against 127.0.0.1:8080 (no curl in the image; use only a command that exists in the chosen image).
- .dockerignore.
- .gitignore: keep existing entries and add .env*, .cursor, evidence/photos, .vercel.
- .env.example: comments only.
- vercel.json: the same headers, no-cache for /sw.js, and an SPA rewrite to index.html.
- .github/workflows/ci.yml: npm ci, npm run build, npm test, docker compose up --build -d, wait with retries and curl -f http://localhost:8080, docker compose down.
- SECURITY.md.
- README sections for Docker, security and privacy (do not delete existing README content).
- docs/DECK.md: pitch-deck text with the 4 required sections (problem and solution; who it is for and how many; what it depends on and what happens if it gets costly or stops; launch plan), using only facts in docs/round1.txt or docs/SPEC.md. Do not invent statistics. State plainly that there are no pilot users yet and that the pilot numbers are targets, not results. State that this build has no backend and no paid API, and that Sarvam or /api/extract from Round 1 are future options, not part of this build.
- docs/DEMO_SCRIPT.md: a 3-minute script with timings that total 2:45 or less.

Do not modify docs/TODAY_PROMPT_RUNBOOK.md or docs/ROUND2_THREE_DAY_TRACKER.md.

Stop and list the files created.
```

---

## §8.3 — Chat A2 (case + rest)

**Agent** · Composer 2.5 Fast · after A1 **and** Gate 1 push (or after A1+B verified locally)

```text
Read docs/SPEC.md and the current code. Do ONLY the CASE screen and the rest: script screen and read-aloud, Call 14447, WhatsApp prefilled link, ticket capture (character-by-character repeat), evidence checklist with photo capture (resize, SHA-256, IndexedDB), tamper-evident log display with verification, export (printable "Self-maintained farmer record", share text, JSON), operator profiles, /demo page with demo data and 25 test sentences, /about page, offline banner and Delete everything.

Details: the WhatsApp link must use the international format https://wa.me/917065514447?text=... with encodeURIComponent; add policy number and mobile only if the user ticks a box (default off). Never read GPS or EXIF location. Show the safety text on the case screen, clock, script and log.

Small additions, do these LAST and skip them if time is short: (1) on /demo, a button "Demo: tamper with record" (demo case only) that edits one stored event so the integrity check shows "नोंदीत बदल आढळला ⚠", and a "Repair demo" button that restores it; (2) show a "Record fingerprint" (first 12 characters of the latest hash) on the printable page and in the share text.

Add tests for new logic. Run npm run build and npm test; fix errors; stop and list what to test. State assumptions at the end; do not ask questions.
```

---

## §8.4 — Chat C (review + fix)

**Ask** (Grok 4.7 Medium):

```text
Review the whole repo against docs/SPEC.md and the hackathon rules (public repo, docker compose up works with no keys and shows the main screen). List bugs, security issues (XSS, CSP breaks, secrets, PII leaks), missing SPEC items, and mobile/voice problems, ordered by severity, each with file path and a one-line fix. Also check: CSP violations in a production build (inline scripts, service worker registration), nginx header inheritance in location blocks, that the healthcheck command exists in the image, that a clean clone with no .env runs with docker compose up --build, that README commands match package.json scripts, and that wa.me uses the 91 country code. Do not change code.
```

**Agent** (same chat, switch mode):

```text
Fix the critical and high items you listed. Run npm run build and npm test, then stop and list what you changed.
```

---

## §8.5 — Chat D (optional, Day 2 if ahead)

```text
Read docs/SPEC.md. Add an opt-in "weather reference" button on the case screen that checks recent rain and hail weather codes near the village using Open-Meteo (free, no key). Show it as reference only, never proof. Add its hosts to connect-src in nginx.conf and vercel.json. If the geocoding or forecast request fails, show a short message and continue. Check the API addresses in the Open-Meteo docs. Add a test. Run npm run build and npm test, then stop.
```

---

## §8.6 — Chat E (Day 3 — final polish)

```text
Read docs/SPEC.md and the whole repo. Final polish only, no new features:
(1) README: add a section "What is new in Round 2" listing which parts came from the Round 1 starter kit (speech hooks, step flow, parser basics) and which were written during Round 2 (Dexie storage, domain logic, hash-chained log, case screen, evidence, export, operator mode, Docker, CI), plus how to run tests and demo data;
(2) check PWA icons and manifest names (BimaBol), theme colour and lang=mr;
(3) make sure vercel.json has the security headers and an SPA rewrite;
(4) remove debug logs and unused code;
(5) run npm audit and fix high or critical issues without breaking the build;
(6) confirm .gitignore excludes .env*, node_modules, dist, .cursor, evidence/photos and that no secrets exist in the repo;
(7) make sure docs/DECK.md and docs/DEMO_SCRIPT.md match what the app actually does now, and that the README commands match package.json;
(8) run npm run build and npm test and fix errors.
Stop and report.
```

---

## §8.7 — Generic fix

```text
Read docs/SPEC.md and the current code. Fix only this problem: [paste the exact error or describe what you saw]. Run npm run build and npm test, then stop and tell me how to check it.
```

---

## §8.8 — Docker fix

```text
Read docs/SPEC.md, Dockerfile, docker-compose.yml and nginx/nginx.conf. docker compose up --build fails or the container is unhealthy with this output: [paste output]. Fix only the Docker and nginx files. Keep the SPEC security headers, non-root, cap_drop ALL and no-new-privileges. Do not edit src/. Tell me the exact command to retest.
```

---

## §8.9 — Voice fix (Day 2 Android)

```text
Read docs/SPEC.md and the current code. On an Android phone in Chrome with mr-IN, this happened: [what you said, what the app heard, what it should have done]. Fix only this voice or parser behaviour. Keep the typed fallback working. If it is parser logic, add a test with this exact sentence. Run npm run build and npm test, then stop and tell me how to check it.
```

---

## §TRACK — Update tracker only

**Agent** · do not edit `src/` unless a gate failed

```text
Read docs/ROUND2_THREE_DAY_TRACKER.md. Mark step [STEP_ID] as COMPLETE with today's date and time (IST). Recompute "Round 2 overall: X/28" and each Day subcount. List the single next step ID and which runbook section to open. Do not edit src/, package.json, or README unless I say a gate failed. Do not modify docs/TODAY_PROMPT_RUNBOOK.md except if I ask. You may only edit docs/ROUND2_THREE_DAY_TRACKER.md for this task.
```

Replace `[STEP_ID]` with e.g. `D1-05`, `D1-06`.

---

## §GATE1 — Push without secrets

After A1 and B both stopped and local build/test pass:

```bat
cd /d D:\voice-kit
git status
git ls-files | findstr /i ".env .pem .key node_modules dist"
git grep -n -i -E "api[_-]?key|secret|token|password|PRIVATE KEY"
git add -A
git status
git commit -m "BimaBol core"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/bimabol.git
git push -u origin main
```

- `findstr` on tracked files: should print nothing (except review false positives carefully).
- `git grep` in `src/`: should print nothing (README/SECURITY may mention words in prose after Chat B).

Open GitHub **Actions** — first run may be red until code is complete; note status.

Suggested follow-up commits (not one blob): Dexie, parser, report flow, Docker, case screen, fixes, polish.

---

## §GATE2 — Typed E2E (dev server)

`npm run dev` → desktop Chrome.

- [ ] Home: safety text + "हे सरकारी किंवा विमा कंपनीचे अॅप नाही."
- [ ] First mic: browser speech service notice
- [ ] `/report`: type 6-step flow; confirm with हो
- [ ] Case created; clock h/m + icon; survives reload
- [ ] `/case/:id`: script only entered fields; ends "कृपया तिकीट क्रमांक द्या."
- [ ] `tel:14447` visible; WhatsApp `wa.me/917065514447`; policy/mobile off by default
- [ ] Ticket `AB12CD` char repeat; reject `AB1`, `AB-12`
- [ ] Evidence photo; checklist; no GPS
- [ ] Integrity "नोंद अखंड आहे ✓"
- [ ] Print share JSON export; Delete everything
- [ ] Two operator profiles
- [ ] `/demo` डेमो डेटा + parsed sentences
- [ ] `npm run build` + `npm test`

**Tamper:** IndexedDB edit event → reload → "नोंदीत बदल आढळला ⚠" (or demo tamper button).

Fail → §8.7, commit, re-test.

---

## §GATE3 — Docker clean clone

```bat
cd /d %TEMP%
git clone https://github.com/YOUR-USERNAME/bimabol.git
cd bimabol
docker compose up --build
```

- [ ] No `.env` in clone
- [ ] `http://localhost:8080` main screen
- [ ] `docker ps` healthy
- [ ] No CSP "Refused to" in Console; security headers on document + `sw.js`
- [ ] SPA reload on `/report`, `/case/...`
- [ ] GitHub Actions green

Fail → §8.8

---

## 6. File ownership (from Master Plan §6)

| Chat | May edit | Must not touch |
|------|----------|----------------|
| A1 | `src/`, `package.json`, lockfile | Dockerfile, nginx, `.github`, `docs/`, README, `.gitignore` |
| B | Docker, nginx, compose, `.github`, SECURITY, README, `docs/DECK.md`, `docs/DEMO_SCRIPT.md` | `src/`, `package.json`; not runbook/tracker |
| A2 | `src/` + tests | infra |
| C, D, E | per prompt | — |

---

## 7. Gotchas (symptom → remember)

1. nginx `add_header` in `location` drops server headers → repeat with `always`
2. Healthcheck: `wget` `127.0.0.1:8080` not `curl` in image
3. `"test": "vitest run"` not bare `vitest`
4. `npm ci` needs matching lockfile
5. CSP only in production/Docker/Vercel
6. Mic needs HTTPS on phone (Vercel)
7. WhatsApp `917065514447`
8. Screen record vs mic on Android
9. Stale service worker → clear site data
10. Pure domain tests, no browser for Vitest
11. Baseline commit + "What is new in Round 2"
12. No backend / no Sarvam in this build

---

## 8. Day 2–3 (tracker only)

Sat–Mon steps, Vercel §11, Android §10.3, video §12, deck §13, submit §14: see [ROUND2_THREE_DAY_TRACKER.md](ROUND2_THREE_DAY_TRACKER.md) and [BimaBol_Round2_Master_Plan.md](BimaBol_Round2_Master_Plan.md) §4.

---

## 9. Starter already works (do not rebuild)

From [VOICE_KIT_END_TO_END.md](VOICE_KIT_END_TO_END.md): mic tap/hold, privacy gate, intents, basic parser, PWA shell, `/demo` playground. A1 should **extend**, not replace, unless SPEC requires.

---

*Generated for BimaBol Round 2. Start with **§S0**, then **§8.1** + **§8.2** in parallel.*