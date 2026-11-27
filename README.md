# BimaBol (७२ तास)

Marathi voice assistant for the first hours after hail, flood, or a similar localised crop loss in Maharashtra, while the PMFBY 72-hour window is still open.

The farmer speaks. BimaBol turns that into a record (crop, village, loss, time), reads it back, starts a conservative clock, reads the words for helpline **14447**, saves the SMS ticket, and keeps evidence on the phone. It does not file a claim, predict a payout, or replace 14447, the Crop Insurance App, the bank, or the agriculture office.

Speaking and listening complete every step. The keyboard appears only after the microphone fails twice, or when there is no internet.

## 72-hour clock (where to see it)

- **Home** — on the status card for the case with the least time left (animated ring, live seconds).
- **Case screen** — full clock after you save a report.

The clock counts down from **72 hours after the event time** (earliest plausible time in that period, Asia/Kolkata). Colours: green above 48h, amber 24–48h, red under 24h, grey if late. It **updates every second** and **survives reload**. Spoken reminders at **24h, 12h, 6h, and 1h** left on the case screen (and in the browser if you allow notifications). If late, the app says to call 14447 anyway and keep the record.

## Run locally

```bash
npm install
npm run dev
```

Open **http://localhost:5173**. The dev server is pinned to that port.

```bash
npm run build
npm test
npm run preview
```

## Live updates (Vercel)

1. Push to the `main` branch on GitHub.
2. [Vercel](https://vercel.com/new) imports this repo once (Vite, `npm run build`, output `dist`).
3. Each new push to `main` rebuilds and updates the live HTTPS URL automatically.

Open that link on Android Chrome, allow the microphone, and add to Home screen.

## Docker (production build in a container)

```bash
docker compose up --build
```

Open **http://localhost:9080** on the host. Inside the container nginx still listens on port 8080; **9080** is used on the host so it does not clash with other software on port 8080. No `.env` is required.

After you change code: run `docker compose up --build` again to refresh the container image.

## Phone

| Browser | Microphone | Spoken reply |
|---------|------------|--------------|
| Android Chrome on Vercel HTTPS | Best | Often has Marathi |
| Desktop Chrome on localhost:5173 | Works | Text on screen if no Marathi voice |
| iOS Safari | Unreliable | Limited |
| Firefox | Not supported | Varies |

**Gold microphone:** hold to speak, or tap once. The app beeps, then listens. Before the first use, a privacy note says speech may go to the browser's speech service.

## Voice flow (matches the product spec)

1. **नुकसान सांगा** — spoken opening line on Home.
2. Who: for you or for another farmer (say it; no typing unless the mic fails).
3. Mobile, policy, branch — by voice, then **हो**.
4. Free report sentence; gaps at most three times.
5. Read-back; **हो** saves, **गाव बदला** fixes village, **हिंदी** / **English** / **फोन करा**.
6. Animated 72-hour clock and reminders.
7. 14447 script spoken; Call **14447**; WhatsApp **7065514447**.
8. Ticket by voice, character repeat, then save.
9. Evidence by voice (`फोटो काढले`, policy, passbook, …) or camera for photos only.

## Demo data

Profile **डेमो डेटा — राजू पाटील** (9876543210). On **`/demo`**, tap sentences to test the parser without a mic. The same **10 Marathi + 10 Hindi** report sentences live in `src/parse/reportParser.test.ts` (plus 5 mixed-language checks).

**Marathi (10):**

1. आज सकाळी गारपीट झाली, माझ्या सोयाबीनचे नुकसान झाले, गाव खेडगाव.
2. काल रात्री ढगफुटी झाली, कापूस गेला, वर्धा जिल्हा.
3. परवा दुपारी शेतात पाणी साचले, तूर खराब झाली, अडीच एकर.
4. माझा मोबाईल नंबर नऊ आठ दोन शून्य एक दोन तीन चार पांच सहा.
5. नाही, गाव खेडगाव नाही, पिंपळगाव.
6. दीड एकर कांद्याचे नुकसान झाले, गारपीट, आत्ता पाहिले.
7. अडीच एकर द्राक्ष बाग वादळात पडली, परवा दुपारी.
8. गारपीट झाली... सोयाबीन.
9. आज morning मध्ये hailstorm आला, my soyabean damage झाले, village is Pimpalgaon.
10. ऊस पाण्यात गेला, 6 तासांपूर्वी पूर आला.

**Hindi (10):**

1. कल शाम ओलावृष्टि हुई, मेरी कपास की फसल खराब हो गई, जिला नागपुर.
2. आज सुबह ओले पड़े सोयाबीन का नुकसान
3. बाढ़ से कपास खराब हुई
4. कल रात झंझा कपास नागपुर
5. पूर्वी पूर तूर नुकसान
6. दोपहर गेहूं ओले
7. मका फसल पानी
8. हरभरा ओला कल
9. ज्वारी पूर कल शाम
10. बाजरी गारपीट आज

## Privacy

Records stay in IndexedDB on the phone. No login, no cloud copy of farmer records. See [SECURITY.md](SECURITY.md).

## License

MIT.