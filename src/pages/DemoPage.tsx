import { useState } from 'react'
import type { ParseKind } from '../config/steps'
import { parseAnswer } from '../parse/index'

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
  { label: 'अंक मालिका', text: 'नऊ आठ', kind: 'digits' },
  { label: 'वेळ', text: 'आज सकाळी', kind: 'time' },
  { label: 'वेळ', text: 'काल रात्री', kind: 'time' },
  { label: 'संकेतशब्द', text: 'मी शाळेत जातो', kind: 'keyword', keywords: 'साला' },
]

const HI_EXAMPLES: Example[] = [
  { label: 'अंक', text: 'पचास', kind: 'digits' },
  { label: 'अंक', text: 'नौ आठ', kind: 'digits' },
  { label: 'समय', text: 'आज सुबह', kind: 'time' },
  { label: 'समय', text: 'कल रात', kind: 'time' },
  { label: 'कीवर्ड', text: 'मैं स्कूल जाता हूँ', kind: 'keyword', keywords: 'स्कूल' },
]

const EN_EXAMPLES: Example[] = [
  { label: 'number', text: 'fifty', kind: 'digits' },
  { label: 'digits', text: 'nine eight', kind: 'digits' },
  { label: 'time', text: 'today morning', kind: 'time' },
  { label: 'time', text: 'yesterday night', kind: 'time' },
  { label: 'keyword', text: 'going to school', kind: 'keyword', keywords: 'school' },
]

function ExampleGroup({
  title,
  items,
  onPick,
}: {
  title: string
  items: Example[]
  onPick: (ex: Example) => void
}) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-slate-200">{title}</h3>
      <ul className="mt-2 flex flex-col gap-2">
        {items.map((ex) => (
          <li key={`${title}-${ex.text}`}>
            <button
              type="button"
              onClick={() => onPick(ex)}
              className="w-full rounded-xl border border-slate-600 bg-slate-900 px-4 py-3 text-left text-lg hover:border-sky-500"
            >
              <span className="text-slate-500">{ex.label}: </span>
              {ex.text}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function DemoPage() {
  const [input, setInput] = useState('')
  const [kind, setKind] = useState<ParseKind>('digits')
  const [keywords, setKeywords] = useState('साला')
  const [result, setResult] = useState<unknown>(null)

  const runParse = () => {
    const kws =
      kind === 'keyword'
        ? keywords.split(/[\s,]+/).filter(Boolean)
        : undefined
    const parsed = parseAnswer(input, kind, kws)
    setResult(parsed)
  }

  const pickExample = (ex: Example) => {
    setInput(ex.text)
    setKind(ex.kind)
    if (ex.keywords) setKeywords(ex.keywords)
    setResult(null)
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">पार्सर डेमो / Parser demo</h1>
      <p className="text-lg text-slate-400">
        No mic here. Paste text or tap an example, then Parse.
      </p>

      <div className="grid gap-4 sm:grid-cols-3">
        <ExampleGroup title="मराठी (5)" items={MR_EXAMPLES} onPick={pickExample} />
        <ExampleGroup title="हिंदी (5)" items={HI_EXAMPLES} onPick={pickExample} />
        <ExampleGroup title="English (5)" items={EN_EXAMPLES} onPick={pickExample} />
      </div>

      <label className="flex flex-col gap-2">
        <span>Parse mode</span>
        <select
          value={kind}
          onChange={(e) => setKind(e.target.value as ParseKind)}
          className="rounded-xl border border-slate-600 bg-slate-900 px-4 py-3 text-xl"
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
          <span>Keywords (comma or space)</span>
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="rounded-xl border border-slate-600 bg-slate-900 px-4 py-3 text-xl"
          />
        </label>
      )}

      <label className="flex flex-col gap-2">
        <span>Input</span>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={4}
          className="rounded-xl border border-slate-600 bg-slate-900 px-4 py-3 text-xl"
        />
      </label>

      <button
        type="button"
        onClick={runParse}
        className="rounded-xl bg-sky-700 py-4 text-xl font-semibold"
      >
        Parse / पार्स करा
      </button>

      <pre className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-950 p-4 text-base">
        {JSON.stringify(result, null, 2)}
      </pre>
    </div>
  )
}