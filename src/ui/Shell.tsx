import { useEffect, useState, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import type { SpeechLang } from '../speech/useSpeech'

type Props = {
  lang: SpeechLang
  onLangChange: (lang: SpeechLang) => void
  children: ReactNode
  onDeleteAll: () => void
}

export function Shell({ lang, onLangChange, children, onDeleteAll }: Props) {
  const [online, setOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true,
  )
  const location = useLocation()

  useEffect(() => {
    const on = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])

  return (
    <div className="mx-auto flex min-h-dvh max-w-2xl flex-col gap-4 p-4 text-xl">
      {!online && (
        <div
          className="rounded-lg border border-amber-500 bg-amber-950 px-4 py-3 text-lg text-amber-100"
          role="status"
        >
          इंटरनेट नाही, टाइप करता येईल. / No internet, you can type.
        </div>
      )}

      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700 pb-4">
        <nav className="flex gap-3 text-lg font-semibold">
          <Link
            to="/"
            className={
              location.pathname === '/'
                ? 'text-sky-400 underline'
                : 'text-slate-300'
            }
          >
            प्रवाह / Flow
          </Link>
          <Link
            to="/demo"
            className={
              location.pathname === '/demo'
                ? 'text-sky-400 underline'
                : 'text-slate-300'
            }
          >
            डेमो / Demo
          </Link>
        </nav>

        <label className="flex items-center gap-2 text-base">
          <span className="text-slate-400">भाषा / Lang</span>
          <select
            value={lang}
            onChange={(e) => onLangChange(e.target.value as SpeechLang)}
            className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-lg"
          >
            <option value="mr-IN">मराठी mr-IN</option>
            <option value="hi-IN">हिंदी hi-IN</option>
            <option value="en-IN">English en-IN</option>
          </select>
        </label>
      </header>

      <main className="flex flex-1 flex-col gap-4">{children}</main>

      <footer className="flex flex-wrap gap-4 border-t border-slate-700 pt-4">
        <button
          type="button"
          onClick={onDeleteAll}
          className="rounded-xl border-2 border-red-500 bg-red-950/40 px-5 py-4 text-lg font-semibold text-red-300"
        >
          सर्व काढून टाका / Delete everything
        </button>
        <button
          type="button"
          disabled
          title="Placeholder for a future phone call action"
          className="rounded-xl border-2 border-slate-600 bg-slate-800 px-5 py-4 text-lg font-semibold text-slate-400"
        >
          कॉल / Call (placeholder)
        </button>
      </footer>
    </div>
  )
}