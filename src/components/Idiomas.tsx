import { Cadeado } from './Cadeado'

const IDIOMAS = [
  { nome: 'Inglês', nativo: 'English' },
  { nome: 'Espanhol', nativo: 'Español' },
  { nome: 'Chinês', nativo: '中文' },
  { nome: 'Japonês', nativo: '日本語' },
  { nome: 'Coreano', nativo: '한국어' },
]

export function Idiomas() {
  return (
    <section id="idiomas" className="mt-20 scroll-mt-24">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Idiomas</h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Trilhas de idiomas com o mesmo método: semana a semana, com apostilas, exercícios e progresso salvo.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600 dark:bg-white/10 dark:text-gray-300">
          <Cadeado className="h-3.5 w-3.5" />
          Em breve
        </span>
      </div>

      <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {IDIOMAS.map((i) => (
          <li
            key={i.nome}
            aria-disabled
            className="relative flex flex-col items-center gap-2 rounded-2xl border border-dashed border-black/15 bg-white/60 px-4 py-6 text-center dark:border-white/15 dark:bg-white/5"
          >
            <Cadeado className="absolute top-3 right-3 h-4 w-4 text-gray-400" />
            <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">{i.nativo}</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">{i.nome}</span>
            <span className="mt-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-semibold text-gray-600 dark:bg-white/10 dark:text-gray-300">
              Em breve
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
