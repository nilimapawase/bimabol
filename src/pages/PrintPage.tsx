import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { db } from '../db/database'
import type { CaseRecord } from '../db/types'
import { cropLabel, lossLabel } from '../parse/reportParser'
import { t } from '../i18n'
import type { SpeechLang } from '../speech/useSpeech'

export function PrintPage({ lang }: { lang: SpeechLang }) {
  const { id } = useParams()
  const [c, setC] = useState<CaseRecord | null>(null)

  useEffect(() => {
    if (id) void db.cases.get(id).then((r) => setC(r ?? null))
  }, [id])

  useEffect(() => {
    if (c) setTimeout(() => window.print(), 300)
  }, [c])

  if (!c) return <p>Loading…</p>
  const fp = c.events.at(-1)?.hash.slice(0, 12) ?? ''

  return (
    <article className="bg-white p-8 text-black print:p-4">
      <h1 className="text-2xl font-bold">Self-maintained farmer record</h1>
      <p className="mt-4 text-sm">{t(lang, 'notGov')}</p>
      <ul className="mt-4 list-disc pl-6">
        {c.village && <li>{t(lang, 'lblVillage')}: {c.village}</li>}
        {c.district && <li>{c.district}</li>}
        {c.crop && <li>{t(lang, 'lblCrop')}: {cropLabel(c.crop)}</li>}
        {c.loss && <li>{t(lang, 'lblLoss')}: {lossLabel(c.loss)}</li>}
        <li>{t(lang, 'lblTime')}: {c.eventTimeIso}</li>
        {c.ticket && <li>{t(lang, 'lblTicket')}: {c.ticket}</li>}
      </ul>
      <p className="mt-4 text-sm">Record fingerprint: {fp}</p>
    </article>
  )
}