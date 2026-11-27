/** Krishi Rakshak / PMFBY farmer helpline (PMFBY spec). */
export const HELPLINE_NUMBER = '14447'
export const HELPLINE_TEL = `tel:${HELPLINE_NUMBER}`

/** Dial immediately (must run in the same user gesture as the tap — no await before this). */
export function dialHelpline(): void {
  const a = document.createElement('a')
  a.href = HELPLINE_TEL
  a.setAttribute('aria-hidden', 'true')
  document.body.appendChild(a)
  a.click()
  a.remove()
}