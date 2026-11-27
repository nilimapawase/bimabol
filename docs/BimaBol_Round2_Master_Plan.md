# BimaBol (७२ तास): Round 2 Master Plan, Cursor Prompts and Submission Guide

Scaler × Wispr Flow "India Runs on Voice" · solo entry · prepared Fri 27 Nov 2026 · all times IST

| | |
|---|---|
| Project folder | `D:\voice-kit` |
| Repo | public GitHub repo named `bimabol` |
| **Deadline** | **Mon 30 Nov 2026, 11:59 PM. One submission only.** |
| Your target | Submit Sun 29 Nov night, or Mon 30 Nov by 6 PM at the very latest |
| Live link | Optional bonus. Must keep working until 2 Dec |

---

## 1. How to use this file

1. Do Section 5 (setup) once.
2. Follow the day plan in Section 4. For each step, copy the matching prompt from Section 8 into a **new** Cursor Agent chat.
3. After each chat, run the gate checks in Section 10 before starting the next one.
4. Appendix A is `SPEC.md` (save it exactly). Appendix B lists the only facts the deck and video may use. Appendix C lists what changed from your earlier plan.
5. Keep this file outside the repo (for example `D:\bimabol-notes\MASTER_PLAN.md`) so it never ends up in the public code.

---

## 2. Where you stand

- **Round 1 passed** (Idea, Prompt, Impact). Round 2 asks for a working voice-first prototype: one core flow that works end to end, not a full product. Extending your Round 1 idea is allowed. Theme: Livelihoods and small business.
- **Product:** BimaBol (७२ तास), a Marathi-first voice PWA for the 72-hour crop-loss reporting window under PMFBY.
- **Existing code:** your voice starter kit in `D:\voice-kit` (Vite, React, TypeScript, Tailwind, PWA, Web Speech, local parser, step flow, demo page). It builds and is staged in Git. It has no commit, no Docker, no tests, and stores data in localStorage.
- **Cursor:** Premium plan, about 3% of the weekly pool used. The pool resets today around 6:52 PM and next on 4 Dec at 6:52 PM. Use Composer 2.5 Fast and check Plan & Usage after each chat.
- **Real versus demo:** helpline numbers, rules, the 36 districts and the crop and loss vocabularies are real. Anything a farmer enters stays on their own phone. There are **no pilot users yet**. Say so in the deck and never invent statistics.
- **Still missing:** the text of "How builds are evaluated" (see Section 3).

---

## 3. What the organisers require

| # | Item | Rule |
|---|---|---|
| 1 | Code on GitHub | Public repo. `docker-compose.yml` so one command starts the app. The main screen must show with no secret keys (a feature that needs a key may show "key not set"). About 300+ lines of your own code written during the hackathon; a template with small changes fails. |
| 2 | Demo video | YouTube, public or unlisted, 3 minutes or less, showing the product working. |
| 3 | Pitch deck (PDF) | They read the text, not the pictures. Cover: problem and solution; who it is for and how many; what it depends on and what happens if it gets costly or stops; launch plan. |
| 4 | Live link | Optional, small bonus. You host it. It should work until 2 Dec. |

Submit once. Their tip: ask a friend to clone your repo and start it.

**Evaluation criteria: not found.** A web search turned up only the launch press release (18 Nov). It says the second round is a time-bound submission, the masterclass covers "guidance on evaluating prototypes", and the top 1,000 teams go to a 24-hour finale on 13 Dec at Scaler's campus in Bengaluru, judged by a jury of industry experts and leaders. The press release also says participants use Wispr Flow to draft specs, work with AI coding tools and document their work by speech. If you do dictate your prompts with Wispr Flow, say so in the README; do not claim it if you did not.

To get the real criteria: replay the blue intro page ("How builds are evaluated" under the See what to build button), watch the masterclass recording at 1.5x, or email wispr.support@scaler.com / ask on Discord. Paste the text to Claude and the plan can be checked against it.

**Inferred judging lens (my inference from the form fields, not confirmed scoring):**

1. A real problem and a real user (Maharashtra farmers, 72 hours).
2. Voice is the main interface: every step works by speaking and listening, with a typed fallback.
3. One core flow works end to end without crashing: speak, confirm, clock, script, ticket, log.
4. Honest about limits and dependencies: not a claim filer, Web Speech needs a network, no pilot users yet.
5. Runs from one command: `docker compose up --build`.
6. A launch plan, and a clear answer to "what if it gets costly or stops".

---

## 4. Day-by-day plan

If you are ahead of this plan, pull Saturday's blocks into Friday evening. The order never changes.

### Fri 27 Nov (today): core build

| Block | Task | Done when |
|---|---|---|
| 30 min | Setup (Section 5) and baseline commit | Tools work, SPEC.md saved, GitHub repo created |
| 50–60 min | Chat **A1** and Chat **B** in parallel, in two chats | Both stopped with a file list; `npm run build` and `npm test` pass |
| 15 min | **Gate 1**: secret scan, commit, push (Section 9) | Pushed; Actions tab shows a run |
| 55–60 min | Chat **A2** | `npm run build` and `npm test` pass |
| 30–40 min | **Gate 2**: typing-only run of the whole flow (Section 10.1), fix with the Generic fix prompt, commit, push | Whole flow works by typing |

### Sat 28 Nov: review, Docker, phone

| Block | Task | Done when |
|---|---|---|
| 40–60 min | Chat **C** (Ask, then Agent fix) | Build and tests pass |
| 30 min | Docker clean-clone test (Section 10.2) | Main screen at localhost:8080, no `.env` |
| 20 min | Deploy to Vercel (Section 11) | HTTPS link opens on your phone |
| 45 min | Android voice test (Section 10.3); fix with the voice fix prompt | Issue list closed or accepted |
| 15 min | Commit, push, **Gate 3**: CI green | Green tick in Actions |

