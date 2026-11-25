import { useEffect } from 'react'

import { Button } from '../../components/Button'
import { Dice } from '../../components/Dice'
import { useDice } from '../../hooks/useDice'
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux'
import { newGame, saveGame } from './gameSlice'
import { selectCurrentPlayer, selectDiceValue, selectGameStatus } from './gameSelectors'

export const GameControls = () => {
  const dispatch = useAppDispatch()
  const { roll, canRoll, isAnimating } = useDice()
  const diceValue = useAppSelector(selectDiceValue)
  const status = useAppSelector(selectGameStatus)
  const currentPlayer = useAppSelector(selectCurrentPlayer)
  const historyLength = useAppSelector((state) => state.game.history.length)
  const lastSavedAt = useAppSelector((state) => state.game.lastSavedAt)
  const playerConfigs = useAppSelector((state) => state.settings.playerConfigs)
  const startingPlayer = useAppSelector((state) => state.settings.startingPlayer)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!canRoll || event.defaultPrevented) return
      if (event.code === 'Space' || event.key === 'Enter') {
        const tagName = (event.target as HTMLElement | null)?.tagName
        if (
          tagName === 'INPUT' ||
          tagName === 'TEXTAREA' ||
          tagName === 'SELECT' ||
          tagName === 'BUTTON' ||
          tagName === 'A'
        ) {
          return
        }
        event.preventDefault()
        roll()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [canRoll, roll])

  // Auto-save after every move (and when the game finishes).
  useEffect(() => {
    if (historyLength === 0 || status === 'rolling') return
    dispatch(saveGame())
  }, [dispatch, historyLength, status])

  const busy = status === 'rolling' || status === 'animating' || isAnimating

  return (
    <div className="themed-card flex w-full flex-col gap-3 rounded-xl border border-slate-200 bg-white/90 p-3 text-slate-900 shadow-lg backdrop-blur sm:rounded-2xl sm:p-4">
      <div className="flex items-center justify-between gap-3 lg:flex-col lg:items-stretch">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Current player</p>
          <p className="flex items-center gap-2 text-base font-semibold">
            <span
              className="inline-block h-3 w-3 rounded-full"
              style={{ backgroundColor: currentPlayer?.color }}
              aria-hidden="true"
            />
            {currentPlayer?.name ?? '—'}
          </p>
        </div>
        <Dice value={diceValue} rolling={busy} disabled={!canRoll} onRoll={roll} />
      </div>

      <Button
        variant="secondary"
        className="w-full py-2 text-sm"
        disabled={busy}
        onClick={() => dispatch(newGame({ players: playerConfigs, startingIndex: startingPlayer }))}
      >
        New game
      </Button>
      <p className="text-xs text-slate-500">
        Press Space or Enter to roll.
        {lastSavedAt && ` Auto-saved ${new Date(lastSavedAt).toLocaleTimeString()}.`}
      </p>
    </div>
  )
}
