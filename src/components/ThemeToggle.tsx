import { setTheme, useTheme } from '../lib/theme'

export function ThemeToggle() {
  const theme = useTheme()
  const escuro = theme === 'escuro'
  return (
    <button
      type="button"
      onClick={() => setTheme(escuro ? 'claro' : 'escuro')}
      aria-label={escuro ? 'Ativar modo claro' : 'Ativar modo escuro'}
      title={escuro ? 'Modo claro' : 'Modo escuro'}
      className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-gray-600 transition hover:bg-black/5 dark:text-gray-300 dark:hover:bg-white/10"
    >
      {escuro ? (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" strokeLinecap="round" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  )
}
