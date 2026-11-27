import { describe, expect, it } from 'vitest'
import { clockState, deadlineFromEvent } from './clock'

describe('clock', () => {
  const event = Date.parse('2026-11-20T06:00:00+05:30')

  it('deadline is event + 72h', () => {
    expect(deadlineFromEvent(event)).toBe(event + 72 * 3600_000)
  })

  it('green above 48h remaining', () => {
    const now = event + 1 * 3600_000
    expect(clockState(event, now).band).toBe('green')
  })

  it('amber 24-48h', () => {
    const now = event + 30 * 3600_000
    expect(clockState(event, now).band).toBe('amber')
  })

  it('red under 24h', () => {
    const now = event + 50 * 3600_000
    expect(clockState(event, now).band).toBe('red')
  })

  it('late after deadline', () => {
    const now = event + 80 * 3600_000
    const s = clockState(event, now)
    expect(s.late).toBe(true)
    expect(s.band).toBe('late')
  })
})