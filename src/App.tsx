import { Suspense, lazy } from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'

import { ErrorBoundary } from './components/ErrorBoundary'
import { Skeleton } from './components/Skeleton'

// Lazy load routes for code splitting
// Preload Home page as it's likely the first page visited
const Home = lazy(() =>
  import('./pages/Home').then((module) => {
    // Prefetch other routes in the background
    import('./pages/Play').catch(() => {})
    import('./pages/Settings').catch(() => {})
    return module
  }),
)
const Play = lazy(() => import('./pages/Play'))
const Settings = lazy(() => import('./pages/Settings'))
const About = lazy(() => import('./pages/About'))

const navLinkClass =
  'rounded-full px-4 py-2 text-sm font-semibold transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'

function App() {
  return (
    <ErrorBoundary>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded focus:bg-white focus:px-3 focus:py-2 text-slate-900"
      >
        Skip to content
      </a>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <header className="border-b border-white/10 bg-slate-900/60 backdrop-blur">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-3 sm:flex-row sm:gap-4 sm:px-6 sm:py-4">
            <NavLink to="/" className="text-lg font-bold text-white sm:text-xl">
              Snakes &amp; Ladders
            </NavLink>
            <nav className="flex flex-wrap items-center justify-center gap-1.5 text-white sm:gap-2">
              <NavLink
                to="/"
                className={({ isActive }) => `${navLinkClass} ${isActive ? 'bg-white/20' : ''}`}
              >
                Home
              </NavLink>
              <NavLink
                to="/play"
                className={({ isActive }) => `${navLinkClass} ${isActive ? 'bg-white/20' : ''}`}
              >
                Game
              </NavLink>
              <NavLink
                to="/settings"
                className={({ isActive }) => `${navLinkClass} ${isActive ? 'bg-white/20' : ''}`}
              >
                Settings
              </NavLink>
              <NavLink
                to="/about"
                className={({ isActive }) => `${navLinkClass} ${isActive ? 'bg-white/20' : ''}`}
              >
                About
              </NavLink>
            </nav>
          </div>
        </header>
        <main id="main" className="mx-auto max-w-6xl px-4 py-6 text-white sm:px-6 sm:py-10">
          <Suspense
            fallback={
              <div className="space-y-8">
                <Skeleton variant="text" width="200px" height="36px" />
                <Skeleton variant="rectangular" width="100%" height="400px" className="rounded-2xl" />
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/play" element={<Play />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </ErrorBoundary>
  )
}

export default App
