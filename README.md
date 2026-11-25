# Snakes & Ladders – React + Redux Toolkit + TailwindCSS

Accessible, stateful Snakes & Ladders built with Vite, React Router, Redux Toolkit, TypeScript, TailwindCSS, Jest, and React Testing Library. It supports 2–5 pass-and-play players, configurable snakes/ladders, dice animations, state persistence, and import/export utilities.

## Getting Started

```bash
npm install
npm run dev        # start local dev server
npm run build      # type-check + production build
npm run preview    # serve the production bundle
npm run lint       # ESLint + Prettier validation
npm run test       # Jest + RTL suite
```

> Copy the provided `/mnt/data/ladders.jpg` into `src/assets/ladders.jpg` before running `npm run dev`. The repo includes a placeholder image so builds succeed, but the real art should replace it for production.

## Architecture Overview

- **Routing:** React Router with `Home`, `Play`, and `Settings` pages.
- **State:** Redux Toolkit slices (`gameSlice`, `settingsSlice`) plus memoized selectors. Async thunks coordinate dice rolling, movement, jumps, win detection, and save/load interactions.
- **Styling:** TailwindCSS (custom config + `src/styles/index.css`) with a11y-first theming, focus states, and responsive layout helpers.
- **Components:** Modular UI primitives (`Button`, `Modal`, `Dice`, `Board`, `PlayerPiece`, `ErrorBoundary`) and feature-level containers (`GameBoard`, `GameControls`, `GameModal`, `SettingsForm`).
- **Hooks & Utils:** `useDice`, `useAnimationQueue`, `useLocalStorage`, board math helpers, random utilities, and validation helpers keep logic reusable and testable.
- **Persistence:** `saveGame`/`loadGame` thunks and the `useLocalStorage` hook power auto-save, manual save/load, and JSON import/export.

```
src/
  app/                # store + root reducer
  components/         # UI building blocks
  features/
    game/             # gameplay slice + UI
    settings/         # settings slice + form
  hooks/              # shared hooks (dice, animation, localStorage, redux)
  pages/              # route views
  utils/              # board helpers, validation, random
  styles/             # Tailwind entry point
  assets/ladders.jpg  # board background (copy from /mnt/data)
```

## Feature Highlights

- 10x10 grid rendered over the provided board art with keyboard-focusable, clickable cells and ARIA labels.
- Light and dark themes (toggle in the header, remembers your choice, follows the system by default).
- Dice control supports mouse, keyboard (Enter/Space, except while a button or input is focused), screen readers, and optional audio feedback.
- Player customization (names, colors, count, starting player), animation/sound toggles, and a row-based snakes/ladders editor (validated on commit).
- Automatic saving after every move (restored on load); New game resets and re-saves. Reset and Load are disabled while a move is animating, and interrupted saves resume as idle.
- App-level `ErrorBoundary`, guarded storage helpers, Redux error-logging middleware, and resilient localStorage access.
- Unit tests for reducers, helpers, and key UI plus a sample GitHub Actions workflow (`.github/workflows/ci.yml`) running `npm ci`, `npm run lint`, and `npm run test`.

## Customizing Snakes & Ladders

- Add, edit, or remove jumps on the **Settings** page (edit a row, then press Enter or leave the field), or edit `DEFAULT_JUMPS` in `src/features/settings/settingsDefaults.ts`.
- Modify player defaults/colors in the same file.
- Tweak animations, sounds, or board math inside `src/components/PlayerPiece.tsx` and `src/utils/boardHelpers.ts`.

## Troubleshooting

- **Board image missing:** ensure `src/assets/ladders.jpg` exists (copy from `/mnt/data/ladders.jpg`).
- **Storage errors:** browsers in private mode can block `localStorage`; errors are caught and surfaced via console warnings.
- **Audio disabled:** if the environment blocks the Web Audio API, the sound toggle silently no-ops.

Enjoy building on top of this modular foundation!

## Dependencies

Dependencies are kept current within their semver ranges (`npm update`). Major upgrades available but not applied because they are breaking: Tailwind 4, Jest 30, ESLint 10, Vite 8, TypeScript 7.

## Default (starting) settings

The game always starts from its own built-in settings — 2 players, Player 1 starts, animations on, sound off, and the classic 16-jump board (8 ladders, 8 snakes) — defined in `src/features/settings/settingsDefaults.ts` and `settingsSlice.ts`. Settings are per-session and are not saved; **Restore default settings** on the Settings page returns to them at any time.
