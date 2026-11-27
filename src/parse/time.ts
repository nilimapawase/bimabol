import { foldDevanagari, foldLatin } from './fold'

export type TimeParse = {
  day: 'today' | 'yesterday'
  part: 'morning' | 'night'
  timezone: 'Asia/Kolkata'
  /** Representative local time in IST (morning 08:00, night 21:00). */
  localISO: string
}

function hasFoldedToken(raw: string, words: string[]): boolean {
  const tokens = foldDevanagari(raw)
    .split(/[\s,.:;!?।]+/)
    .filter(Boolean)
  const latin = foldLatin(raw).split(/[\s,.:;!?]+/).filter(Boolean)
  return words.some((w) => {
    const fw = foldDevanagari(w)
    const fl = foldLatin(w)
    return (
      tokens.some((t) => t === fw) ||
      latin.some((t) => t === fl)
    )
  })
}

function kolkataYmd(base: Date): { y: number; m: number; d: number } {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(base)
  const get = (type: string) =>
    Number(parts.find((p) => p.type === type)?.value ?? '0')
  return { y: get('year'), m: get('month'), d: get('day') }
}

function shiftKolkataDay(
  ymd: { y: number; m: number; d: number },
  delta: number,
): { y: number; m: number; d: number } {
  const utc = Date.UTC(ymd.y, ymd.m - 1, ymd.d + delta, 12)
  return kolkataYmd(new Date(utc))
}

function toIstIso(
  ymd: { y: number; m: number; d: number },
  hour: number,
): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${ymd.y}-${pad(ymd.m)}-${pad(ymd.d)}T${pad(hour)}:00:00+05:30`
}

export function parseTime(raw: string): TimeParse | null {
  let day: TimeParse['day'] | null = null
  if (hasFoldedToken(raw, ['आज', 'today'])) {
    day = 'today'
  } else if (hasFoldedToken(raw, ['काल', 'कल', 'yesterday'])) {
    day = 'yesterday'
  }
  if (!day) return null

  let part: TimeParse['part'] | null = null
  if (hasFoldedToken(raw, ['सकाळ', 'सकाळी', 'सुबह', 'morning'])) {
    part = 'morning'
  } else if (hasFoldedToken(raw, ['रात', 'रात्र', 'रात्री', 'night'])) {
    part = 'night'
  }
  if (!part) return null

  const today = kolkataYmd(new Date())
  const dayYmd =
    day === 'today' ? today : shiftKolkataDay(today, -1)
  const hour = part === 'morning' ? 8 : 21

  return {
    day,
    part,
    timezone: 'Asia/Kolkata',
    localISO: toIstIso(dayYmd, hour),
  }
}