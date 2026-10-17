import { useLayoutEffect, useRef, useState } from 'react'
import { useProgress } from '../lib/progress'
import { countDone, weekTopicKeys, type NumberedSection } from '../lib/roadmap'
import { ProgressBar } from './ProgressBar'
import { WeekCard } from './WeekCard'

// Classes literais para o Tailwind gerar (até 8 linhas por seção).
const ROW_START = ['lg:row-start-1', 'lg:row-start-2', 'lg:row-start-3', 'lg:row-start-4', 'lg:row-start-5', 'lg:row-start-6', 'lg:row-start-7', 'lg:row-start-8']
const ROW_SPAN = ['lg:row-span-1', 'lg:row-span-2', 'lg:row-span-3', 'lg:row-span-4', 'lg:row-span-5', 'lg:row-span-6', 'lg:row-span-7', 'lg:row-span-8']

type Props = {
  roadmapId: string
  section: NumberedSection
  nextKey?: string
  /** Conteúdo extra embaixo do nó central (ex.: link da apostila). */
  nodeFooter?: React.ReactNode
}

export function SectionMap({ roadmapId, section, nextKey, nodeFooter }: Props) {
  const { done } = useProgress()
  const keys = section.weeks.flatMap((w) => weekTopicKeys(roadmapId, w))
  const doneCount = countDone(keys, done)

  const containerRef = useRef<HTMLDivElement>(null)
  const nodeRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef(new Map<string, HTMLDivElement>())
  const [paths, setPaths] = useState<string[]>([])

  useLayoutEffect(() => {
    const container = containerRef.current
    const node = nodeRef.current
    if (!container || !node) return

    const compute = () => {
      if (window.innerWidth < 1024) return setPaths([])
      const c = container.getBoundingClientRect()
      const n = node.getBoundingClientRect()
      const ny = n.top + n.height / 2 - c.top
      setPaths(
        section.weeks.map((w, i) => {
          const el = cardRefs.current.get(w.id)
          if (!el) return ''
          const r = el.getBoundingClientRect()
          const y = r.top - c.top + 30
          const left = i % 2 === 0
          const x1 = (left ? r.right : r.left) - c.left
          const x2 = (left ? n.left : n.right) - c.left
          const mx = (x1 + x2) / 2
          return `M ${x1} ${y} C ${mx} ${y}, ${mx} ${ny}, ${x2} ${ny}`
        }),
      )
    }

    compute()
    const ro = new ResizeObserver(compute)
    ro.observe(container)
    cardRefs.current.forEach((el) => ro.observe(el))
    window.addEventListener('resize', compute)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', compute)
    }
  }, [section])

  const rows = Math.ceil(section.weeks.length / 2)

  return (
    <div ref={containerRef} id={`secao-${section.id}`} className="relative scroll-mt-24">
      <svg className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block" aria-hidden>
        {paths.map((d, i) => d && <path key={i} d={d} fill="none" stroke="var(--color-line)" strokeWidth="1.5" />)}
      </svg>

      <div className="relative grid grid-cols-1 gap-4 lg:grid-cols-[1fr_15rem_1fr] lg:gap-x-20 lg:gap-y-5">
        <div className={`z-10 flex flex-col items-center gap-2 lg:col-start-2 lg:row-start-1 lg:self-center ${ROW_SPAN[rows - 1]}`}>
          <div ref={nodeRef} className="w-full rounded-2xl bg-ink px-5 py-4 text-white shadow-lg">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-bold">{section.title}</h2>
              <span className="font-mono text-xs text-white/70">
                {doneCount}/{keys.length}
              </span>
            </div>
            <ProgressBar value={doneCount} total={keys.length} className="mt-3 bg-white/15" barClassName="bg-emerald-400" />
          </div>
          <p className="px-2 text-center text-xs text-gray-500">{section.summary}</p>
          {nodeFooter}
        </div>

        {section.weeks.map((week, i) => (
          <WeekCard
            key={week.id}
            ref={(el) => {
              if (el) cardRefs.current.set(week.id, el)
              else cardRefs.current.delete(week.id)
            }}
            roadmapId={roadmapId}
            week={week}
            nextKey={nextKey}
            className={`self-start ${i % 2 === 0 ? 'lg:col-start-1' : 'lg:col-start-3'} ${ROW_START[Math.floor(i / 2)]}`}
          />
        ))}
      </div>
    </div>
  )
}
