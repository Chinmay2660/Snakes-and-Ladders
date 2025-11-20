import { useCallback, useEffect, useRef } from 'react'

import { rollAndMove } from '../features/game/gameSlice'
import { selectGameCanRoll, selectJumps } from '../features/game/gameSelectors'
import { useAnimationQueue } from './useAnimationQueue'
import { useAppDispatch, useAppSelector } from './useRedux'
import { playSound } from '../utils/sounds'

export const useDice = () => {
  const dispatch = useAppDispatch()
  const canRoll = useAppSelector(selectGameCanRoll)
  const soundEnabled = useAppSelector((state) => state.settings.soundEnabled)
  const jumps = useAppSelector(selectJumps)
  const gameState = useAppSelector((state) => state.game)
  const { enqueue, isAnimating } = useAnimationQueue()
  const prevHistoryLength = useRef(gameState.history.length)
  const prevStatus = useRef(gameState.status)

  useEffect(() => {
    if (!soundEnabled) return

    const historyChanged = gameState.history.length > prevHistoryLength.current
    const statusChanged = gameState.status !== prevStatus.current

    if (historyChanged && gameState.history.length > 0) {
      const lastMove = gameState.history[gameState.history.length - 1]
      if (lastMove && lastMove.from && lastMove.to) {
        const jumpTarget = jumps?.[lastMove.from]
        if (jumpTarget && jumpTarget === lastMove.to) {
          const isLadder = lastMove.to > lastMove.from
          playSound(isLadder ? 'ladder' : 'snake')
        }
      }
    }

    if (statusChanged && gameState.status === 'complete' && gameState.winnerId) {
      playSound('win')
    }

    prevHistoryLength.current = gameState.history.length
    prevStatus.current = gameState.status
  }, [gameState.history, gameState.status, gameState.winnerId, jumps, soundEnabled])

  const roll = useCallback(() => {
    if (!canRoll || isAnimating) return
    enqueue(async () => {
      if (soundEnabled) {
        playSound('dice')
      }
      await dispatch(rollAndMove())
    })
  }, [canRoll, dispatch, enqueue, isAnimating, soundEnabled])

  return { roll, canRoll: canRoll && !isAnimating, isAnimating }
}
