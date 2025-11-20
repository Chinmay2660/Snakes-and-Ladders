import type { Middleware } from '@reduxjs/toolkit'

export const errorLogger: Middleware = () => (next) => (action) => {
  try {
    return next(action)
  } catch (error) {
    console.error('[Redux] action failed', {
      action,
      error,
    })
    throw error
  }
}
