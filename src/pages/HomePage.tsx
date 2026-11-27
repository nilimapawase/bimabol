import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SafetyBanner } from '../components/SafetyBanner'
import { ClockDisplay } from '../components/ClockDisplay'
import {
  getActiveProfileId,
  listCases,
  listProfiles,
  setActiveProfileId,
  upsertProfile,
} from '../db/database'
import type { CaseRecord, Profile } from '../db/types'
import { cropLabel, lossLabel } from '../parse/reportParser'

export function HomePage() {
  const [cases, setCases] = useState<CaseRecord[]>([])
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [activeId, setActiveId] = useState('')

  const reload = async () => {
    const pid = await getActiveProfileId()
    setActiveId(pid)
    setProfiles(await listProfiles())
    setCases(await listCases(pid))
  }

  useEffect(() => {
    void reload()
  }, [])

  const switchProfile = (id: string) => {
    setActiveProfileId(id)
    setActiveId(id)
    void listCases(id).then(setCases)
  }

  const addProfile = () => {
    const name = prompt('शेतकऱ्याचे नाव / farmer name')
    if (!name?.trim()) return
    const mobile = prompt('१० अंकी मोबाईल (optional)') ?? ''
    const id = crypto.randomUUID()
    void upsertProfile({ id, name: name.trim(), mobile: mobile.trim() }).then(reload)
  }

  return (
    <div className="flex flex-col gap-6">
      <SafetyBanner />
      <section className="rounded-xl border border-slate-700 p-4">
        <h2 className="text-lg font-semibold">ऑपरेटर / प्रोफाइल</h2>
        <ul className="mt-2 flex flex-col gap-2">
          {profiles.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                className={`btn w-full text-left ${activeId === p.id ? 'primary' : ''}`}
                onClick={() => switchProfile(p.id)}
              >
                {p.name} ({p.mobile || '—'})
              </button>
            </li>
          ))}
        </ul>
        <button type="button" className="btn mt-3" onClick={addProfile}>
          + नवीन प्रोफाइल
        </button>
      </section>
      <Link
        to="/report"
        className="block rounded-2xl border-2 border-sky-500 bg-sky-950 px-6 py-6 text-center text-2xl font-bold text-sky-100"
      >
        नुकसान सांगा
      </Link>
      <h2 className="text-xl font-semibold text-slate-300">प्रकरणे / Cases</h2>
      {cases.length === 0 ? (
        <p className="text-slate-400">अद्याप प्रकरण नाही.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {cases.map((c) => (
            <li key={c.id}>
              <Link
                to={`/case/${c.id}`}
                className="block rounded-xl border border-slate-700 bg-slate-900 p-4 hover:border-sky-600"
              >
                <ClockDisplay eventTimeIso={c.eventTimeIso} />
                <p className="mt-2 text-lg">
                  {c.crop ? cropLabel(c.crop) : '—'} · {c.village ?? '—'} ·{' '}
                  {c.loss ? lossLabel(c.loss) : '—'}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}