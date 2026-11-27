import { t } from '../i18n'
import type { SpeechLang } from '../speech/useSpeech'

export function SafetyBanner({ lang }: { lang: SpeechLang }) {
  return (
    <aside className="card tilt">
      <p className="kicker">{t(lang, 'limit')}</p>
      <p>{t(lang, 'safety')}</p>
      <p className="mt-2 text-[var(--gold)]">{t(lang, 'notGov')}</p>
    </aside>
  )
}
