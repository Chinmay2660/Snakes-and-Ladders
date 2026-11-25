import { Suspense, lazy } from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'

import { ErrorBoundary } from './components/ErrorBoundary'
import { GameLoader } from './components/GameLoader'
import { useTheme } from './hooks/useTheme'

const Home = lazy(() => import('./pages/Home'))
const Play = lazy(() => import('./pages/Play'))
const Settings = lazy(() => import('./pages/Settings'))

const navLinkClass =
  'rounded-full px-3 py-1.5 text-sm font-semibold transition hover:bg-slate-900/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 dark:hover:bg-white/20 dark:focus-visible:outline-white'

const links = [
  { to: '/', label: 'Home' },
  { to: '/play', label: 'Game' },
  { to: '/settings', label: 'Settings' },
]

function App() {
  const { theme, toggle } = useTheme()
  return (
    <ErrorBoundary>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded focus:bg-white focus:px-3 focus:py-2 text-slate-900"
      >
        Skip to content
      </a>
      <div className="flex h-dvh flex-col bg-gradient-to-br from-sky-100 via-slate-100 to-sky-50 text-slate-900 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 dark:text-white">
        <header className="flex-none border-b border-slate-300/60 bg-white/70 backdrop-blur dark:border-white/10 dark:bg-slate-900/60">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-2 sm:px-6">
            <NavLink to="/" className="text-base font-bold sm:text-lg">
              Snakes &amp; Ladders
            </NavLink>
            <nav className="flex items-center gap-1">
              {links.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `${navLinkClass} ${isActive ? 'bg-slate-900/10 dark:bg-white/20' : ''}`
                  }
                >
                  {label}
                </NavLink>
              ))}
              <button
                type="button"
                onClick={toggle}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                className={`${navLinkClass} flex items-center`}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  {theme === 'dark' ? (
                    <>
                      <circle cx="12" cy="12" r="4" />
                      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                    </>
                  ) : (
                    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
                  )}
                </svg>
              </button>
            </nav>
          </div>
        </header>
        <main
          id="main"
          className="mx-auto min-h-0 w-full max-w-6xl flex-1 overflow-y-auto px-3 py-3 sm:px-6"
        >
          <Suspense fallback={<GameLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/play" element={<Play />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </ErrorBoundary>
  )
}

export default App
