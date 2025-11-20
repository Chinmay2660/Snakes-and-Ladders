import { combineReducers } from '@reduxjs/toolkit'

import gameReducer from '../features/game/gameSlice'
import settingsReducer from '../features/settings/settingsSlice'

const rootReducer = combineReducers({
  game: gameReducer,
  settings: settingsReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
