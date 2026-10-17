import type { Company } from '../data/types'

export function Companies({ title, companies }: { title: string; companies: Company[] }) {
  return (
    <section id="empresas" className="scroll-mt-24">
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Quem usa no dia a dia, e para quê. Bom para saber onde procurar vaga.</p>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {companies.map((c) => (
          <li key={c.name} className="flex gap-3 rounded-xl border border-black/5 dark:border-white/10 bg-white dark:bg-surface-dark p-4 shadow-sm">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-ink font-bold text-white dark:bg-white/10">
              {c.name.charAt(0)}
            </span>
            <div>
              <p className="font-semibold">{c.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{c.how}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
