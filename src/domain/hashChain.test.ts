import { describe, expect, it } from 'vitest'
import { appendEvent, verifyChain, type ChainEvent } from './hashChain'

describe('hashChain', () => {
  it('valid chain verifies', async () => {
    const e1 = await appendEvent([], 'report_confirmed', { a: 1 }, '2026-11-20T10:00:00+05:30')
    const e2 = await appendEvent([e1], 'ticket_saved', { t: 'AB12' }, '2026-11-20T11:00:00+05:30')
    expect(await verifyChain([e1, e2])).toBe(true)
  })

  it('tamper detected', async () => {
    const e1 = await appendEvent([], 'report_confirmed', { a: 1 }, '2026-11-20T10:00:00+05:30')
    const bad: ChainEvent = {
      ...e1,
      payload: { a: 999 },
    }
    expect(await verifyChain([bad])).toBe(false)
  })
})