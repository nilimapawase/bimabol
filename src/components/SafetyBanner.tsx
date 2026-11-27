import { NOT_GOV_LINE_MR, SAFETY_LINE_MR } from '../constants/copy'

export function SafetyBanner() {
  return (
    <div className="rounded-lg border border-slate-600 bg-slate-900/80 px-4 py-3 text-base leading-relaxed text-slate-200">
      <p>{SAFETY_LINE_MR}</p>
      <p className="mt-2 text-amber-200/90">{NOT_GOV_LINE_MR}</p>
    </div>
  )
}