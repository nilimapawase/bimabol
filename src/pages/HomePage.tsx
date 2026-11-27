import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { SafetyBanner } from '../components/SafetyBanner'
import { ClockDisplay } from '../components/ClockDisplay'
import { clockState } from '../domain/clock'
import {
  getActiveProfileId,
  listCases,
  listProfiles,
  setActiveProfileId,
  upsertProfile,
} from '../db/database'
import type { CaseRecord, Profile } from '../db/types'
import { cropLabel, lossLabel } from '../parse/reportParser'
import { t } from '../i18n'
import type { SpeechLang } from '../speech/useSpeech'

export function HomePage({ lang }: { lang: SpeechLang }) {
  const [cases, setCases] = useState<CaseRecord[]>([])
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [activeId, setActiveId] = useState('')
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')

  const reload = async () => {
    const pid = await getActiveProfileId()
    setActiveId(pid)
    setProfiles(await listProfiles())
    setCases(await listCases(pid))
  }

  useEffect(() => {
    void reload()
  }, [])

  const board = useMemo(() => {
    const withTicket = cases.filter((c) => c.ticket).length
    const evidenceDone = cases.filter((c) =>
      Object.values(c.evidence).every(Boolean),
    ).length
    const soonest = cases.reduce<CaseRecord | null>((best, c) => {
      if (!best) return c
      return clockState(Date.parse(c.eventTimeIso)).remainingMs <
        clockState(Date.parse(best.eventTimeIso)).remainingMs
        ? c
        : best
    }, null)
    return { withTicket, evidenceDone, soonest }
  }, [cases])

  const addProfile = () => {
    if (!name.trim()) return
    const id = crypto.randomUUID()
    void upsertProfile({
      id,
      name: name.trim(),
      mobile: mobile.trim(),
    }).then(() => {
      setName('')
      setMobile('')
      setActiveProfileId(id)
      return reload()
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <SafetyBanner lang={lang} />
      <section className="card tilt rise">
        <p className="kicker">{t(lang, 'status')}</p>
        <p className="mb-3 text-sm text-[var(--muted)]">{t(lang, 'statusNote')}</p>
        <div className="stat-grid">
          <div className="stat">
            <b>{cases.length}</b>
            <span>{t(lang, 'cases')}</span>
          </div>
          <div className="stat">
            <b>{board.withTicket}</b>
            <span>{t(lang, 'tickets')}</span>
          </div>
          <div className="stat">
            <b>{board.evidenceDone}</b>
            <span>{t(lang, 'evidence')}</span>
          </div>
        </div>
        {board.soonest && (
          <div className="mt-3">
            <ClockDisplay eventTimeIso={board.soonest.eventTimeIso} lang={lang} />
          </div>
        )}
      </section>

      <section className="card">
        <p className="kicker">{t(lang, 'whoFor')}</p>
        <div className="mt-2 flex flex-col gap-2">
          {profiles.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`btn text-left ${activeId === p.id ? 'primary' : ''}`}
              onClick={() => {
                setActiveProfileId(p.id)
                setActiveId(p.id)
                void listCases(p.id).then(setCases)
              }}
            >
              {p.name}
              <span className="block text-sm opacity-80">{p.mobile || t(lang, 'noMobile')}</span>
            </button>
          ))}
        </div>
        <div className="mt-3 grid gap-2">
          <input
            className="input"
            placeholder={t(lang, 'newName')}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="input"
            placeholder={t(lang, 'newMobile')}
            inputMode="numeric"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
          <button type="button" className="btn" onClick={addProfile}>
            {t(lang, 'addProfile')}
          </button>
        </div>
      </section>

      <Link to="/report" className="hero-cta">
        {t(lang, 'tellLoss')}
      </Link>

      <section>
        <p className="kicker">{t(lang, 'cases')}</p>
        {cases.length === 0 ? (
          <p className="text-[var(--muted)]">{t(lang, 'noCases')}</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {cases.map((c) => (
              <li key={c.id}>
                <Link to={`/case/${c.id}`} className="card block no-underline text-inherit">
                  <p className="text-lg font-semibold">
                    {c.crop ? cropLabel(c.crop) : t(lang, 'noCrop')} · {c.village ?? t(lang, 'noVillage')} ·{' '}
                    {c.loss ? lossLabel(c.loss) : t(lang, 'noLoss')}
                  </p>
                  <p className="text-sm text-[var(--muted)]">
                    {c.ticket ? `${t(lang, 'ticketSaved')} ${c.ticket}` : t(lang, 'noTicket')}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}