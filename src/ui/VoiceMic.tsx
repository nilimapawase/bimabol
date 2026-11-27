import { useEffect, useRef, useState } from 'react'
import { t } from '../i18n'
import { parseConfirmIntent } from '../flow/intents'
import { voiceCommand } from '../flow/reportVoice'
import { PrivacyNote, shouldBlockMic } from '../speech/PrivacyNote'
import { mostlyLatin } from '../speech/latinHeavy'
import { useRecognition } from '../speech/useRecognition'
import { useSpeech, type SpeechLang } from '../speech/useSpeech'

type Props = {
  lang: SpeechLang
  prompt: string
  onHeard: (text: string) => void
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

export function VoiceMic({ lang, prompt, onHeard }: Props) {
  const { speak, visibleOnly } = useSpeech(lang)
  const rec = useRecognition(lang)
  const [privacy, setPrivacy] = useState(shouldBlockMic)
  const [waiting, setWaiting] = useState(false)
  const [pending, setPending] = useState('')
  const heard = useRef(onHeard)
  const prev = useRef(false)
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const holdMode = useRef(false)
  const sttRetry = useRef<0 | 1 | 2>(0)
  heard.current = onHeard

  const clearHold = () => {
    if (holdTimer.current) clearTimeout(holdTimer.current)
    holdTimer.current = null
  }

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
    if (rec.lastNoise) {
      speak(t(lang, 'noiseHigh'))
      rec.clearNoise()
    }
  }, [rec.lastNoise, rec, lang, speak])

  useEffect(() => {
    const was = prev.current
    prev.current = rec.listening
    if (was && !rec.listening) {
      const text = rec.transcript.trim()
      const conf = rec.confidence
      if (
        text &&
        lang === 'mr-IN' &&
        mostlyLatin(text) &&
        sttRetry.current < 2
      ) {
        sttRetry.current = (sttRetry.current + 1) as 1 | 2
        const alt: SpeechLang = sttRetry.current === 1 ? 'en-IN' : 'hi-IN'
        rec.clearTranscript()
        beep()
        rec.start(alt)
        return
      }
      sttRetry.current = 0
      if (text) {
        const cmd = voiceCommand(text)
        if (cmd === 'stop') {
          rec.clearTranscript()
          return
        }
        if (cmd === 'slow') {
          speak(prompt, { rate: 0.65 })
          rec.clearTranscript()
          return
        }
        if (parseConfirmIntent(text) === 'repeat') {
          speak(prompt)
          rec.clearTranscript()
          return
        }
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
  }, [rec.listening, rec.transcript, rec, lang, pending, speak])

  return (
    <div className="voice-box">
      <PrivacyNote open={privacy} onDismiss={() => setPrivacy(false)} />
      <p className="text-lg">{prompt}</p>
      <p className="text-center text-sm text-[var(--muted)]">{t(lang, 'holdMic')}</p>
      <button
        type="button"
        className={`mic-orb ${rec.listening ? 'live' : ''}`}
        disabled={privacy || !rec.supported}
        aria-pressed={rec.listening}
        aria-label={rec.listening ? t(lang, 'micStop') : t(lang, 'micStart')}
        onPointerDown={(e) => {
          if (privacy || !rec.supported) return
          e.preventDefault()
          holdMode.current = false
          clearHold()
          holdTimer.current = setTimeout(() => {
            holdMode.current = true
            if (!rec.listening) {
              beep()
              rec.start()
            }
          }, 400)
          e.currentTarget.setPointerCapture(e.pointerId)
        }}
        onPointerUp={(e) => {
          clearHold()
          if (holdMode.current) rec.stop()
          else if (!rec.listening) {
            beep()
            rec.start()
          } else rec.stop()
          holdMode.current = false
          e.currentTarget.releasePointerCapture(e.pointerId)
        }}
        onPointerCancel={() => {
          clearHold()
          if (holdMode.current) rec.stop()
          holdMode.current = false
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
      {!rec.supported && (
        <p className="text-center text-sm text-[var(--muted)]">{t(lang, 'micRequired')}</p>
      )}
    </div>
  )
}