Chat **D** only if all of the above is finished.

### Sun 29 Nov: polish, proof, submit

| Block | Task | Done when |
|---|---|---|
| 30 min | Chat **E** final polish | Build and tests pass |
| 20 min | Friend clone test (Section 10.5) | Friend sees the main screen |
| 60 min | Demo video: record, upload to YouTube as unlisted (Section 12) | Video is 3:00 or less |
| 45 min | Deck PDF from `docs/DECK.md` (Section 13) | Text is selectable |
| 15 min | **Gate 4** and submit (Section 14) | Confirmation screenshot saved |

**No new features after Sun 6 PM. Fixes only.**

### Mon 30 Nov: buffer

Fixes only. Submit by 6 PM. The portal closes at 11:59 PM, and you cannot resubmit.

### After

Keep the Vercel link alive until 2 Dec. Shortlist is announced 2 Dec. Finale 13 Dec for the top 1,000 teams.

### Cut order if you fall behind

Chat D first, then operator mode, then the JSON export. **Never cut:** Docker working with no keys, tests passing, the voice report flow with typed fallback, the clock, the case script with Call 14447, the ticket, the tamper-evident log, the safety text.

---

## 5. Setup checklist (Friday, before any chat)

Use Command Prompt (`cmd`) in `D:\voice-kit`.

