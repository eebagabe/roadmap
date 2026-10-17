import { progress, topicKey, useProgress } from '../lib/progress'
import { countDone, pad, weekTopicKeys, type NumberedWeek } from '../lib/roadmap'
import { Checkbox } from './Checkbox'

type Props = { roadmapId: string; week: NumberedWeek; compacto?: boolean }

/** Tópicos da semana dentro da apostila, sincronizados com os checkboxes do mapa. */
export function TemaProgresso({ roadmapId, week, compacto = false }: Props) {
  const { done } = useProgress()
  const keys = weekTopicKeys(roadmapId, week)
  const feitos = countDone(keys, done)
  const completo = feitos === keys.length
  const botao = (
    <button
      type="button"
      onClick={() => progress.setTopics(keys, !completo)}
      className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
        completo
          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
          : 'border border-black/15 bg-white hover:bg-black/5 dark:border-white/15 dark:bg-surface-dark dark:hover:bg-white/10'
      }`}
    >
      {completo ? '✓ Tema concluído' : `Marcar Tema ${week.number} como concluído`}
    </button>
  )

  if (compacto)
    return (
      <div className="not-prose my-4 flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
        <span>Terminou as atividades?</span>
        {botao}
      </div>
    )

  return (
    <div className="not-prose my-5 rounded-xl border border-black/10 bg-paper p-4 dark:border-white/10 dark:bg-white/5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-mono text-[10px] font-semibold tracking-widest text-gray-500 uppercase dark:text-gray-400">
          Semana {pad(week.number)} · {feitos}/{keys.length} tópicos concluídos
        </p>
        {botao}
      </div>
      <ul className="mt-3 flex flex-wrap gap-2">
        {week.topics.map((topic) => {
          const key = topicKey(roadmapId, week.id, topic)
          const marcado = !!done[key]
          return (
            <li key={key}>
              <label
                className={`flex cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-1 text-sm transition ${
                  marcado
                    ? 'border-emerald-100 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300'
                    : 'border-black/10 bg-white dark:border-white/10 dark:bg-surface-dark'
                }`}
              >
                <Checkbox checked={marcado} label={`Marcar ${topic} como concluído`} onChange={() => progress.toggleTopic(key)} />
                <span className={marcado ? 'line-through decoration-emerald-600/40' : ''}>{topic}</span>
              </label>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
