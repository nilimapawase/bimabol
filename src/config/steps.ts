export type ParseKind = 'text' | 'digits' | 'time' | 'keyword'

export type Step = {
  id: string
  prompt: { mr: string; en: string }
  parse: ParseKind
  keywords?: string[]
}

/** Swap questions by editing this array only. */
export const steps: Step[] = [
  {
    id: 'sentence',
    prompt: {
      mr: 'एक वाक्य सांगा.',
      en: 'Say a short sentence.',
    },
    parse: 'text',
  },
  {
    id: 'number',
    prompt: {
      mr: 'एक संख्या सांगा.',
      en: 'Say a number.',
    },
    parse: 'digits',
  },
  {
    id: 'timeofday',
    prompt: {
      mr: 'केव्हा? उदा. आज सकाळ किंवा काल रात्र.',
      en: 'When? e.g. this morning or last night.',
    },
    parse: 'time',
  },
]