import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'

import { Button } from '../../components/Button'
import { Snackbar } from '../../components/Snackbar'
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux'
import { setPlayers } from '../game/gameSlice'
import {
  resetSettings,
  setPlayerColor,
  setPlayerCount,
  setPlayerName,
  setStartingPlayer,
  setJumps,
  toggleAnimations,
  toggleSound,
} from './settingsSlice'

export const SettingsForm = () => {
  const dispatch = useAppDispatch()
  const settings = useAppSelector((state) => state.settings)
  const [draftJumps, setDraftJumps] = useState<
    Record<string, { from: number | null; to: number | null }>
  >({})
  const [jumpErrors, setJumpErrors] = useState<Record<string, string>>({})
  const [snackbar, setSnackbar] = useState<{
    isOpen: boolean
    message: string
    type: 'success' | 'error' | 'info'
  }>({
    isOpen: false,
    message: '',
    type: 'info',
  })

  // Helper function to check if a value conflicts with existing jumps
  const checkValueConflict = (
    value: number,
    excludeFrom?: number,
    excludeTo?: number,
  ): { conflict: boolean; message: string } => {
    // Check all existing jumps
    for (const [from, to] of Object.entries(settings.jumps)) {
      const fromNum = Number(from)
      const toNum = Number(to)

      // Skip if this is the jump we're editing
      if (excludeFrom !== undefined && fromNum === excludeFrom) {
        continue
      }

      // Check if value matches any existing "From"
      if (value === fromNum) {
        return {
          conflict: true,
          message: `Square ${value} is already used as a "From" value`,
        }
      }

      // Check if value matches any existing "To" (but skip if it's the current jump's "To")
      if (value === toNum) {
        // Only skip if we're excluding this specific "To" value
        if (excludeTo !== undefined && toNum === excludeTo && fromNum === excludeFrom) {
          continue
        }
        return {
          conflict: true,
          message: `Square ${value} is already used as a "To" value`,
        }
      }
    }

    return { conflict: false, message: '' }
  }

  // Validate all jumps for duplicates and set errors
  useEffect(() => {
    const errors: Record<string, string> = {}
    const allFromValues = new Set<number>()
    const allToValues = new Set<number>()

    // First pass: collect all "From" and "To" values
    Object.entries(settings.jumps).forEach(([from, to]) => {
      const fromNum = Number(from)
      const toNum = Number(to)

      // Check if from and to are the same
      if (fromNum === toNum) {
        errors[from] = `"From" and "To" cannot be the same`
      } else {
        allFromValues.add(fromNum)
        allToValues.add(toNum)
      }
    })

    // Second pass: check for duplicates
    Object.entries(settings.jumps).forEach(([from, to]) => {
      const fromNum = Number(from)
      const toNum = Number(to)

      // Skip if already has error (from/to same)
      if (errors[from]) {
        return
      }

      // Check if "From" value is duplicate
      const fromCount = Array.from(allFromValues).filter((v) => v === fromNum).length
      if (fromCount > 1) {
        errors[from] = `Square ${fromNum} is already used as a "From" value`
        return
      }

      // Check if "From" value matches any "To" value
      if (allToValues.has(fromNum)) {
        errors[from] = `Square ${fromNum} is already used as a "To" value`
        return
      }

      // Check if "To" value is duplicate
      const toCount = Array.from(allToValues).filter((v) => v === toNum).length
      if (toCount > 1) {
        errors[from] = `Square ${toNum} is already used as a "To" value`
        return
      }

      // Check if "To" value matches any "From" value
      if (allFromValues.has(toNum)) {
        errors[from] = `Square ${toNum} is already used as a "From" value`
        return
      }
    })

    // Update errors, but preserve any existing errors for draft jumps
    setJumpErrors((prev) => {
      const updated: Record<string, string> = {}
      // Preserve draft jump errors (keys starting with 'draft-')
      Object.entries(prev).forEach(([key, message]) => {
        if (key.startsWith('draft-')) {
          updated[key] = message
        }
      })
      // Add new errors for saved jumps (this will overwrite any existing errors for these keys)
      Object.entries(errors).forEach(([key, message]) => {
        updated[key] = message
      })
      return updated
    })
  }, [settings.jumps])

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()

    // Check for validation errors - the useEffect already validates all jumps
    // Filter out draft jump errors (they start with 'draft-')
    const savedJumpErrors = Object.entries(jumpErrors).filter(
      ([key]) => !key.startsWith('draft-'),
    )
    const hasErrors = savedJumpErrors.length > 0

    // Also check for invalid drafts
    const hasInvalidDrafts = Object.values(draftJumps).some(
      (draft) => draft.from !== null && draft.to !== null && draft.from === draft.to,
    )

    // Double-check for same from/to values (should be caught by useEffect, but just in case)
    const hasInvalidJumps = Object.entries(settings.jumps).some(
      ([from, to]) => Number(from) === Number(to),
    )

    if (hasErrors || hasInvalidJumps || hasInvalidDrafts) {
      // Show error snackbar
      const errorMessages = [
        ...savedJumpErrors.map(([, msg]) => msg),
        ...(hasInvalidJumps ? ['Some jumps have "From" and "To" set to the same value'] : []),
        ...(hasInvalidDrafts
          ? ['Some draft jumps have "From" and "To" set to the same value']
          : []),
      ]
      setSnackbar({
        isOpen: true,
        message: `Please fix all errors before applying: ${errorMessages.join('; ')}`,
        type: 'error',
      })
      return
    }

    dispatch(
      setPlayers({ players: settings.playerConfigs, startingIndex: settings.startingPlayer }),
    )
    // Show success snackbar
    setSnackbar({
      isOpen: true,
      message: 'Settings applied successfully!',
      type: 'success',
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-xl border border-slate-200 bg-white/90 p-4 shadow-lg sm:space-y-8 sm:rounded-2xl sm:p-6"
    >
      <section>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900 sm:text-lg">Players</h2>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-slate-700">Player Count</label>
              <select
                className="w-auto rounded border border-slate-300 pl-3 pr-10 py-2 text-black"
                style={{ width: 'fit-content', minWidth: '80px' }}
                value={settings.playerConfigs.length}
                onChange={(event) => dispatch(setPlayerCount(Number(event.target.value)))}
              >
                {[1, 2, 3, 4, 5].map((count) => (
                  <option key={count} value={count} className="text-black">
                    {count}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:gap-4 md:grid-cols-2">
          {settings.playerConfigs.map((player, index) => (
            <div key={player.id} className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
              <p className="text-sm font-semibold text-slate-700">Player {index + 1}</p>
              <label className="mt-3 block text-sm text-slate-600">
                Name
                <input
                  required
                  minLength={2}
                  value={player.name}
                  onChange={(event) =>
                    dispatch(setPlayerName({ id: player.id, name: event.target.value }))
                  }
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
                />
              </label>
              <label className="mt-3 flex items-center gap-3 text-sm text-slate-600">
                Color
                <input
                  type="color"
                  value={player.color}
                  aria-label={`${player.name} color`}
                  onChange={(event) =>
                    dispatch(setPlayerColor({ id: player.id, color: event.target.value }))
                  }
                  className="h-10 w-10 cursor-pointer rounded border border-slate-300"
                />
              </label>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Snakes &amp; Ladders</h2>
            <p className="mt-1 text-sm text-slate-600">
              Configure jumps on the board. Higher number = Ladder, Lower number = Snake.
            </p>
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              const draftId = `draft-${Date.now()}`
              setDraftJumps((prev) => ({
                ...prev,
                [draftId]: { from: null, to: null },
              }))
            }}
          >
            + Add Jump
          </Button>
        </div>
        <div className="mt-4 space-y-2 max-h-[400px] overflow-y-auto">
          {/* Draft jumps (new, empty entries) */}
          {Object.entries(draftJumps).map(([draftId, draft]) => {
            const fromNum = draft.from
            const toNum = draft.to
            const hasError = jumpErrors[draftId] !== undefined
            const fromConflict = fromNum !== null ? checkValueConflict(fromNum) : { conflict: false, message: '' }
            const toConflict = toNum !== null ? checkValueConflict(toNum) : { conflict: false, message: '' }
            const isValid =
              fromNum !== null &&
              toNum !== null &&
              fromNum >= 1 &&
              fromNum <= 100 &&
              toNum >= 1 &&
              toNum <= 100 &&
              fromNum !== toNum &&
              !fromConflict.conflict &&
              !toConflict.conflict &&
              !settings.jumps[fromNum]
            const isLadder = isValid && toNum !== null && fromNum !== null && toNum > fromNum
            const showBadge = isValid && !hasError

            return (
              <div
                key={draftId}
                className="flex items-center gap-3 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50/40 p-3"
              >
                <div className="flex items-center gap-2 flex-1">
                  <label className="text-sm font-medium text-slate-700">
                    From:
                    <input
                      type="number"
                      min="1"
                      max="100"
                      placeholder="1-100"
                      value={fromNum ?? ''}
                      onChange={(e) => {
                        const value = e.target.value === '' ? null : Number(e.target.value)
                        const currentTo = draft.to
                        let error: string | undefined

                        if (value !== null && value >= 1 && value <= 100) {
                          // Check if from and to are the same
                          if (currentTo !== null && value === currentTo) {
                            error = `"From" and "To" cannot be the same`
                          } else {
                            // Check for conflicts with existing jumps
                            const conflict = checkValueConflict(value)
                            if (conflict.conflict) {
                              error = conflict.message
                            }
                          }
                        }

                        setJumpErrors((prev) => {
                          const updated = { ...prev }
                          if (error) {
                            updated[draftId] = error
                          } else {
                            delete updated[draftId]
                          }
                          return updated
                        })

                        setDraftJumps((prev) => ({
                          ...prev,
                          [draftId]: { ...prev[draftId], from: value },
                        }))
                      }}
                      onBlur={() => {
                        if (fromNum !== null && toNum !== null) {
                          // Re-check all validations
                          const fromConflict = checkValueConflict(fromNum)
                          const toConflict = checkValueConflict(toNum)
                          const isSame = fromNum === toNum
                          const hasExistingFrom = settings.jumps[fromNum] !== undefined

                          if (isSame) {
                            setJumpErrors((prev) => ({
                              ...prev,
                              [draftId]: `"From" and "To" cannot be the same`,
                            }))
                          } else if (hasExistingFrom) {
                            setJumpErrors((prev) => ({
                              ...prev,
                              [draftId]: `Square ${fromNum} already has a jump configured`,
                            }))
                          } else if (fromConflict.conflict) {
                            setJumpErrors((prev) => ({
                              ...prev,
                              [draftId]: fromConflict.message,
                            }))
                          } else if (toConflict.conflict) {
                            setJumpErrors((prev) => ({
                              ...prev,
                              [draftId]: toConflict.message,
                            }))
                          } else if (
                            fromNum >= 1 &&
                            fromNum <= 100 &&
                            toNum >= 1 &&
                            toNum <= 100
                          ) {
                            // Save to actual jumps
                            const newJumps = { ...settings.jumps }
                            newJumps[fromNum] = toNum
                            dispatch(setJumps(newJumps))
                            // Remove from drafts and clear errors
                            setDraftJumps((prev) => {
                              const updated = { ...prev }
                              delete updated[draftId]
                              return updated
                            })
                            setJumpErrors((prev) => {
                              const updated = { ...prev }
                              delete updated[draftId]
                              return updated
                            })
                          }
                        } else if (fromNum !== null && toNum !== null && fromNum === toNum) {
                          setJumpErrors((prev) => ({
                            ...prev,
                            [draftId]: `"From" and "To" cannot be the same`,
                          }))
                        }
                      }}
                      className={`ml-2 w-20 rounded border px-2 py-1 text-sm text-black placeholder:text-slate-400 ${
                        hasError ? 'border-red-500' : 'border-slate-300'
                      }`}
                    />
                  </label>
                  <span className="text-slate-400">→</span>
                  <label className="text-sm font-medium text-slate-700">
                    To:
                    <input
                      type="number"
                      min="1"
                      max="100"
                      placeholder="1-100"
                      value={toNum ?? ''}
                      onChange={(e) => {
                        const value = e.target.value === '' ? null : Number(e.target.value)
                        const currentFrom = draft.from
                        let error: string | undefined

                        if (value !== null && value >= 1 && value <= 100) {
                          // Check if from and to are the same
                          if (currentFrom !== null && value === currentFrom) {
                            error = `"From" and "To" cannot be the same`
                          } else {
                            // Check for conflicts with existing jumps
                            const conflict = checkValueConflict(value)
                            if (conflict.conflict) {
                              error = conflict.message
                            }
                          }
                        }

                        setJumpErrors((prev) => {
                          const updated = { ...prev }
                          if (error) {
                            updated[draftId] = error
                          } else {
                            delete updated[draftId]
                          }
                          return updated
                        })

                        setDraftJumps((prev) => ({
                          ...prev,
                          [draftId]: { ...prev[draftId], to: value },
                        }))
                      }}
                      onBlur={() => {
                        if (fromNum !== null && toNum !== null) {
                          // Re-check all validations
                          const fromConflict = checkValueConflict(fromNum)
                          const toConflict = checkValueConflict(toNum)
                          const isSame = fromNum === toNum
                          const hasExistingFrom = settings.jumps[fromNum] !== undefined

                          if (isSame) {
                            setJumpErrors((prev) => ({
                              ...prev,
                              [draftId]: `"From" and "To" cannot be the same`,
                            }))
                          } else if (hasExistingFrom) {
                            setJumpErrors((prev) => ({
                              ...prev,
                              [draftId]: `Square ${fromNum} already has a jump configured`,
                            }))
                          } else if (fromConflict.conflict) {
                            setJumpErrors((prev) => ({
                              ...prev,
                              [draftId]: fromConflict.message,
                            }))
                          } else if (toConflict.conflict) {
                            setJumpErrors((prev) => ({
                              ...prev,
                              [draftId]: toConflict.message,
                            }))
                          } else if (
                            fromNum >= 1 &&
                            fromNum <= 100 &&
                            toNum >= 1 &&
                            toNum <= 100
                          ) {
                            // Save to actual jumps
                            const newJumps = { ...settings.jumps }
                            newJumps[fromNum] = toNum
                            dispatch(setJumps(newJumps))
                            // Remove from drafts and clear errors
                            setDraftJumps((prev) => {
                              const updated = { ...prev }
                              delete updated[draftId]
                              return updated
                            })
                            setJumpErrors((prev) => {
                              const updated = { ...prev }
                              delete updated[draftId]
                              return updated
                            })
                          }
                        } else if (fromNum !== null && toNum !== null && fromNum === toNum) {
                          setJumpErrors((prev) => ({
                            ...prev,
                            [draftId]: `"From" and "To" cannot be the same`,
                          }))
                        }
                      }}
                      className={`ml-2 w-20 rounded border px-2 py-1 text-sm text-black placeholder:text-slate-400 ${
                        hasError ? 'border-red-500' : 'border-slate-300'
                      }`}
                    />
                  </label>
                  {jumpErrors[draftId] && (
                    <p className="ml-2 text-xs text-red-600">{jumpErrors[draftId]}</p>
                  )}
                  {showBadge && (
                    <span
                      className={`ml-2 rounded-full px-2 py-1 text-xs font-semibold ${
                        isLadder ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {isLadder ? '🪜 Ladder' : '🐍 Snake'}
                    </span>
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setDraftJumps((prev) => {
                      const updated = { ...prev }
                      delete updated[draftId]
                      return updated
                    })
                    setJumpErrors((prev) => {
                      const updated = { ...prev }
                      delete updated[draftId]
                      return updated
                    })
                  }}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Cancel
                </Button>
              </div>
            )
          })}

          {/* Saved jumps */}
          {Object.entries(settings.jumps)
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([from, to]) => {
              const fromNum = Number(from)
              const toNum = Number(to)
              const isLadder = toNum > fromNum
              const hasError = fromNum === toNum || jumpErrors[from] !== undefined
              const showBadge = !hasError && fromNum !== toNum
              return (
                <div
                  key={from}
                  className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50/60 p-3"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <label className="text-sm font-medium text-slate-700">
                      From:
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={fromNum}
                        onChange={(e) => {
                          const newFrom = Number(e.target.value)
                          if (!isNaN(newFrom) && newFrom >= 1 && newFrom <= 100) {
                            // Always allow the change, but check for errors
                            const newJumps = { ...settings.jumps }
                            delete newJumps[fromNum]
                            const validTo = Math.max(1, Math.min(100, toNum))
                            newJumps[newFrom] = validTo
                            dispatch(setJumps(newJumps))

                            let error: string | undefined

                            // Check if from and to are the same
                            if (newFrom === validTo) {
                              error = `"From" and "To" cannot be the same`
                            } else {
                              // Check for conflicts with existing jumps (excluding current jump)
                              const fromConflict = checkValueConflict(newFrom, fromNum, toNum)
                              const toConflict = checkValueConflict(validTo, fromNum, toNum)
                              if (fromConflict.conflict) {
                                error = fromConflict.message
                              } else if (toConflict.conflict) {
                                error = toConflict.message
                              }
                            }

                            setJumpErrors((prev) => {
                              const updated = { ...prev }
                              // Clear old key error
                              delete updated[from]
                              if (error) {
                                updated[newFrom.toString()] = error
                              } else {
                                delete updated[newFrom.toString()]
                              }
                              return updated
                            })
                          }
                        }}
                        onBlur={(e) => {
                          const newFrom = Number(e.target.value)
                          if (isNaN(newFrom) || newFrom < 1 || newFrom > 100) {
                            // Reset to original value if invalid
                            e.target.value = fromNum.toString()
                            setJumpErrors((prev) => {
                              const updated = { ...prev }
                              delete updated[from]
                              return updated
                            })
                          } else {
                            let error: string | undefined

                            // Check if from and to are the same
                            if (newFrom === toNum) {
                              error = `"From" and "To" cannot be the same`
                            } else {
                              // Check for conflicts with existing jumps (excluding current jump)
                              const fromConflict = checkValueConflict(newFrom, fromNum, toNum)
                              const toConflict = checkValueConflict(toNum, fromNum, toNum)
                              if (fromConflict.conflict) {
                                error = fromConflict.message
                              } else if (toConflict.conflict) {
                                error = toConflict.message
                              }
                            }

                            setJumpErrors((prev) => {
                              const updated = { ...prev }
                              if (error) {
                                updated[from] = error
                              } else {
                                delete updated[from]
                              }
                              return updated
                            })
                          }
                        }}
                        className={`ml-2 w-20 rounded border px-2 py-1 text-sm text-black ${
                          hasError ? 'border-red-500' : 'border-slate-300'
                        }`}
                      />
                    </label>
                    <span className="text-slate-400">→</span>
                    <label className="text-sm font-medium text-slate-700">
                      To:
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={toNum}
                        onChange={(e) => {
                          const newTo = Number(e.target.value)
                          if (!isNaN(newTo) && newTo >= 1 && newTo <= 100) {
                            // Always allow the change
                            const newJumps = { ...settings.jumps }
                            newJumps[fromNum] = newTo
                            dispatch(setJumps(newJumps))

                            let error: string | undefined

                            // Check if from and to are the same
                            if (newTo === fromNum) {
                              error = `"From" and "To" cannot be the same`
                            } else {
                              // Check for conflicts with existing jumps (excluding current jump)
                              const conflict = checkValueConflict(newTo, fromNum, toNum)
                              if (conflict.conflict) {
                                error = conflict.message
                              }
                            }

                            setJumpErrors((prev) => {
                              const updated = { ...prev }
                              if (error) {
                                updated[from] = error
                              } else {
                                delete updated[from]
                              }
                              return updated
                            })
                          }
                        }}
                        onBlur={(e) => {
                          const newTo = Number(e.target.value)
                          if (isNaN(newTo) || newTo < 1 || newTo > 100) {
                            // Reset to original value if invalid
                            e.target.value = toNum.toString()
                            setJumpErrors((prev) => {
                              const updated = { ...prev }
                              delete updated[from]
                              return updated
                            })
                          } else {
                            let error: string | undefined

                            // Check if from and to are the same
                            if (newTo === fromNum) {
                              error = `"From" and "To" cannot be the same`
                            } else {
                              // Check for conflicts with existing jumps (excluding current jump)
                              const conflict = checkValueConflict(newTo, fromNum, toNum)
                              if (conflict.conflict) {
                                error = conflict.message
                              }
                            }

                            setJumpErrors((prev) => {
                              const updated = { ...prev }
                              if (error) {
                                updated[from] = error
                              } else {
                                delete updated[from]
                              }
                              return updated
                            })
                          }
                        }}
                        className={`ml-2 w-20 rounded border px-2 py-1 text-sm text-black ${
                          hasError ? 'border-red-500' : 'border-slate-300'
                        }`}
                      />
                    </label>
                    {showBadge && (
                      <span
                        className={`ml-2 rounded-full px-2 py-1 text-xs font-semibold ${
                          isLadder ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {isLadder ? '🪜 Ladder' : '🐍 Snake'}
                      </span>
                    )}
                  </div>
                  {jumpErrors[from] && (
                    <p className="ml-2 text-xs text-red-600">{jumpErrors[from]}</p>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      const newJumps = { ...settings.jumps }
                      delete newJumps[fromNum]
                      dispatch(setJumps(newJumps))
                      setSnackbar({
                        isOpen: true,
                        message: `Jump from ${fromNum} to ${toNum} removed successfully`,
                        type: 'success',
                      })
                    }}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Remove
                  </Button>
                </div>
              )
            })}
          {Object.keys(settings.jumps).length === 0 && Object.keys(draftJumps).length === 0 && (
            <div className="rounded-lg border-2 border-dashed border-slate-300 bg-slate-50/40 p-8 text-center">
              <p className="text-sm text-slate-500">
                No jumps configured. Click "Add Jump" to get started.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-3 sm:gap-4 md:grid-cols-3">
        <label className="flex flex-col rounded-xl border border-slate-200 p-4">
          <span className="text-sm font-semibold text-black">Starting player</span>
          <select
            className="mt-2 rounded border border-slate-300 px-3 py-2 pr-8 text-black"
            value={settings.startingPlayer}
            onChange={(event) => dispatch(setStartingPlayer(Number(event.target.value)))}
          >
            {settings.playerConfigs.map((player, index) => (
              <option key={player.id} value={index} className="text-black">
                {player.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center justify-between rounded-xl border border-slate-200 p-4 text-sm font-semibold text-black">
          Animations
          <input
            type="checkbox"
            checked={settings.animationsEnabled}
            onChange={() => dispatch(toggleAnimations())}
          />
        </label>

        <label className="flex items-center justify-between rounded-xl border border-slate-200 p-4 text-sm font-semibold text-black">
          Sound
          <input
            type="checkbox"
            checked={settings.soundEnabled}
            onChange={() => dispatch(toggleSound())}
          />
        </label>
      </section>

      <div className="flex flex-col gap-3">
        {(Object.keys(jumpErrors).length > 0 ||
          Object.entries(settings.jumps).some(([from, to]) => Number(from) === Number(to)) ||
          Object.values(draftJumps).some(
            (draft) => draft.from !== null && draft.to !== null && draft.from === draft.to,
          )) && (
          <div className="rounded-lg border-2 border-red-300 bg-red-50 p-3">
            <p className="text-sm font-semibold text-red-800">
              ⚠️ Please fix the following errors before applying:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-red-700">
              {Object.entries(settings.jumps).some(([from, to]) => Number(from) === Number(to)) && (
                <li>Some jumps have "From" and "To" set to the same value</li>
              )}
              {Object.values(draftJumps).some(
                (draft) => draft.from !== null && draft.to !== null && draft.from === draft.to,
              ) && <li>Some draft jumps have "From" and "To" set to the same value</li>}
              {Object.entries(jumpErrors).map(([key, error]) => (
                <li key={key}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="flex flex-wrap gap-3">
          <Button type="submit">Apply to game</Button>
          <Button type="button" variant="secondary" onClick={() => dispatch(resetSettings())}>
            Reset settings
          </Button>
        </div>
      </div>
      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        isOpen={snackbar.isOpen}
        onClose={() => setSnackbar((prev) => ({ ...prev, isOpen: false }))}
      />
    </form>
  )
}
