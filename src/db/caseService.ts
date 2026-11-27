import { appendEvent } from '../domain/hashChain'
import { parseFreeReport } from '../parse/reportParser'
import type { CropId, LossId } from '../parse/vocab'
import { db, getActiveProfileId, saveCase, upsertProfile } from './database'
import type { CaseRecord } from './types'

export type ReportDraft = {
  forOther: boolean
  otherName?: string
  mobile?: string
  policy?: string
  bankBranch?: string
  freeText?: string
  crop?: CropId
  village?: string
  taluka?: string
  district?: string
  loss?: LossId
  area?: string
  eventTimeIso?: string
}

function istNow(): string {
  return new Date().toISOString().replace('Z', '+05:30').slice(0, 25) // approximate; tests inject
}

export async function createCaseFromDraft(
  draft: ReportDraft,
  nowIso = istNow(),
): Promise<CaseRecord> {
  const profileId = await getActiveProfileId()
  const profile = await db.profiles.get(profileId)
  if (profile && (draft.mobile || draft.policy || draft.bankBranch)) {
    await upsertProfile({
      ...profile,
      mobile: draft.mobile ?? profile.mobile,
      policyNumber: draft.policy ?? profile.policyNumber,
      bankBranch: draft.bankBranch ?? profile.bankBranch,
    })
  }
  const parsed = draft.freeText ? parseFreeReport(draft.freeText) : {}
  const eventTimeIso =
    draft.eventTimeIso ?? parsed.eventTimeIso ?? nowIso

  const rec: CaseRecord = {
    id: crypto.randomUUID(),
    profileId,
    createdAt: nowIso,
    forOtherFarmer: draft.forOther,
    otherFarmerName: draft.otherName,
    mobile: draft.mobile ?? profile?.mobile,
    policyNumber: draft.policy ?? profile?.policyNumber,
    bankBranch: draft.bankBranch ?? profile?.bankBranch,
    crop: draft.crop ?? parsed.crop,
    village: draft.village ?? parsed.village,
    taluka: draft.taluka,
    district: draft.district ?? parsed.district,
    loss: draft.loss ?? parsed.loss,
    area: draft.area ?? parsed.area,
    eventTimeIso,
    evidence: {
      photos: false,
      policy: false,
      passbook: false,
      witness: false,
      survey: false,
    },
    events: [],
  }

  const ev = await appendEvent(
    [],
    'report_confirmed',
    {
      crop: rec.crop,
      village: rec.village,
      loss: rec.loss,
      eventTimeIso: rec.eventTimeIso,
      farmer: profile?.name,
    },
    nowIso,
  )
  rec.events = [ev]
  await saveCase(rec)
  return rec
}

export function validateTicket(raw: string): boolean {
  const t = raw.trim()
  return /^[A-Za-z0-9]{4,30}$/.test(t)
}

export async function saveTicket(caseId: string, ticket: string): Promise<void> {
  const c = await db.cases.get(caseId)
  if (!c) return
  const cleaned = ticket.trim()
  const now = istNow()
  const ev = await appendEvent(c.events, 'ticket_saved', { ticket: cleaned }, now)
  c.ticket = cleaned
  c.ticketSavedAt = now
  c.events = [...c.events, ev]
  await saveCase(c)
}