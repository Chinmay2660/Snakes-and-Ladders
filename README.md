# Snakes & Ladders – React + Redux Toolkit + TailwindCSS

Accessible, stateful Snakes & Ladders built with Vite, React Router, Redux Toolkit, TypeScript, TailwindCSS, Jest, and React Testing Library. It supports 1–4 pass-and-play users, configurable snakes/ladders, dice animations, state persistence, and import/export utilities.

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

- **Routing:** React Router with `Home`, `Play`, `Settings`, and `About` pages.
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
- Dice control supports mouse, keyboard (Enter/Space), screen readers, and optional audio feedback.
- Player customization (names, colors, count, starting player), animation/sound toggles, and JSON-based snakes/ladders map editor.
- Auto-save toggle (backed by `useLocalStorage`), manual save/load, and JSON import/export buttons.
- App-level `ErrorBoundary`, guarded storage helpers, Redux error-logging middleware, and resilient localStorage access.
- Unit tests for reducers, helpers, and key UI plus a sample GitHub Actions workflow (`.github/workflows/ci.yml`) running `npm ci`, `npm run lint`, and `npm run test`.

## Customizing Snakes & Ladders

- Update the textarea on the **Settings** page or edit `DEFAULT_JUMPS` in `src/features/settings/settingsDefaults.ts`.
- Modify player defaults/colors in the same file.
- Tweak animations, sounds, or board math inside `src/components/PlayerPiece.tsx` and `src/utils/boardHelpers.ts`.

## Troubleshooting

- **Board image missing:** ensure `src/assets/ladders.jpg` exists (copy from `/mnt/data/ladders.jpg`).
- **Storage errors:** browsers in private mode can block `localStorage`; errors are caught and surfaced via console warnings.
- **Audio disabled:** if the environment blocks the Web Audio API, the sound toggle silently no-ops.

Enjoy building on top of this modular foundation!
