import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { DemoPage } from './pages/DemoPage'
import { Shell } from './ui/Shell'
import type { SpeechLang } from './speech/useSpeech'
import { wipeAllData } from './db/database'
import { HomePage } from './pages/HomePage'
import { ReportPage } from './pages/ReportPage'
import { CasePage } from './pages/CasePage'
import { AboutPage } from './pages/AboutPage'
import { PrintPage } from './pages/PrintPage'

function App() {
  const [lang, setLang] = useState<SpeechLang>(() => {
    const saved = sessionStorage.getItem('bimabol-lang')
    if (saved === 'mr-IN' || saved === 'hi-IN' || saved === 'en-IN') return saved
    return 'mr-IN'
  })
  const [resetKey, setResetKey] = useState(0)

  const deleteEverything = () => {
    void wipeAllData().then(() => setResetKey((k) => k + 1))
  }

  return (
    <Shell
      lang={lang}
      onLangChange={(next) => {
        sessionStorage.setItem('bimabol-lang', next)
        setLang(next)
      }}
      onDeleteAll={deleteEverything}
      resetKey={resetKey}
    >
      <Routes>
        <Route path="/" element={<HomePage key={resetKey} lang={lang} />} />
        <Route
          path="/report"
          element={
            <ReportPage
              key={resetKey}
              lang={lang}
              onLang={(next) => {
                sessionStorage.setItem('bimabol-lang', next)
                setLang(next)
              }}
            />
          }
        />
        <Route path="/case/:id" element={<CasePage lang={lang} />} />
        <Route path="/case/:id/print" element={<PrintPage lang={lang} />} />
        <Route path="/demo" element={<DemoPage lang={lang} />} />
        <Route path="/about" element={<AboutPage lang={lang} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Shell>
  )
}

export default App