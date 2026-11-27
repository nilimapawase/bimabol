import { foldDevanagari, foldLatin } from './fold'

export type TimeParse = {
  day: 'today' | 'yesterday'
  part: 'morning' | 'night'
  timezone: 'Asia/Kolkata'
  /** Representative local time in IST (morning 08:00, night 21:00). */
  localISO: string
}

function containsAny(haystack: string, needles: string[]): boolean {
  return needles.some((n) => haystack.includes(n))
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
  const dev = foldDevanagari(raw)
  const lat = foldLatin(raw)

  let day: TimeParse['day'] | null = null
  if (containsAny(dev, ['आज']) || containsAny(lat, ['today'])) {
    day = 'today'
  } else if (
    containsAny(dev, ['काल', 'कल']) ||
    containsAny(lat, ['yesterday'])
  ) {
    day = 'yesterday'
  }
  if (!day) return null

  let part: TimeParse['part'] | null = null
  if (
    containsAny(dev, ['सकाळ', 'सकाळी', 'सुबह']) ||
    containsAny(lat, ['morning'])
  ) {
    part = 'morning'
  } else if (
    containsAny(dev, ['रात', 'रात्र', 'रात्री']) ||
    containsAny(lat, ['night'])
  ) {
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