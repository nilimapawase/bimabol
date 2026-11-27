# BimaBol (७२ तास)

Marathi-first voice PWA for the PMFBY 72-hour crop-loss reporting window. Speaks or types the loss, confirms a record, runs a conservative clock, script for **14447**, ticket capture, evidence, tamper-evident log. **Not** a claim filer.

## What is new in Round 2

Starter kit speech/parse/flow → Dexie, hash-chained log, report/case routes, Docker, CI, Vitest (`npm test`).

## Run locally

```bash
npm install
npm run dev
```

Open the printed URL (usually `http://localhost:5173`). Production build:

```bash
npm run build
npm run preview
```

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

If the mic fails, the flow falls back to typing. **`/demo`** parses pasted text without a mic on all browsers.

Recognition confidence is often `0` (shown as **unknown**). Marathi voices may be missing; the app shows text on screen instead of speaking.

## Project map

- `src/config/steps.ts` — questions to ask
- `src/flow/` — step loop and confirm intents
- `src/speech/` — recognition, synthesis, privacy gate
- `src/parse/` — digits, time (Asia/Kolkata), Devanagari keyword fold
- `src/pages/FlowPage.tsx` — main experience
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