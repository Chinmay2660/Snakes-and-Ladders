import { describe, expect, it } from '@jest/globals'

import gameReducer, {
  completeTurn,
  movePlayer,
  resetGame,
  setPlayers,
} from '../src/features/game/gameSlice'
import type { GameState } from '../src/features/game/gameTypes'

const createState = (): GameState => ({
  players: [
    { id: 'p1', name: 'Player 1', color: '#000' },
    { id: 'p2', name: 'Player 2', color: '#fff' },
  ],
  positions: { p1: 1, p2: 1 },
  currentPlayerIndex: 0,
  diceValue: null,
  status: 'idle',
  history: [],
})

describe('gameSlice reducers', () => {
  it('moves a player across the board', () => {
    const next = gameReducer(
      createState(),
      movePlayer({
        playerId: 'p1',
        to: 6,
        dice: 5,
      }),
    )

    expect(next.positions.p1).toBe(6)
    expect(next.history).toHaveLength(1)
    expect(next.status).toBe('animating')
  })

  it('completes a turn cyclically', () => {
    const next = gameReducer(createState(), completeTurn())
    expect(next.currentPlayerIndex).toBe(1)
    const backToStart = gameReducer(next, completeTurn())
    expect(backToStart.currentPlayerIndex).toBe(0)
    expect(backToStart.status).toBe('idle')
  })

  it('resets when players change', () => {
    const state = createState()
    state.positions.p1 = 50
    const next = gameReducer(
      state,
      setPlayers({
        players: [
          { id: 'a', name: 'Alpha', color: '#123' },
          { id: 'b', name: 'Beta', color: '#456' },
        ],
        startingIndex: 1,
      }),
    )

    expect(next.positions.a).toBe(1)
    expect(next.currentPlayerIndex).toBe(1)
  })

  it('resets the game in place', () => {
    const state = createState()
    state.positions.p1 = 99
    const next = gameReducer(state, resetGame())
    expect(next.positions.p1).toBe(1)
    expect(next.status).toBe('idle')
  })
})
