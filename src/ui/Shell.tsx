import { useEffect, useState, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import type { SpeechLang } from '../speech/useSpeech'
import { HELPLINE_TEL } from '../constants/helpline'
import { t } from '../i18n'

type Props = {
  lang: SpeechLang
  onLangChange: (lang: SpeechLang) => void
  children: ReactNode
  onDeleteAll: () => void
  resetKey?: number
}

export function Shell({ lang, onLangChange, children, onDeleteAll }: Props) {
  const [online, setOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true,
  )
  const [confirmDelete, setConfirmDelete] = useState(false)
  const location = useLocation()
  const links = [
    { to: '/', label: t(lang, 'navHome') },
    { to: '/report', label: t(lang, 'navReport') },
    { to: '/demo', label: t(lang, 'navDemo') },
    { to: '/about', label: t(lang, 'navAbout') },
  ]

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

  const active = (to: string) =>
    location.pathname === to || (to !== '/' && location.pathname.startsWith(to))

  return (
    <div className="app-shell">
      {!online && (
        <div className="card" role="status">
          {t(lang, 'offline')}
        </div>
      )}
      <header className="flex flex-col gap-3">
        <div className="brand">
          <Link to="/" className="brand-mark">
            <span className="brand-seal">७२</span>
            <span>
              <h1>BimaBol</h1>
              <p>{t(lang, 'brandSub')}</p>
            </span>
          </Link>
          <label className="lang-row">
            <span className="sr-only">भाषा</span>
            <select
              aria-label="भाषा"
              value={lang}
              onChange={(e) => onLangChange(e.target.value as SpeechLang)}
            >
              <option value="mr-IN">मराठी</option>
              <option value="hi-IN">हिंदी</option>
              <option value="en-IN">English</option>
            </select>
          </label>
        </div>
        <nav className="nav-row" aria-label="मुख्य मार्ग">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className={active(l.to) ? 'active' : ''}>
              {l.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="stage flex flex-1 flex-col gap-4">{children}</main>
      <div className="dock">
        {confirmDelete ? (
          <>
            <button type="button" className="danger" onClick={() => setConfirmDelete(false)}>
              {t(lang, 'no')}
            </button>
            <button
              type="button"
              className="call"
              onClick={() => {
                setConfirmDelete(false)
                onDeleteAll()
              }}
            >
              {t(lang, 'deleteYes')}
            </button>
          </>
        ) : (
          <>
            <button type="button" className="danger" onClick={() => setConfirmDelete(true)}>
              {t(lang, 'delete')}
            </button>
            <a className="call" href={HELPLINE_TEL}>
              {t(lang, 'call')}
            </a>
          </>
        )}
      </div>
      {confirmDelete && <p className="text-center text-sm text-[var(--gold)]">{t(lang, 'deleteAsk')}</p>}
    </div>
  )
}