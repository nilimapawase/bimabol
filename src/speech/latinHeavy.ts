/** True when most letters are basic Latin (Marathi STT often mis-returns Roman). */
export function mostlyLatin(text: string): boolean {
  const letters = text.replace(/[\s\d+./\-,]/g, '')
  if (letters.length < 4) return false
  const latin = (letters.match(/[A-Za-z]/g) ?? []).length
  return latin / letters.length > 0.55
}