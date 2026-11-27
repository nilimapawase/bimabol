import { foldDevanagari, foldLatin } from './fold'

export function matchKeyword(utterance: string, keywords: string[]): string | null {
  const foldedUtterance =
    foldDevanagari(utterance) + ' ' + foldLatin(utterance)
  for (const kw of keywords) {
    const foldedKw = foldDevanagari(kw) + ' ' + foldLatin(kw)
    if (foldedUtterance.includes(foldedKw.trim())) {
      return kw
    }
    const devOnly = foldDevanagari(kw)
    const uttDev = foldDevanagari(utterance)
    if (devOnly && uttDev.includes(devOnly)) return kw
  }
  return null
}