import { useRef, type PointerEvent as ReactPointerEvent } from 'react'

const HOLD_MS = 400

type Props = {
  listening: boolean
  disabled?: boolean
  onTapToggle: () => void
  onHoldStart: () => void
  onHoldEnd: () => void
}

export function MicButton({
  listening,
  disabled,
  onTapToggle,
  onHoldStart,
  onHoldEnd,
}: Props) {
  const pressStart = useRef(0)
  const holdMode = useRef(false)
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearHoldTimer = () => {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current)
      holdTimer.current = null
    }
  }

  const onPointerDown = (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (disabled) return
    e.preventDefault()
    pressStart.current = Date.now()
    holdMode.current = false
    clearHoldTimer()
    holdTimer.current = setTimeout(() => {
      holdMode.current = true
      onHoldStart()
    }, HOLD_MS)
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onPointerUp = (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (disabled) return
    e.preventDefault()
    clearHoldTimer()
    const duration = Date.now() - pressStart.current
    if (holdMode.current || duration >= HOLD_MS) {
      onHoldEnd()
    } else {
      onTapToggle()
    }
    holdMode.current = false
    e.currentTarget.releasePointerCapture(e.pointerId)
  }

  const onPointerCancel = (e: ReactPointerEvent<HTMLButtonElement>) => {
    clearHoldTimer()
    if (holdMode.current) onHoldEnd()
    holdMode.current = false
    e.currentTarget.releasePointerCapture(e.pointerId)
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onContextMenu={(e) => e.preventDefault()}
      className={`touch-none h-32 w-32 select-none rounded-full text-xl font-bold shadow-lg transition-colors ${
        listening
          ? 'bg-red-600 ring-4 ring-red-300'
          : 'bg-emerald-600 hover:bg-emerald-500'
      } disabled:opacity-40`}
      style={{ WebkitTouchCallout: 'none', WebkitUserSelect: 'none' }}
      aria-pressed={listening}
      aria-label="Microphone"
    >
      {listening ? 'बंद / Stop' : 'माइक / Mic'}
    </button>
  )
}