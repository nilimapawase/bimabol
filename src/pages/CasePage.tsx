import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { SafetyBanner } from '../components/SafetyBanner'
import { ClockDisplay } from '../components/ClockDisplay'
import { HELPLINE_TEL, dialHelpline } from '../constants/helpline'
import { evidenceFromSpeech, spokenTicket, voiceCommand } from '../flow/reportVoice'
import { parseConfirmIntent } from '../flow/intents'
import { t } from '../i18n'
import type { SpeechLang } from '../speech/useSpeech'
import { verifyChain } from '../domain/hashChain'
import { db, getActiveProfileId } from '../db/database'
import { saveTicket, validateTicket } from '../db/caseService'
import type { CaseRecord } from '../db/types'
import { cropLabel, lossLabel } from '../parse/reportParser'
import { appendEvent } from '../domain/hashChain'
import { processPhotoFile } from '../utils/photo'
import { VoiceMic } from '../ui/VoiceMic'
import { useSpeech } from '../speech/useSpeech'

export function CasePage({ lang }: { lang: SpeechLang }) {
  const { speak } = useSpeech(lang)
  const { id } = useParams()
  const [c, setC] = useState<CaseRecord | null>(null)
  const [profileName, setProfileName] = useState('')
  const [ok, setOk] = useState(true)
  const [ticketInput, setTicketInput] = useState('')
  const [ticketRepeat, setTicketRepeat] = useState<string[] | null>(null)
  const [waExtra, setWaExtra] = useState(false)
  const [ticketPrompt, setTicketPrompt] = useState('')

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

  useEffect(() => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      void Notification.requestPermission()
    }
  }, [])

  const scriptLines = useMemo(() => {
    if (!c) return [] as string[]
    return [
      profileName && `नमस्कार. माझे नाव ${profileName}.`,
      c.village && `मी ${c.village} गावचा शेतकरी आहे.`,
      c.district && `जिल्हा ${c.district}.`,
      c.crop && `माझ्या ${cropLabel(c.crop)} पिकाचे`,
      c.loss && `${lossLabel(c.loss)} मुळे नुकसान झाले.`,
      c.eventTimeIso && `घटना ${c.eventTimeIso} ला झाली.`,
      c.policyNumber && `पीक विमा क्रमांक ${c.policyNumber}.`,
      c.mobile && `मोबाईल ${c.mobile}.`,
      'कृपया तिकीट क्रमांक द्या.',
    ].filter(Boolean) as string[]
  }, [c, profileName])

  const summary = scriptLines.join(' ')

  const spokeIntro = useRef(false)
  useEffect(() => {
    spokeIntro.current = false
  }, [id])

  useEffect(() => {
    if (!c || !summary || spokeIntro.current) return
    spokeIntro.current = true
    speak(t(lang, 'clockSpeak'))
    const timer = window.setTimeout(() => speak(summary), 1200)
    return () => window.clearTimeout(timer)
  }, [c, summary, lang, speak])

  useEffect(() => {
    if (!ticketRepeat?.length) {
      setTicketPrompt('')
      return
    }
    speak(ticketRepeat.join(' . '))
    setTicketPrompt(t(lang, 'ticketConfirmVoice'))
  }, [ticketRepeat, lang, speak])

  if (!c) {
    return (
      <p>
        {t(lang, 'caseMissing')} <Link to="/">{t(lang, 'navHome')}</Link>
      </p>
    )
  }

  const waUrl = () => {
    let text = summary
    if (waExtra) {
      if (c.policyNumber) text += ` Policy: ${c.policyNumber}.`
      if (c.mobile) text += ` Mobile: ${c.mobile}.`
    }
    return `https://wa.me/917065514447?text=${encodeURIComponent(text)}`
  }

  const logCallTap = async () => {
    const ev = await appendEvent(c.events, 'call_tapped', {}, new Date().toISOString())
    const next = { ...c, events: [...c.events, ev] }
    await db.cases.put(next)
    setC(next)
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

  const onHeard = (text: string) => {
    if (voiceCommand(text) === 'call') {
      dialHelpline()
      void logCallTap()
      return
    }
    const kind = evidenceFromSpeech(text)
    if (kind === 'photos') {
      void (async () => {
        const ev = await appendEvent(c.events, 'evidence_added', { kind: 'photo' }, new Date().toISOString())
        const next = { ...c, evidence: { ...c.evidence, photos: true }, events: [...c.events, ev] }
        await db.cases.put(next)
        setC(next)
        setOk(await verifyChain(next.events))
      })()
      return
    }
    if (kind) {
      void (async () => {
        const ev = await appendEvent(c.events, 'evidence_added', { kind }, new Date().toISOString())
        const next = { ...c, evidence: { ...c.evidence, [kind]: true }, events: [...c.events, ev] }
        await db.cases.put(next)
        setC(next)
        setOk(await verifyChain(next.events))
      })()
      return
    }
    if (ticketRepeat && parseConfirmIntent(text) === 'yes') {
      void confirmTicket()
      return
    }
    const ticket = spokenTicket(text)
    setTicketInput(ticket)
    if (validateTicket(ticket)) setTicketRepeat(ticket.split(''))
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
    const { blob, sha256 } = await processPhotoFile(file)
    await db.photos.add({
      id: crypto.randomUUID(),
      caseId: id,
      sha256,
      capturedAt: new Date().toISOString(),
      mime: 'image/jpeg',
      blob,
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
    return `${summary}\n\nRecord fingerprint: ${fp}\n${t(lang, 'integrityOk')}`
  }

  return (
    <div className="flex flex-col gap-4">
      <SafetyBanner lang={lang} speakOnMount />
      <ClockDisplay
        eventTimeIso={c.eventTimeIso}
        lang={lang}
        caseId={c.id}
        speakReminders
      />
      <p className={ok ? 'text-emerald-400' : 'text-amber-400'}>
        {ok ? t(lang, 'integrityOk') : t(lang, 'integrityBad')}
      </p>
      <VoiceMic
        lang={lang}
        prompt={ticketPrompt || t(lang, 'ticketAsk')}
        onHeard={onHeard}
      />
      <section className="card tilt">
        <h2 className="text-xl font-bold">{t(lang, 'scriptTitle')}</h2>
        <p className="mt-2 whitespace-pre-wrap text-lg">{scriptLines.join('\n')}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={HELPLINE_TEL}
            className="btn primary no-underline text-inherit"
            onClick={() => void logCallTap()}
          >
            {t(lang, 'call')}
          </a>
          <button type="button" className="btn" onClick={() => void onWa()}>
            {t(lang, 'wa')}
          </button>
        </div>
        <label className="mt-2 flex items-center gap-2 text-sm text-[var(--muted)]">
          <input
            type="checkbox"
            checked={waExtra}
            onChange={(e) => setWaExtra(e.target.checked)}
          />
          {t(lang, 'waExtra')}
        </label>
      </section>
      <section className="rounded-xl border border-slate-700 p-4">
        <h2 className="text-lg font-bold">{t(lang, 'ticketTitle')}</h2>
        {!ticketRepeat ? (
          ticketInput ? (
            <p className="text-[var(--gold)]">
              {t(lang, 'heard')}: {ticketInput}
            </p>
          ) : null
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
              {t(lang, 'ticketSave')}
            </button>
          </>
        )}
        {c.ticket && (
          <p className="mt-2">
            {t(lang, 'ticketSaved')}: {c.ticket}
          </p>
        )}
      </section>
      <section className="rounded-xl border border-slate-700 p-4">
        <h2 className="text-lg font-bold">{t(lang, 'evidenceTitle')}</h2>
        <ul className="list-disc pl-6">
          <li>{c.evidence.photos ? '✓' : '○'} {t(lang, 'photo')}</li>
          <li>{c.evidence.policy ? '✓' : '○'} {t(lang, 'policy')}</li>
          <li>{c.evidence.passbook ? '✓' : '○'} {t(lang, 'passbook')}</li>
          <li>{c.evidence.witness ? '✓' : '○'} {t(lang, 'witness')}</li>
          <li>{c.evidence.survey ? '✓' : '○'} {t(lang, 'survey')}</li>
        </ul>
        <p className="text-sm text-[var(--muted)]">{t(lang, 'geotagNote')}</p>
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
                void (async () => {
                  const ev = await appendEvent(
                    c.events,
                    'evidence_added',
                    { kind: k },
                    new Date().toISOString(),
                  )
                  const next = {
                    ...c,
                    evidence: { ...c.evidence, [k]: true },
                    events: [...c.events, ev],
                  }
                  await db.cases.put(next)
                  setC(next)
                  setOk(await verifyChain(next.events))
                })()
              }}
            >
              {t(lang, k)} ✓
            </button>
          ))}
        </div>
      </section>
      <section className="flex flex-wrap gap-3">
        <button type="button" className="btn" onClick={exportJson}>
          {t(lang, 'json')}
        </button>
        <button
          type="button"
          className="btn"
          onClick={() => {
            const text = shareText()
            if (typeof navigator.share === 'function') {
              void navigator.share({ text }).catch(() => {
                void navigator.clipboard.writeText(text)
              })
              return
            }
            void navigator.clipboard.writeText(text)
          }}
        >
          {t(lang, 'share')}
        </button>
        <Link to={`/case/${c.id}/print`} className="btn">
          {t(lang, 'print')}
        </Link>
      </section>
      {c.profileId === 'demo-farmer' && (
        <section className="rounded border border-dashed border-slate-600 p-3 text-base">
          <p className="text-[var(--muted)]">{t(lang, 'demoOnly')}</p>
          <button
            type="button"
            className="btn mt-2"
            onClick={() => {
              if (!c.events.length) return
              const tampered = [...c.events]
              tampered[0] = {
                ...tampered[0]!,
                payload: { ...(tampered[0]!.payload as object), tampered: true },
              }
              const next = { ...c, events: tampered }
              void db.cases.put(next).then(async () => {
                setC(next)
                setOk(await verifyChain(next.events))
              })
            }}
          >
            {t(lang, 'tamper')}
          </button>
          <button
            type="button"
            className="btn mt-2 ml-2"
            onClick={() => {
              void (async () => {
                const ev = await appendEvent(
                  [],
                  'report_confirmed',
                  {
                    crop: c.crop,
                    village: c.village,
                    loss: c.loss,
                    eventTimeIso: c.eventTimeIso,
                  },
                  c.createdAt,
                )
                const next = { ...c, events: [ev] }
                await db.cases.put(next)
                setC(next)
                setOk(true)
              })()
            }}
          >
            {t(lang, 'repair')}
          </button>
        </section>
      )}
    </div>
  )
}