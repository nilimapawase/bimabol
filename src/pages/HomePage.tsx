import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SafetyBanner } from '../components/SafetyBanner'
import { ClockDisplay } from '../components/ClockDisplay'
import { getActiveProfileId, listCases } from '../db/database'
import type { CaseRecord } from '../db/types'
import { cropLabel, lossLabel } from '../parse/reportParser'

export function HomePage() {
  const [cases, setCases] = useState<CaseRecord[]>([])

  useEffect(() => {
    void (async () => {
      const pid = await getActiveProfileId()
      setCases(await listCases(pid))
    })()
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <SafetyBanner />
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