import type { ParseKind } from '../config/steps'
import { parseDigits } from './digits'
import { matchKeyword } from './keywords'
import { parseTime } from './time'

export type ParseResult = string | number | ReturnType<typeof parseTime> | null

export function parseAnswer(
  raw: string,
  kind: ParseKind,
  keywords?: string[],
): ParseResult {
  switch (kind) {
    case 'text':
      return raw.trim()
    case 'digits':
      return parseDigits(raw)
    case 'time':
      return parseTime(raw)
    case 'keyword': {
      if (!keywords?.length) return null
      return matchKeyword(raw, keywords) ?? null
    }
    default:
      return raw.trim()
  }
}

export function formatParseResult(value: ParseResult): string {
  if (value === null || value === undefined) return '—'
  if (typeof value === 'object') {
    return JSON.stringify(value)
  }
  return String(value)
}

export { foldDevanagari } from './fold'
export { parseDigits, parseTime, matchKeyword }