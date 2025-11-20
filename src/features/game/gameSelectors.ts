import { createSelector } from '@reduxjs/toolkit'

import type { RootState } from '../../app/store'

export const selectGameState = (state: RootState) => state.game
export const selectSettingsState = (state: RootState) => state.settings

export const selectPlayers = createSelector([selectGameState], (game) => game.players)

export const selectCurrentPlayer = createSelector(
  [selectGameState],
  (game) => game.players[game.currentPlayerIndex],
)

export const selectPositions = createSelector([selectGameState], (game) => game.positions)

export const selectWinner = createSelector([selectGameState], (game) =>
  game.winnerId ? game.players.find((player) => player.id === game.winnerId) : undefined,
)

export const selectDiceValue = createSelector([selectGameState], (game) => game.diceValue)

export const selectGameStatus = createSelector([selectGameState], (game) => game.status)

export const selectJumps = createSelector([selectSettingsState], (settings) => settings.jumps)

export const selectGameCanRoll = createSelector([selectGameStatus], (status) => status === 'idle')
