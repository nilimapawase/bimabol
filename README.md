# BimaBol (७२ तास)

Marathi-first voice PWA for the PMFBY 72-hour crop-loss reporting window. The farmer speaks the loss into the microphone. The app confirms the record, runs a conservative clock, reads the **14447** script, captures the ticket by voice, and keeps evidence. Typing appears only after the microphone fails twice. **Not** a claim filer.

## What is new in Round 2

Starter kit speech/parse/flow → Dexie, hash-chained log, report/case routes, Docker, CI, Vitest (`npm test`).

## Run locally

```bash
npm install
npm run dev
```

Open **http://localhost:5173** only. On this PC, port 8080 is Oracle Database, not BimaBol. The Vite server is pinned to 5173.

```bash
npm run build
npm run preview
```

Production preview may print another port if 5173 is already taken by `npm run dev`.

## Deploy to Vercel

1. Push this folder to a git remote (GitHub, etc.).
2. Import the repo in [Vercel](https://vercel.com/new).
3. Framework preset: **Vite**. Build command: `npm run build`. Output directory: `dist`.
4. Deploy. The PWA installs from the deployed HTTPS URL on Android Chrome.

## Swap the step config

Edit **`src/config/steps.ts`** only. Each step has `id`, bilingual `prompt` (`mr`, `en`), `parse` mode (`text` | `digits` | `time` | `keyword`), and optional `keywords[]`.

## Browser limits

| Environment | Mic (`webkitSpeechRecognition`) | TTS | PWA install |
|-------------|--------------------------------|-----|---------------|
| **Android Chrome** | Best target; needs network for recognition | Often works for `mr-IN` | Add to Home screen |
| **iOS Safari** | Unreliable or missing (especially installed PWA) | Limited voices | Add to Home Screen only |
| **Firefox desktop/mobile** | Not supported | Varies | Limited |

`/report` and the case screen are voice-first: tap the gold microphone, speak, and the fields fill. After two failed listens, a typed box is the fallback. **`/demo`** parses pasted text without a mic. The microphone needs HTTPS (the Vercel link) on a phone. Chrome desktop on localhost can use it too.

Recognition confidence is often `0` (shown as **unknown**). Marathi voices may be missing; the app shows text on screen instead of speaking.

## Project map

- `src/config/steps.ts` — questions to ask
- `src/flow/` — step loop and confirm intents
- `src/speech/` — recognition, synthesis, privacy gate
- `src/parse/` — digits, time (Asia/Kolkata), Devanagari keyword fold
- `src/pages/ReportPage.tsx` — voice report (mic fills each step)
- `src/pages/FlowPage.tsx` — starter step loop
- `src/pages/DemoPage.tsx` — parser playground

## Docker

```bash
docker compose up --build
```

Open http://localhost:8080 — no `.env` required.

## Tests

```bash
npm test
```

## Security and privacy

See [SECURITY.md](SECURITY.md). Data stays on device (Dexie). Speech may use the browser vendor's service.

## License

MIT (hackathon starter — use and fork freely).