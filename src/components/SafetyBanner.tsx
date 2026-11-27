import { useEffect, useRef } from 'react'
import { t } from '../i18n'
import { useSpeech, type SpeechLang } from '../speech/useSpeech'

export function SafetyBanner({
  lang,
  speakOnMount,
}: {
  lang: SpeechLang
  speakOnMount?: boolean
}) {
  const { speak } = useSpeech(lang)
  const spoke = useRef(false)
  useEffect(() => {
    if (!speakOnMount || spoke.current) return
    spoke.current = true
    speak(`${t(lang, 'safety')} ${t(lang, 'notGov')}`)
  }, [lang, speak, speakOnMount])

  return (
    <aside className="card tilt">
      <p className="kicker">{t(lang, 'limit')}</p>
      <p>{t(lang, 'safety')}</p>
      <p className="mt-2 text-[var(--gold)]">{t(lang, 'notGov')}</p>
    </aside>
  )
}
