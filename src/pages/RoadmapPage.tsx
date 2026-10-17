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
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{totalWeeks(roadmap)} semanas</p>
        <p className="mt-4 text-gray-700 dark:text-gray-300">
          <strong>Objetivo:</strong> {roadmap.objective}
        </p>

        <div className="mx-auto mt-6 max-w-md">
          <div className="mb-1.5 flex justify-between font-mono text-xs text-gray-500 dark:text-gray-400">
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
            className="rounded-full border border-black/10 dark:border-white/10 bg-white dark:bg-surface-dark px-4 py-1.5 font-medium shadow-sm hover:bg-black/5 dark:hover:bg-white/10"
          >
            {anyExpanded ? '✕ Recolher tudo' : '↕ Expandir tudo'}
          </button>
          <a href="#empresas" className="rounded-full px-4 py-1.5 font-medium text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/10">
            Empresas
          </a>
          <a href="#projetos" className="rounded-full px-4 py-1.5 font-medium text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/10">
            Projetos
          </a>
          <button type="button" onClick={reset} className="rounded-full px-4 py-1.5 font-medium text-gray-400 hover:text-rose-600">
            Zerar progresso
          </button>
        </div>
      </header>

      <aside className="mx-auto mt-10 max-w-3xl rounded-2xl border border-black/5 dark:border-white/10 bg-[#f4ece2] dark:bg-[#252019] p-5 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
        <p className="mb-1 font-mono text-[10px] font-semibold tracking-widest text-gray-500 dark:text-gray-400 uppercase">Antes de começar</p>
        {roadmap.intro}
      </aside>

      <aside className="mx-auto mt-4 max-w-3xl rounded-2xl border border-black/5 bg-white p-5 text-sm leading-relaxed text-gray-700 dark:border-white/10 dark:bg-surface-dark dark:text-gray-300">
        <p className="mb-2 font-mono text-[10px] font-semibold tracking-widest text-gray-500 uppercase dark:text-gray-400">Como estudar</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <strong>Todo o conteúdo fica na apostila</strong> de cada etapa: teoria, exemplos, atividades e gabarito. O mapa
            serve para você se orientar e acompanhar o progresso.
          </li>
          <li>
            <strong>Clique no nome de um tópico</strong> para abrir a apostila direto nele. A <strong>caixinha</strong> ao
            lado marca o tópico como concluído (também dá para marcar dentro da apostila).
          </li>
          <li>
            A apostila funciona como <strong>marca-página</strong>: ao abrir de novo, ela continua do primeiro tema que
            você ainda não concluiu.
          </li>
        </ul>
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
                  className="rounded-full border border-black/10 dark:border-white/10 bg-white dark:bg-surface-dark px-3 py-1 text-xs font-semibold shadow-sm hover:bg-black/5 dark:hover:bg-white/10"
                >
                  📘 Abrir apostila da etapa
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
