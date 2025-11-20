import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type { PlayerConfig } from '../game/gameTypes'
import { buildPlayers, DEFAULT_JUMPS } from './settingsDefaults'

export interface SettingsState {
  playerConfigs: PlayerConfig[]
  animationsEnabled: boolean
  soundEnabled: boolean
  startingPlayer: number
  jumps: Record<number, number>
}

const DEFAULT_STATE: SettingsState = {
  playerConfigs: buildPlayers(2),
  animationsEnabled: true,
  soundEnabled: false,
  startingPlayer: 0,
  jumps: DEFAULT_JUMPS,
}

const clampPlayerCount = (count: number) => Math.min(5, Math.max(1, count))

const settingsSlice = createSlice({
  name: 'settings',
  initialState: DEFAULT_STATE,
  reducers: {
    setPlayerCount(state, action: PayloadAction<number>) {
      const nextCount = clampPlayerCount(action.payload)
      if (nextCount === state.playerConfigs.length) return
      const players = [...state.playerConfigs]
      if (nextCount > players.length) {
        const additional = buildPlayers(nextCount - players.length, players.length)
        state.playerConfigs = players.concat(additional)
      } else {
        state.playerConfigs = players.slice(0, nextCount)
      }
      state.startingPlayer = Math.min(state.startingPlayer, nextCount - 1)
    },
    setPlayerName(state, action: PayloadAction<{ id: string; name: string }>) {
      const player = state.playerConfigs.find((config) => config.id === action.payload.id)
      if (player) {
        player.name = action.payload.name || player.name
      }
    },
    setPlayerColor(state, action: PayloadAction<{ id: string; color: string }>) {
      const player = state.playerConfigs.find((config) => config.id === action.payload.id)
      if (player) {
        player.color = action.payload.color
      }
    },
    setStartingPlayer(state, action: PayloadAction<number>) {
      const nextIndex = Math.min(Math.max(0, action.payload), state.playerConfigs.length - 1)
      state.startingPlayer = nextIndex
    },
    toggleAnimations(state) {
      state.animationsEnabled = !state.animationsEnabled
    },
    toggleSound(state) {
      state.soundEnabled = !state.soundEnabled
    },
    setJumps(state, action: PayloadAction<Record<number, number>>) {
      // Create a new object to ensure reference change for React re-renders
      state.jumps = { ...action.payload }
    },
    resetSettings() {
      return DEFAULT_STATE
    },
  },
})

export const {
  setPlayerCount,
  setPlayerName,
  setPlayerColor,
  setStartingPlayer,
  toggleAnimations,
  toggleSound,
  setJumps,
  resetSettings,
} = settingsSlice.actions

export default settingsSlice.reducer
