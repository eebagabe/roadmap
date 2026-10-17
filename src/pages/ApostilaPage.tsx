import { useEffect, useState } from 'react'
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom'
import { headings, Markdown } from '../components/Markdown'
import { findRoadmap } from '../data/roadmaps'
import { hasApostila, loadApostila, type ApostilaKind } from '../lib/apostilas'

export function ApostilaPage() {
  const { roadmapId = '', sectionId = '' } = useParams()
  const [params, setParams] = useSearchParams()
  const kind: ApostilaKind = params.get('aba') === 'gabarito' ? 'gabarito' : 'apostila'
  const [loaded, setLoaded] = useState<{ key: string; source?: string }>()

  const roadmap = findRoadmap(roadmapId)
  const section = roadmap?.sections.find((s) => s.id === sectionId)
  const key = `${roadmapId}/${sectionId}/${kind}`

  useEffect(() => {
    let alive = true
    loadApostila(roadmapId, sectionId, kind).then((source) => alive && setLoaded({ key, source }))
    return () => {
      alive = false
    }
  }, [roadmapId, sectionId, kind, key])

  if (!roadmap || !section || !hasApostila(roadmapId, sectionId)) return <Navigate to={`/roadmap/${roadmapId}`} replace />

  const source = loaded?.key === key ? loaded.source : undefined
  const toc = source ? headings(source) : []
  const hasGabarito = hasApostila(roadmapId, sectionId, 'gabarito')
  const index = roadmap.sections.findIndex((s) => s.id === sectionId)
  const neighbors = [roadmap.sections[index - 1], roadmap.sections[index + 1]].map((s) =>
    s && hasApostila(roadmapId, s.id) ? s : undefined,
  )

  const tab = (k: ApostilaKind, label: string) => (
    <button
      type="button"
      onClick={() => setParams(k === 'gabarito' ? { aba: 'gabarito' } : {})}
      className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
        kind === k ? 'bg-ink text-white' : 'text-gray-600 hover:bg-black/5'
      }`}
    >
      {label}
    </button>
  )

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link to={`/roadmap/${roadmapId}#secao-${sectionId}`} className="text-sm font-medium text-gray-600 hover:text-ink">
          ← {roadmap.icon} {roadmap.short}
        </Link>
        <div className="flex items-center gap-1 rounded-full border border-black/10 bg-white p-1 shadow-sm">
          {tab('apostila', 'Apostila')}
          {hasGabarito && tab('gabarito', 'Gabarito')}
        </div>
        <button type="button" onClick={() => window.print()} className="text-sm font-medium text-gray-600 hover:text-ink">
          Imprimir / PDF
        </button>
      </div>

      {kind === 'gabarito' && (
        <p className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900 print:hidden">
          <strong>Calma aí:</strong> abra o gabarito só depois de tentar resolver as atividades sozinho. Errar e consertar é o
          treino.
        </p>
      )}

      <div className="mt-8 grid gap-10 lg:grid-cols-[14rem_1fr]">
        <aside className="hidden lg:block print:hidden">
          <nav className="sticky top-24 space-y-1 text-sm">
            <p className="mb-2 font-mono text-[10px] font-semibold tracking-widest text-gray-500 uppercase">Nesta {kind}</p>
            {toc.map((h) => (
              <a key={h.id} href={`#${h.id}`} className="block rounded px-2 py-1 text-gray-600 hover:bg-black/5 hover:text-ink">
                {h.text}
              </a>
            ))}
          </nav>
        </aside>

        <article className="min-w-0 rounded-2xl border border-black/5 bg-white px-5 py-8 shadow-sm sm:px-10 print:border-0 print:shadow-none">
          {source === undefined ? <p className="text-gray-500">Carregando…</p> : <Markdown source={source} />}
        </article>
      </div>

      <nav className="mt-10 flex justify-between gap-4 text-sm print:hidden">
        {neighbors.map((s, i) =>
          s ? (
            <Link
              key={s.id}
              to={`/roadmap/${roadmapId}/apostila/${s.id}`}
              className={`rounded-xl border border-black/10 bg-white px-4 py-3 font-medium shadow-sm hover:bg-black/5 ${i ? 'ml-auto' : ''}`}
            >
              {i ? `${s.title} →` : `← ${s.title}`}
            </Link>
          ) : (
            <span key={i} />
          ),
        )}
      </nav>
    </div>
  )
}
