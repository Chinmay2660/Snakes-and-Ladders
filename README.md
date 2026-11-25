# Snakes & Ladders

A pass-and-play Snakes & Ladders game for 2–5 players, built with React, Redux Toolkit, TypeScript, Vite, and TailwindCSS.

## Features

- 2–5 players on a 10x10 board, with custom names, colors, and starting player.
- Animated dice and piece movement, with optional sound.
- Configurable snakes and ladders: add, edit, or remove jumps on the Settings page (validated on save), or restore the defaults.
- Automatic saving after every move; your game is restored when you return. Manual new game, save, and load.
- Light and dark themes (follows the system, remembers your choice).
- Accessible: keyboard-playable, focusable board cells, ARIA labels, screen-reader support.
- Confetti and a winner dialog when someone reaches square 100.

## Getting Started

Requires Node.js 20+.

```bash
npm install
npm run dev        # start the dev server
```

Other commands:

```bash
npm run build      # type-check + production build
npm run preview    # serve the production build
npm run lint       # ESLint + Prettier
npm run test       # Jest + React Testing Library
```

## How to Play

1. Click **Start playing** on the home page (or **Configure game** to change players and board first).
2. Take turns rolling the dice (click the dice, or press Enter/Space).
3. Land on a ladder to climb, on a snake to slide down.
4. The first player to reach square 100 wins.

## Customizing

- Default jumps and player settings: `src/features/settings/settingsDefaults.ts`.
- Board math: `src/utils/boardHelpers.ts`.

## Build Notes

- `vite.config.ts` intentionally has no custom `manualChunks` or `treeshake.moduleSideEffects` overrides; they caused a production crash (`Cannot set properties of undefined (setting 'Activity')`).
- Don't add `<link rel="modulepreload" href="/src/main.tsx">` to `index.html`; Vite injects the correct preload.
