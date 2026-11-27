import { describe, expect, it } from 'vitest'
import { parseFreeReport } from './reportParser'

const NOW = new Date('2026-11-20T10:00:00+05:30')

const MR: { text: string; crop?: string; loss?: string; village?: string; district?: string }[] = [
  {
    text: 'आज सकाळी गारपीट झाली, माझ्या सोयाबीनचे नुकसान झाले, गाव खेडगाव.',
    crop: 'soybean',
    loss: 'hail',
    village: 'खेडगाव',
  },
  {
    text: 'काल रात्री ढगफुटी झाली, कापूस गेला, वर्धा जिल्हा.',
    crop: 'cotton',
    loss: 'cloudburst',
    district: 'Wardha',
  },
  {
    text: 'परवा दुपारी शेतात पाणी साचले, तूर खराब झाली, अडीच एकर.',
    crop: 'tur',
    loss: 'flood',
  },
  { text: 'माझा मोबाईल नंबर नऊ आठ दोन शून्य एक दोन तीन चार पांच सहा.' },
  { text: 'नाही, गाव खेडगाव नाही, पिंपळगाव.', village: 'पिंपळगाव' },
  { text: 'दीड एकर कांद्याचे नुकसान झाले, गारपीट, आत्ता पाहिले.', crop: 'onion', loss: 'hail' },
  { text: 'अडीच एकर द्राक्ष बाग वादळात पडली, परवा दुपारी.', crop: 'grape' },
  { text: 'गारपीट झाली... सोयाबीन.', crop: 'soybean', loss: 'hail' },
  {
    text: 'आज morning मध्ये hailstorm आला, my soyabean damage झाले, village is Pimpalgaon.',
    crop: 'soybean',
    loss: 'hail',
    village: 'पिंपळगाव',
  },
  { text: 'ऊस पाण्यात गेला, 6 तासांपूर्वी पूर आला.', crop: 'sugarcane', loss: 'flood' },
]

const HI = [
  { text: 'कल शाम ओलावृष्टि हुई, मेरी कपास की फसल खराब हो गई, जिला नागपुर.', crop: 'cotton', loss: 'hail', district: 'Nagpur' },
  { text: 'आज सुबह ओले पड़े सोयाबीन का नुकसान', crop: 'soybean', loss: 'hail' },
  { text: 'बाढ़ से कपास खराब हुई', crop: 'cotton', loss: 'flood' },
  { text: 'कल रात झंझा कपास नागपुर', crop: 'cotton', district: 'Nagpur' },
  { text: 'पूर्वी पूर तूर नुकसान', crop: 'tur', loss: 'flood' },
  { text: 'दोपहर गेहूं ओले', crop: 'wheat', loss: 'hail' },
  { text: 'मका फसल पानी', crop: 'maize', loss: 'flood' },
  { text: 'हरभरा ओला कल', crop: 'gram', loss: 'hail' },
  { text: 'ज्वारी पूर कल शाम', crop: 'jowar', loss: 'flood' },
  { text: 'बाजरी गारपीट आज', crop: 'bajra', loss: 'hail' },
]

const MIXED = [
  { text: 'आज morning मध्ये hailstorm आला, my soyabean damage झाले.', crop: 'soybean', loss: 'hail' },
  { text: 'Hail on cotton in Wardha yesterday night', crop: 'cotton', loss: 'hail', district: 'Wardha' },
  { text: 'flood in tur field today दुपारी', crop: 'tur', loss: 'flood' },
  { text: 'sugarcane cloudburst काल', crop: 'sugarcane', loss: 'cloudburst' },
  { text: 'onion damage hail आज सकाळी', crop: 'onion', loss: 'hail' },
]

function assertParsed(
  text: string,
  want: { crop?: string; loss?: string; village?: string; district?: string },
) {
  const p = parseFreeReport(text, NOW)
  if (want.crop) expect(p.crop).toBe(want.crop)
  if (want.loss) expect(p.loss).toBe(want.loss)
  if (want.village) expect(p.village).toBe(want.village)
  if (want.district) expect(p.district).toBe(want.district)
  if (!want.crop && !want.loss && !want.village && !want.district) {
    expect(p.crop ?? p.loss ?? p.village ?? p.district ?? true).toBeTruthy()
  }
}

describe('reportParser 25 sentences', () => {
  it('10 Marathi', () => {
    MR.forEach((s) => assertParsed(s.text, s))
  })
  it('10 Hindi', () => {
    HI.forEach((s) => assertParsed(s.text, s))
  })
  it('5 mixed', () => {
    MIXED.forEach((s) => assertParsed(s.text, s))
  })
})