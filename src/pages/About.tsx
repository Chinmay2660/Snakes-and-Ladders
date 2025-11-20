export const About = () => (
  <section className="space-y-4 text-white sm:space-y-6">
    <header className="text-center sm:text-left">
      <h1 className="text-2xl font-bold text-white sm:text-3xl">About</h1>
      <p className="mt-1 text-sm text-white/80 sm:mt-2 sm:text-base">
        This project showcases a production-ready implementation of Snakes & Ladders with modern
        tooling, accessibility best practices, and automated tests.
      </p>
    </header>
    <article className="space-y-3 rounded-xl border border-white/20 bg-white/10 p-4 shadow-sm sm:space-y-4 sm:rounded-2xl sm:p-6">
      <p>
        The board leverages Redux Toolkit for deterministic state management, React Router for
        navigation, and TailwindCSS for design. Animations, persistence, and input validation ensure
        a polished experience.
      </p>
      <p>
        Use the import/export helpers to share games, tweak the snakes and ladders mapping in
        settings, and explore the hooks folder for reusable logic.
      </p>
    </article>
  </section>
)
