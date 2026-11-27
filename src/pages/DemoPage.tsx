import { useState } from 'react'
import type { ParseKind } from '../config/steps'
import { DEMO_HI_REPORTS, DEMO_MR_REPORTS } from '../config/demoReportSentences'
import { parseAnswer } from '../parse/index'
import { parseFreeReport } from '../parse/reportParser'
import { t } from '../i18n'
import type { SpeechLang } from '../speech/useSpeech'

const DEMO_KINDS: { value: ParseKind; label: string }[] = [
  { value: 'text', label: 'text' },
  { value: 'digits', label: 'digits' },
  { value: 'time', label: 'time' },
  { value: 'keyword', label: 'keyword' },
]

type Example = {
  label: string
  text: string
  kind: ParseKind
  keywords?: string
}

const MR_EXAMPLES: Example[] = [
  { label: 'संख्या', text: 'पन्नास', kind: 'digits' },
  { label: 'अंक', text: 'नऊ आठ', kind: 'digits' },
  { label: 'वेळ', text: 'आज सकाळी', kind: 'time' },
  { label: 'वेळ', text: 'काल रात्री', kind: 'time' },
  { label: 'शब्द', text: 'मी शाळेत जातो', kind: 'keyword', keywords: 'शाळा' },
]

const HI_EXAMPLES: Example[] = [
  { label: 'अंक', text: 'पचास', kind: 'digits' },
  { label: 'अंक', text: 'नौ आठ', kind: 'digits' },
  { label: 'समय', text: 'आज सुबह', kind: 'time' },
  { label: 'समय', text: 'कल रात', kind: 'time' },
  { label: 'कीवर्ड', text: 'मैं स्कूल जाता हूँ', kind: 'keyword', keywords: 'स्कूल' },
]

function SentenceList({
  title,
  items,
  onPick,
}: {
  title: string
  items: readonly string[]
  onPick: (text: string) => void
}) {
  return (
    <div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <ul className="mt-2 flex flex-col gap-2">
        {items.map((text) => (
          <li key={text}>
            <button type="button" className="btn w-full text-left" onClick={() => onPick(text)}>
              {text}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function DemoPage({ lang }: { lang: SpeechLang }) {
  const [input, setInput] = useState('')
  const [kind, setKind] = useState<ParseKind>('digits')
  const [keywords, setKeywords] = useState('शाळा')
  const [result, setResult] = useState<unknown>(null)

  const runParse = () => {
    const kws =
      kind === 'keyword' ? keywords.split(/[\s,]+/).filter(Boolean) : undefined
    const parsed = parseAnswer(input, kind, kws)
    setResult(parsed)
  }

  const pickReport = (text: string) => {
    setInput(text)
    setKind('text')
    setResult(parseFreeReport(text))
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">{t(lang, 'demoTitle')}</h1>
      <p className="text-lg text-[var(--muted)]">{t(lang, 'demoHint')}</p>

      <section className="card">
        <h2 className="text-xl font-bold">{t(lang, 'demoReport')}</h2>
        <p className="text-sm text-[var(--muted)]">10 Marathi + 10 Hindi — tap to inject into the parser.</p>
        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          <SentenceList title="मराठी (10)" items={DEMO_MR_REPORTS} onPick={pickReport} />
          <SentenceList title="हिंदी (10)" items={DEMO_HI_REPORTS} onPick={pickReport} />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <MicroDemo title="मराठी micro (5)" items={MR_EXAMPLES} onPick={(ex) => {
          setInput(ex.text)
          setKind(ex.kind)
          if (ex.keywords) setKeywords(ex.keywords)
          setResult(null)
        }} />
        <MicroDemo title="हिंदी micro (5)" items={HI_EXAMPLES} onPick={(ex) => {
          setInput(ex.text)
          setKind(ex.kind)
          if (ex.keywords) setKeywords(ex.keywords)
          setResult(null)
        }} />
      </section>

      <label className="flex flex-col gap-2">
        <span>{t(lang, 'parseMode')}</span>
        <select
          value={kind}
          onChange={(e) => setKind(e.target.value as ParseKind)}
          className="input"
        >
          {DEMO_KINDS.map((k) => (
            <option key={k.value} value={k.value}>
              {k.label}
            </option>
          ))}
        </select>
      </label>

      {kind === 'keyword' && (
        <label className="flex flex-col gap-2">
          <span>{t(lang, 'keywords')}</span>
          <input type="text" value={keywords} onChange={(e) => setKeywords(e.target.value)} className="input" />
        </label>
      )}

      <label className="flex flex-col gap-2">
        <span>{t(lang, 'input')}</span>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={4} className="input" />
      </label>

      <button type="button" onClick={runParse} className="btn primary">
        {t(lang, 'parseBtn')}
      </button>

      <pre className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-950 p-4 text-base">
        {JSON.stringify(result, null, 2)}
      </pre>
    </div>
  )
}

function MicroDemo({
  title,
  items,
  onPick,
}: {
  title: string
  items: Example[]
  onPick: (ex: Example) => void
}) {
  return (
    <div className="card">
      <h3 className="font-semibold">{title}</h3>
      <ul className="mt-2 flex flex-col gap-2">
        {items.map((ex) => (
          <li key={ex.text}>
            <button type="button" className="btn w-full text-left" onClick={() => onPick(ex)}>
              <span className="text-[var(--muted)]">{ex.label}: </span>
              {ex.text}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}