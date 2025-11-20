import { configureStore } from '@reduxjs/toolkit'

import rootReducer from './rootReducer'
import { errorLogger } from '../middleware/errorLogger'

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(errorLogger),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
