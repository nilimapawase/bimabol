import type { ChainEvent } from '../domain/hashChain'
import type { CropId, LossId } from '../parse/vocab'

export type Profile = {
  id: string
  name: string
  mobile: string
  policyNumber?: string
  bankBranch?: string
  demo?: boolean
}

export type CaseRecord = {
  id: string
  profileId: string
  createdAt: string
  forOtherFarmer: boolean
  otherFarmerName?: string
  crop?: CropId
  village?: string
  taluka?: string
  district?: string
  loss?: LossId
  area?: string
  eventTimeIso: string
  discoveryTimeIso?: string
  ticket?: string
  ticketSavedAt?: string
  evidence: {
    photos: boolean
    policy: boolean
    passbook: boolean
    witness: boolean
    survey: boolean
  }
  witnessName?: string
  surveyNumber?: string
  events: ChainEvent[]
}

export type PhotoBlob = {
  id: string
  caseId: string
  sha256: string
  capturedAt: string
  mime: string
}