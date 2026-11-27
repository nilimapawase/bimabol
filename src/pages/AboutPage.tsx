import type { SpeechLang } from '../speech/useSpeech'
import { t } from '../i18n'

export function AboutPage({ lang }: { lang: SpeechLang }) {
  return (
    <article className="card rise flex flex-col gap-4">
      <h1 className="text-2xl font-bold">{t(lang, 'aboutTitle')}</h1>
      <p>{t(lang, 'about1')}</p>
      <p>{t(lang, 'about2')}</p>
      <p>{t(lang, 'about3')}</p>
    </article>
  )
}