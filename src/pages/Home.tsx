import { Link } from 'react-router-dom'

const Home = () => (
  <section className="mx-auto flex max-w-2xl flex-col items-center gap-6 py-8 text-center sm:py-16">
    <h1 className="text-4xl font-bold sm:text-5xl">Snakes &amp; Ladders</h1>
    <p className="text-base text-slate-600 dark:text-white/80 sm:text-lg">
      Pass-and-play for 2–5 players. Race to square 100, climb ladders, avoid snakes — and tweak the
      board to your liking. Your game saves automatically.
    </p>
    <div className="flex flex-col gap-3 sm:flex-row">
      <Link
        to="/play"
        className="inline-flex items-center justify-center rounded-full bg-sky-600 px-6 py-3 text-lg font-semibold text-white shadow-lg transition hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
      >
        Start playing
      </Link>
      <Link
        to="/settings"
        className="inline-flex items-center justify-center rounded-full border border-slate-400 px-6 py-3 text-lg font-semibold hover:bg-slate-900/10 dark:border-white/40 dark:hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
      >
        Configure game
      </Link>
    </div>
  </section>
)

export default Home
