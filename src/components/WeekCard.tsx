import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { hasApostila } from '../lib/apostilas'
import { progress, topicKey, useProgress, weekKey } from '../lib/progress'
import { countDone, pad, weekTopicKeys, type NumberedWeek } from '../lib/roadmap'
import { Checkbox } from './Checkbox'

type Props = {
  roadmapId: string
  sectionId: string
  week: NumberedWeek
  nextKey?: string
  className?: string
}

export const WeekCard = forwardRef<HTMLDivElement, Props>(function WeekCard({ roadmapId, sectionId, week, nextKey, className = '' }, ref) {
  const { done, collapsed } = useProgress()
  const keys = weekTopicKeys(roadmapId, week)
  const doneCount = countDone(keys, done)
  const complete = doneCount === keys.length
  const wKey = weekKey(roadmapId, week.id)
  const isCollapsed = !!collapsed[wKey]
  const comApostila = hasApostila(roadmapId, sectionId)

  return (
    <div
      ref={ref}
      id={`semana-${week.id}`}
      className={`scroll-mt-24 rounded-2xl border bg-white dark:bg-surface-dark shadow-sm transition ${
        complete ? 'border-emerald-200 dark:border-emerald-800' : 'border-black/5 dark:border-white/10'
      } ${className}`}
    >
      <div
        className="flex cursor-pointer items-center gap-3 px-4 py-3 select-none"
        onClick={() => progress.toggleCollapsed(wKey)}
      >
        <Checkbox
          size="md"
          checked={complete}
          label={`Marcar semana ${week.number} inteira`}
          onChange={() => progress.setTopics(keys, !complete)}
        />
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] font-semibold tracking-widest text-gray-500 dark:text-gray-400 uppercase">Semana {pad(week.number)}</p>
          <h3 className={`text-sm font-semibold ${complete ? 'text-emerald-700 dark:text-emerald-400' : ''}`}>{week.title}</h3>
        </div>
        <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
          {doneCount}/{keys.length}
        </span>
        <button
          type="button"
          aria-expanded={!isCollapsed}
          aria-label={isCollapsed ? 'Expandir semana' : 'Recolher semana'}
          className="rounded p-1 text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/10"
        >
          <svg
            viewBox="0 0 16 16"
            className={`h-4 w-4 transition-transform ${isCollapsed ? '-rotate-90' : ''}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      {!isCollapsed && (
        <ul className="flex flex-wrap gap-2 px-3 pb-3">
          {week.topics.map((topic) => {
            const key = topicKey(roadmapId, week.id, topic)
            const checked = !!done[key]
            return (
              <li key={key}>
                <div
                  id={`topico-${key}`}
                  className={`flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-sm transition ${
                    checked ? 'border-emerald-100 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300' : 'border-black/10 dark:border-white/10 hover:border-black/25 dark:hover:border-white/30'
                  }`}
                >
                  <Checkbox checked={checked} label={`Marcar ${topic} como concluído`} onChange={() => progress.toggleTopic(key)} />
                  {comApostila ? (
                    <Link
                      to={`/roadmap/${roadmapId}/apostila/${sectionId}?semana=${week.id}&topico=${encodeURIComponent(topic)}`}
                      title="Abrir este tópico na apostila"
                      className={`underline-offset-2 hover:underline ${checked ? 'line-through decoration-emerald-600/40' : ''}`}
                    >
                      {topic}
                    </Link>
                  ) : (
                    <span className={checked ? 'line-through decoration-emerald-600/40' : ''}>{topic}</span>
                  )}
                  {key === nextKey && (
                    <span className="rounded-full bg-ink px-2 py-0.5 dark:bg-white dark:text-ink text-[10px] font-semibold text-white">Próximo</span>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
})
