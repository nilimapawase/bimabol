import { canonicalStringify } from './canonical'

export type LogEventType =
  | 'report_confirmed'
  | 'call_tapped'
  | 'whatsapp_opened'
  | 'ticket_saved'
  | 'evidence_added'

export type ChainEvent = {
  id: string
  type: LogEventType
  timestamp: string
  payload: Record<string, unknown>
  prevHash: string
  hash: string
}

export const GENESIS = '0'.repeat(64)

export async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input)
  const buf = await crypto.subtle.digest('SHA-256', data)
  return [...new Uint8Array(buf)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function computeEventHash(
  prevHash: string,
  event: Omit<ChainEvent, 'hash'>,
): Promise<string> {
  const body = canonicalStringify({
    id: event.id,
    type: event.type,
    timestamp: event.timestamp,
    payload: event.payload,
    prevHash,
  })
  return sha256Hex(prevHash + body)
}

export async function appendEvent(
  chain: ChainEvent[],
  type: LogEventType,
  payload: Record<string, unknown>,
  nowIso: string,
  id = crypto.randomUUID(),
): Promise<ChainEvent> {
  const prevHash = chain.length ? chain[chain.length - 1]!.hash : GENESIS
  const base = {
    id,
    type,
    timestamp: nowIso,
    payload,
    prevHash,
  }
  const hash = await computeEventHash(prevHash, base)
  return { ...base, hash }
}

export async function verifyChain(events: ChainEvent[]): Promise<boolean> {
  let prev = GENESIS
  for (const ev of events) {
    if (ev.prevHash !== prev) return false
    const expected = await computeEventHash(prev, {
      id: ev.id,
      type: ev.type,
      timestamp: ev.timestamp,
      payload: ev.payload,
      prevHash: ev.prevHash,
    })
    if (expected !== ev.hash) return false
    prev = ev.hash
  }
  return true
}