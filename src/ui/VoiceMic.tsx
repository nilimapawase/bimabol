import { useEffect, useRef, useState } from 'react'
import { t } from '../i18n'
import { PrivacyNote, shouldBlockMic } from '../speech/PrivacyNote'
import { useRecognition } from '../speech/useRecognition'
import { useSpeech, type SpeechLang } from '../speech/useSpeech'

type Props = {
  lang: SpeechLang
  prompt: string
  onHeard: (text: string) => void
}

export function VoiceMic({ lang, prompt, onHeard }: Props) {
  const { speak, visibleOnly } = useSpeech(lang)
  const rec = useRecognition(lang)
  const [privacy, setPrivacy] = useState(shouldBlockMic)
  const heard = useRef(onHeard)
  const prev = useRef(false)
  heard.current = onHeard

  useEffect(() => {
    if (!privacy) speak(prompt)
  }, [prompt, privacy, speak])

  useEffect(() => {
    const was = prev.current
    prev.current = rec.listening
    if (was && !rec.listening) {
      const text = rec.transcript.trim()
      if (text) heard.current(text)
      rec.clearTranscript()
    }
  }, [rec.listening, rec.transcript, rec])

  return (
    <div className="voice-box">
      <PrivacyNote open={privacy} onDismiss={() => setPrivacy(false)} />
      <p className="text-lg">{prompt}</p>
      <button
        type="button"
        className={`mic-orb ${rec.listening ? 'live' : ''}`}
        disabled={privacy || !rec.supported}
        aria-pressed={rec.listening}
        aria-label={rec.listening ? t(lang, 'micStop') : t(lang, 'micStart')}
        onClick={() => rec.toggle()}
      >
        {rec.listening ? t(lang, 'micStop') : t(lang, 'micStart')}
      </button>
      {rec.transcript && (
        <p className="text-center text-[var(--gold)]">
          {t(lang, 'heard')}: {rec.transcript}
        </p>
      )}
      {visibleOnly && <p className="text-center text-sm text-[var(--muted)]">{t(lang, 'noVoice')}</p>}
      {rec.showTypedFallback && (
        <p className="text-center text-sm text-[var(--muted)]">{t(lang, 'typeFallback')}</p>
      )}
      {!rec.supported && (
        <p className="text-center text-sm text-[var(--muted)]">{t(lang, 'typeFallback')}</p>
      )}
    </div>
  )
}
