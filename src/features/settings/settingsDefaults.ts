import { nanoid } from '@reduxjs/toolkit'

import type { PlayerConfig } from '../game/gameTypes'

export const DEFAULT_COLORS = ['#d97706', '#2563eb', '#16a34a', '#db2777', '#9333ea']

export const DEFAULT_JUMPS: Record<number, number> = {
  3: 22,
  5: 8,
  11: 26,
  17: 4,
  19: 7,
  20: 29,
  27: 1,
  35: 44,
  38: 59,
  40: 3,
  45: 24,
  48: 10,
  50: 91,
  52: 72,
  57: 41,
  61: 78,
  62: 19,
  71: 92,
  73: 53,
  79: 99,
  84: 36,
  87: 63,
  95: 75,
  98: 28,
}

export const buildPlayers = (count: number, startIndex = 0): PlayerConfig[] =>
  Array.from({ length: count }).map((_, index) => ({
    id: nanoid(),
    name: `Player ${startIndex + index + 1}`,
    color: DEFAULT_COLORS[(startIndex + index) % DEFAULT_COLORS.length],
  }))
