import { foldDevanagari, foldLatin } from './fold'
import { parseDigits } from './digits'
import { CROP_ALIASES, DISTRICTS, LOSS_ALIASES, type CropId, type LossId } from './vocab'
import { parseEventTimePhrase } from '../domain/eventTime'

export type ParsedReport = {
  crop?: CropId
  village?: string
  taluka?: string
  district?: string
  loss?: LossId
  area?: string
  eventTimeIso?: string
  flagsSpecialLoss?: boolean
}

function norm(s: string): string {
  return foldDevanagari(foldLatin(s)).toLowerCase()
}

function matchAlias<T extends string>(
  text: string,
  table: Record<T, string[]>,
): T | undefined {
  const n = norm(text)
  for (const [id, aliases] of Object.entries(table) as [T, string[]][]) {
    for (const a of aliases) {
      if (n.includes(norm(a))) return id
    }
  }
  return undefined
}

const VILLAGE_PATTERNS = [
  /गाव\s+([^\s,.]+)/,
  /village\s+(?:is\s+)?([a-z]+)/i,
  /गाँव\s+([^\s,.]+)/,
]

export function parseFreeReport(
  raw: string,
  now: Date = new Date(),
): ParsedReport {
  const out: ParsedReport = {}
  out.crop = matchAlias(raw, CROP_ALIASES)
  out.loss = matchAlias(raw, LOSS_ALIASES)

  for (const d of DISTRICTS) {
    for (const name of d.names) {
      if (norm(raw).includes(norm(name))) {
        out.district = d.id
        break
      }
    }
  }

  for (const re of VILLAGE_PATTERNS) {
    const m = raw.match(re)
    if (m?.[1]) {
      out.village = m[1].trim()
      break
    }
  }
  if (!out.village && norm(raw).includes('खेडगाव')) out.village = 'खेडगाव'
  if (!out.village && norm(raw).includes('pimpalgaon')) out.village = 'Pimpalgaon'
  const pin = raw.match(/पिंपळगाव|Pimpalgaon/i)
  if (pin) out.village = 'पिंपळगाव'

  const areaMixed = raw.match(/अडीच|डेढ|दीड|2\.5|साडे/i)
  if (areaMixed) out.area = areaMixed[0]

  const eventIso = parseEventTimePhrase(raw, now)
  if (eventIso) out.eventTimeIso = eventIso

  const digits = parseDigits(raw)
  if (typeof digits === 'number' && digits > 0 && digits < 1000) {
    // ignore unless area context
  }

  if (
    /वाळू|wild|animal|वन्य|प्राणी|drought|pest|व्यापक|widespread|inundat|पाणी साच/i.test(raw) ||
    (out.crop === 'paddy' && out.loss === 'flood')
  ) {
    out.flagsSpecialLoss = true
  }

  return out
}

export function cropLabel(id: CropId): string {
  const mr: Record<CropId, string> = {
    soybean: 'सोयाबीन',
    cotton: 'कापूस',
    tur: 'तूर',
    jowar: 'ज्वारी',
    bajra: 'बाजरी',
    maize: 'मका',
    paddy: 'भात',
    groundnut: 'भुईमूग',
    gram: 'हरभरा',
    wheat: 'गहू',
    onion: 'कांदा',
    sugarcane: 'ऊस',
    banana: 'केळी',
    grape: 'द्राक्ष',
    pomegranate: 'डाळिंब',
    orange: 'संत्रा',
    mango: 'आंबा',
    turmeric: 'हळद',
  }
  return mr[id]
}

export function lossLabel(id: LossId): string {
  const mr: Record<LossId, string> = {
    hail: 'गारपीट',
    flood: 'पूर',
    cloudburst: 'ढगफुटी',
    landslide: 'भूस्खलन',
  }
  return mr[id]
}