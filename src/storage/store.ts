export type SavedAnswer = {
  id: string
  raw: string
  parsed: unknown
}

const STORAGE_KEY = 'voice-starter-answers'
export const PRIVACY_KEY = 'voice-starter-privacy-dismissed'

export function loadAnswers(): SavedAnswer[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as SavedAnswer[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveAnswers(answers: SavedAnswer[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(answers))
}

export function upsertAnswer(entry: SavedAnswer): SavedAnswer[] {
  const list = loadAnswers()
  const next = list.filter((a) => a.id !== entry.id)
  next.push(entry)
  saveAnswers(next)
  return next
}

export function clearAll(): void {
  localStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem(PRIVACY_KEY)
}

export function isPrivacyDismissed(): boolean {
  return localStorage.getItem(PRIVACY_KEY) === '1'
}

export function dismissPrivacy(): void {
  localStorage.setItem(PRIVACY_KEY, '1')
}