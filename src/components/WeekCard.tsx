import { forwardRef } from 'react'
import { progress, topicKey, useProgress, weekKey } from '../lib/progress'
import { countDone, pad, weekTopicKeys, type NumberedWeek } from '../lib/roadmap'
import { Checkbox } from './Checkbox'

type Props = {
  roadmapId: string
  week: NumberedWeek
  nextKey?: string
  className?: string
}

export const WeekCard = forwardRef<HTMLDivElement, Props>(function WeekCard({ roadmapId, week, nextKey, className = '' }, ref) {
  const { done, collapsed } = useProgress()
  const keys = weekTopicKeys(roadmapId, week)
  const doneCount = countDone(keys, done)
  const complete = doneCount === keys.length
  const wKey = weekKey(roadmapId, week.id)
  const isCollapsed = !!collapsed[wKey]

  return (
    <div
      ref={ref}
      id={`semana-${week.id}`}
      className={`scroll-mt-24 rounded-2xl border bg-white shadow-sm transition ${
        complete ? 'border-emerald-200' : 'border-black/5'
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
          <p className="font-mono text-[10px] font-semibold tracking-widest text-gray-500 uppercase">Semana {pad(week.number)}</p>
          <h3 className={`text-sm font-semibold ${complete ? 'text-emerald-700' : ''}`}>{week.title}</h3>
        </div>
        <span className="font-mono text-xs text-gray-500">
          {doneCount}/{keys.length}
        </span>
        <button
          type="button"
          aria-expanded={!isCollapsed}
          aria-label={isCollapsed ? 'Expandir semana' : 'Recolher semana'}
          className="rounded p-1 text-gray-500 hover:bg-black/5"
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
                <label
                  id={`topico-${key}`}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-1.5 text-sm transition ${
                    checked ? 'border-emerald-100 bg-emerald-50 text-emerald-800' : 'border-black/10 hover:border-black/25'
                  }`}
                >
                  <Checkbox checked={checked} label={topic} onChange={() => progress.toggleTopic(key)} />
                  <span className={checked ? 'line-through decoration-emerald-600/40' : ''}>{topic}</span>
                  {key === nextKey && (
                    <span className="rounded-full bg-ink px-2 py-0.5 text-[10px] font-semibold text-white">Próximo</span>
                  )}
                </label>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
})
