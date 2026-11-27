import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SafetyBanner } from '../components/SafetyBanner'
import { createCaseFromDraft, type ReportDraft } from '../db/caseService'
import { parseConfirmIntent } from '../flow/intents'
import { classifyWho, tenDigitMobile } from '../flow/reportVoice'
import { parseFreeReport, cropLabel, lossLabel } from '../parse/reportParser'
import type { CropId } from '../parse/vocab'
import { t } from '../i18n'
import type { SpeechLang } from '../speech/useSpeech'
import { VoiceMic } from '../ui/VoiceMic'

type Step = 'who' | 'setup' | 'report' | 'gaps' | 'confirm'

function withParse(base: ReportDraft, text: string): ReportDraft {
  const p = parseFreeReport(text)
  return {
    ...base,
    freeText: text,
    crop: base.crop ?? p.crop,
    village: base.village ?? p.village,
    district: base.district ?? p.district,
    loss: base.loss ?? p.loss,
    area: base.area ?? p.area,
    eventTimeIso: base.eventTimeIso ?? p.eventTimeIso,
  }
}

export function ReportPage({ lang }: { lang: SpeechLang }) {
  const nav = useNavigate()
  const [step, setStep] = useState<Step>('who')
  const [draft, setDraft] = useState<ReportDraft>({ forOther: false })
  const [freeText, setFreeText] = useState('')
  const [gapField, setGapField] = useState<'crop' | 'village' | 'time' | null>(null)
  const [gapValue, setGapValue] = useState('')
  const [gapsAsked, setGapsAsked] = useState(0)

  const applyParsed = (text: string) => {
    setDraft((d) => withParse(d, text))
  }

  const routeAfter = (next: ReportDraft, asked: number) => {
    if (!next.crop && asked < 3) {
      setGapField('crop')
      setStep('gaps')
      return
    }
    if (!next.village && asked < 3) {
      setGapField('village')
      setStep('gaps')
      return
    }
    if (!next.eventTimeIso && asked < 3) {
      setGapField('time')
      setStep('gaps')
      return
    }
    setGapField(null)
    setStep('confirm')
  }

  const saveGap = () => {
    const parsed = parseFreeReport(gapValue)
    const next: ReportDraft = { ...draft }
    if (gapField === 'crop') next.crop = parsed.crop ?? (gapValue as CropId)
    if (gapField === 'village') next.village = parsed.village ?? gapValue
    if (gapField === 'time') next.eventTimeIso = parsed.eventTimeIso ?? gapValue
    setDraft(next)
    setGapValue('')
    const asked = gapsAsked + 1
    setGapsAsked(asked)
    routeAfter(next, asked)
  }

  const confirm = async () => {
    const c = await createCaseFromDraft(draft)
    nav(`/case/${c.id}`)
  }

  const prompt =
    step === 'who'
      ? t(lang, 'whoQ')
      : step === 'setup'
        ? t(lang, 'setupSay')
        : step === 'report'
          ? t(lang, 'sayLoss')
          : step === 'gaps'
            ? gapField === 'crop'
              ? t(lang, 'askCrop')
              : gapField === 'village'
                ? t(lang, 'askVillage')
                : t(lang, 'askTime')
            : `${t(lang, 'readback')}. ${t(lang, 'right')}`

  const onHeard = (text: string) => {
    const intent = parseConfirmIntent(text)
    if (step === 'who') {
      const who = classifyWho(text)
      if (!who) return
      setDraft((d) => ({ ...d, forOther: who === 'other' }))
      setStep('setup')
      return
    }
    if (step === 'setup') {
      if (intent === 'yes') {
        setStep('report')
        return
      }
      setDraft((d) => {
        const next = { ...d }
        const mobile = tenDigitMobile(text)
        if (d.forOther && !d.otherName && !mobile) next.otherName = text.trim()
        else if (!d.mobile && mobile) next.mobile = mobile
        else if (!d.policy) next.policy = text.trim()
        else if (!d.bankBranch) next.bankBranch = text.trim()
        return next
      })
      return
    }
    if (step === 'report') {
      if (intent === 'yes' && freeText.trim()) {
        const next = withParse(draft, freeText)
        setDraft(next)
        routeAfter(next, gapsAsked)
        return
      }
      setFreeText(text)
      const next = withParse(draft, text)
      setDraft(next)
      if (next.crop && next.village && next.eventTimeIso) routeAfter(next, gapsAsked)
      return
    }
    if (step === 'gaps' && gapField) {
      const parsed = parseFreeReport(text)
      const next: ReportDraft = { ...draft }
      if (gapField === 'crop') next.crop = parsed.crop ?? (text as CropId)
      if (gapField === 'village') next.village = parsed.village ?? text
      if (gapField === 'time') next.eventTimeIso = parsed.eventTimeIso ?? text
      setDraft(next)
      setGapValue('')
      const asked = gapsAsked + 1
      setGapsAsked(asked)
      routeAfter(next, asked)
      return
    }
    if (step === 'confirm') {
      if (intent === 'yes') void confirm()
      if (intent === 'no') setStep('report')
    }
  }

  return (
    <div className="card rise flex flex-col gap-4">
      <SafetyBanner lang={lang} />
      <VoiceMic lang={lang} prompt={prompt} onHeard={onHeard} />
      {step === 'who' && (
        <>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="btn"
              onClick={() => {
                setDraft((d) => ({ ...d, forOther: false }))
                setStep('setup')
              }}
            >
              {t(lang, 'mine')}
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => {
                setDraft((d) => ({ ...d, forOther: true }))
                setStep('setup')
              }}
            >
              {t(lang, 'other')}
            </button>
          </div>
        </>
      )}
      {step === 'setup' && (
        <>
          {draft.forOther && (
            <input
              className="input"
              placeholder={t(lang, 'otherName')}
              value={draft.otherName ?? ''}
              onChange={(e) =>
                setDraft((d) => ({ ...d, otherName: e.target.value }))
              }
            />
          )}
          <input
            className="input"
            placeholder={t(lang, 'mobilePh')}
            inputMode="numeric"
            value={draft.mobile ?? ''}
            onChange={(e) =>
              setDraft((d) => ({ ...d, mobile: e.target.value }))
            }
          />
          <input
            className="input"
            placeholder={t(lang, 'policyPh')}
            value={draft.policy ?? ''}
            onChange={(e) =>
              setDraft((d) => ({ ...d, policy: e.target.value }))
            }
          />
          <input
            className="input"
            placeholder={t(lang, 'branchPh')}
            value={draft.bankBranch ?? ''}
            onChange={(e) =>
              setDraft((d) => ({ ...d, bankBranch: e.target.value }))
            }
          />
          <button type="button" className="btn primary" onClick={() => setStep('report')}>
            {t(lang, 'yesNext')}
          </button>
        </>
      )}
      {step === 'report' && (
        <>
          <textarea
            className="input min-h-32"
            value={freeText}
            onChange={(e) => {
              setFreeText(e.target.value)
              applyParsed(e.target.value)
            }}
          />
          <button
            type="button"
            className="btn primary"
            onClick={() => {
              const next = withParse(draft, freeText)
              setDraft(next)
              routeAfter(next, gapsAsked)
            }}
          >
            {t(lang, 'next')}
          </button>
        </>
      )}
      {step === 'gaps' && gapField && (
        <>
          <p>
            {gapField === 'crop' && t(lang, 'askCrop')}
            {gapField === 'village' && t(lang, 'askVillage')}
            {gapField === 'time' && t(lang, 'askTime')}
          </p>
          <input
            className="input"
            value={gapValue}
            onChange={(e) => setGapValue(e.target.value)}
          />
          <button type="button" className="btn primary" onClick={saveGap}>
            {t(lang, 'yes')}
          </button>
        </>
      )}
      {step === 'gaps' && !gapField && (
        <button type="button" className="btn primary" onClick={() => setStep('confirm')}>
          पुष्टीकडे
        </button>
      )}
      {step === 'confirm' && (
        <>
          <p className="text-lg">
            {t(lang, 'readback')}: {draft.crop ? cropLabel(draft.crop) : '—'}, {draft.village ?? '—'},{' '}
            {draft.loss ? lossLabel(draft.loss) : '—'}, {draft.eventTimeIso ?? '—'}. {t(lang, 'right')}
          </p>
          <div className="flex flex-wrap gap-3">
            <button type="button" className="btn primary" onClick={() => void confirm()}>
              {t(lang, 'yes')}
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => {
                setStep('report')
              }}
            >
              {t(lang, 'no')}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
