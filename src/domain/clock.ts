export type ClockBand = 'green' | 'amber' | 'red' | 'late'

export type ClockState = {
  deadlineMs: number
  remainingMs: number
  band: ClockBand
  late: boolean
  hours: number
  minutes: number
}

const H72 = 72 * 60 * 60 * 1000

export function deadlineFromEvent(eventTimeMs: number): number {
  return eventTimeMs + H72
}

export function clockState(
  eventTimeMs: number,
  nowMs: number = Date.now(),
): ClockState {
  const deadlineMs = deadlineFromEvent(eventTimeMs)
  const remainingMs = deadlineMs - nowMs
  const late = remainingMs <= 0
  const abs = Math.abs(remainingMs)
  const hours = Math.floor(abs / (60 * 60 * 1000))
  const minutes = Math.floor((abs % (60 * 60 * 1000)) / (60 * 1000))
  let band: ClockBand = 'green'
  if (late) band = 'late'
  else if (remainingMs <= 24 * 60 * 60 * 1000) band = 'red'
  else if (remainingMs <= 48 * 60 * 60 * 1000) band = 'amber'
  return { deadlineMs, remainingMs, band, late, hours, minutes }
}