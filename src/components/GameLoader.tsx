const TILES = ['🎲', '🪜', '🐍', '🎲', '🪜']

export const GameLoader = () => (
  <div
    role="status"
    aria-live="polite"
    className="flex h-full min-h-[60vh] flex-col items-center justify-center gap-6 text-white"
  >
    <div className="relative grid h-28 w-28 grid-cols-2 grid-rows-2 overflow-hidden rounded-2xl border-4 border-slate-900 shadow-2xl">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={i === 0 || i === 3 ? 'bg-white' : 'bg-slate-900'}
          aria-hidden="true"
        />
      ))}
      <span className="absolute inset-0 flex animate-bounce items-center justify-center text-5xl drop-shadow-lg">
        🎲
      </span>
    </div>
    <div className="text-center">
      <p className="text-2xl font-bold tracking-wide">Snakes &amp; Ladders</p>
      <p className="mt-1 text-sm text-white/70">Setting up the board…</p>
    </div>
    <div className="flex items-center gap-2 text-2xl" aria-hidden="true">
      {TILES.map((tile, i) => (
        <span
          key={i}
          className="animate-bounce"
          style={{ animationDelay: `${i * 120}ms`, animationDuration: '1s' }}
        >
          {tile}
        </span>
      ))}
    </div>
    <span className="sr-only">Loading</span>
  </div>
)
