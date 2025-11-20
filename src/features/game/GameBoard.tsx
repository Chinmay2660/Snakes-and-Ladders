import { memo, useMemo } from 'react'

import { Board } from '../../components/Board'
import { JumpIndicator } from '../../components/JumpIndicator'
import { PlayerPiece } from '../../components/PlayerPiece'
import { useAppSelector } from '../../hooks/useRedux'
import { selectCurrentPlayer, selectJumps, selectPlayers, selectPositions } from './gameSelectors'

export const GameBoard = memo(() => {
  const players = useAppSelector(selectPlayers)
  const positions = useAppSelector(selectPositions)
  const currentPlayer = useAppSelector(selectCurrentPlayer)
  const jumps = useAppSelector(selectJumps)
  const animationsEnabled = useAppSelector((state) => state.settings.animationsEnabled)

  const jumpIndicators = useMemo(() => {
    if (!jumps || Object.keys(jumps).length === 0) {
      return []
    }

    const indicators = Object.entries(jumps)
      .filter(([from, to]) => {
        const fromNum = Number(from)
        const toNum = Number(to)
        return (
          !isNaN(fromNum) &&
          !isNaN(toNum) &&
          fromNum >= 1 &&
          fromNum <= 100 &&
          toNum >= 1 &&
          toNum <= 100 &&
          fromNum !== toNum
        )
      })
      .map(([from, to]) => {
        const fromNum = Number(from)
        const toNum = Number(to)
        return {
          from: fromNum,
          to: toNum,
          type: toNum > fromNum ? ('ladder' as const) : ('snake' as const),
        }
      })
    return indicators
  }, [jumps])

  return (
    <Board>
      {jumpIndicators.map((jump, index) => (
        <JumpIndicator key={`${jump.from}-${jump.to}-${index}`} {...jump} />
      ))}
      {players.map((player) => (
        <PlayerPiece
          key={player.id}
          player={player}
          position={positions[player.id] ?? 1}
          isActive={player.id === currentPlayer?.id}
          animate={animationsEnabled}
        />
      ))}
    </Board>
  )
})

GameBoard.displayName = 'GameBoard'
