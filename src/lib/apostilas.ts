/**
 * Apostilas ficam em `src/apostilas/<roadmap>/<secao>.md` e o gabarito em
 * `src/apostilas/<roadmap>/<secao>.gabarito.md`. Basta criar o arquivo
 * para o link aparecer no roadmap.
 */
const files = import.meta.glob<string>('../apostilas/*/*.md', { query: '?raw', import: 'default' })

export type ApostilaKind = 'apostila' | 'gabarito'

const path = (roadmapId: string, sectionId: string, kind: ApostilaKind) =>
  `../apostilas/${roadmapId}/${sectionId}${kind === 'gabarito' ? '.gabarito' : ''}.md`

export const hasApostila = (roadmapId: string, sectionId: string, kind: ApostilaKind = 'apostila') =>
  path(roadmapId, sectionId, kind) in files

export function loadApostila(roadmapId: string, sectionId: string, kind: ApostilaKind) {
  const loader = files[path(roadmapId, sectionId, kind)]
  return loader ? loader() : Promise.resolve(undefined)
}
