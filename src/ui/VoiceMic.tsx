import { useEffect, useRef, useState } from 'react'
import { t } from '../i18n'
import { parseConfirmIntent } from '../flow/intents'
import { PrivacyNote, shouldBlockMic } from '../speech/PrivacyNote'
import { useRecognition } from '../speech/useRecognition'
import { useSpeech, type SpeechLang } from '../speech/useSpeech'

type Props = {
  lang: SpeechLang
  prompt: string
  onHeard: (text: string) => void
  onFallback?: (typing: boolean) => void
}

function beep() {
  const Ctx = window.AudioContext
  if (!Ctx) return
  const ctx = new Ctx()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.frequency.value = 880
  gain.gain.value = 0.04
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start()
  osc.stop(ctx.currentTime + 0.08)
  osc.onended = () => void ctx.close()
}

export function VoiceMic({ lang, prompt, onHeard, onFallback }: Props) {
  const { speak, visibleOnly } = useSpeech(lang)
  const rec = useRecognition(lang)
  const [privacy, setPrivacy] = useState(shouldBlockMic)
  const [waiting, setWaiting] = useState(false)
  const [pending, setPending] = useState('')
  const heard = useRef(onHeard)
  const prev = useRef(false)
  heard.current = onHeard

  useEffect(() => {
    onFallback?.(rec.showTypedFallback || !rec.supported)
  }, [onFallback, rec.showTypedFallback, rec.supported])

  useEffect(() => {
    if (!rec.listening) {
      setWaiting(false)
      return
    }
    const id = window.setTimeout(() => setWaiting(true), 8000)
    return () => window.clearTimeout(id)
  }, [rec.listening])

  useEffect(() => {
    if (!privacy) speak(prompt)
  }, [prompt, privacy, speak])

  useEffect(() => {
    const was = prev.current
    prev.current = rec.listening
    if (was && !rec.listening) {
      const text = rec.transcript.trim()
      const conf = rec.confidence
      if (text) {
        if (pending && parseConfirmIntent(text) === 'yes') {
          heard.current(pending)
          setPending('')
        } else if (conf !== null && conf > 0 && conf < 0.35) {
          speak(t(lang, 'lowConf'))
        } else if (conf !== null && conf > 0 && conf < 0.6) {
          setPending(text)
          speak(`${t(lang, 'heard')}: ${text}`)
        } else {
          heard.current(text)
        }
      }
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
        onClick={() => {
          if (rec.listening) rec.stop()
          else {
            beep()
            rec.start()
          }
        }}
      >
        {rec.listening ? t(lang, 'micStop') : t(lang, 'micStart')}
      </button>
      {rec.transcript && (
        <p className="text-center text-[var(--gold)]">
          {t(lang, 'heard')}: {rec.transcript}
        </p>
      )}
      {waiting && <p className="text-center">{t(lang, 'stillListening')}</p>}
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
