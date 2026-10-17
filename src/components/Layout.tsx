import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { roadmaps } from '../data/roadmaps'

export function Layout() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0 })
  }, [pathname, hash])

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-black/5 bg-paper/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-6 overflow-x-auto px-4 py-3">
          <Link to="/" className="flex shrink-0 items-center gap-2 font-extrabold tracking-tight">
            <img src="/favicon.svg" alt="" className="h-7 w-7" />
            Roadmap
          </Link>
          <nav className="flex gap-1 text-sm">
            {roadmaps
              .filter((r) => r.status === 'disponivel')
              .map((r) => (
                <NavLink
                  key={r.id}
                  to={`/roadmap/${r.id}`}
                  className={({ isActive }) =>
                    `shrink-0 rounded-full px-3 py-1.5 font-medium transition ${
                      isActive ? 'bg-ink text-white' : 'text-gray-600 hover:bg-black/5'
                    }`
                  }
                >
                  {r.icon} {r.short}
                </NavLink>
              ))}
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-black/5 py-8 text-center text-sm text-gray-500">
        Seu progresso fica salvo neste navegador.
      </footer>
    </div>
  )
}
