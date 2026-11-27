import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SafetyBanner } from '../components/SafetyBanner'
import { createCaseFromDraft, type ReportDraft } from '../db/caseService'
import { parseFreeReport, cropLabel, lossLabel } from '../parse/reportParser'
import type { CropId } from '../parse/vocab'

type Step = 'who' | 'setup' | 'report' | 'gaps' | 'confirm'

export function ReportPage() {
  const nav = useNavigate()
  const [step, setStep] = useState<Step>('who')
  const [draft, setDraft] = useState<ReportDraft>({ forOther: false })
  const [freeText, setFreeText] = useState('')
  const [gapField, setGapField] = useState<'crop' | 'village' | 'time' | null>(null)
  const [gapValue, setGapValue] = useState('')
  const [gapsAsked, setGapsAsked] = useState(0)

  const applyParsed = (text: string) => {
    const p = parseFreeReport(text)
    setDraft((d) => ({
      ...d,
      freeText: text,
      crop: d.crop ?? p.crop,
      village: d.village ?? p.village,
      district: d.district ?? p.district,
      loss: d.loss ?? p.loss,
      area: d.area ?? p.area,
      eventTimeIso: d.eventTimeIso ?? p.eventTimeIso,
    }))
  }

  const nextGap = () => {
    if (!draft.crop) {
      setGapField('crop')
      return
    }
    if (!draft.village) {
      setGapField('village')
      return
    }
    if (!draft.eventTimeIso) {
      setGapField('time')
      return
    }
    setStep('confirm')
  }

  const saveGap = () => {
    if (gapField === 'crop') setDraft((d) => ({ ...d, crop: gapValue as CropId }))
    if (gapField === 'village') setDraft((d) => ({ ...d, village: gapValue }))
    if (gapField === 'time') setDraft((d) => ({ ...d, eventTimeIso: gapValue }))
    setGapValue('')
    setGapsAsked((n) => n + 1)
    setGapField(null)
    if (gapsAsked + 1 >= 3) setStep('confirm')
    else nextGap()
  }

  const confirm = async () => {
    const c = await createCaseFromDraft(draft)
    nav(`/case/${c.id}`)
  }

  return (
    <div className="flex flex-col gap-4">
      <SafetyBanner />
      {step === 'who' && (
        <>
          <p>तुमच्यासाठी की दुसऱ्या शेतकऱ्यासाठी?</p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="btn"
              onClick={() => {
                setDraft((d) => ({ ...d, forOther: false }))
                setStep('setup')
              }}
            >
              माझे
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => {
                setDraft((d) => ({ ...d, forOther: true }))
                setStep('setup')
              }}
            >
              दुसऱ्याचे
            </button>
          </div>
        </>
      )}
      {step === 'setup' && (
        <>
          {draft.forOther && (
            <input
              className="input"
              placeholder="शेतकऱ्याचे नाव"
              value={draft.otherName ?? ''}
              onChange={(e) =>
                setDraft((d) => ({ ...d, otherName: e.target.value }))
              }
            />
          )}
          <input
            className="input"
            placeholder="१० अंकी मोबाईल"
            inputMode="numeric"
            value={draft.mobile ?? ''}
            onChange={(e) =>
              setDraft((d) => ({ ...d, mobile: e.target.value }))
            }
          />
          <input
            className="input"
            placeholder="विमा / नोंदणी क्रमांक"
            value={draft.policy ?? ''}
            onChange={(e) =>
              setDraft((d) => ({ ...d, policy: e.target.value }))
            }
          />
          <input
            className="input"
            placeholder="बँक शाखा (फक्त नाव)"
            value={draft.bankBranch ?? ''}
            onChange={(e) =>
              setDraft((d) => ({ ...d, bankBranch: e.target.value }))
            }
          />
          <button type="button" className="btn primary" onClick={() => setStep('report')}>
            हो — पुढे
          </button>
        </>
      )}
      {step === 'report' && (
        <>
          <p>काय झाले ते सांगा (टाइप करा किंवा मिक वापरा).</p>
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
              applyParsed(freeText)
              setStep('gaps')
              nextGap()
            }}
          >
            पुढे
          </button>
        </>
      )}
      {step === 'gaps' && gapField && (
        <>
          <p>
            {gapField === 'crop' && 'कोणते पीक?'}
            {gapField === 'village' && 'कोणते गाव?'}
            {gapField === 'time' && 'हे केव्हा झाले? (ISO किंवा वाक्य)'}
          </p>
          <input
            className="input"
            value={gapValue}
            onChange={(e) => setGapValue(e.target.value)}
          />
          <button type="button" className="btn primary" onClick={saveGap}>
            हो
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
            मला असे समजले आहे: पीक{' '}
            {draft.crop ? cropLabel(draft.crop) : '—'}, गाव {draft.village ?? '—'}, नुकसान{' '}
            {draft.loss ? lossLabel(draft.loss) : '—'}, वेळ {draft.eventTimeIso ?? '—'}. बरोबर
            आहे का?
          </p>
          <div className="flex flex-wrap gap-3">
            <button type="button" className="btn primary" onClick={() => void confirm()}>
              हो
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => {
                setStep('report')
              }}
            >
              नाही
            </button>
          </div>
        </>
      )}
    </div>
  )
}
