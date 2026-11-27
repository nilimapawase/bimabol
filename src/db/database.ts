import Dexie, { type Table } from 'dexie'
import type { CaseRecord, PhotoBlob, Profile } from './types'
import { PRIVACY_KEY, clearAll as clearPrivacyStore } from '../storage/store'

class BimaBolDB extends Dexie {
  profiles!: Table<Profile, string>
  cases!: Table<CaseRecord, string>
  photos!: Table<PhotoBlob, string>

  constructor() {
    super('bimabol')
    this.version(1).stores({
      profiles: 'id, name',
      cases: 'id, profileId, createdAt',
      photos: 'id, caseId',
    })
  }
}

export const db = new BimaBolDB()

export async function wipeAllData(): Promise<void> {
  await db.cases.clear()
  await db.profiles.clear()
  await db.photos.clear()
  clearPrivacyStore()
  localStorage.removeItem(ACTIVE_PROFILE_KEY)
  if ('caches' in window) {
    const keys = await caches.keys()
    await Promise.all(keys.map((k) => caches.delete(k)))
  }
}

const ACTIVE_PROFILE_KEY = 'bimabol-active-profile'

export async function ensureDemoProfiles(): Promise<void> {
  const demo: Profile = {
    id: 'demo-farmer',
    name: 'डेमो डेटा — राजू पाटील',
    mobile: '9876543210',
    policyNumber: 'DEMO-0001',
    bankBranch: 'डेमो शाखा',
    demo: true,
  }
  const op: Profile = {
    id: 'operator-1',
    name: 'ऑपरेटर — सीएससी',
    mobile: '9123456780',
    policyNumber: '',
    bankBranch: '',
  }
  await db.profiles.bulkPut([demo, op])
}

export async function getActiveProfileId(): Promise<string> {
  await ensureDemoProfiles()
  const existing = localStorage.getItem(ACTIVE_PROFILE_KEY)
  if (existing) return existing
  localStorage.setItem(ACTIVE_PROFILE_KEY, 'demo-farmer')
  return 'demo-farmer'
}

export function setActiveProfileId(id: string): void {
  localStorage.setItem(ACTIVE_PROFILE_KEY, id)
}

export async function listProfiles(): Promise<Profile[]> {
  await ensureDemoProfiles()
  return db.profiles.toArray()
}

export async function upsertProfile(profile: Profile): Promise<void> {
  await db.profiles.put(profile)
}

export async function listCases(profileId: string): Promise<CaseRecord[]> {
  return db.cases.where('profileId').equals(profileId).toArray()
}

export async function getCase(id: string): Promise<CaseRecord | undefined> {
  return db.cases.get(id)
}

export async function saveCase(rec: CaseRecord): Promise<void> {
  await db.cases.put(rec)
}

export { PRIVACY_KEY }