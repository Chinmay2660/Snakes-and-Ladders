import { createAsyncThunk, createSlice, nanoid } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type { RootState } from '../../app/store'
import { BOARD_SIZE } from '../../utils/boardHelpers'
import { rollDice } from '../../utils/random'
import { safeParseJson } from '../../utils/validation'
import type { GameState, MoveRecord, PersistedGameState, PlayerConfig } from './gameTypes'
import { buildPlayers } from '../settings/settingsDefaults'

const LOCAL_STORAGE_KEY = 'snakes-and-ladders-game'

const createPositions = (players: PlayerConfig[]) =>
  players.reduce<Record<string, number>>((acc, player) => {
    acc[player.id] = 1
    return acc
  }, {})

const defaultPlayers = buildPlayers(2)

const initialState: GameState = {
  players: defaultPlayers,
  positions: createPositions(defaultPlayers),
  currentPlayerIndex: 0,
  diceValue: null,
  status: 'idle',
  history: [],
  error: undefined,
  lastSavedAt: undefined,
}

const persistState = (state: GameState, settingsSnapshot: RootState['settings']) => {
  try {
    const payload: PersistedGameState = {
      positions: state.positions,
      currentPlayerIndex: state.currentPlayerIndex,
      history: state.history,
      diceValue: state.diceValue,
      status: state.status,
      winnerId: state.winnerId,
      updatedAt: new Date().toISOString(),
      players: state.players,
      settingsSnapshot: {
        playerCount: settingsSnapshot.playerConfigs.length,
        playerConfigs: settingsSnapshot.playerConfigs,
        startingPlayer: settingsSnapshot.startingPlayer,
        animationsEnabled: settingsSnapshot.animationsEnabled,
        soundEnabled: settingsSnapshot.soundEnabled,
        jumps: settingsSnapshot.jumps,
      },
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload))
  } catch (error) {
    console.warn('Failed to persist state', error)
  }
}

const loadPersistedState = (): PersistedGameState | null => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (!raw) return null
    const parsed = safeParseJson<PersistedGameState>(raw)
    return parsed ?? null
  } catch (error) {
    console.warn('Failed to load state', error)
    return null
  }
}

const createMoveRecord = (
  playerId: string,
  from: number,
  to: number,
  dice: number,
): MoveRecord => ({
  id: nanoid(),
  playerId,
  from,
  to,
  dice,
  timestamp: new Date().toISOString(),
})

const getNextPlayerIndex = (state: GameState) =>
  (state.currentPlayerIndex + 1) % state.players.length

export const rollAndMove = createAsyncThunk<void, void, { state: RootState }>(
  'game/rollAndMove',
  async (_, { getState, dispatch }) => {
    const dice = rollDice()
    dispatch(setStatus('rolling'))
    dispatch(setDiceValue(dice))

    await new Promise((resolve) => setTimeout(resolve, 600))

    const state = getState()
    const gameState = state.game
    const player = gameState.players[gameState.currentPlayerIndex]
    const from = gameState.positions[player.id]
    const attempted = from + dice
    let destination = attempted > BOARD_SIZE ? from : attempted

    dispatch(
      movePlayer({
        playerId: player.id,
        to: destination,
        dice,
      }),
    )

    if (destination === BOARD_SIZE) {
      dispatch(declareWinner(player.id))
      return
    }

    const jumpTarget = state.settings.jumps[destination]

    if (jumpTarget) {
      await new Promise((resolve) => setTimeout(resolve, 350))
      const isLadder = jumpTarget > destination
      dispatch(
        applyJump({
          playerId: player.id,
          from: destination,
          to: jumpTarget,
          dice,
          jumpType: isLadder ? 'ladder' : 'snake',
        }),
      )
      destination = jumpTarget
    }

    if (destination === BOARD_SIZE) {
      dispatch(declareWinner(player.id))
      return
    }

    dispatch(completeTurn())
  },
)

