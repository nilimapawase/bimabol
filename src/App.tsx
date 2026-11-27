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
  const [lang, setLang] = useState<SpeechLang>('mr-IN')
  const [resetKey, setResetKey] = useState(0)

  const deleteEverything = () => {
    void wipeAllData().then(() => setResetKey((k) => k + 1))
  }

  return (
    <Shell
      lang={lang}
      onLangChange={setLang}
      onDeleteAll={deleteEverything}
      resetKey={resetKey}
    >
      <Routes>
        <Route path="/" element={<HomePage key={resetKey} />} />
        <Route path="/report" element={<ReportPage key={resetKey} />} />
        <Route path="/case/:id" element={<CasePage />} />
        <Route path="/case/:id/print" element={<PrintPage />} />
        <Route path="/demo" element={<DemoPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Shell>
  )
}

export default App