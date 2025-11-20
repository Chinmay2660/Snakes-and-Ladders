import { Link } from 'react-router-dom'

export const Home = () => (
  <section className="space-y-4 text-white sm:space-y-6">
    <header className="text-center sm:text-left">
      <h1 className="text-3xl font-bold text-white sm:text-4xl">Snakes &amp; Ladders</h1>
      <p className="mt-2 text-base text-white/80 sm:mt-3 sm:text-lg">
        A modern, accessible take on the classic board game. Customize player settings, keep your
        progress, and enjoy a responsive experience across devices.
      </p>
    </header>
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
      <Link
        to="/play"
        className="inline-flex items-center justify-center rounded-full bg-sky-600 px-5 py-2.5 text-base font-semibold text-white shadow-lg transition hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300 sm:px-6 sm:py-3 sm:text-lg"
      >
        Start playing
      </Link>
      <Link
        to="/settings"
        className="inline-flex items-center justify-center rounded-full border border-white/40 px-5 py-2.5 text-base font-semibold text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60 sm:px-6 sm:py-3 sm:text-lg"
      >
        Configure game
      </Link>
    </div>
    <ul className="grid gap-3 sm:gap-4 md:grid-cols-2">
      {[
        'Keyboard-friendly controls with full ARIA support.',
        'Redux-powered state with save/load, export/import.',
        'Customizable snakes, ladders, players, and themes.',
        'Robust error handling with ErrorBoundary fallback.',
      ].map((item) => (
        <li
          key={item}
          className="rounded-2xl border border-white/20 bg-white/10 p-4 text-white shadow-sm"
        >
          {item}
        </li>
      ))}
    </ul>
  </section>
)
