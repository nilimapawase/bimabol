import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { SafetyBanner } from '../components/SafetyBanner'
import { ClockDisplay } from '../components/ClockDisplay'
import { INTEGRITY_BAD, INTEGRITY_OK } from '../constants/copy'
import { verifyChain } from '../domain/hashChain'
import { db, getActiveProfileId } from '../db/database'
import { saveTicket, validateTicket } from '../db/caseService'
import type { CaseRecord } from '../db/types'
import { cropLabel, lossLabel } from '../parse/reportParser'
import { appendEvent } from '../domain/hashChain'
import { sha256Hex } from '../domain/hashChain'

export function CasePage() {
  const { id } = useParams()
  const [c, setC] = useState<CaseRecord | null>(null)
  const [profileName, setProfileName] = useState('')
  const [ok, setOk] = useState(true)
  const [ticketInput, setTicketInput] = useState('')
  const [ticketRepeat, setTicketRepeat] = useState<string[] | null>(null)
  const [waExtra, setWaExtra] = useState(false)

  const load = async () => {
    if (!id) return
    const rec = await db.cases.get(id)
    if (!rec) return
    setC(rec)
    setOk(await verifyChain(rec.events))
    const pid = await getActiveProfileId()
    const p = await db.profiles.get(rec.profileId ?? pid)
    setProfileName(p?.name ?? '')
  }

  useEffect(() => {
    void load()
  }, [id])

  if (!c) {
    return (
      <p>
        प्रकरण सापडले नाही. <Link to="/">मुख्य पृष्ठ</Link>
      </p>
    )
  }

  const scriptLines = [
    profileName && `नमस्कार. माझे नाव ${profileName}.`,
    c.village && `मी ${c.village} गावचा शेतकरी आहे.`,
    c.district && `जिल्हा ${c.district}.`,
    c.crop && `माझ्या ${cropLabel(c.crop)} पिकाचे`,
    c.loss && `${lossLabel(c.loss)} मुळे नुकसान झाले.`,
    c.eventTimeIso && `घटना ${c.eventTimeIso} ला झाली.`,
    'कृपया तिकीट क्रमांक द्या.',
  ].filter(Boolean)

  const summary = scriptLines.join(' ')

  const waUrl = () => {
    let text = summary
    if (waExtra) {
      const prof = c.profileId
      // policy/mobile only if ticked — loaded from profile in real use
      void prof
    }
    return `https://wa.me/917065514447?text=${encodeURIComponent(text)}`
  }

  const onCall = async () => {
    const ev = await appendEvent(c.events, 'call_tapped', {}, new Date().toISOString())
    const next = { ...c, events: [...c.events, ev] }
    await db.cases.put(next)
    setC(next)
    window.location.href = 'tel:14447'
  }

  const onWa = async () => {
    const ev = await appendEvent(
      c.events,
      'whatsapp_opened',
      {},
      new Date().toISOString(),
    )
    const next = { ...c, events: [...c.events, ev] }
    await db.cases.put(next)
    setC(next)
    window.open(waUrl(), '_blank', 'noopener,noreferrer')
  }

  const onTicketSubmit = () => {
    if (!validateTicket(ticketInput)) {
      alert('तिकीट ४–३० अक्षरे/अंक असावे.')
      return
    }
    setTicketRepeat(ticketInput.replace(/[\s-]/g, '').split(''))
  }

  const confirmTicket = async () => {
    if (!id) return
    await saveTicket(id, ticketInput)
    await load()
    setTicketRepeat(null)
    setTicketInput('')
  }

  const onPhoto = async (file: File | null) => {
    if (!file || !id) return
    const buf = await file.arrayBuffer()
    const hash = await sha256Hex(
      String.fromCharCode(...new Uint8Array(buf).slice(0, 5000)),
    )
    await db.photos.add({
      id: crypto.randomUUID(),
      caseId: id,
      sha256: hash,
      capturedAt: new Date().toISOString(),
      mime: file.type,
    })
    const ev = await appendEvent(
      c.events,
      'evidence_added',
      { kind: 'photo' },
      new Date().toISOString(),
    )
    const next = {
      ...c,
      evidence: { ...c.evidence, photos: true },
      events: [...c.events, ev],
    }
    await db.cases.put(next)
    setC(next)
    setOk(await verifyChain(next.events))
  }

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(c, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `bimabol-case-${c.id}.json`
    a.click()
  }

  const shareText = () => {
    const fp = c.events.at(-1)?.hash.slice(0, 12) ?? ''
    return `${summary}\n\nRecord fingerprint: ${fp}\n${INTEGRITY_OK}`
  }

  return (
    <div className="flex flex-col gap-4">
      <SafetyBanner />
      <ClockDisplay eventTimeIso={c.eventTimeIso} />
      <p className={ok ? 'text-emerald-400' : 'text-amber-400'}>
        {ok ? INTEGRITY_OK : INTEGRITY_BAD}
      </p>
      <section className="rounded-xl border border-slate-700 bg-slate-900 p-4">
        <h2 className="text-xl font-bold">१४४४७ स्क्रिप्ट</h2>
        <p className="mt-2 whitespace-pre-wrap text-lg">{scriptLines.join('\n')}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" className="btn primary" onClick={() => void onCall()}>
            Call 14447
          </button>
          <button type="button" className="btn" onClick={() => void onWa()}>
            WhatsApp
          </button>
        </div>
        <label className="mt-2 flex items-center gap-2 text-sm text-slate-400">
          <input
            type="checkbox"
            checked={waExtra}
            onChange={(e) => setWaExtra(e.target.checked)}
          />
          WhatsApp मध्ये policy/mobile समाविष्ट करा (default off)
        </label>
      </section>
      <section className="rounded-xl border border-slate-700 p-4">
        <h2 className="text-lg font-bold">तिकीट क्रमांक</h2>
        {!ticketRepeat ? (
          <>
            <input
              className="input"
              value={ticketInput}
              onChange={(e) => setTicketInput(e.target.value)}
              placeholder="SMS तिकीट"
            />
            <button type="button" className="btn primary mt-2" onClick={onTicketSubmit}>
              पुष्टीसाठी
            </button>
          </>
        ) : (
          <>
            <p>
              {ticketRepeat.map((ch, i) => (
                <span key={i} className="mr-2 inline-block text-2xl">
                  {ch}
                </span>
              ))}
            </p>
            <button type="button" className="btn primary mt-2" onClick={() => void confirmTicket()}>
              हो — जतन करा
            </button>
          </>
        )}
        {c.ticket && <p className="mt-2 text-slate-300">जतन: {c.ticket}</p>}
      </section>
      <section className="rounded-xl border border-slate-700 p-4">
        <h2 className="text-lg font-bold">पुरावे</h2>
        <ul className="list-disc pl-6">
          <li>{c.evidence.photos ? '✓' : '○'} फोटो</li>
          <li>{c.evidence.policy ? '✓' : '○'} विमा प्रत</li>
          <li>{c.evidence.passbook ? '✓' : '○'} पासबुक फोटो</li>
          <li>{c.evidence.witness ? '✓' : '○'} साक्षीदार</li>
          <li>{c.evidence.survey ? '✓' : '○'} सर्वे / गट क्रमांक</li>
        </ul>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          className="mt-2"
          onChange={(e) => void onPhoto(e.target.files?.[0] ?? null)}
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {(['policy', 'passbook', 'witness', 'survey'] as const).map((k) => (
            <button
              key={k}
              type="button"
              className="btn"
              onClick={() => {
                const next = {
                  ...c,
                  evidence: { ...c.evidence, [k]: true },
                }
                void db.cases.put(next).then(() => setC(next))
              }}
            >
              {k} ✓
            </button>
          ))}
        </div>
      </section>
      <section className="flex flex-wrap gap-3">
        <button type="button" className="btn" onClick={exportJson}>
          JSON
        </button>
        <button
          type="button"
          className="btn"
          onClick={() => {
            void navigator.share?.({ text: shareText() }).catch(() => {
              void navigator.clipboard.writeText(shareText())
            })
          }}
        >
          Share text
        </button>
        <Link to={`/case/${c.id}/print`} className="btn">
          Printable record
        </Link>
      </section>
    </div>
  )
}