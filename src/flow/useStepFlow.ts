import { useCallback, useEffect, useMemo, useState } from 'react'
import { steps, type Step } from '../config/steps'
import { parseConfirmIntent } from './intents'
import {
  formatParseResult,
  parseAnswer,
  type ParseResult,
} from '../parse/index'
import type { SpeechLang } from '../speech/useSpeech'
import { upsertAnswer, type SavedAnswer } from '../storage/store'

export type FlowPhase = 'ask' | 'listen' | 'confirm' | 'done'

/** Keep spoken replies calm and under ~20 words. */
function speakReadBack(parsed: ParseResult): string {
  return `${formatParseResult(parsed)}. बरोबर? / Correct?`
}

export function useStepFlow(
  _lang: SpeechLang,
  speak: (text: string) => void,
  onStepChange?: (index: number) => void,
) {
  const [stepIndex, setStepIndex] = useState(0)
  const [phase, setPhase] = useState<FlowPhase>('ask')
  const [rawAnswer, setRawAnswer] = useState('')
  const [parsed, setParsed] = useState<ParseResult>(null)
  const [saved, setSaved] = useState<SavedAnswer[]>([])

  const step: Step | undefined = steps[stepIndex]

  const promptText = useMemo(() => {
    if (!step) return ''
    return step.prompt.mr
  }, [step])

  const readBackText = useMemo(() => {
    if (!step) return ''
    return speakReadBack(parsed)
  }, [parsed, step])

  const beginAsk = useCallback(() => {
    if (!step) return
    setPhase('listen')
    speak(step.prompt.mr)
  }, [speak, step])

  useEffect(() => {
    if (phase === 'ask' && step) {
      beginAsk()
    }
  }, [stepIndex, phase, step, beginAsk])

  useEffect(() => {
    onStepChange?.(stepIndex)
  }, [stepIndex, onStepChange])

  const submitAnswer = useCallback(
    (text: string) => {
      if (!step) return
      const trimmed = text.trim()
      if (!trimmed) return
      setRawAnswer(trimmed)
      const value = parseAnswer(trimmed, step.parse, step.keywords)
      setParsed(value)
      setPhase('confirm')
      speak(speakReadBack(value))
    },
    [speak, step],
  )

  const submitConfirm = useCallback(
    (text: string) => {
      const intent = parseConfirmIntent(text)
      if (!step) return

      switch (intent) {
        case 'yes': {
          const entry: SavedAnswer = {
            id: step.id,
            raw: rawAnswer,
            parsed,
          }
          setSaved(upsertAnswer(entry))
          if (stepIndex + 1 >= steps.length) {
            setPhase('done')
            speak('झाले. थोडे थांबा. / Done. Thank you.')
          } else {
            setStepIndex((i) => i + 1)
            setRawAnswer('')
            setParsed(null)
            setPhase('ask')
          }
          break
        }
        case 'no':
        case 'change':
          setPhase('listen')
          setRawAnswer('')
          setParsed(null)
          speak(step.prompt.mr)
          break
        case 'repeat':
          speak(readBackText)
          break
        default:
          break
      }
    },
    [parsed, rawAnswer, readBackText, speak, step, stepIndex],
  )

  const restart = useCallback(() => {
    setStepIndex(0)
    setPhase('ask')
    setRawAnswer('')
    setParsed(null)
  }, [])

  return {
    step,
    stepIndex,
    phase,
    promptText,
    readBackText,
    rawAnswer,
    parsed,
    saved,
    submitAnswer,
    submitConfirm,
    restart,
    totalSteps: steps.length,
  }
}