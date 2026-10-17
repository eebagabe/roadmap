import { Cadeado } from './Cadeado'

const UNIVERSIDADES = ['ITA', 'MIT', 'Harvard', 'Oxford']
const NUMEROS = [
  { valor: '9', rotulo: 'fases' },
  { valor: '25', rotulo: 'etapas' },
  { valor: '~116', rotulo: 'semanas' },
]

/** Destaque da próxima grande trilha, ainda bloqueada. */
export function BannerComputacao() {
  return (
    <section
      aria-label="Trilha Ciência da Computação, em breve"
      className="relative mt-12 overflow-hidden rounded-3xl bg-gradient-to-br from-[#1f2937] via-[#2a2347] to-[#3a2a1c] p-6 text-white shadow-xl ring-1 ring-white/10 sm:p-10"
    >
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-line/20 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" aria-hidden />

      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center">
        <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/20">
          <Cadeado className="h-10 w-10 text-line" />
        </div>

        <div className="flex-1">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-line px-3 py-1 text-xs font-bold tracking-widest text-ink uppercase">
            <Cadeado className="h-3.5 w-3.5" />
            Em breve
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">🎓 Ciência da Computação</h2>
          <p className="mt-3 max-w-2xl text-white/80">
            A trilha mais completa do Roadmap: do primeiro programa ao projeto final, unindo o núcleo de Ciência da
            Computação de algumas das melhores universidades do mundo. Matemática, algoritmos, teoria, sistemas, IA e
            muito mais. Gratuita e em português.
          </p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {UNIVERSIDADES.map((u) => (
              <li key={u} className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-sm font-semibold">
                {u}
              </li>
            ))}
          </ul>
        </div>

        <dl className="grid grid-cols-3 gap-3 lg:w-64 lg:grid-cols-1">
          {NUMEROS.map((n) => (
            <div key={n.rotulo} className="rounded-xl bg-white/5 px-4 py-3 text-center ring-1 ring-white/10 lg:text-left">
              <dt className="sr-only">{n.rotulo}</dt>
              <dd>
                <span className="block text-2xl font-extrabold">{n.valor}</span>
                <span className="font-mono text-[11px] tracking-widest text-white/60 uppercase">{n.rotulo}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
