# BimaBol pitch deck text (export to PDF)

## Problem and solution

Under PMFBY, farmers must report localised crop loss within 72 hours. Late intimation is a common rejection reason. BimaBol (७२ तास) is a Marathi-first voice PWA: speak the loss, confirm a record, see a conservative 72-hour clock, get the words for helpline 14447, save the SMS ticket, and keep evidence on the phone. It does **not** file claims.

## Who and how many

Insured smallholders in Maharashtra; family members and CSC operators. Press-reported hectare figures in `docs/round1.txt` — not all area was insured; **no pilot users yet**; pilot targets are goals, not results.

## Depends on / what if costly or stops

No backend, no paid API, no login — marginal hosting cost only. Web Speech needs network (browser vendor). Typed fallback completes every step. Official channels (14447, Crop Insurance App) remain the filing route. Sarvam / LLM extract from Round 1 are **future options**, not in this build.

## Launch plan

Time steps with 5–10 farmers; pilot ~30 insured farmers in one district via CSC/family helpers; measure ticket saved within 24h and complete records (see `docs/round1.txt` Impact targets).