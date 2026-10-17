import { slug } from './progress'

/**
 * Cada apostila segue a ordem das semanas da etapa: "## Tema N" é a semana N.
 * Aqui ficam as funções que ligam tópicos e semanas aos títulos da apostila.
 */
export type Titulo = { nivel: 2 | 3; texto: string; id: string; tema?: number }

export function titulos(source: string): Titulo[] {
  let tema: number | undefined
  const lista: Titulo[] = []
  for (const m of source.matchAll(/^(##|###) (.+)$/gm)) {
    const texto = m[2].trim()
    const nivel = m[1] === '##' ? 2 : 3
    if (nivel === 2) tema = Number(texto.match(/^Tema (\d+):/)?.[1]) || undefined
    lista.push({ nivel, texto, id: slug(texto), tema })
  }
  return lista
}

export const temaDoTitulo = (texto: string) => Number(texto.match(/^Tema (\d+):/)?.[1]) || undefined

const IGNORAR = new Set(['com', 'para', 'dos', 'das', 'nos', 'nas', 'uma', 'que', 'por', 'sem'])

const palavras = (texto: string) => slug(texto).split('-').filter((p) => p.length >= 3 && !IGNORAR.has(p))

/** Id do subtítulo do tema que melhor corresponde ao tópico; se nenhum servir, o próprio tema. */
export function ancoraDoTopico(source: string, tema: number, topico?: string): string | undefined {
  const doTema = titulos(source).filter((t) => t.tema === tema)
  const cabecalho = doTema.find((t) => t.nivel === 2)
  if (!topico) return cabecalho?.id

  const alvo = palavras(topico)
  let melhor: { id: string; pontos: number } | undefined
  for (const t of doTema) {
    if (t.nivel !== 3) continue
    const ps = palavras(t.texto)
    const pontos = alvo.filter((a) => ps.some((p) => p.startsWith(a) || a.startsWith(p))).length
    if (pontos > 0 && (!melhor || pontos > melhor.pontos)) melhor = { id: t.id, pontos }
  }
  return melhor?.id ?? cabecalho?.id
}

export function rolarAte(id: string, destacar = false) {
  const el = document.getElementById(id)
  if (!el) return
  // Salto direto (sem animação) e de novo após as fontes carregarem, que mudam a altura do texto.
  el.scrollIntoView({ block: 'start', behavior: 'instant' })
  void document.fonts?.ready.then(() => el.scrollIntoView({ block: 'start', behavior: 'instant' }))
  if (destacar)
    el.animate([{ backgroundColor: 'rgba(16,185,129,.25)' }, { backgroundColor: 'transparent' }], { duration: 1800 })
}
