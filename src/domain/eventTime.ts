import { foldDevanagari, foldLatin } from '../parse/fold'

function kolkataParts(d: Date): { y: number; m: number; d: number; h: number; min: number } {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
  const parts = fmt.formatToParts(d)
  const g = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0)
  return { y: g('year'), m: g('month'), d: g('day'), h: g('hour'), min: g('minute') }
}

function toIso(y: number, m: number, day: number, hour: number, min = 0): string {
  const p = (n: number) => String(n).padStart(2, '0')
  return `${y}-${p(m)}-${p(day)}T${p(hour)}:${p(min)}:00+05:30`
}

function shiftDay(
  base: Date,
  delta: number,
  hour: number,
  min = 0,
): string {
  const { y, m, d } = kolkataParts(base)
  const utc = Date.UTC(y, m - 1, d + delta, 12)
  const shifted = kolkataParts(new Date(utc))
  return toIso(shifted.y, shifted.m, shifted.d, hour, min)
}

function hasToken(raw: string, words: string[]): boolean {
  const tokens = raw
    .split(/[\s,.:;!?।]+/)
    .map((t) => foldDevanagari(t))
    .filter(Boolean)
  return words.some((w) => {
    const fw = foldDevanagari(w)
    return tokens.some((t) => t === fw || t.startsWith(fw))
  })
}

/** Earliest plausible instant in IST for spoken time phrase. */
export function parseEventTimePhrase(
  raw: string,
  now: Date = new Date(),
): string | null {
  const dev = foldDevanagari(raw)
  const lat = foldLatin(raw).toLowerCase()

  const hoursAgo = dev.match(/(\d+)\s*तासां?पूर्वी/) ?? lat.match(/(\d+)\s*hours?\s*ago/)
  if (hoursAgo) {
    const h = Number(hoursAgo[1])
    const ms = now.getTime() - h * 60 * 60 * 1000
    const p = kolkataParts(new Date(ms))
    return toIso(p.y, p.m, p.d, p.h, p.min)
  }

  let dayOffset = 0
  if (hasToken(raw, ['आज', 'today'])) dayOffset = 0
  else if (hasToken(raw, ['काल', 'कल', 'yesterday'])) dayOffset = -1
  else if (hasToken(raw, ['परवा', 'परसों'])) dayOffset = -2
  else return null

  let hour = 6
  const min = 0
  if (hasToken(raw, ['सकाळ', 'सकाळी', 'सुबह', 'पहाट', 'morning'])) hour = 6
  else if (hasToken(raw, ['दुपार', 'दुपारी', 'दोपहर', 'afternoon'])) hour = 12
  else if (hasToken(raw, ['संध्याकाळ', 'संध्याकाळी', 'शाम', 'evening'])) hour = 17
  else if (hasToken(raw, ['रात', 'रात्र', 'रात्री', 'night'])) hour = 19

  return shiftDay(now, dayOffset, hour, min)
}