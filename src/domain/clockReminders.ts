const H = 60 * 60 * 1000
export const REMINDER_HOURS = [24, 12, 6, 1] as const
export type ReminderHour = (typeof REMINDER_HOURS)[number]

export function nextReminder(
  remainingMs: number,
  late: boolean,
  already: ReminderHour[],
): ReminderHour | null {
  if (late) return null
  for (const h of REMINDER_HOURS) {
    if (already.includes(h)) continue
    if (remainingMs <= h * H) return h
  }
  return null
}

export function loadReminded(caseId: string): ReminderHour[] {
  try {
    const raw = localStorage.getItem(`bimabol-remind-${caseId}`)
    return raw ? (JSON.parse(raw) as ReminderHour[]) : []
  } catch {
    return []
  }
}

export function saveReminded(caseId: string, hours: ReminderHour[]) {
  localStorage.setItem(`bimabol-remind-${caseId}`, JSON.stringify(hours))
}