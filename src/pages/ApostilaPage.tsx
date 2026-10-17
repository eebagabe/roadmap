import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useLocation, useParams, useSearchParams } from 'react-router-dom'
import { Markdown } from '../components/Markdown'
import { TemaProgresso } from '../components/TemaProgresso'
import { findRoadmap } from '../data/roadmaps'
import { hasApostila, headings, loadApostila, type ApostilaKind } from '../lib/apostilas'
import { useProgress } from '../lib/progress'
import { countDone, numberedSections, weekTopicKeys } from '../lib/roadmap'
import { ancoraDoTopico, rolarAte, temaDoTitulo } from '../lib/temas'

export default function ApostilaPage() {
  const { roadmapId = '', sectionId = '' } = useParams()
  const [params, setParams] = useSearchParams()
  const kind: ApostilaKind = params.get('aba') === 'gabarito' ? 'gabarito' : 'apostila'
  const [loaded, setLoaded] = useState<{ key: string; source?: string }>()

  const roadmap = findRoadmap(roadmapId)
  const section = roadmap?.sections.find((s) => s.id === sectionId)
  const key = `${roadmapId}/${sectionId}/${kind}`
  const { hash } = useLocation()
  const semana = params.get('semana')
  const topico = params.get('topico') ?? undefined

  useEffect(() => {
    let alive = true
    loadApostila(roadmapId, sectionId, kind).then((source) => alive && setLoaded({ key, source }))
    return () => {
      alive = false
    }
  }, [roadmapId, sectionId, kind, key])

  const source = loaded?.key === key ? loaded.source : undefined
  const { done } = useProgress()
  const semanas = useMemo(
    () => (roadmap ? numberedSections(roadmap).find((s) => s.id === sectionId)?.weeks : undefined),
    [roadmap, sectionId],
  )

  const aposTitulo = useCallback(
    (texto: string) => {
      if (kind !== 'apostila' || !semanas) return null
      const inicio = temaDoTitulo(texto)
      const fim = Number(texto.match(/^Atividades de fixação do Tema (\d+)/)?.[1]) || undefined
      const week = semanas[(inicio ?? fim ?? 0) - 1]
      if (!week) return null
      return <TemaProgresso roadmapId={roadmapId} week={week} compacto={!inicio} />
    },
    [kind, semanas, roadmapId],
  )

  // Posiciona a leitura quando o conteúdo chega: link de tópico (?semana=&topico=) ou âncora (#).
  useEffect(() => {
    if (!source || !section) return
    requestAnimationFrame(() => {
      if (hash) return rolarAte(decodeURIComponent(hash.slice(1)))
      const tema = section.weeks.findIndex((w) => w.id === semana) + 1
      if (kind === 'apostila' && tema > 0) {
        const id = ancoraDoTopico(source, tema, topico)
        if (id) rolarAte(id, true)
      }
    })
    // Só ao abrir a página ou trocar o destino; não a cada marcação de progresso.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source, semana, topico])

  if (!roadmap || !section || !hasApostila(roadmapId, sectionId)) return <Navigate to={`/roadmap/${roadmapId}`} replace />

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
        kind === k ? 'bg-ink text-white dark:bg-white dark:text-ink' : 'text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/10'
      }`}
    >
      {label}
    </button>
  )

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link to={`/roadmap/${roadmapId}#secao-${sectionId}`} className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-ink dark:hover:text-white">
          ← {roadmap.icon} {roadmap.short}
        </Link>
        <div className="flex items-center gap-1 rounded-full border border-black/10 dark:border-white/10 bg-white dark:bg-surface-dark p-1 shadow-sm">
          {tab('apostila', 'Apostila')}
          {hasGabarito && tab('gabarito', 'Gabarito')}
        </div>
        <button type="button" onClick={() => window.print()} className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-ink dark:hover:text-white">
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
            <p className="mb-2 font-mono text-[10px] font-semibold tracking-widest text-gray-500 dark:text-gray-400 uppercase">Sumário</p>
            {toc.map((h) => {
              const n = temaDoTitulo(h.text)
              const week = n && kind === 'apostila' ? semanas?.[n - 1] : undefined
              const keys = week ? weekTopicKeys(roadmapId, week) : []
              const concluido = keys.length > 0 && countDone(keys, done) === keys.length
              return (
                <a
                  key={h.id}
                  href={`#${h.id}`}
                  className="flex gap-1.5 rounded px-2 py-1 text-gray-600 hover:bg-black/5 hover:text-ink dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white"
                >
                  <span className={concluido ? 'text-emerald-600 dark:text-emerald-400' : ''}>{h.text}</span>
                  {concluido && <span className="text-emerald-600 dark:text-emerald-400" aria-label="concluído">✓</span>}
                </a>
              )
            })}
          </nav>
        </aside>

        <article className="min-w-0 rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-surface-dark px-5 py-8 shadow-sm sm:px-10 print:border-0 print:shadow-none">
          {source === undefined ? <p className="text-gray-500 dark:text-gray-400">Carregando…</p> : <Markdown source={source} aposTitulo={aposTitulo} />}
        </article>
      </div>

      <nav className="mt-10 flex justify-between gap-4 text-sm print:hidden">
        {neighbors.map((s, i) =>
          s ? (
            <Link
              key={s.id}
              to={`/roadmap/${roadmapId}/apostila/${s.id}`}
              className={`rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-surface-dark px-4 py-3 font-medium shadow-sm hover:bg-black/5 dark:hover:bg-white/10 ${i ? 'ml-auto' : ''}`}
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
