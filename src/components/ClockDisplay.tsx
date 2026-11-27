import { clockState, type ClockBand } from '../domain/clock'
import { t, type CopyKey } from '../i18n'
import type { SpeechLang } from '../speech/useSpeech'

const WORD: Record<ClockBand, CopyKey> = {
  green: 'clockGreen',
  amber: 'clockAmber',
  red: 'clockRed',
  late: 'clockLate',
}

type Props = { eventTimeIso: string; lang: SpeechLang }

export function ClockDisplay({ eventTimeIso, lang }: Props) {
  const state = clockState(Date.parse(eventTimeIso))
  return (
    <div className={`clock card tilt band-${state.band}`} aria-live="polite">
      <div>
        <p className="kicker">{t(lang, 'clockTitle')}</p>
        <strong>
          {state.late ? '−' : ''}
          {state.hours} {t(lang, 'hours')} {state.minutes} {t(lang, 'mins')}
        </strong>
        <p className="text-sm text-[var(--muted)]">
          {state.late ? t(lang, 'timeOver') : t(lang, 'timeLeft')} · {t(lang, 'clockNote')}
        </p>
      </div>
      <span className={`pill ${state.band}`}>{t(lang, WORD[state.band])}</span>
    </div>
  )
}
