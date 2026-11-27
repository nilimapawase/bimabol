# Round 2 — three-day tracker (BimaBol)

Update this file after every step: tick the box, set **Completed at**, then recompute the counters at the top. Or paste the **TRACK** prompt from [TODAY_PROMPT_RUNBOOK.md](TODAY_PROMPT_RUNBOOK.md) into a small Agent chat (edit `docs/` only).

---

## Live counters

| Metric | Value |
|--------|--------|
| **Round 2 overall** | **9 / 28** complete |
| **Day 1 — Fri 27 Nov 2026** | **8 / 12** |
| **Day 2 — Sat 28 Nov** | **1 / 8** |
| **Day 3 — Sun 29 Nov** | **0 / 6** |
| **Buffer — Mon 30 Nov** | **0 / 2** |

**Deadline:** Mon 30 Nov 2026, 11:59 PM IST (submit earlier if possible: Sun night or Mon by 6 PM)  
**Repo name:** `bimabol` (public GitHub)  
**Local app:** http://localhost:5173 only (8080 on this PC is Oracle, not BimaBol)  
**Project folder:** `D:\voice-kit`  
**Prompts:** [TODAY_PROMPT_RUNBOOK.md](TODAY_PROMPT_RUNBOOK.md)

---

## Day 1 — Fri 27 (code, tests, push tonight)

| ID | Task | Owner | Done | Completed at | Prompt / gate |
|----|------|-------|------|--------------|----------------|
| D1-01 | Tools check, baseline commit, `main`, empty GitHub `bimabol` remote | You | [x] | 2026-11-27 | Runbook **§S0** — baseline + feature commits; **add remote + push** |
| D1-02 | Chat **A1** core app + Vitest | Agent | [x] | 2026-11-27 | Single agent pass |
| D1-03 | Chat **B** Docker, CI, DECK, DEMO_SCRIPT | Agent | [x] | 2026-11-27 | |
| D1-04 | Local `npm install`, `npm run build`, `npm test` | You | [x] | 2026-11-27 | 22 tests pass |
| D1-05 | **Gate 1** — secret scan, commit, push | You | [x] | 2026-11-27 | https://github.com/nilimapawase/bimabol |
| D1-06 | Chat **A2** case, ticket, evidence, export | Agent | [x] | 2026-11-27 | |
| D1-07 | **Gate 2** — typed full flow (§10.1) | You | [x] | 2026-11-27 | Browser: report → case, script, ticket AB12CD char-by-char, integrity, tamper warning. |
| D1-08 | Chat **C** — Ask review | Ask | [ ] | | Runbook **§8.4** (Grok 4.7) |
| D1-09 | Chat **C** — Agent fix critical/high | Agent | [ ] | | Runbook **§8.4** fix block |
| D1-10 | **Gate 3** — Docker clean clone (§10.2) | You | [ ] | | Runbook **§GATE3** |
| D1-11 | GitHub **Actions** green | You | [x] | 2026-11-27 | CI success on `9227df2` |
| D1-12 | **Day 1 sign-off** (all Day 1 boxes + counters updated) | You | [ ] | | |

---

## Day 2 — Sat 28 (phone, HTTPS, CI)

| ID | Task | Owner | Done | Completed at | Notes |
|----|------|-------|------|--------------|-------|
| D2-01 | Deploy **Vercel** (§11 Master Plan) | You | [ ] | | HTTPS for mic/camera |
| D2-02 | **Android voice** test (§10.3) on Vercel URL | You | [ ] | | |
| D2-03 | **Voice fix** chats as needed (§8.9) | Agent | [x] | 2026-11-27 | `/report` and case ticket/evidence are voice-first. Typed fallback after two misses. Phone test still D2-02. |
| D2-04 | Re-run Gate 2 items that broke on phone | You | [ ] | | |
| D2-05 | **Optional Chat D** weather (§8.5) | Agent | [ ] | | Skip if behind |
| D2-06 | Docker / CSP spot-check on production build | You | [ ] | | DevTools Console |
| D2-07 | Commit + push fixes | You | [ ] | | |
| D2-08 | **Gate 3** final — CI green + container healthy | You | [ ] | | |

---

## Day 3 — Sun 29 (polish, video, deck, submit)

**No new features after 6 PM Sun — fixes only.**

| ID | Task | Owner | Done | Completed at | Notes |
|----|------|-------|------|--------------|-------|
| D3-01 | Chat **E** final polish (§8.6) | Agent | [ ] | | |
| D3-02 | **Friend clone** test (§10.5) | You | [ ] | | |
| D3-03 | **Demo video** YouTube ≤3:00 (§12) | You | [ ] | | Use `docs/DEMO_SCRIPT.md` |
| D3-04 | **Deck PDF** from `docs/DECK.md` (§13) | You | [ ] | | Ctrl+F `14447` in PDF |
| D3-05 | **Gate 4** (§10.4) | You | [ ] | | |
| D3-06 | **Portal submit** once (§14) + screenshot | You | [ ] | | |

---

## Buffer — Mon 30 Nov

| ID | Task | Owner | Done | Completed at |
|----|------|-------|------|--------------|
| D4-01 | Fixes only if judges would see them | You / Agent | [ ] | |
| D4-02 | Submit by **6 PM** if not done; portal closes **11:59 PM** | You | [ ] | |

---

## Submission pack (hackathon)

| Deliverable | Done | Link / file |
|-------------|------|-------------|
| Public GitHub + `docker compose up --build` | [ ] | |
| Demo video (YouTube, ≤3 min) | [ ] | |
| Pitch deck (PDF, selectable text) | [ ] | |
| Live link (optional bonus, up to 2 Dec) | [ ] | |

---

## Testing matrix

| When | What | Reference |
|------|------|-----------|
| After A1, A2, C, E | `npm run build`, `npm test` | `docs/SPEC.md` TESTS |
| Day 1 | Gate 2 typed E2E | Master Plan §10.1 / Runbook §GATE2 |
| Day 1–2 | Gate 3 Docker clone | §10.2 / Runbook §GATE3 |
| Day 2 | Android voice §10.3 | Runbook §8.9 per failure |
| Day 3 | Gate 4 + friend §10.5 | Master Plan §10.4–10.5 |

---

## Cut order if behind (never cut these)

**Never cut:** Docker with no keys, tests passing, typed/voice report path, 72h clock, 14447 script, ticket capture, tamper-evident hash log, safety text.

**Cut first:** Chat D → optional demo tamper button → JSON export polish → operator extras.

---

## How to recompute counters

1. Count rows with `[x]` or `[X]` in the Done column (28 total).
2. Update the **Live counters** table at the top.
3. Set **Day N** subcounts (12 + 8 + 6 + 2 = 28).