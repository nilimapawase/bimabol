import { describe, expect, it } from 'vitest'
import { nextReminder } from './clockReminders'

describe('clock reminders', () => {
  it('fires at 24, 12, 6, 1 hour thresholds', () => {
    const h = 60 * 60 * 1000
    expect(nextReminder(23 * h, false, [])).toBe(24)
    expect(nextReminder(11 * h, false, [24])).toBe(12)
    expect(nextReminder(6 * h, false, [24, 12])).toBe(6)
    expect(nextReminder(30 * 60 * 1000, false, [24, 12, 6])).toBe(1)
    expect(nextReminder(0, true, [])).toBeNull()
  })
})