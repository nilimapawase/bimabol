import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { FlowPage } from './pages/FlowPage'
import { DemoPage } from './pages/DemoPage'
import { Shell } from './ui/Shell'
import type { SpeechLang } from './speech/useSpeech'
import { clearAll } from './storage/store'

function App() {
  const [lang, setLang] = useState<SpeechLang>('mr-IN')
  const [resetKey, setResetKey] = useState(0)

  const deleteEverything = () => {
    clearAll()
    setResetKey((k) => k + 1)
  }

  return (
    <Shell
      lang={lang}
      onLangChange={setLang}
      onDeleteAll={deleteEverything}
    >
      <Routes>
        <Route
          path="/"
          element={<FlowPage key={resetKey} lang={lang} />}
        />
        <Route path="/demo" element={<DemoPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Shell>
  )
}

export default App