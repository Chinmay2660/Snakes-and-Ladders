import clsx from 'clsx'
import { ReactNode } from 'react'

import { BOARD_COLUMNS, BOARD_ROWS, formatSquareLabel } from '../utils/boardHelpers'

interface BoardProps {
  ariaLabel?: string
  onSquareSelect?: (square: number) => void
  children?: ReactNode
}

const buildDisplaySquares = () => {
  const rows: number[][] = []

  for (let visualRow = 0; visualRow < BOARD_ROWS; visualRow++) {
    const boardRowFromBottom = visualRow
    const start = boardRowFromBottom * BOARD_COLUMNS + 1
    const rowSquares = Array.from({ length: BOARD_COLUMNS }, (_, idx) => start + idx)

    if (boardRowFromBottom % 2 === 1) {
      rowSquares.reverse()
    }

    rows.unshift(rowSquares)
  }

  return rows.flat()
}

const squares = buildDisplaySquares()

export const Board = ({
  ariaLabel = 'Snakes and Ladders board',
  onSquareSelect,
  children,
}: BoardProps) => (
  <section
    className="relative aspect-square w-full max-w-3xl rounded-xl border-2 border-slate-900 bg-slate-900 shadow-2xl sm:rounded-2xl sm:border-4"
    aria-label={ariaLabel}
  >
    <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 overflow-hidden rounded-xl sm:rounded-2xl">
      {squares.map((square, index) => {
        const row = Math.floor(index / BOARD_COLUMNS)
        const column = index % BOARD_COLUMNS
        const isLight = (row + column) % 2 === 0

        return (
          <button
            key={square}
            type="button"
            className={clsx(
              'relative flex items-center justify-center text-[10px] font-semibold transition focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-white sm:text-xs',
              isLight ? 'bg-white text-slate-900' : 'bg-slate-900 text-white',
            )}
            aria-label={formatSquareLabel(square)}
            onClick={() => onSquareSelect?.(square)}
            tabIndex={onSquareSelect ? 0 : -1}
          >
            {square}
          </button>
        )
      })}
    </div>
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl sm:rounded-2xl">
      {children}
    </div>
  </section>
)
