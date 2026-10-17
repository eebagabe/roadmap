import { useSyncExternalStore } from 'react'

export type Theme = 'claro' | 'escuro'

const KEY = 'roadmap:tema'
const listeners = new Set<() => void>()

function stored(): Theme | null {
  try {
    const v = localStorage.getItem(KEY)
    return v === 'claro' || v === 'escuro' ? v : null
  } catch {
    return null
  }
}

function current(): Theme {
  return document.documentElement.classList.contains('dark') ? 'escuro' : 'claro'
}

export function setTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'escuro')
  try {
    localStorage.setItem(KEY, theme)
  } catch {
    // Sem storage: vale só nesta sessão.
  }
  listeners.forEach((l) => l())
}

// Sem escolha salva, acompanha o sistema operacional.
const media = window.matchMedia('(prefers-color-scheme: dark)')
media.addEventListener('change', (e) => {
  if (stored()) return
  document.documentElement.classList.toggle('dark', e.matches)
  listeners.forEach((l) => l())
})

export function useTheme() {
  return useSyncExternalStore((l) => {
    listeners.add(l)
    return () => listeners.delete(l)
  }, current)
}
