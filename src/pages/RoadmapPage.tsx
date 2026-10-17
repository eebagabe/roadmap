import { Link, Navigate, useParams } from 'react-router-dom'
import { Companies } from '../components/Companies'
import { NextTopicButton } from '../components/NextTopicButton'
import { ProgressBar } from '../components/ProgressBar'
import { Projects } from '../components/Projects'
import { SectionMap } from '../components/SectionMap'
import { findRoadmap } from '../data/roadmaps'
import { hasApostila } from '../lib/apostilas'
import { progress, useProgress, weekKey } from '../lib/progress'
import { countDone, findNextTopic, numberedSections, roadmapTopicKeys, totalWeeks } from '../lib/roadmap'

export function RoadmapPage() {
  const { roadmapId } = useParams()
  const roadmap = findRoadmap(roadmapId)
  const { done, collapsed } = useProgress()

  if (!roadmap || roadmap.status !== 'disponivel') return <Navigate to="/" replace />

  const sections = numberedSections(roadmap)
  const allWeekKeys = roadmap.sections.flatMap((s) => s.weeks.map((w) => weekKey(roadmap.id, w.id)))
  const anyExpanded = allWeekKeys.some((k) => !collapsed[k])
  const keys = roadmapTopicKeys(roadmap)
  const doneCount = countDone(keys, done)
  const next = findNextTopic(roadmap, done)

  const reset = () => {
    if (confirm(`Apagar todo o progresso do ${roadmap.short}? Não dá para desfazer.`)) progress.reset(roadmap.id)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pt-12 pb-28">
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="flex items-center justify-center gap-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
          <span aria-hidden>{roadmap.icon}</span>
          {roadmap.title}
        </h1>
        <p className="mt-2 text-sm text-gray-500">{totalWeeks(roadmap)} semanas</p>
        <p className="mt-4 text-gray-700">
          <strong>Objetivo:</strong> {roadmap.objective}
        </p>

        <div className="mx-auto mt-6 max-w-md">
          <div className="mb-1.5 flex justify-between font-mono text-xs text-gray-500">
            <span>Seu progresso</span>
            <span>
              {doneCount}/{keys.length}
            </span>
          </div>
          <ProgressBar value={doneCount} total={keys.length} barClassName="bg-emerald-500" />
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-2 text-sm">
          <button
            type="button"
            onClick={() => progress.setCollapsed(allWeekKeys, anyExpanded)}
            className="rounded-full border border-black/10 bg-white px-4 py-1.5 font-medium shadow-sm hover:bg-black/5"
          >
            {anyExpanded ? '✕ Recolher tudo' : '↕ Expandir tudo'}
          </button>
          <a href="#empresas" className="rounded-full px-4 py-1.5 font-medium text-gray-600 hover:bg-black/5">
            Empresas
          </a>
          <a href="#projetos" className="rounded-full px-4 py-1.5 font-medium text-gray-600 hover:bg-black/5">
            Projetos
          </a>
          <button type="button" onClick={reset} className="rounded-full px-4 py-1.5 font-medium text-gray-400 hover:text-rose-600">
            Zerar progresso
          </button>
        </div>
      </header>

      <aside className="mx-auto mt-10 max-w-3xl rounded-2xl border border-black/5 bg-[#f4ece2] p-5 text-sm leading-relaxed text-gray-700">
        <p className="mb-1 font-mono text-[10px] font-semibold tracking-widest text-gray-500 uppercase">Antes de começar</p>
        {roadmap.intro}
      </aside>

      <div className="relative mt-14 space-y-16">
        <div className="absolute top-0 bottom-0 left-1/2 hidden w-px -translate-x-1/2 bg-line/60 lg:block" aria-hidden />
        {sections.map((section) => (
          <SectionMap
            key={section.id}
            roadmapId={roadmap.id}
            section={section}
            nextKey={next?.key}
            nodeFooter={
              hasApostila(roadmap.id, section.id) && (
                <Link
                  to={`/roadmap/${roadmap.id}/apostila/${section.id}`}
                  className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold shadow-sm hover:bg-black/5"
                >
                  📘 Apostila e gabarito
                </Link>
              )
            }
          />
        ))}
      </div>

      <div className="mt-24 space-y-20">
        <Companies title={roadmap.companiesTitle} companies={roadmap.companies} />
        <Projects roadmapId={roadmap.id} projects={roadmap.projects} />
      </div>

      <NextTopicButton roadmapId={roadmap.id} next={next} />
    </div>
  )
}
