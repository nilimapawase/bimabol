import { useCallback, useEffect, useRef, useState } from 'react'
import type { SpeechLang } from './useSpeech'

const FAILURE_ERRORS = new Set(['no-speech', 'network', 'audio-capture'])

function getRecognitionCtor():
  | (new () => SpeechRecognition)
  | undefined {
  if (typeof window === 'undefined') return undefined
  return window.SpeechRecognition ?? window.webkitSpeechRecognition
}

export type RecognitionFailureReason =
  | 'no-speech'
  | 'network'
  | 'audio-capture'
  | 'not-allowed'
  | 'unsupported'
  | 'other'

export function useRecognition(lang: SpeechLang) {
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [confidence, setConfidence] = useState<number | null>(null)
  const [failureCount, setFailureCount] = useState(0)
  const [permissionDenied, setPermissionDenied] = useState(false)
  const [supported, setSupported] = useState(true)
  const recRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    setSupported(!!getRecognitionCtor())
  }, [])

  useEffect(() => {
    if (recRef.current) {
      recRef.current.lang = lang
    }
  }, [lang])

  const stop = useCallback(() => {
    recRef.current?.stop()
    setListening(false)
  }, [])

  const start = useCallback(() => {
    const Ctor = getRecognitionCtor()
    if (!Ctor) {
      setSupported(false)
      return
    }
    recRef.current?.abort()
    const rec = new Ctor()
    rec.continuous = true
    rec.interimResults = true
    rec.lang = lang
    rec.maxAlternatives = 1

    rec.onstart = () => setListening(true)
    rec.onend = () => setListening(false)
    rec.onresult = (event: SpeechRecognitionEvent) => {
      let text = ''
      let conf = 0
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]!
        text += result[0]!.transcript
        if (result.isFinal) conf = result[0]!.confidence
      }
      setTranscript(text)
      if (conf > 0) setConfidence(conf)
    }
    rec.onerror = (event: SpeechRecognitionErrorEvent) => {
      const code = event.error as RecognitionFailureReason
      if (code === 'not-allowed') {
        setPermissionDenied(true)
        setFailureCount((c) => c + 1)
      } else if (FAILURE_ERRORS.has(event.error)) {
        setFailureCount((c) => c + 1)
      }
      setListening(false)
    }

    recRef.current = rec
    try {
      rec.start()
    } catch {
      setListening(false)
    }
  }, [lang])

  const toggle = useCallback(() => {
    if (listening) stop()
    else start()
  }, [listening, start, stop])

  const resetFailures = useCallback(() => {
    setFailureCount(0)
    setPermissionDenied(false)
  }, [])

  const clearTranscript = useCallback(() => {
    setTranscript('')
    setConfidence(null)
  }, [])

  return {
    listening,
    transcript,
    confidence,
    failureCount,
    permissionDenied,
    supported,
    start,
    stop,
    toggle,
    resetFailures,
    clearTranscript,
    showTypedFallback: failureCount >= 2 || permissionDenied || !supported,
  }
}