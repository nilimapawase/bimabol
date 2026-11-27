# Voice-first starter kit

Marathi-first, installable PWA for hackathon demos: mic in, speech out, configurable steps, tiny local parser, localStorage only. No backend, login, analytics, or stored audio.

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

## License

MIT (hackathon starter — use and fork freely).