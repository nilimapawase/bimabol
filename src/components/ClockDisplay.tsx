import { clockState } from '../domain/clock'

const ICON: Record<string, string> = {
  green: '🟢',
  amber: '🟠',
  red: '🔴',
  late: '⏱️',
}

type Props = { eventTimeIso: string }

export function ClockDisplay({ eventTimeIso }: Props) {
  const ms = Date.parse(eventTimeIso)
  const state = clockState(ms)
  const sign = state.late ? '−' : ''
  return (
    <div
      className="rounded-xl border-2 border-slate-600 bg-slate-900 px-4 py-3"
      aria-live="polite"
    >
      <p className="text-lg font-semibold">
        {ICON[state.band]} ७२ तासांचे घड्याळ — {sign}
        {state.hours} तास {state.minutes} मिनिटे{' '}
        {state.late ? '(उशीर झाला असू शकतो)' : 'उरले'}
      </p>
      {state.late && (
        <p className="mt-2 text-base text-amber-200">
          वेळ निघून गेली असू शकते, तरीही आत्ताच १४४४७ वर कळवा आणि नोंद ठेवा.
        </p>
      )}
    </div>
  )
}