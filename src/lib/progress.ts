import { useSyncExternalStore } from 'react'
import { progressStorage, type ProgressData } from './storage'

let state: ProgressData = progressStorage.load()
const listeners = new Set<() => void>()

function commit(next: ProgressData) {
  state = next
  progressStorage.save(state)
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function toggleKey(map: Record<string, true>, key: string, value?: boolean) {
  const next = { ...map }
  const on = value ?? !next[key]
  if (on) next[key] = true
  else delete next[key]
  return next
}

export function slug(text: string) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export const topicKey = (roadmapId: string, weekId: string, topic: string) =>
  `${roadmapId}/${weekId}/${slug(topic)}`

export const weekKey = (roadmapId: string, weekId: string) => `${roadmapId}/${weekId}`

export const progress = {
  toggleTopic(key: string, value?: boolean) {
    commit({ ...state, done: toggleKey(state.done, key, value) })
  },
  setTopics(keys: string[], value: boolean) {
    let done = state.done
    for (const k of keys) done = toggleKey(done, k, value)
    commit({ ...state, done })
  },
  toggleCollapsed(key: string, value?: boolean) {
    commit({ ...state, collapsed: toggleKey(state.collapsed, key, value) })
  },
  setCollapsed(keys: string[], value: boolean) {
    let collapsed = state.collapsed
    for (const k of keys) collapsed = toggleKey(collapsed, k, value)
    commit({ ...state, collapsed })
  },
  reset(prefix: string) {
    const strip = (map: Record<string, true>) =>
      Object.fromEntries(Object.entries(map).filter(([k]) => !k.startsWith(`${prefix}/`))) as Record<string, true>
    commit({ done: strip(state.done), collapsed: strip(state.collapsed) })
  },
}

/** Leitura pontual, sem assinar mudanças. */
export const getProgress = () => state

export function useProgress() {
  return useSyncExternalStore(subscribe, () => state)
}
