import type { NextTopic } from '../lib/roadmap'
import { progress, weekKey } from '../lib/progress'

export function NextTopicButton({ roadmapId, next }: { roadmapId: string; next?: NextTopic }) {
  if (!next) return null

  const go = () => {
    progress.toggleCollapsed(weekKey(roadmapId, next.week.id), false)
    requestAnimationFrame(() => {
      const el = document.getElementById(`topico-${next.key}`)
      if (!el) return
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      el.animate(
        [{ boxShadow: '0 0 0 0 rgba(16,185,129,.6)' }, { boxShadow: '0 0 0 10px rgba(16,185,129,0)' }],
        { duration: 900, iterations: 2 },
      )
    })
  }

  return (
    <button
      type="button"
      onClick={go}
      className="fixed bottom-5 left-5 z-40 flex max-w-[16rem] items-center gap-4 rounded-2xl border border-black/5 dark:border-white/10 bg-[#f4ece2] dark:bg-[#252019] px-4 py-3 text-left shadow-lg transition hover:-translate-y-0.5"
    >
      <span className="min-w-0">
        <span className="block font-mono text-[10px] font-semibold tracking-widest text-gray-500 dark:text-gray-400 uppercase">Próximo tópico</span>
        <span className="block truncate text-sm font-semibold">{next.topic}</span>
      </span>
      <span aria-hidden>→</span>
    </button>
  )
}
