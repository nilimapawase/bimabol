import { describe, expect, it } from 'vitest'
import { parseEventTimePhrase } from './eventTime'

const NOW = new Date('2026-11-27T14:00:00+05:30')

describe('event time', () => {
  it('आज सकाळी is today 06:00, not yesterday via सकल', () => {
    expect(
      parseEventTimePhrase(
        'आज सकाळी गारपीट झाली, माझ्या सोयाबीनचे नुकसान झाले, गाव खेडगाव.',
        NOW,
      ),
    ).toBe('2026-11-27T06:00:00+05:30')
  })

  it('काल रात्री is yesterday 19:00', () => {
    expect(parseEventTimePhrase('काल रात्री ढगफुटी झाली', NOW)).toBe(
      '2026-11-26T19:00:00+05:30',
    )
  })
})