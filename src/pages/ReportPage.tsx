import { useMemo, useState, type Dispatch, type SetStateAction } from 'react'
import { useNavigate } from 'react-router-dom'
import { SafetyBanner } from '../components/SafetyBanner'
import { dialHelpline } from '../constants/helpline'
import { createCaseFromDraft, type ReportDraft } from '../db/caseService'
import { getActiveProfileId, db } from '../db/database'
import { parseConfirmIntent } from '../flow/intents'
import { classifyWho, tenDigitMobile, voiceCommand } from '../flow/reportVoice'
import { parseFreeReport, cropLabel, lossLabel } from '../parse/reportParser'
import type { CropId } from '../parse/vocab'
import { t } from '../i18n'
import type { SpeechLang } from '../speech/useSpeech'
import { VoiceMic } from '../ui/VoiceMic'

type Step = 'who' | 'otherName' | 'setup' | 'report' | 'gaps' | 'confirm'

function readbackLine(draft: ReportDraft, lang: SpeechLang): string {
  const crop = draft.crop ? cropLabel(draft.crop) : '—'
  const village = draft.village ?? '—'
  const loss = draft.loss ? lossLabel(draft.loss) : '—'
  const time = draft.eventTimeIso ?? '—'
  return `${t(lang, 'readback')}: ${t(lang, 'lblCrop')} ${crop}, ${t(lang, 'lblVillage')} ${village}, ${t(lang, 'lblLoss')} ${loss}, ${t(lang, 'lblTime')} ${time}. ${t(lang, 'right')}`
}

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
    special: base.special || p.flagsSpecialLoss || false,
  }
}

async function profileStepAfterMine(
  setDraft: Dispatch<SetStateAction<ReportDraft>>,
  setStep: Dispatch<SetStateAction<Step>>,
) {
  const pid = await getActiveProfileId()
  const p = await db.profiles.get(pid)
  setDraft((d) => ({
    ...d,
    forOther: false,
    mobile: p?.mobile ?? d.mobile,
    policy: p?.policyNumber ?? d.policy,
    bankBranch: p?.bankBranch ?? d.bankBranch,
  }))
  setStep(p?.mobile && p?.policyNumber ? 'report' : 'setup')
}

export function ReportPage({
  lang,
  onLang,
}: {
  lang: SpeechLang
  onLang: (lang: SpeechLang) => void
}) {
  const nav = useNavigate()
  const [step, setStep] = useState<Step>('who')
  const [draft, setDraft] = useState<ReportDraft>({ forOther: false })
  const [gapField, setGapField] = useState<'crop' | 'village' | 'time' | null>(null)
  const [gapsAsked, setGapsAsked] = useState(0)

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

  const confirm = async () => {
    const c = await createCaseFromDraft(draft)
    nav(`/case/${c.id}`)
  }

  const prompt = useMemo(() => {
    if (step === 'who') return t(lang, 'whoQ')
    if (step === 'otherName') return t(lang, 'askOtherName')
    if (step === 'setup') return t(lang, 'setupSay')
    if (step === 'report') return t(lang, 'sayLossVoice')
    if (step === 'gaps') {
      if (gapField === 'crop') return t(lang, 'askCrop')
      if (gapField === 'village') return t(lang, 'askVillage')
      return t(lang, 'askTime')
    }
    const base = readbackLine(draft, lang)
    return draft.special ? `${t(lang, 'specialRules')} ${base}` : base
  }, [step, gapField, draft, lang])

  const onHeard = (text: string) => {
    const command = voiceCommand(text)
    if (command === 'hindi') onLang('hi-IN')
    if (command === 'english') onLang('en-IN')
    if (command === 'marathi') onLang('mr-IN')
    if (command === 'call') {
      dialHelpline()
      return
    }
    if (command === 'changeVillage') {
      setGapField('village')
      setStep('gaps')
      return
    }
    const intent = parseConfirmIntent(text)
    if (step === 'who') {
      const who = classifyWho(text)
      if (!who) return
      if (who === 'mine') {
        void profileStepAfterMine(setDraft, setStep)
        return
      }
      const stripped = text
        .replace(/दुसर[ा्याचे]?|दुसऱ्या|शेतकरी|फार्मर|other|someone/gi, ' ')
        .trim()
      setDraft((d) => ({
        ...d,
        forOther: true,
        otherName: stripped.length > 2 ? stripped : d.otherName,
      }))
      setStep(stripped.length > 2 ? 'setup' : 'otherName')
      return
    }
    if (step === 'otherName') {
      setDraft((d) => ({ ...d, forOther: true, otherName: text.trim() }))
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
      const next = withParse(draft, text)
      setDraft(next)
      routeAfter(next, gapsAsked)
      return
    }
    if (step === 'gaps' && gapField) {
      const parsed = parseFreeReport(text)
      const next: ReportDraft = { ...draft }
      if (gapField === 'crop') next.crop = parsed.crop ?? (text as CropId)
      if (gapField === 'village') next.village = parsed.village ?? text
      if (gapField === 'time') next.eventTimeIso = parsed.eventTimeIso ?? text
      setDraft(next)
      const asked = gapsAsked + 1
      setGapsAsked(asked)
      routeAfter(next, asked)
      return
    }
    if (step === 'confirm') {
      if (intent === 'yes') void confirm()
      if (intent === 'no') setStep('report')
      if (intent === 'change') {
        setGapField('village')
        setStep('gaps')
      }
    }
  }

  return (
    <div className="card rise flex flex-col gap-4">
      <SafetyBanner lang={lang} speakOnMount />
      <VoiceMic lang={lang} prompt={prompt} onHeard={onHeard} />
      {step === 'who' && (
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="btn primary flex-1 min-h-14 text-lg"
            onClick={() => void profileStepAfterMine(setDraft, setStep)}
          >
            {t(lang, 'mine')}
          </button>
          <button
            type="button"
            className="btn flex-1 min-h-14 text-lg"
            onClick={() => {
              setDraft((d) => ({ ...d, forOther: true }))
              setStep('otherName')
            }}
          >
            {t(lang, 'other')}
          </button>
        </div>
      )}
      {step === 'gaps' && gapField && (
        <p className="text-lg">
          {gapField === 'crop' && t(lang, 'askCrop')}
          {gapField === 'village' && t(lang, 'askVillage')}
          {gapField === 'time' && t(lang, 'askTime')}
        </p>
      )}
      {step === 'confirm' && (
        <>
          {draft.special && <p className="text-[var(--gold)]">{t(lang, 'specialRules')}</p>}
          <p className="text-lg">{readbackLine(draft, lang)}</p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="btn primary flex-1 min-h-14 text-lg"
              onClick={() => void confirm()}
            >
              {t(lang, 'yes')}
            </button>
            <button type="button" className="btn flex-1 min-h-14 text-lg" onClick={() => setStep('report')}>
              {t(lang, 'no')}
            </button>
          </div>
        </>
      )}
    </div>
  )
}