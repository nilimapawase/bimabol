import { describe, expect, it } from 'vitest'
import { parseConfirmIntent } from './intents'

describe('intents', () => {
  it('yes variants', () => {
    expect(parseConfirmIntent('हो')).toBe('yes')
    expect(parseConfirmIntent('yes')).toBe('yes')
    expect(parseConfirmIntent('हाँ')).toBe('yes')
  })
  it('no', () => {
    expect(parseConfirmIntent('नाही')).toBe('no')
  })
  it('repeat', () => {
    expect(parseConfirmIntent('पुन्हा सांगा')).toBe('repeat')
  })
  it('change', () => {
    expect(parseConfirmIntent('बदला')).toBe('change')
  })
})