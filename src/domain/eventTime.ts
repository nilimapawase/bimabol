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

function hasAny(s: string, needles: string[]): boolean {
  return needles.some((n) => s.includes(n))
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
  if (hasAny(dev, ['आज']) || hasAny(lat, ['today'])) dayOffset = 0
  else if (hasAny(dev, ['काल', 'कल']) || hasAny(lat, ['yesterday', 'कल'])) dayOffset = -1
  else if (hasAny(dev, ['परवा', 'परसों']) || hasAny(lat, ['day before'])) dayOffset = -2
  else return null

  let hour = 6
  let min = 0
  if (
    hasAny(dev, ['सकाळ', 'सकाळी', 'सुबह', 'पहाट']) ||
    hasAny(lat, ['morning', 'subah'])
  )
    hour = 6
  else if (hasAny(dev, ['दुपार', 'दोपहर']) || hasAny(lat, ['noon', 'afternoon', 'dopahar']))
    hour = 12
  else if (
    hasAny(dev, ['संध्याकाळ', 'शाम']) ||
    hasAny(lat, ['evening', 'sham'])
  )
    hour = 17
  else if (hasAny(dev, ['रात', 'रात्र', 'रात्री']) || hasAny(lat, ['night']))
    hour = 19

  return shiftDay(now, dayOffset, hour, min)
}