export const saveGame = createAsyncThunk<void, void, { state: RootState }>(
  'game/saveGame',
  async (_, { getState, dispatch }) => {
    const state = getState()
    persistState(state.game, state.settings)
    dispatch(markSaved())
  },
)

export const loadGame = createAsyncThunk('game/loadGame', async (_, { dispatch }) => {
  const snapshot = loadPersistedState()
  if (snapshot) {
    dispatch(hydrateGame(snapshot))
  }
})

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    hydrateGame(state, action: PayloadAction<PersistedGameState>) {
      state.players = action.payload.players
      state.positions = action.payload.positions
      state.currentPlayerIndex = action.payload.currentPlayerIndex
      state.history = action.payload.history
      state.diceValue = action.payload.diceValue
      state.status = action.payload.status
      state.winnerId = action.payload.winnerId
      state.lastSavedAt = action.payload.updatedAt
    },
    setPlayers(state, action: PayloadAction<{ players: PlayerConfig[]; startingIndex?: number }>) {
      state.players = action.payload.players
      state.positions = createPositions(action.payload.players)
      state.currentPlayerIndex =
        action.payload.startingIndex !== undefined
          ? Math.min(Math.max(0, action.payload.startingIndex), action.payload.players.length - 1)
          : 0
      state.history = []
      state.status = 'idle'
      state.diceValue = null
      state.winnerId = undefined
    },
    setStatus(state, action: PayloadAction<GameState['status']>) {
      state.status = action.payload
    },
    setDiceValue(state, action: PayloadAction<number>) {
      state.diceValue = action.payload
    },
    movePlayer(state, action: PayloadAction<{ playerId: string; to: number; dice: number }>) {
      const from = state.positions[action.payload.playerId]
      state.positions[action.payload.playerId] = action.payload.to
      state.status = 'animating'
      state.history.push(
        createMoveRecord(action.payload.playerId, from, action.payload.to, action.payload.dice),
      )
    },
    applyJump(
      state,
      action: PayloadAction<{
        playerId: string
        from: number
        to: number
        dice: number
        jumpType?: 'ladder' | 'snake'
      }>,
    ) {
      state.positions[action.payload.playerId] = action.payload.to
      state.history.push(
        createMoveRecord(
          action.payload.playerId,
          action.payload.from,
          action.payload.to,
          action.payload.dice,
        ),
      )
    },
    declareWinner(state, action: PayloadAction<string>) {
      state.status = 'complete'
      state.winnerId = action.payload
    },
    completeTurn(state) {
      state.status = 'idle'
      state.currentPlayerIndex = getNextPlayerIndex(state)
    },
    resetGame(
      state,
      action: PayloadAction<{ players: PlayerConfig[]; startingIndex?: number } | undefined>,
    ) {
      const nextPlayers = action.payload?.players ?? state.players
      state.players = nextPlayers
      state.positions = createPositions(nextPlayers)
      const startingIndex =
        action.payload?.startingIndex !== undefined
          ? Math.min(Math.max(0, action.payload.startingIndex), nextPlayers.length - 1)
          : 0
      state.currentPlayerIndex = startingIndex
      state.diceValue = null
      state.history = []
      state.winnerId = undefined
      state.status = 'idle'
    },
    markSaved(state) {
      state.lastSavedAt = new Date().toISOString()
    },
    importGameState(state, action: PayloadAction<PersistedGameState>) {
      state.players = action.payload.players
      state.positions = action.payload.positions
      state.currentPlayerIndex = action.payload.currentPlayerIndex
      state.diceValue = action.payload.diceValue
      state.history = action.payload.history
      state.status = action.payload.status
      state.winnerId = action.payload.winnerId
      state.lastSavedAt = new Date().toISOString()
    },
  },
})

export const {
  hydrateGame,
  setPlayers,
  setStatus,
  setDiceValue,
  movePlayer,
  applyJump,
  declareWinner,
  completeTurn,
  resetGame,
  markSaved,
  importGameState,
} = gameSlice.actions

export default gameSlice.reducer
