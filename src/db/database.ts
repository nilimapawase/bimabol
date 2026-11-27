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
  if ('caches' in window) {
    const keys = await caches.keys()
    await Promise.all(keys.map((k) => caches.delete(k)))
  }
}

export async function getActiveProfileId(): Promise<string> {
  const key = 'bimabol-active-profile'
  const existing = localStorage.getItem(key)
  if (existing) return existing
  const demo: Profile = {
    id: 'demo-farmer',
    name: 'डेमो डेटा — राजू पाटील',
    mobile: '9876543210',
    policyNumber: 'DEMO-0001',
    bankBranch: 'डेमो शाखा',
    demo: true,
  }
  await db.profiles.put(demo)
  localStorage.setItem(key, demo.id)
  return demo.id
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