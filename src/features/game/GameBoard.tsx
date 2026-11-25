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

  const jumpIndicators = useMemo(
    () =>
      Object.entries(jumps ?? {})
        .map(([from, to]) => ({ from: Number(from), to: Number(to) }))
        .filter(({ from, to }) => from >= 1 && from <= 100 && to >= 1 && to <= 100 && from !== to)
        .map(({ from, to }) => ({
          from,
          to,
          type: to > from ? ('ladder' as const) : ('snake' as const),
        })),
    [jumps],
  )

  // Fan out pieces that share a square so none is hidden.
  const offsets = useMemo(() => {
    const bySquare: Record<number, string[]> = {}
    players.forEach((player) => {
      const square = positions[player.id] ?? 1
      ;(bySquare[square] ??= []).push(player.id)
    })
    const result: Record<string, { x: number; y: number }> = {}
    Object.values(bySquare).forEach((ids) => {
      ids.forEach((id, i) => {
        if (ids.length === 1) {
          result[id] = { x: 0, y: 0 }
          return
        }
        const angle = (i / ids.length) * Math.PI * 2
        result[id] = { x: Math.cos(angle) * 2.2, y: Math.sin(angle) * 2.2 }
      })
    })
    return result
  }, [players, positions])

  return (
    <Board>
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="false">
        {jumpIndicators.map((jump) => (
          <JumpIndicator key={`${jump.from}-${jump.to}`} {...jump} />
        ))}
      </svg>
      {players.map((player) => (
        <PlayerPiece
          key={player.id}
          player={player}
          position={positions[player.id] ?? 1}
          offset={offsets[player.id]}
          isActive={player.id === currentPlayer?.id}
          animate={animationsEnabled}
        />
      ))}
    </Board>
  )
})

GameBoard.displayName = 'GameBoard'
