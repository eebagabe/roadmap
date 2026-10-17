import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { RoadmapPage } from './pages/RoadmapPage'

// O leitor de Markdown é pesado: só baixa quando alguém abre uma apostila.
const ApostilaPage = lazy(() => import('./pages/ApostilaPage'))

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="roadmap/:roadmapId" element={<RoadmapPage />} />
          <Route
            path="roadmap/:roadmapId/apostila/:sectionId"
            element={
              <Suspense fallback={<p className="p-10 text-center text-gray-500">Carregando apostila…</p>}>
                <ApostilaPage />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
