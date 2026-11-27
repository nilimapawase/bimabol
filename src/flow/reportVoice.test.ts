import { describe, expect, it } from 'vitest'
import {
  classifyWho,
  evidenceFromSpeech,
  spokenTicket,
  tenDigitMobile,
  voiceCommand,
} from './reportVoice'

describe('report voice', () => {
  it('classifies who', () => {
    expect(classifyWho('माझे')).toBe('mine')
    expect(classifyWho('दुसऱ्या शेतकऱ्यासाठी')).toBe('other')
    expect(classifyWho('for someone else')).toBe('other')
  })

  it('reads a 10-digit mobile', () => {
    expect(tenDigitMobile('नऊ आठ सात सहा पाच चार तीन दोन एक शून्य')).toBe('9876543210')
    expect(tenDigitMobile('माझा नंबर 9876543210 आहे')).toBe('9876543210')
  })

  it('hears language, call, and village change', () => {
    expect(voiceCommand('हिंदी')).toBe('hindi')
    expect(voiceCommand('English')).toBe('english')
    expect(voiceCommand('फोन करा')).toBe('call')
    expect(voiceCommand('गाव बदला')).toBe('changeVillage')
  })

  it('reads a spoken ticket and evidence', () => {
    expect(spokenTicket('A B one two C D')).toBe('AB12CD')
    expect(spokenTicket('ZX98')).toBe('ZX98')
    expect(evidenceFromSpeech('फोटो काढले')).toBe('photos')
    expect(evidenceFromSpeech('passbook photo')).toBe('passbook')
  })
})
