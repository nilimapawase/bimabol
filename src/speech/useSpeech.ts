import { useCallback, useEffect, useRef, useState } from 'react'

export type SpeechLang = 'mr-IN' | 'hi-IN' | 'en-IN'

function langPrefix(lang: SpeechLang): string {
  return lang.split('-')[0]!
}

function findVoice(lang: SpeechLang): SpeechSynthesisVoice | null {
  const voices = speechSynthesis.getVoices()
  const prefix = langPrefix(lang)
  return (
    voices.find((v) => v.lang.toLowerCase().startsWith(prefix)) ??
  voices.find((v) => v.lang.toLowerCase().startsWith(lang.toLowerCase())) ??
    null
  )
}

export function useSpeech(lang: SpeechLang) {
  const [visibleOnly, setVisibleOnly] = useState(false)
  const [lastText, setLastText] = useState('')
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    const refresh = () => {
      const voice = findVoice(lang)
      if (!voice) setVisibleOnly(true)
    }
    refresh()
    speechSynthesis.addEventListener('voiceschanged', refresh)
    return () => speechSynthesis.removeEventListener('voiceschanged', refresh)
  }, [lang])

  const speak = useCallback(
    (text: string, opts?: { rate?: number }) => {
      setLastText(text)
      speechSynthesis.cancel()
      const voice = findVoice(lang)
      if (!voice) {
        setVisibleOnly(true)
        return
      }
      setVisibleOnly(false)
      const u = new SpeechSynthesisUtterance(text)
      u.lang = lang
      u.rate = opts?.rate ?? 0.9
      u.voice = voice
      utterRef.current = u
      speechSynthesis.speak(u)
    },
    [lang],
  )

  const cancel = useCallback(() => {
    speechSynthesis.cancel()
  }, [])

  return { speak, cancel, visibleOnly, lastText }
}