import {
  dismissPrivacy,
  isPrivacyDismissed,
} from '../storage/store'

type Props = {
  open: boolean
  onDismiss: () => void
}

export function PrivacyNote({ open, onDismiss }: Props) {
  if (!open) return null

  const handleDismiss = () => {
    dismissPrivacy()
    onDismiss()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="max-w-lg rounded-2xl border border-slate-600 bg-slate-900 p-6 text-lg shadow-xl">
        <h2 className="text-2xl font-bold text-amber-300">
          गोपनीयता / Privacy
        </h2>
        <p className="mt-4 text-slate-100">
          Speech may be sent to your browser&apos;s speech service.
        </p>
        <p className="mt-2 text-slate-400 text-base">
          ध्वनी ब्राउझरच्या वाक् सेवेकडे जाऊ शकतो.
        </p>
        <button
          type="button"
          onClick={handleDismiss}
          className="mt-6 w-full rounded-xl bg-sky-600 py-4 text-xl font-semibold text-white hover:bg-sky-500"
        >
          समजले / OK
        </button>
      </div>
    </div>
  )
}

export function shouldBlockMic(): boolean {
  return !isPrivacyDismissed()
}