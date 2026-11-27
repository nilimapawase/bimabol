const WORD_TO_DIGIT: Record<string, string> = {
  zero: '0',
  oh: '0',
  one: '1',
  two: '2',
  three: '3',
  four: '4',
  five: '5',
  six: '6',
  seven: '7',
  eight: '8',
  nine: '9',
  ten: '10',
  twenty: '20',
  thirty: '30',
  forty: '40',
  fifty: '50',
  sixty: '60',
  seventy: '70',
  eighty: '80',
  ninety: '90',
  hundred: '100',
  शून्य: '0',
  एक: '1',
  दो: '2',
  दोन: '2',
  तीन: '3',
  चार: '4',
  पाच: '5',
  पाँच: '5',
  पांच: '5',
  सहा: '6',
  सात: '7',
  आठ: '8',
  नऊ: '9',
  नौ: '9',
  दहा: '10',
  दस: '10',
  वीस: '20',
  बीस: '20',
  तीस: '30',
  चाळीस: '40',
  चालीस: '40',
  पन्नास: '50',
  पचास: '50',
  साठ: '60',
  सत्तर: '70',
  ऐंशी: '80',
  अस्सी: '80',
  नव्वद: '90',
  नब्बे: '90',
  शंभर: '100',
  सौ: '100',
}

const DEVANAGARI_DIGITS = /[०-९]/g

function devanagariToAscii(s: string): string {
  return s.replace(DEVANAGARI_DIGITS, (ch) =>
    String(ch.charCodeAt(0) - 0x0966),
  )
}

function tokenize(raw: string): string[] {
  return raw
    .trim()
    .split(/[\s,]+/)
    .map((t) => t.replace(/[।.!?]/g, ''))
    .filter(Boolean)
}

function isSingleDigitToken(t: string): boolean {
  const n = devanagariToAscii(t)
  if (/^\d$/.test(n)) return true
  const w = WORD_TO_DIGIT[t.toLowerCase()]
  return w !== undefined && w.length === 1
}

const EN_TENS = [
  'twenty',
  'thirty',
  'forty',
  'fifty',
  'sixty',
  'seventy',
  'eighty',
  'ninety',
] as const
const EN_ONES = [
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
] as const

const HI_MR_TENS: [string, number][] = [
  ['वीस', 20],
  ['बीस', 20],
  ['तीस', 30],
  ['चाळीस', 40],
  ['चालीस', 40],
  ['पन्नास', 50],
  ['पचास', 50],
  ['साठ', 60],
  ['सत्तर', 70],
  ['ऐंशी', 80],
  ['अस्सी', 80],
  ['नव्वद', 90],
  ['नब्बे', 90],
]

const ONES_HI: Record<string, number> = {
  एक: 1,
  दो: 2,
  दोन: 2,
  तीन: 3,
  चार: 4,
  पाच: 5,
  पांच: 5,
  सहा: 6,
  सात: 7,
  आठ: 8,
  नऊ: 9,
  नौ: 9,
}

/** Digits: word runs, digit runs, or raw text. */
export function parseDigits(raw: string): string | number {
  const text = devanagariToAscii(raw.trim())
  if (!text) return raw

  const onlyDigits = text.replace(/\s/g, '')
  if (/^\d+$/.test(onlyDigits)) return Number(onlyDigits)

  const tokens = tokenize(text)
  if (tokens.length === 0) return raw

  if (tokens.every(isSingleDigitToken)) {
    const joined = tokens
      .map((t) => {
        const n = devanagariToAscii(t)
        if (/^\d$/.test(n)) return n
        return WORD_TO_DIGIT[t.toLowerCase()] ?? ''
      })
      .join('')
    if (joined) return Number(joined)
  }

  const folded = tokens.map((t) => t.toLowerCase())
  const phrase = folded.join(' ')

  for (let i = 0; i < EN_TENS.length; i++) {
    const tens = (i + 2) * 10
    const tensWord = EN_TENS[i]!
    for (let j = 0; j < EN_ONES.length; j++) {
      const composite = `${tensWord} ${EN_ONES[j]}`
      if (phrase === composite) return tens + j + 1
    }
  }

  if (tokens.length === 2) {
    const [a, b] = tokens
    for (const [tw, tv] of HI_MR_TENS) {
      if (a === tw && ONES_HI[b] !== undefined) return tv + ONES_HI[b]!
      if (b === tw && ONES_HI[a] !== undefined) return tv + ONES_HI[a]!
    }
  }

  if (tokens.length === 1) {
    const w = WORD_TO_DIGIT[tokens[0]!.toLowerCase()] ?? WORD_TO_DIGIT[tokens[0]!]
    if (w) return Number(w)
  }

  return raw
}