1. **Tools check:** run `node -v`, `git --version`, `docker --version`. If Docker Desktop will not start, rely on the GitHub Actions Docker check from Chat B, but still get one real clean-clone run (yours or a friend's) before submitting.
2. **Baseline commit first**, before adding SPEC.md, so the history shows what existed before Round 2:
   ```
   cd /d D:\voice-kit
   git status
   git ls-files | findstr /i "node_modules dist .env"
   git commit -m "Voice starter kit baseline (before Round 2)"
   ```
   The second command must print nothing. If it lists `node_modules` or `dist`, run `git rm -r --cached node_modules dist` first and make sure `.gitignore` lists them. If Git says "Please tell me who you are", run `git config --global user.name "Your Name"` and `git config --global user.email "you@example.com"`.
3. **Save `SPEC.md`** from Appendix A, exactly, into `D:\voice-kit`. In File Explorer turn on View → Show → File name extensions so it is not `SPEC.md.md`. Check with `dir SPEC.*`.
4. **Create `D:\voice-kit\docs`** and copy your Round 1 file `hackthon_1.txt` into it as `round1.txt` (Chat B reads facts from it). If you no longer have it, paste your Round 1 Idea, Prompt and Impact text into `docs\round1.txt`.
5. **Check `VOICE_KIT_END_TO_END.md` exists** in the repo. If it does not, delete that file name from the A1 prompt.
6. **GitHub:** create a **public** repo named `bimabol`, empty (no README, no .gitignore, no licence). Then:
   ```
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/bimabol.git
   ```
7. **Cursor settings:** Agent mode, folder `voice-kit`, location This PC (not Cloud), model Composer 2.5 Fast, Auto off, no Projects, no Multitask. If a chat fails twice, switch that chat to Grok 4.7 Medium.
8. **Verify the official numbers once** on the official PMFBY or Krishi Rakshak pages: helpline 14447 and WhatsApp 7065514447. A wrong number in a farmer app is the worst possible bug.

---

## 6. Order of work and file ownership

```
Setup + baseline commit
   ├─ Chat A1 (src/, package.json) ──┐
   └─ Chat B (infra + docs)          ├─> Gate 1 -> push
                                     ┘
Chat A2 (src/ rest) -> Gate 2 -> push
-> Chat C (Ask, then Agent fix) -> Docker clean clone -> Vercel -> Android test -> fixes -> Gate 3
-> Chat E (polish) -> friend test -> video + deck -> Gate 4 -> SUBMIT
Chat D only if you are ahead.
```

| Chat | May edit | Must not touch |
|---|---|---|
| A1 | `src/`, `package.json`, lockfile | Dockerfile, nginx, `.github`, `docs/`, README, `.gitignore` |
| B | Dockerfile, `nginx/`, compose, `.dockerignore`, `.gitignore`, `.env.example`, `vercel.json`, `.github/`, SECURITY.md, `docs/`, README | `src/`, `package.json`; no npm, no docker |
| A2 | `src/` and tests | infra files |
| C, D, E | as stated in each prompt | |

Rules: one new chat per prompt. Never run two chats that edit the same files. Do not `git add` until both A1 and B have stopped.

---

## 7. Gotchas I found when checking the SPEC

These are already folded into the prompts in Section 8. They are listed so you recognise the symptom.

1. **nginx header inheritance.** If a `location` block (for example the one that sets no-cache on `sw.js`) has its own `add_header`, nginx silently drops the server-level security headers there. Fix: repeat them or use an include file, with `always`.
2. **Healthcheck command.** The image may have no `curl`. Use the alpine `nginx-unprivileged` image and `wget` against `127.0.0.1` (not `localhost`, which can resolve to IPv6). CI can use `curl` because it runs on the runner, not in the container.
3. **`npm test` must run once and exit.** Use the script `"test": "vitest run"`. Plain `vitest` waits in watch mode and hangs CI.
4. **`npm ci` needs a lockfile that matches `package.json`** and a Node version Vite supports. A1 must keep `package-lock.json` in sync; B must pick the Node major from the Vite version in `package.json`.
5. **CSP bugs only show in production.** `npm run dev` ignores nginx headers. After Docker or Vercel is up, open DevTools → Console and look for "Refused to ..." messages. `script-src 'self'` blocks any inline script.
6. **The microphone and `crypto.subtle` need a secure context.** `http://192.168.x.x:8080` from your phone will not work. Test on the Vercel HTTPS link, or use Chrome remote debugging port forwarding (`chrome://inspect`, forward 8080 to localhost:8080).
7. **WhatsApp links need the country code:** `https://wa.me/917065514447?text=...`. `wa.me/7065514447` will not open the right chat.
8. **Screen recording can steal the mic.** On many Android phones the screen recorder and Chrome speech recognition cannot both hold the microphone. Test a short take first. If it fails, record the screen without mic audio and add a voice-over, or film the phone with a second device.
9. **Stale service worker.** After a redeploy, an old build can keep serving from cache. Test in a fresh Chrome profile or use Clear site data.
10. **Tests should not need a browser.** Keep domain logic (clock, parser, hash chain) as pure functions with an injectable "now", so Vitest needs no IndexedDB. Use canonical JSON with sorted keys for the hash.
11. **The starter kit predates Round 2.** The baseline commit plus a README section "What is new in Round 2" (Chat E) keep this honest and visible. The Round 2 code (Dexie, domain logic, hash-chained log, case screen, evidence, export, Docker, CI, tests) is far more than 300 lines.
12. **No backend in this build.** Your Round 1 text mentions Sarvam and an optional `/api/extract`. This build has neither. The deck must say they are future options, not part of this build.

---
## 8. Cursor prompts (copy and paste)

Run in this order: **A1 and B together**, then **A2**, then **C**, then **E**. D is optional. Always start a new chat. Each prompt below is a single block; paste the whole block.

### 8.1 Chat A1: core app

Agent mode, Composer 2.5 Fast. Run at the same time as Chat B.

```text
Read SPEC.md, the existing code and VOICE_KIT_END_TO_END.md. Rename the package to bimabol. Do ONLY: Dexie storage migration, domain logic (clock, event time, hash-chained event log), parser extensions (crops, loss types, 36 districts, time phrases, numbers), the /report flow (steps 1-6), the Home page with case cards and clocks, the safety text, and Vitest tests for parser, clock and hash chain.

Rules: do not touch Dockerfile, nginx, .github, docs, README or .gitignore. Add dexie and vitest only; keep dependencies minimal. In package.json set the script "test" to "vitest run" and keep "build" working. Run npm install (not npm ci) so package-lock.json stays in sync. Write the domain logic (clock, parser, event time, hash chain) as pure functions with an injectable "now" and no Dexie imports, so tests need no browser. Use canonical JSON with sorted keys for the hash chain. Use WebCrypto SHA-256. Parser tests: 25 sentences (10 Marathi, 10 Hindi, 5 mixed).

Run npm install, npm run build and npm test; fix every error; then stop and list what to test. State assumptions at the end; do not ask questions.
```

**Done when:** it stopped, `npm run build` and `npm test` pass, and it listed what to test.

**If A1 fails twice** (it is a large chat), split it into A1a and A1b, each in a new chat, run one after the other:

```text
Read SPEC.md, the existing code and VOICE_KIT_END_TO_END.md. Rename the package to bimabol. Do ONLY: add dexie and vitest, the Dexie storage migration (keep the privacy-dismissed flag in localStorage), domain logic (clock, event time, hash-chained event log) as pure functions with an injectable "now" and no Dexie imports, canonical JSON with sorted keys, and Vitest tests for clock and hash chain (valid chain, tamper detected). Set the script "test" to "vitest run". Do not touch Dockerfile, nginx, .github, docs, README or .gitignore. Run npm install, npm run build and npm test; fix every error; then stop and list what to test. State assumptions at the end; do not ask questions.
```

```text
Read SPEC.md and the current code. Do ONLY: parser extensions (crops, loss types, 36 districts with fuzzy match and folding, time phrases, numbers, mixed speech), the /report flow (steps 1-6), the Home page with case cards and clocks, the safety text, and Vitest parser tests with 25 sentences (10 Marathi, 10 Hindi, 5 mixed) plus intent tests. Do not touch Dockerfile, nginx, .github, docs, README or .gitignore. Run npm run build and npm test; fix every error; then stop and list what to test. State assumptions at the end; do not ask questions.
```

### 8.2 Chat B: infrastructure and docs

Agent mode, Composer 2.5 Fast. Run at the same time as Chat A1.

```text
Read SPEC.md. Do ONLY infrastructure and docs. Do not edit src/ or package.json and do not run npm or docker. You may read package.json.

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
- docs/DECK.md: pitch-deck text with the 4 required sections (problem and solution; who it is for and how many; what it depends on and what happens if it gets costly or stops; launch plan), using only facts in docs/round1.txt or SPEC.md. Do not invent statistics. State plainly that there are no pilot users yet and that the pilot numbers are targets, not results. State that this build has no backend and no paid API, and that Sarvam or /api/extract from Round 1 are future options, not part of this build.
- docs/DEMO_SCRIPT.md: a 3-minute script with timings that total 2:45 or less.

Stop and list the files created.
```

**Done when:** all files exist. Skim `nginx/nginx.conf` for the repeated headers and `docker-compose.yml` for the `wget` healthcheck.

### 8.3 Chat A2: case screen and the rest

Agent mode, Composer 2.5 Fast. Start only after A1 has finished.

```text
Read SPEC.md and the current code. Do ONLY the CASE screen and the rest: script screen and read-aloud, Call 14447, WhatsApp prefilled link, ticket capture (character-by-character repeat), evidence checklist with photo capture (resize, SHA-256, IndexedDB), tamper-evident log display with verification, export (printable "Self-maintained farmer record", share text, JSON), operator profiles, /demo page with demo data and 25 test sentences, /about page, offline banner and Delete everything.

Details: the WhatsApp link must use the international format https://wa.me/917065514447?text=... with encodeURIComponent; add policy number and mobile only if the user ticks a box (default off). Never read GPS or EXIF location. Show the safety text on the case screen, clock, script and log.

Small additions, do these LAST and skip them if time is short: (1) on /demo, a button "Demo: tamper with record" (demo case only) that edits one stored event so the integrity check shows "नोंदीत बदल आढळला ⚠", and a "Repair demo" button that restores it; (2) show a "Record fingerprint" (first 12 characters of the latest hash) on the printable page and in the share text.

Add tests for new logic. Run npm run build and npm test; fix errors; stop and list what to test. State assumptions at the end; do not ask questions.
```

### 8.4 Chat C: review, then fix

Grok 4.7 Medium. **First in Ask mode:**

```text
Review the whole repo against SPEC.md and the hackathon rules (public repo, docker compose up works with no keys and shows the main screen). List bugs, security issues (XSS, CSP breaks, secrets, PII leaks), missing SPEC items, and mobile/voice problems, ordered by severity, each with file path and a one-line fix. Also check: CSP violations in a production build (inline scripts, service worker registration), nginx header inheritance in location blocks, that the healthcheck command exists in the image, that a clean clone with no .env runs with docker compose up --build, that README commands match package.json scripts, and that wa.me uses the 91 country code. Do not change code.
```

**Then switch to Agent mode and send:**

```text
Fix the critical and high items you listed. Run npm run build and npm test, then stop and list what you changed.
```

### 8.5 Chat D: optional weather reference

Only if you are ahead. Composer 2.5 Fast, Agent mode.

```text
Read SPEC.md. Add an opt-in "weather reference" button on the case screen that checks recent rain and hail weather codes near the village using Open-Meteo (free, no key). Show it as reference only, never proof. Add its hosts to connect-src in nginx.conf and vercel.json. If the geocoding or forecast request fails, show a short message and continue. Check the API addresses in the Open-Meteo docs. Add a test. Run npm run build and npm test, then stop.
```

### 8.6 Chat E: final polish

Composer 2.5 Fast, Agent mode. Run on Sunday after the Android test fixes.

```text
Read SPEC.md and the whole repo. Final polish only, no new features:
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

### 8.7 Generic fix prompt (any failing chat)

```text
Read SPEC.md and the current code. Fix only this problem: [paste the exact error or describe what you saw]. Run npm run build and npm test, then stop and tell me how to check it.
```

### 8.8 Docker fix prompt

```text
Read SPEC.md, Dockerfile, docker-compose.yml and nginx/nginx.conf. docker compose up --build fails or the container is unhealthy with this output: [paste output]. Fix only the Docker and nginx files. Keep the SPEC security headers, non-root, cap_drop ALL and no-new-privileges. Do not edit src/. Tell me the exact command to retest.
```

### 8.9 Voice fix prompt (after the Android test)

```text
Read SPEC.md and the current code. On an Android phone in Chrome with mr-IN, this happened: [what you said, what the app heard, what it should have done]. Fix only this voice or parser behaviour. Keep the typed fallback working. If it is parser logic, add a test with this exact sentence. Run npm run build and npm test, then stop and tell me how to check it.
```

---

## 9. Git: push without secrets

Run from `D:\voice-kit` in Command Prompt, replacing `YOUR-USERNAME`:

```
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

- The second command should print nothing. The only acceptable match is `.env.example` (it is empty apart from comments). A path that merely contains the letters "dist" is a false alarm; look at it, do not ignore it blindly.
- The third command should print nothing in `src/`. After Chat B finishes, README and SECURITY.md will legitimately contain words like "secret" or "API key" in sentences such as "no API key is needed". Read each hit. A real key means: remove it, and if it was already pushed, treat it as leaked and rotate it.
- If `git remote add` says the remote already exists (you added it in setup), skip that line.
- After the first push, open the repo's **Actions** tab and check for a green tick. It may be red until A1 and B are both pushed; that is expected.
- Make several commits during the project, not one. Examples:

```
git add -A
git commit -m "Add Dexie storage and hash-chained event log"
git commit -m "Add parser extensions and 25 test sentences"
git commit -m "Add voice report flow and home clocks"
git commit -m "Add Docker, nginx headers and CI"
git commit -m "Add case screen, ticket and evidence"
git commit -m "Fix review findings"
git commit -m "Final polish"
git push
```

---
## 10. Test checklists (the gates)

### 10.1 Gate 2: typing-only run (dev server)

Run `npm run dev` and open the printed localhost address in desktop Chrome.

- [ ] Home loads, shows the safety text and the "हे सरकारी किंवा विमा कंपनीचे अॅप नाही." line.
- [ ] The first mic use shows the notice that speech may be sent to the browser's speech service.
- [ ] `/report`: type the report from the 6-step flow (who, setup, crop, village, loss, time). Confirm with the Marathi "हो" button or typing.
- [ ] A case is created. The clock shows hours and minutes with an icon, and it survives a reload.
- [ ] `/case/:id`: the script shows only the items you entered (nothing invented) and ends with "कृपया तिकीट क्रमांक द्या."
- [ ] Call 14447 (`tel:14447`) is always visible. The WhatsApp link opens `wa.me/917065514447` with the summary; policy number and mobile are off by default.
- [ ] Ticket: typing `AB12CD` is repeated character by character, confirmed and saved. `AB1` and `AB-12` are rejected (4–30 letters or digits).
- [ ] Evidence: a photo is added, the checklist ticks, no GPS is read.
- [ ] The integrity line shows "नोंद अखंड आहे ✓".
- [ ] Printable "Self-maintained farmer record", share text and JSON download (no photos) all work.
- [ ] Delete everything clears Dexie, localStorage and caches.
- [ ] Operator mode: create two profiles, each with its own cases.
- [ ] `/demo` shows the डेमो डेटा farmer and the test sentences with parsed output.
- [ ] `npm run build` and `npm test` pass.

**Tamper test:** DevTools → Application → IndexedDB → edit one event's payload → reload the case. You must see "नोंदीत बदल आढळला ⚠". (If A2 added the demo tamper button, use that instead.)

### 10.2 Gate 3: Docker clean-clone test

In a temp folder, not your working folder:

```
cd /d %TEMP%
git clone https://github.com/YOUR-USERNAME/bimabol.git
cd bimabol
docker compose up --build
```

- [ ] There is **no `.env` file** in the clone.
- [ ] `http://localhost:8080` shows the main screen.
- [ ] `docker ps` shows the container as healthy.
- [ ] DevTools → Console has no "Refused to ..." CSP errors, and the Network tab shows the security headers on the page and on `sw.js`.
- [ ] Reload works on `/report` and `/case/...` (SPA fallback).
- [ ] The GitHub Actions run is green.

If it fails, use the Docker fix prompt (8.8).

### 10.3 Android voice test (on the Vercel link)

Use Chrome on Android with the Marathi voice and speech services installed.

- [ ] Mic permission prompt appears after the privacy notice.
- [ ] Say: **आज सकाळी गारपीट झाली, माझ्या सोयाबीनचे नुकसान झाले, गाव खेडगाव.** Expected: crop soybean, loss hail, village खेडगाव, event time today 06:00.
- [ ] Say: **काल रात्री ढगफुटी झाली, कापूस गेला, वर्धा जिल्हा.** Expected: cotton, cloudburst, Wardha, yesterday 19:00.
- [ ] Say: **परवा दुपारी शेतात पाणी साचले, तूर खराब झाली, अडीच एकर.** Expected: tur, flood or water logging, 2.5 acres, day before yesterday 12:00.
- [ ] Say (Hindi): **कल शाम ओलावृष्टि हुई, मेरी कपास की फसल खराब हो गई, जिला नागपुर.** Expected: cotton, hail, Nagpur, yesterday 17:00.
- [ ] Say (mixed): **आज morning मध्ये hailstorm आला, my soyabean damage झाले.** Expected: soybean, hail, today morning.
- [ ] Say: **6 तासांपूर्वी पूर आला, ऊस पाण्यात गेला.** Expected: sugarcane, flood, 6 hours before now.
- [ ] The read-back is spoken in Marathi, or the text shows if no Marathi voice exists.
- [ ] Saying "गाव बदला" asks only for the village.
- [ ] Silence for 8 seconds triggers "मी ऐकत आहे. तुम्ही बोलू शकता."
- [ ] A noisy or unclear phrase triggers the retry or the typed fallback for that field only.
- [ ] Call 14447 opens the dialer (do not complete the call). Say a ticket number and hear it repeated character by character.
- [ ] Take a photo with the camera; the checklist ticks.
- [ ] The integrity check shows ✓.
- [ ] **Airplane mode:** the banner "इंटरनेट नाही. टाइप करा. घड्याळ चालू आहे." appears, and typing finishes every step.

Every mismatch becomes one voice fix prompt (8.9) with the exact sentence.

### 10.4 Gate 4: repo and links

- [ ] Repo is public (check in an incognito window).
- [ ] No secrets, `.env`, photos, `node_modules` or `dist` in the repo.
- [ ] README has run-locally, Docker, tests, demo data, browser limits, privacy and "What is new in Round 2".
- [ ] Actions tab is green.
- [ ] Vercel link opens in incognito (if it asks for a Vercel login, turn off Deployment Protection in the project settings).
- [ ] YouTube link plays in incognito and is 3:00 or less.
- [ ] Deck PDF text is selectable.

### 10.5 Friend test

Send a friend this message:

> Please clone https://github.com/YOUR-USERNAME/bimabol, run `docker compose up --build`, open http://localhost:8080 and tell me if you see the main screen. Do not create any .env file. Tell me if anything fails and paste the error.

If they have no Docker, a green CI run plus your own clean-clone test is the fallback.

---

## 11. Deploy to Vercel (optional bonus, and your phone test link)

1. Sign in at vercel.com with GitHub, choose Add New → Project, and import `bimabol`.
2. Framework preset Vite, build command `npm run build`, output directory `dist`. **No environment variables.**
3. Deploy, then open the `https://...vercel.app` link on your Android phone. Speech and the camera need HTTPS, which this gives you.
4. Check that the page response carries the same security headers as nginx (DevTools → Network → the document request).
5. Open the link in incognito. If it asks you to log in to Vercel, turn off Deployment Protection in the project settings.
6. It must keep working until 2 Dec. Do not delete the project or the repo before then.

---

## 12. Demo video (3:00 or less)

Aim for 2:45. Record the real app, in Marathi. `docs/DEMO_SCRIPT.md` from Chat B is the detailed version; this is the skeleton.

| Time | Show | Say or caption |
|---|---|---|
| 0:00–0:15 | Title, then the phone in a field-like setting or a still | One sentence: 72 hours to report crop loss, and one confusing minute can cost a claim. |
| 0:15–0:35 | Open the app, privacy notice, tap **नुकसान सांगा** | Voice is the main way to use it. |
| 0:35–1:10 | Speak the soybean hail sentence; read-back; say "हो"; the 72-hour clock starts | The app confirms what it heard before it saves anything. |
| 1:10–1:35 | Case screen: script read aloud; Call 14447 button (dialer opens, do not call); WhatsApp button | It reads the exact words for the helpline. |
| 1:35–1:55 | Say the ticket number; the app repeats it character by character | The ticket from the SMS is saved with the time. |
| 1:55–2:15 | Take a photo; evidence checklist ticks | The photo is stored on the phone, with a SHA-256 and no GPS. |
| 2:15–2:35 | Integrity ✓, then tamper (demo button or DevTools) and ⚠ | A tamper-evident log: it detects edits, it is not legal proof. |
| 2:35–2:50 | Airplane mode, type a step, open the printable record | Works offline by typing. |
| 2:50–3:00 | Limits slide | Not a claim filer. No pilot users yet. Data stays on the phone. |

Tips: do a 10-second test take first (gotcha 8 in Section 7). Do not dial 14447 on camera. Upload to YouTube as **Unlisted**, then check the duration and play it in incognito. Do not show a real policy number or phone number; use the डेमो डेटा farmer.

---

## 13. Pitch deck PDF

They read the text, so every slide needs real selectable text. Chat B writes `docs/DECK.md`; you check it against Appendix B and convert it.

| Slide | Content |
|---|---|
| 1 | BimaBol (७२ तास) and the one-line promise. Mention "not a government or insurer app". |
| 2 | **Problem:** 72-hour rule for localised calamities; a stressed farmer must remember policy number, crop, village and time; the Wardha farmer story (as reported in the press); weak networks and app failures acknowledged in the 4 Aug 2026 Lok Sabha answer. |
| 3 | **Solution:** the voice flow: speak, hear it back, clock, 14447 script, tap to call, ticket, evidence, tamper-evident dated record. What it does not do. |
| 4 | **Who and how many:** insured smallholders in Maharashtra, plus family members and CSC operators. Use only the hectare figures in Appendix B, and say not all land was insured and no count of farmers who miss the window was found. |
| 5 | **Depends on and what if costly or stopped:** no backend, no paid API, no login, so no per-use cost; Web Speech is the browser's service (needs a network, sends audio to the browser vendor), and if it stops, typing and big buttons still complete every step; the official channels (14447, Crop Insurance App) remain the real filing route; if hosting stops, an installed PWA keeps working offline; Sarvam and AI extraction are future options only if funded. |
| 6 | **Launch plan:** time the steps with 5 to 10 farmers first; then a pilot of about 30 insured farmers in one district; work through CSC operators and family members; targets below. |
| 7 | **Risks:** false comfort from a clock, unclear start time, wrong village or policy number, farmers who will never open a new app. |
| 8 | What is built (Round 2), repo link, demo link, live link. |

Pilot numbers are **targets, not results**: at least 24 of 30 save a 14447 ticket or mark the call within 24 hours of speaking the loss; at least 27 confirmed records contain crop, village, loss type and time.

**Export to PDF with real text:** paste each slide into Google Slides or PowerPoint and download or export as PDF, or open the Markdown in a viewer and use Print → Save as PDF. Then open the PDF, press Ctrl+F and search for `14447`. If it finds it, the text is real.

---

## 14. Submission checklist (do it once, calmly)

1. Open a notes file with the three links ready: repo URL, YouTube URL, deck PDF, and the live link if you have one.
2. Run Gate 4 (Section 10.4) in full.
3. Make sure your latest push is the final code and the Actions run is green.
4. Submit on the portal. **One submission only.** Do not submit in the last hour.
5. Save a screenshot or the confirmation text.
6. Do not push breaking changes after submitting. Only fix things you would be happy for a judge to see.

---

## 15. After you submit

- Keep the Vercel link alive until 2 Dec.
- Shortlist: 2 Dec. Finale: 13 Dec, 24 hours at Scaler's campus in Bengaluru, for the top 1,000 teams.
- Next Cursor pool reset: 4 Dec, 6:52 PM.
- Keep the repo, SPEC.md and this file. A finale build can reuse the same prompts and gotchas.

---
## Appendix A: SPEC.md (save exactly as `D:\voice-kit\SPEC.md`)

```text
BimaBol (७२ तास) - SPEC.md (single source of truth)

PURPOSE
Marathi-first voice PWA. After hail, flood/inundation, cloudburst or landslide damages an insured crop, the farmer (or family member / CSC operator) speaks what happened. The app builds a confirmed record, starts a conservative 72-hour clock, reads the exact words for helpline 14447, saves the SMS ticket number, keeps evidence, and produces a tamper-evident dated record. It does NOT file claims, predict payouts, give legal advice, or replace 14447, the Crop Insurance App, the bank or the agriculture office. Show: "हे सरकारी किंवा विमा कंपनीचे अॅप नाही."

HARD RULES
1. Public GitHub repo. `docker compose up --build` serves the app at http://localhost:8080 and shows the main screen with NO secret keys.
2. Substantial original code. No template-only code.
3. Never commit secrets, .env, keys, evidence photos, node_modules, dist.
4. No Aadhaar, GPS, bank account numbers, analytics, stored audio, login, or cloud copy of farmer data.

STACK
Keep Vite, React, TypeScript, Tailwind, react-router, vite-plugin-pwa and the existing src/parse, src/flow, src/speech. Add dexie (IndexedDB) and vitest. Move saved data from localStorage to Dexie (keep the privacy-dismissed flag in localStorage). Rename the package to bimabol.

ROUTES
/ Home | /report Voice report | /case/:id Case | /demo Test sentences and demo data | /about Privacy, dependencies, limits
Bilingual labels (Marathi + English), language switch mr-IN / hi-IN / en-IN, large buttons, high contrast.

VOICE RULES
- App speaks calm plain Marathi, one idea, under 20 words, beeps, then listens. After 8 s silence: "मी ऐकत आहे. तुम्ही बोलू शकता."
- Any step accepts: हो, नाही, पुन्हा सांगा, हळू, थांबा, फोन करा, हिंदी, English, बदला.
- Confidence under 0.6: repeat what was heard and wait for हो/नाही. Under 0.35: "नीट ऐकू आले नाही. कृपया पुन्हा सांगा." Mostly Latin letters from mr-IN: retry en-IN, then hi-IN. High noise: "आवाज जास्त आहे, मोबाईल तोंडाजवळ धरा" and use hold-to-talk. Two failures: typed field or big buttons for that field only. Offline: "इंटरनेट नाही. टाइप करा. घड्याळ चालू आहे." and typing completes every step.
- No Marathi TTS voice: show the text on screen.
- Before the first mic use, show that speech may be sent to the browser's speech service.

REPORT FLOW (/report)
1 Open: big button "नुकसान सांगा". 2 Who: self or another farmer (ask and store the name). 3 Setup once, voice or typed, saved only after हो: 10-digit mobile, policy/enrolment number (read in groups), bank branch NAME only. 4 Report, spoken freely: crop, village, taluka, district, loss type, area (optional), event time, discovery time. 5 Gaps: at most 3 one-line questions (कोणते पीक? कोणते गाव? हे केव्हा झाले?). 6 Confirm: "मला असे समजले आहे: पीक …, गाव …, नुकसान …, वेळ …. बरोबर आहे का?" हो saves; "गाव बदला" asks only that field. Then create the case.

PARSER (extend existing, local, offline)
- Crops (MR/HI/EN): soybean सोयाबीन, cotton कापूस, tur तूर, jowar ज्वारी, bajra बाजरी, maize मका, paddy भात, groundnut भुईमूग, gram हरभरा, wheat गहू, onion कांदा, sugarcane ऊस, banana केळी, grape द्राक्ष, pomegranate डाळिंब, orange संत्रा, mango आंबा, turmeric हळद and similar.
- Loss types: hail गारपीट, flood/inundation पूर / पाणी साचले, cloudburst ढगफुटी, landslide दरड/भूस्खलन. For widespread loss, drought, pests, wild animals, or paddy inundation: show "नियम वेगळे असू शकतात, १४४४७ ला विचारा" and still allow the case.
- All 36 Maharashtra districts (Marathi and English) with fuzzy match. Fold ळ/ल, श/ष/स, ण/न and vowel length.
- Time: आज सकाळी = today 06:00, दुपारी 12:00, संध्याकाळी 17:00, रात्री 19:00; काल/कल, परवा, "N तासांपूर्वी". Always use the EARLIEST time in the period, Asia/Kolkata.
- Numbers: साडेतीनशे, दीड, सव्वा, अडीच, डबल/double, Devanagari digits.
- Mixed speech: "आज morning मध्ये hailstorm आला, my soyabean damage झाले" gives soybean, hail, today morning.

CLOCK
Deadline = event time + 72 hours. Show hours and minutes: green above 48h, amber 24-48h, red under 24h, with an icon, not colour alone. Survives reload. In-app reminders at 24/12/6/1h (browser Notification only if permitted and the app is open). Start: "७२ तासांचे घड्याळ सुरू. वाट पाहू नका. आत्ताच कळवा." Late: "वेळ निघून गेली असू शकते, तरीही आत्ताच १४४४७ वर कळवा आणि नोंद ठेवा." Also say the official start time can be disputed, so report now.

CASE SCREEN (/case/:id)
- Large script (name, village, taluka, district, crop, loss, event time, policy, mobile; omit missing items; invent nothing), read aloud, ending "कृपया तिकीट क्रमांक द्या."
- Call 14447 (tel:) always visible. WhatsApp 7065514447 button with a prefilled summary (wa.me, URL-encoded; policy number and mobile only if the user ticks a box, default off).
- Ticket: "फोन झाल्यावर SMS मधील तिकीट क्रमांक सांगा." Accept spoken or typed, 4-30 letters/digits, repeat character by character, confirm, save with time.
- Evidence checklist by voice or tap: dated photos, policy copy, passbook photo (never store an account number), witness name, survey/गट number. "फोटो काढले" ticks photos. Photo capture: input type=file accept=image/* capture=environment; resize to max 1280px; store in IndexedDB with SHA-256 and capture time; never read GPS. Note that the official Crop Insurance app may ask for a geotagged photo.
- Export: printable page titled "Self-maintained farmer record" (print CSS), Web Share text, JSON download (no photos).

TAMPER-EVIDENT LOG (key differentiator)
Append-only events per case: report_confirmed, call_tapped, whatsapp_opened, ticket_saved, evidence_added. Each event has id, type, ISO timestamp with +05:30, minimal payload, prevHash, and hash = SHA-256(prevHash + canonical JSON) using WebCrypto. The case screen verifies the chain and shows "नोंद अखंड आहे ✓" or "नोंदीत बदल आढळला ⚠". call_tapped records the tap time, NOT that a call connected. The About page states honestly that it detects edits to the record, uses the phone's clock, and is not legal proof.

OPERATOR MODE
Profiles (farmer name + mobile) with their own cases; switch profile; all local.

DEMO DATA
A labelled "डेमो डेटा" farmer with a case, and a box that injects 10 Marathi, 10 Hindi and 5 mixed test sentences and shows the parsed output.

SAFETY TEXT (home, clock, script, log)
"हे अॅप क्लेम दाखल करत नाही. विमा कंपनीला किंवा १४४४७ वर त्वरित कळवा. नियम पीक व आपत्तीनुसार बदलू शकतात."

SECURITY
- nginx headers: CSP (default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self'; worker-src 'self'; manifest-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'), Permissions-Policy (microphone=(self), camera=(self), geolocation=(), payment=()), X-Content-Type-Options nosniff, Referrer-Policy no-referrer, X-Frame-Options DENY. Same headers in vercel.json.
- Treat all speech and typed text as untrusted: no dangerouslySetInnerHTML, validate phone (10 digits) and ticket (4-30 alphanumeric), length limits, escape text in the wa.me URL.
- Docker: multi-stage, nginx-unprivileged on 8080, non-root, cap_drop ALL, no-new-privileges, healthcheck.
- Hygiene: .gitignore (.env*, node_modules, dist, .cursor, evidence/photos), empty .env.example, npm audit with no high/critical issues, minimal dependencies.
- Delete everything wipes IndexedDB, localStorage and caches.

TESTS (vitest, npm test must pass)
Parser: 25 sentences (10 MR, 10 HI, 5 mixed). Clock: deadline, colours, late. Hash chain: valid and tamper-detected. Intents.

DOCS
README: what and why, run locally, run with Docker, tests, demo data, browser limits (Android Chrome best, iOS limited), dependencies and fallbacks (Web Speech needs a network and sends audio to the browser vendor; fallback is typing/buttons), privacy, structure. Also docs/DECK.md and docs/DEMO_SCRIPT.md.

NOT IN SCOPE
Claim filing, payout prediction, backend, accounts, analytics, GPS.
```

---

## Appendix B: Facts the deck and video may use

These come from your Round 1 text. Nothing else should appear as a fact. **Do not state:** user counts, farmers helped, accuracy percentages, payouts, or any statistic not listed here.

**The rule and the channels**
- PMFBY requires intimation within 72 hours for localised calamities (hailstorm, landslide, inundation, cloudburst) through the Crop Insurance App, helpline 14447, the insurer, the bank or the agriculture office.
- The 14447 helpline sends a ticket number by SMS. The WhatsApp chatbot 7065514447 appears in official district notices.
- A Lok Sabha answer on 4 August 2026 keeps the 72-hour rule on 14447, notes app failures and weak networks, and shows no plan to extend the time.
- A Wardha farmer told the press his claim was refused as outside the window although he phoned the helpline at once, and nobody could tell him the reference time.

**Scale (state it carefully)**
- State agriculture department figure, reported in the press: unseasonal rain and hail across 29 districts and 2,04,835 hectares, 14 March to 2 April 2026.
- Minister's figure: 61,004 hectares across 27 districts in May and June 2026, including about 18,121 hectares of banana.
- Not all of that land was insured. No national count of farmers who miss the 72-hour window was found; treat it as unknown and say you plan to measure it.

**What exists and what is the gap**
- Already exist: the 14447 helpline, the Crop Insurance App, WhatsApp 7065514447, Kisan e-Mitra. Fasal Rakshak, 72 Ghante and Fasal Nuksan Sahayak already show a clock or a script.
- The gap you found: no single Marathi flow that does speak the loss, hear it back, read the 14447 script, tap to call, speak the SMS ticket character by character, and keep the log only on the phone.

**Status and targets (be explicit)**
- No farmer has used it yet. There are no pilot users.
- Pilot targets, not results: about 30 insured farmers in one district; at least 24 save a ticket or mark the call within 24 hours; at least 27 confirmed records have crop, village, loss type and time; everyone who finishes can show the dated log a week later. Time the same steps with 5 to 10 farmers first and adjust the targets.
- A later signal, with an insurer or the agriculture department: late-intimation rejections among pilot farmers against a similar group. A finished log is preparation, not a paid claim.

**Main risk to state**
- False comfort: seeing hours left can feel like the claim is safe. The start of the 72 hours is often unclear, a Wardha farmer was refused after calling at once, widespread season-end losses do not need this individual report, and some covers need a geotagged photo in the official app. A misheard village or policy number makes the call worse. Many farmers in a weak-signal field will never open a new app, so a relative or an operator may be the real user.

---

## Appendix C: What I changed compared with your earlier files

Your SPEC is unchanged. These are the differences in the plan and prompts:

1. **Dates and schedule.** Replaced the old Sun 22 to Sun 29 plan with a Fri 27 to Mon 30 plan, with gates and a "no new features after Sun 6 PM" rule. Your same-day timetable is kept as a fast track.
2. **Baseline commit** before Round 2 work, so the history shows what the starter kit was.
3. **A1:** added `"test": "vitest run"`, keep the lockfile in sync, pure domain functions with an injectable now, canonical sorted-key JSON, and "do not touch README or `.gitignore`" (Chat B owns them). Added a two-chat fallback split.
4. **B:** nginx `add_header` inheritance fix, `wget` healthcheck on `127.0.0.1`, Node version from the Vite version, no-cache for `sw.js` in `vercel.json`, CI wait with retries, and explicit deck rules (no backend, no paid API, targets not results).
5. **A2:** `wa.me/917065514447` (country code), and two small last-priority additions: a demo tamper button and a record fingerprint.
6. **C:** extra checks for CSP in production, header inheritance, healthcheck, clean clone and the wa.me number.
7. **E:** also checks that DECK.md, DEMO_SCRIPT.md and README commands match the final app.
8. **New:** voice fix prompt, Docker fix prompt, the Android test sentences with expected results, the demo-video skeleton, the deck slide map, and the submission and after-submit checklists.
9. **Still open:** the "How builds are evaluated" text. When you have it, paste it to Claude and compare it with Section 3.
