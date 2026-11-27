import { describe, expect, it } from 'vitest'
import { validateTicket } from './caseService'

describe('validateTicket', () => {
  it('accepts AB12CD', () => {
    expect(validateTicket('AB12CD')).toBe(true)
  })
  it('rejects short', () => {
    expect(validateTicket('AB1')).toBe(false)
  })
  it('rejects hyphenated invalid', () => {
    expect(validateTicket('AB-12')).toBe(false)
  })
})