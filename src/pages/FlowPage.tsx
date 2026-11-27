import { useEffect, useRef, useState } from 'react'
import { useStepFlow } from '../flow/useStepFlow'
import { MicButton } from '../ui/MicButton'
import { PrivacyNote, shouldBlockMic } from '../speech/PrivacyNote'
import { useRecognition } from '../speech/useRecognition'
import { useSpeech, type SpeechLang } from '../speech/useSpeech'
import { loadAnswers, type SavedAnswer } from '../storage/store'

type Props = {
  lang: SpeechLang
}

function formatConfidence(c: number | null): string {
  if (c === null || c === 0) return 'unknown'
  return `${Math.round(c * 100)}%`
}

export function FlowPage({ lang }: Props) {
  const { speak, visibleOnly, lastText } = useSpeech(lang)
  const recognition = useRecognition(lang)
  const flow = useStepFlow(lang, speak, () => {
    recognition.resetFailures()
  })

  const [privacyOpen, setPrivacyOpen] = useState(shouldBlockMic())
  const [typed, setTyped] = useState('')
  const [answers, setAnswers] = useState<SavedAnswer[]>(() => loadAnswers())
  const prevListening = useRef(false)

  useEffect(() => {
    recognition.resetFailures()
    recognition.clearTranscript()
  }, [flow.stepIndex])

  const micBlocked = privacyOpen

  const handleMicToggle = () => {
    if (micBlocked) return
    recognition.toggle()
  }

  const handleHoldStart = () => {
    if (micBlocked) return
    if (!recognition.listening) recognition.start()
  }

  const handleHoldEnd = () => {
    recognition.stop()
  }

  useEffect(() => {
    const wasListening = prevListening.current
    const isListening = recognition.listening
    prevListening.current = isListening

    if (wasListening && !isListening) {
      const text = recognition.transcript.trim()
      if (!text) return
      if (flow.phase === 'confirm') {
        flow.submitConfirm(text)
      } else if (flow.phase === 'listen' || flow.phase === 'ask') {
        flow.submitAnswer(text)
      }
      recognition.clearTranscript()
    }
  }, [
    recognition.listening,
    recognition.transcript,
    flow.phase,
    flow.submitAnswer,
    flow.submitConfirm,
    recognition,
  ])

  const submitTyped = () => {
    const text = typed.trim()
    if (!text) return
    if (flow.phase === 'confirm') flow.submitConfirm(text)
    else flow.submitAnswer(text)
    setTyped('')
    recognition.clearTranscript()
  }

  useEffect(() => {
    setAnswers(loadAnswers())
  }, [flow.saved])

  const showField = recognition.showTypedFallback

  return (
    <div className="flex flex-col gap-6">
      <PrivacyNote
        open={privacyOpen}
        onDismiss={() => setPrivacyOpen(false)}
      />

      <p className="text-lg text-slate-400">
        पायरी {flow.stepIndex + 1} / {flow.totalSteps} ·{' '}
        {flow.phase === 'confirm'
          ? 'पुष्टी / Confirm'
          : flow.phase === 'done'
            ? 'पूर्ण / Done'
            : 'ऐका / Listen'}
      </p>

      {flow.step && (
        <section className="rounded-2xl border border-slate-700 bg-slate-800/50 p-5">
          <p className="text-2xl font-semibold text-white">
            {flow.step.prompt.mr}
          </p>
          <p className="mt-2 text-xl text-slate-300">{flow.step.prompt.en}</p>
        </section>
      )}

      {visibleOnly && lastText && (
        <div className="rounded-xl border border-violet-500 bg-violet-950/50 p-4 text-lg">
          <span className="text-violet-300">ऑन-स्क्रीन / On screen: </span>
          {lastText}
        </div>
      )}

      <div className="flex flex-col items-center gap-4">
        <MicButton
          listening={recognition.listening}
          disabled={micBlocked || flow.phase === 'done'}
          onTapToggle={handleMicToggle}
          onHoldStart={handleHoldStart}
          onHoldEnd={handleHoldEnd}
        />
        <p className="w-full rounded-lg bg-slate-900 p-4 text-lg">
          <span className="text-slate-500">Transcript: </span>
          {recognition.transcript || '…'}
        </p>
        <p className="text-base text-slate-400">
          विश्वास / Confidence: {formatConfidence(recognition.confidence)}
        </p>
        {recognition.permissionDenied && (
          <p className="text-amber-300">
            मायक्रोफोन परवानगी नाही / Microphone permission denied
          </p>
        )}
        {!recognition.supported && (
          <p className="text-amber-300">
            या ब्राउझरमध्ये वाक् ओळख नाही / Speech recognition unsupported
          </p>
        )}
      </div>

      {showField && flow.phase !== 'done' && (
        <div className="flex flex-col gap-2">
          <label className="text-lg">
            टाइप करा / Type answer
            <input
              type="text"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-900 px-4 py-3 text-xl"
            />
          </label>
          <button
            type="button"
            onClick={submitTyped}
            className="rounded-xl bg-sky-700 py-3 font-semibold"
          >
            पाठवा / Submit
          </button>
        </div>
      )}

      {flow.rawAnswer && (
        <p className="text-slate-300">Read-back: {flow.readBackText}</p>
      )}

      {answers.length > 0 && (
        <section className="rounded-xl border border-slate-700 p-4">
          <h2 className="text-lg font-bold text-slate-200">
            जतन केले / Saved
          </h2>
          <ul className="mt-2 space-y-2 text-base">
            {answers.map((a) => (
              <li key={a.id}>
                <strong>{a.id}</strong>: {a.raw} → {JSON.stringify(a.parsed)}
              </li>
            ))}
          </ul>
        </section>
      )}

    </div>
  )
}