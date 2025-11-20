import { ChangeEvent, useEffect, useRef, useState } from 'react'

import { Button } from '../../components/Button'
import { Dice } from '../../components/Dice'
import { useDice } from '../../hooks/useDice'
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { safeParseJson } from '../../utils/validation'
import { importGameState, loadGame, resetGame, saveGame } from './gameSlice'
import { selectCurrentPlayer, selectDiceValue, selectGameStatus } from './gameSelectors'

export const GameControls = () => {
  const dispatch = useAppDispatch()
  const { roll, canRoll, isAnimating } = useDice()
  const diceValue = useAppSelector(selectDiceValue)
  const status = useAppSelector(selectGameStatus)
  const currentPlayer = useAppSelector(selectCurrentPlayer)
  const gameSnapshot = useAppSelector((state) => state.game)
  const settingsSnapshot = useAppSelector((state) => state.settings)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string>()
  const [autoSave, setAutoSave] = useLocalStorage('snl-auto-save', true)

  const handleImport = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = safeParseJson<Parameters<typeof importGameState>[0]['payload']>(
          String(reader.result),
        )
        if (!parsed) {
          throw new Error('Invalid JSON')
        }
        dispatch(importGameState(parsed))
        setError(undefined)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to import game')
      }
    }
    reader.readAsText(file)
  }

  const exportState = () => {
    const payload = JSON.stringify(
      {
        game: gameSnapshot,
        settings: settingsSnapshot,
      },
      null,
      2,
    )
    const blob = new Blob([payload], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'snakes-and-ladders.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!canRoll) return
      if (event.code === 'Space' || event.key === 'Enter') {
        const tagName = (event.target as HTMLElement | null)?.tagName
        if (tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT') {
          return
        }
        event.preventDefault()
        roll()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [canRoll, roll])

  useEffect(() => {
    if (!autoSave) return
    if (gameSnapshot.history.length === 0) return
    dispatch(saveGame())
  }, [autoSave, dispatch, gameSnapshot.history.length])

  const diceRolling = status === 'rolling' || status === 'animating' || isAnimating

  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white/90 p-3 shadow-lg backdrop-blur sm:rounded-2xl sm:p-4">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="text-center sm:text-left">
          <p className="text-xs uppercase tracking-wide text-slate-500">Current player</p>
          <p className="text-base font-semibold text-slate-900 sm:text-lg">
            {currentPlayer?.name ?? '—'}
          </p>
        </div>
        <Dice value={diceValue} rolling={diceRolling} disabled={!canRoll} onRoll={roll} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-6 sm:grid-cols-3 sm:gap-3">
        <Button
          variant="secondary"
          onClick={() =>
            dispatch(
              resetGame({
                players: settingsSnapshot.playerConfigs,
                startingIndex: settingsSnapshot.startingPlayer,
              }),
            )
          }
        >
          Reset game
        </Button>
        <Button variant="primary" onClick={() => dispatch(saveGame())}>
          Save game
        </Button>
        <Button variant="secondary" onClick={() => dispatch(loadGame())}>
          Load saved game
        </Button>
        <Button variant="ghost" onClick={exportState}>
          Export JSON
        </Button>
        <Button variant="ghost" onClick={() => fileInputRef.current?.click()}>
          Import JSON
        </Button>
      </div>
      <label className="mt-4 flex items-center gap-2 text-sm text-slate-600">
        <input
          type="checkbox"
          checked={autoSave}
          onChange={(event) => setAutoSave(event.target.checked)}
        />
        Auto-save after each move
      </label>
      {gameSnapshot.lastSavedAt && (
        <p className="mt-2 text-xs text-slate-500">
          Last saved {new Date(gameSnapshot.lastSavedAt).toLocaleString()}
        </p>
      )}
      {error && (
        <p className="mt-3 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        className="sr-only"
        onChange={handleImport}
        aria-label="Import game state"
      />
    </div>
  )
}
