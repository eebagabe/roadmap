import { Link } from 'react-router-dom'
import { roadmaps } from '../data/roadmaps'
import { BannerComputacao } from '../components/BannerComputacao'
import { ProgressBar } from '../components/ProgressBar'
import { useProgress } from '../lib/progress'
import { countDone, roadmapTopicKeys, totalWeeks } from '../lib/roadmap'

export function HomePage() {
  const { done } = useProgress()

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <section className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold tracking-[0.2em] text-gray-500 dark:text-gray-400 uppercase">Estude com um caminho claro</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">Roadmap</h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Escolha uma trilha e siga semana a semana. Todo o conteúdo fica nas apostilas de cada etapa, com teoria,
          exercícios e gabarito; o mapa mostra o caminho e guarda o seu progresso. No fim, projetos para colocar a mão na
          massa.
        </p>
      </section>

      <BannerComputacao />

      <section className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {roadmaps.map((r) => {
          const keys = roadmapTopicKeys(r)
          const doneCount = countDone(keys, done)
          const soon = r.status === 'em-breve'
          const card = (
            <article
              className={`group flex h-full flex-col rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-surface-dark p-6 shadow-sm transition ${
                soon ? 'opacity-60' : 'hover:-translate-y-0.5 hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between">
                <span
                  className="grid h-12 w-12 place-items-center rounded-xl text-2xl"
                  style={{ backgroundColor: `${r.accent}1a` }}
                >
                  {r.icon}
                </span>
                {soon ? (
                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600 dark:bg-white/10 dark:text-gray-300">Em breve</span>
                ) : (
                  <span className="font-mono text-xs text-gray-500 dark:text-gray-400">{totalWeeks(r)} semanas</span>
                )}
              </div>
              <h2 className="mt-4 text-lg font-bold">{r.short}</h2>
              <p className="mt-1 flex-1 text-sm text-gray-600 dark:text-gray-400">{r.objective}</p>
              {!soon && (
                <div className="mt-5">
                  <div className="mb-1.5 flex justify-between font-mono text-xs text-gray-500 dark:text-gray-400">
                    <span>Progresso</span>
                    <span>
                      {doneCount}/{keys.length}
                    </span>
                  </div>
                  <ProgressBar value={doneCount} total={keys.length} />
                </div>
              )}
            </article>
          )
          return soon ? (
            <div key={r.id}>{card}</div>
          ) : (
            <Link key={r.id} to={`/roadmap/${r.id}`}>
              {card}
            </Link>
          )
        })}
      </section>
    </div>
  )
}
