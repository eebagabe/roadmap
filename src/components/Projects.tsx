import type { Project, ProjectLevel } from '../data/types'
import { progress, useProgress } from '../lib/progress'
import { Checkbox } from './Checkbox'

const LEVEL_STYLE: Record<ProjectLevel, string> = {
  Iniciante: 'bg-emerald-50 text-emerald-700',
  Intermediário: 'bg-amber-50 text-amber-700',
  Avançado: 'bg-rose-50 text-rose-700',
}

export function Projects({ roadmapId, projects }: { roadmapId: string; projects: Project[] }) {
  const { done } = useProgress()
  return (
    <section id="projetos" className="scroll-mt-24">
      <h2 className="text-2xl font-bold tracking-tight">Projetos para praticar</h2>
      <p className="mt-1 text-sm text-gray-600">
        Ler não basta: construa. Comece pelos iniciantes e suba de nível. Coloque cada um no GitHub com um README explicando o
        que você aprendeu.
      </p>
      <ul className="mt-6 grid gap-4 md:grid-cols-2">
        {projects.map((p) => {
          const key = `${roadmapId}/projetos/${p.id}`
          const checked = !!done[key]
          return (
            <li
              key={p.id}
              className={`flex flex-col rounded-2xl border bg-white p-5 shadow-sm ${checked ? 'border-emerald-200' : 'border-black/5'}`}
            >
              <div className="flex items-start gap-3">
                <div className="pt-0.5">
                  <Checkbox size="md" checked={checked} label={`Projeto concluído: ${p.title}`} onChange={() => progress.toggleTopic(key)} />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{p.title}</h3>
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${LEVEL_STYLE[p.level]}`}>{p.level}</span>
                  </div>
                  <p className="mt-1.5 text-sm text-gray-600">{p.description}</p>
                </div>
              </div>
              <ul className="mt-4 flex flex-wrap gap-1.5 pl-8">
                {p.skills.map((s) => (
                  <li key={s} className="rounded-md bg-black/5 px-2 py-0.5 font-mono text-[11px] text-gray-700">
                    {s}
                  </li>
                ))}
              </ul>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
