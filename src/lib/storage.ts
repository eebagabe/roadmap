/**
 * Persistência do progresso.
 *
 * Hoje tudo fica no localStorage do navegador. Se um dia o progresso
 * for para um backend, basta criar outro `ProgressStorage` e trocar
 * a instância exportada em `progressStorage`.
 */
export type ProgressData = {
  /** Tópicos marcados como estudados. Chave: `roadmap/semana/topico`. */
  done: Record<string, true>
  /** Cards de semana recolhidos. Chave: `roadmap/semana`. */
  collapsed: Record<string, true>
}

export interface ProgressStorage {
  load(): ProgressData
  save(data: ProgressData): void
}

const KEY = 'roadmap:progress:v1'

const empty = (): ProgressData => ({ done: {}, collapsed: {} })

class LocalProgressStorage implements ProgressStorage {
  load(): ProgressData {
    try {
      const raw = localStorage.getItem(KEY)
      if (!raw) return empty()
      const parsed = JSON.parse(raw) as Partial<ProgressData>
      return { done: parsed.done ?? {}, collapsed: parsed.collapsed ?? {} }
    } catch {
      return empty()
    }
  }

  save(data: ProgressData): void {
    try {
      localStorage.setItem(KEY, JSON.stringify(data))
    } catch {
      // Modo anônimo ou storage cheio: segue só em memória.
    }
  }
}

export const progressStorage: ProgressStorage = new LocalProgressStorage()
