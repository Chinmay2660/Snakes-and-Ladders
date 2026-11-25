import { nanoid } from '@reduxjs/toolkit'

import type { PlayerConfig } from '../game/gameTypes'

export const DEFAULT_COLORS = ['#d97706', '#2563eb', '#16a34a', '#db2777', '#9333ea']

export const DEFAULT_JUMPS: Record<number, number> = {
  4: 14,
  9: 31,
  16: 6,
  21: 42,
  28: 84,
  36: 44,
  47: 26,
  49: 11,
  51: 67,
  62: 19,
  71: 91,
  80: 100,
  87: 24,
  93: 73,
  95: 75,
  98: 78,
}

export const buildPlayers = (count: number, startIndex = 0): PlayerConfig[] =>
  Array.from({ length: count }).map((_, index) => ({
    id: nanoid(),
    name: `Player ${startIndex + index + 1}`,
    color: DEFAULT_COLORS[(startIndex + index) % DEFAULT_COLORS.length],
  }))
