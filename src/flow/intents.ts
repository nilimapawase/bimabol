import { foldDevanagari, foldLatin } from '../parse/fold'

export type ConfirmIntent = 'yes' | 'no' | 'repeat' | 'change' | null

const PHRASES: { intent: ConfirmIntent; phrases: string[] }[] = [
  {
    intent: 'yes',
    phrases: ['हो', 'होय', 'हाँ', 'हां', 'yes'],
  },
  {
    intent: 'no',
    phrases: ['नाही', 'नहीं', 'no'],
  },
  {
    intent: 'repeat',
    phrases: ['पुन्हा सांगा', 'पुन्हा', 'फिर से', 'repeat'],
  },
  {
    intent: 'change',
    phrases: ['बदला', 'बदलो', 'change'],
  },
]

function foldPhrase(p: string): string {
  const dev = foldDevanagari(p)
  const lat = foldLatin(p)
  return `${dev} ${lat}`.trim()
}

export function parseConfirmIntent(raw: string): ConfirmIntent {
  const foldedUtterance = foldPhrase(raw)
  const devUtterance = foldDevanagari(raw)

  for (const { intent, phrases } of PHRASES) {
    for (const phrase of phrases) {
      const folded = foldPhrase(phrase)
      if (foldedUtterance.includes(folded) || devUtterance.includes(foldDevanagari(phrase))) {
        return intent
      }
    }
  }
  return null
}