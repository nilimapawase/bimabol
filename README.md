# BimaBol (७२ तास)

Marathi voice assistant for the first hours after hail, flood, or a similar localised crop loss in Maharashtra, while the PMFBY 72-hour window is still open.

The farmer speaks. BimaBol turns that into a record (crop, village, loss, time), reads it back, starts a conservative clock, reads the words for helpline **14447**, saves the SMS ticket, and keeps evidence on the phone. It does not file a claim, predict a payout, or replace 14447, the Crop Insurance App, the bank, or the agriculture office.

Speaking and listening complete every step. The keyboard appears only after the microphone fails twice, or when there is no internet.

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

## Phone

Import the repo on [Vercel](https://vercel.com/new). Framework: Vite. Build: `npm run build`. Output: `dist`. Open the HTTPS link in Android Chrome and allow the microphone. Add to Home screen to install the PWA.

| Browser | Microphone | Spoken reply |
|---------|------------|--------------|
| Android Chrome | Best. Needs a network for recognition | Often has Marathi |
| Desktop Chrome on localhost | Works | If no Marathi voice is installed, the words stay on screen |
| iOS Safari | Unreliable | Limited |
| Firefox | Not supported | Varies |

Before the first microphone use, the app says speech may be sent to the browser's speech service.

## What you say

1. **नुकसान सांगा** — "पिकाचे नुकसान झाले असेल तर मला सांगा."
2. "तुमच्यासाठी की दुसऱ्या शेतकऱ्यासाठी?" A name is stored when it is for someone else.
3. Mobile (10 digits), policy or enrolment number, bank branch name. Say **हो** to continue.
4. Speak freely. "आज सकाळी गारपीट झाली, माझ्या सोयाबीनचे नुकसान झाले, गाव खेडगाव." Today morning is 06:00 IST. "काल रात्री" is yesterday 19:00.
5. At most three short questions: crop, village, time.
6. The app reads the record back. **हो** saves. **गाव बदला** asks only for the village.
7. The clock runs from that time plus 72 hours. Green above 48 hours, amber from 24 to 48, red under 24.
8. The 14447 script is on screen and spoken. One tap calls **14447**. WhatsApp is **7065514447**.
9. After the call, say the ticket. It is repeated character by character, then saved.
10. Evidence by voice or tap: "फोटो काढले", policy copy, passbook photo, witness, survey. No account number. No GPS.

Also understood while you speak: **हिंदी**, **English**, **मराठी**, **फोन करा**, **नाही**, **पुन्हा सांगा**.

If the loss sounds like a wild-animal attack, widespread damage, or paddy inundation, the app says the rules may differ and to ask 14447.

Always on screen: "हे अॅप क्लेम दाखल करत नाही." and "हे सरकारी किंवा विमा कंपनीचे अॅप नाही."

## Demo data

A profile named **डेमो डेटा — राजू पाटील** (mobile 9876543210) is created on this phone. On `/demo`, these sentences can be parsed without a microphone.

Marathi:

1. आज सकाळी गारपीट झाली, माझ्या सोयाबीनचे नुकसान झाले, गाव खेडगाव.
2. काल रात्री ढगफुटी झाली, कापूस गेला, वर्धा जिल्हा.
3. परवा दुपारी शेतात पाणी साचले, तूर खराब झाली, अडीच एकर.
4. नाही, गाव खेडगाव नाही, पिंपळगाव.
5. दीड एकर कांद्याचे नुकसान झाले, गारपीट, आत्ता पाहिले.
6. अडीच एकर द्राक्ष बाग वादळात पडली, परवा दुपारी.
7. गारपीट झाली... सोयाबीन.
8. आज morning मध्ये hailstorm आला, my soyabean damage झाले, village is Pimpalgaon.
9. ऊस पाण्यात गेला, 6 तासांपूर्वी पूर आला.
10. माझा मोबाईल नंबर नऊ आठ दोन शून्य एक दोन तीन चार पांच सहा.

Hindi:

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

## Docker

```bash
docker compose up --build
```

The container listens on port **8080** and needs no `.env`. On this computer, port 8080 is already Oracle Database, so use http://localhost:5173 here. Use the container port only on a machine where 8080 is free.

## Privacy

Records stay in IndexedDB on the phone. There is no login and no cloud copy of farmer records. No Aadhaar, no GPS, no stored audio, no bank account number. See [SECURITY.md](SECURITY.md).

## License

MIT.
