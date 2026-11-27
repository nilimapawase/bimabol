import { useEffect, useRef } from 'react'
import { type ClockBand } from '../domain/clock'
import {
  loadReminded,
  nextReminder,
  saveReminded,
  type ReminderHour,
} from '../domain/clockReminders'
import { t, type CopyKey } from '../i18n'
import { useClockTick } from '../hooks/useClockTick'
import type { SpeechLang } from '../speech/useSpeech'
import { useSpeech } from '../speech/useSpeech'

const WORD: Record<ClockBand, CopyKey> = {
  green: 'clockGreen',
  amber: 'clockAmber',
  red: 'clockRed',
  late: 'clockLate',
}

const BAND_COLORS: Record<ClockBand, string> = {
  green: '#3dbea5',
  amber: '#e8c47a',
  red: '#e86a6a',
  late: '#8b8b9a',
}

type Props = {
  eventTimeIso: string
  lang: SpeechLang
  caseId?: string
  speakReminders?: boolean
}

export function ClockDisplay({
  eventTimeIso,
  lang,
  caseId,
  speakReminders = false,
}: Props) {
  const state = useClockTick(eventTimeIso)
  const { speak } = useSpeech(lang)
  const reminded = useRef<ReminderHour[]>(caseId ? loadReminded(caseId) : [])

  const total = 72 * 60 * 60 * 1000
  const frac = state.late
    ? 0
    : Math.max(0, Math.min(1, state.remainingMs / total))
  const r = 54
  const c = 2 * Math.PI * r
  const offset = c * (1 - frac)

  useEffect(() => {
    if (!caseId || !speakReminders) return
    const next = nextReminder(state.remainingMs, state.late, reminded.current)
    if (!next) return
    reminded.current = [...reminded.current, next]
    saveReminded(caseId, reminded.current)
    const msg = t(lang, `remind${next}` as CopyKey)
    speak(msg)
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      new Notification('BimaBol', { body: msg })
    }
  }, [caseId, speakReminders, state.remainingMs, state.late, lang, speak])

  const spokeLate = useRef(false)
  useEffect(() => {
    if (state.late && speakReminders && !spokeLate.current) {
      spokeLate.current = true
      speak(t(lang, 'clockLateMsg'))
    }
  }, [state.late, speakReminders, lang, speak])

  return (
    <div
      className={`clock card tilt clock-anim band-${state.band}`}
      aria-live="polite"
    >
      <div className="clock-ring-wrap">
        <svg className="clock-ring" viewBox="0 0 128 128" aria-hidden>
          <circle className="clock-track" cx="64" cy="64" r={r} />
          <circle
            className="clock-progress"
            cx="64"
            cy="64"
            r={r}
            stroke={BAND_COLORS[state.band]}
            strokeDasharray={c}
            strokeDashoffset={offset}
          />
        </svg>
        <span className="clock-pulse" />
        <div className="clock-center">
          <span className="clock-digits">
            {state.late ? '−' : ''}
            {state.hours}:{String(state.minutes).padStart(2, '0')}
          </span>
        </div>
      </div>
      <div className="clock-copy">
        <p className="kicker">{t(lang, 'clockTitle')}</p>
        <p className="text-sm text-[var(--muted)]">
          {state.late ? t(lang, 'timeOver') : t(lang, 'timeLeft')} · {t(lang, 'clockNote')}
        </p>
        <span className={`pill ${state.band}`}>{t(lang, WORD[state.band])}</span>
      </div>
    </div>
  )
}
