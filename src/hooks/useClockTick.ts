import { useEffect, useState } from 'react'
import { clockState } from '../domain/clock'

export function useClockTick(eventTimeIso: string) {
  const eventMs = Date.parse(eventTimeIso)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])

  return clockState(eventMs, now)
}