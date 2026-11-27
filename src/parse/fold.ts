/** Strip matras, halant, nukta, anusvara, visarga, chandrabindu; shorten independent vowels; map similar consonants. */
export function foldDevanagari(input: string): string {
  let s = input.normalize('NFC')

  const stripClass =
    /[\u093A\u0941-\u094C\u094D\u0951-\u0954\u093B\u093C\u0902\u0903\u0901]/g
  s = s.replace(stripClass, '')

  const vowelMap: Record<string, string> = {
    आ: 'अ',
    ई: 'इ',
    ऊ: 'उ',
    ऐ: 'ए',
    औ: 'ओ',
  }
  s = s.replace(/[\u0906\u0908\u090A\u0910\u0914]/g, (ch) => vowelMap[ch] ?? ch)

  const consMap: Record<string, string> = {
    श: 'स',
    ष: 'स',
    ण: 'न',
    ळ: 'ल',
  }
  s = s.replace(/[शषणळ]/g, (ch) => consMap[ch] ?? ch)

  return s.toLowerCase()
}

export function foldLatin(input: string): string {
  return input.toLowerCase().trim()
}