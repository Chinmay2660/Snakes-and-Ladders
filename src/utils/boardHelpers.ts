export const BOARD_COLUMNS = 10
export const BOARD_ROWS = 10
export const BOARD_SIZE = BOARD_COLUMNS * BOARD_ROWS

const CELL_SIZE = 100 / BOARD_COLUMNS

export interface SquarePosition {
  row: number
  column: number
  leftPercent: number
  topPercent: number
}

export const squareToCoords = (square: number): SquarePosition => {
  const safeSquare = Math.min(Math.max(1, square), BOARD_SIZE)
  const normalized = safeSquare - 1

  // Match the board's display order (serpentine pattern)
  // Build the same order as Board.tsx buildDisplaySquares
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
  const displaySquares = rows.flat()

  // Find the index of this square in the display order
  const displayIndex = displaySquares.indexOf(safeSquare)
  if (displayIndex === -1) {
    // Fallback to old calculation if not found
    const fromBottomRow = Math.floor(normalized / BOARD_COLUMNS)
    const columnWithinRow = normalized % BOARD_COLUMNS
    const isLeftToRight = fromBottomRow % 2 === 0
    const column = isLeftToRight ? columnWithinRow : BOARD_COLUMNS - 1 - columnWithinRow
    const row = BOARD_ROWS - 1 - fromBottomRow
    return {
      row,
      column,
      leftPercent: column * CELL_SIZE + CELL_SIZE / 2,
      topPercent: row * CELL_SIZE + CELL_SIZE / 2,
    }
  }

  // Calculate row and column from display index
  const row = Math.floor(displayIndex / BOARD_COLUMNS)
  const column = displayIndex % BOARD_COLUMNS

  return {
    row,
    column,
    leftPercent: column * CELL_SIZE + CELL_SIZE / 2,
    topPercent: row * CELL_SIZE + CELL_SIZE / 2,
  }
}

export const buildSquares = () => Array.from({ length: BOARD_SIZE }, (_, idx) => idx + 1)

export const getPathBetween = (from: number, to: number) => {
  const path: number[] = []
  if (from === to) return path
  const step = from < to ? 1 : -1
  for (let square = from + step; step > 0 ? square <= to : square >= to; square += step) {
    path.push(square)
  }
  return path
}

export const formatSquareLabel = (square: number) => `Square ${square}`
