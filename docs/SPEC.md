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