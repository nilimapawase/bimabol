import { parseDigits } from '../parse/digits'
import { parseConfirmIntent } from './intents'

export function classifyWho(raw: string): 'mine' | 'other' | null {
  if (/दुसर|दुसऱ|किसी|someone|other|else/i.test(raw)) return 'other'
  if (/माझ|मेरा|मेरी|mine|myself|स्वत/i.test(raw)) return 'mine'
  if (parseConfirmIntent(raw) === 'yes') return 'mine'
  return null
}

export function tenDigitMobile(raw: string): string | null {
  const parsed = String(parseDigits(raw) ?? '').replace(/\D/g, '')
  if (parsed.length === 10) return parsed
  const ascii = raw.replace(/[०-९]/g, (ch) => String('०१२३४५६७८९'.indexOf(ch)))
  const match = ascii.match(/\d{10}/)
  return match ? match[0] : null
}

export function spokenTicket(raw: string): string {
  const parts = raw.trim().split(/[\s,.-]+/).filter(Boolean)
  const mapped = parts.map((part) => {
    const digit = parseDigits(part)
    if (typeof digit === 'number' && digit >= 0 && digit <= 9) return String(digit)
    return part
  })
  return mapped.join('').replace(/[^A-Za-z0-9]/g, '').toUpperCase()
}

export type EvidenceKind = 'photos' | 'policy' | 'passbook' | 'witness' | 'survey'

export function evidenceFromSpeech(raw: string): EvidenceKind | null {
  if (/पासबुक|passbook/i.test(raw)) return 'passbook'
  if (/फोटो|photo|काढल/i.test(raw)) return 'photos'
  if (/साक्ष|witness/i.test(raw)) return 'witness'
  if (/सर्वे|survey|गट/i.test(raw)) return 'survey'
  if (/विमा|पॉलिसी|policy/i.test(raw)) return 'policy'
  return null
}
