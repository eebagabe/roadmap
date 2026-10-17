import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ApostilaPage } from './pages/ApostilaPage'
import { HomePage } from './pages/HomePage'
import { RoadmapPage } from './pages/RoadmapPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="roadmap/:roadmapId" element={<RoadmapPage />} />
          <Route path="roadmap/:roadmapId/apostila/:sectionId" element={<ApostilaPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
