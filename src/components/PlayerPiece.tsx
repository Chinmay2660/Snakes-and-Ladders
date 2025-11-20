import clsx from 'clsx'
import { memo } from 'react'

import type { PlayerConfig } from '../features/game/gameTypes'
import { squareToCoords } from '../utils/boardHelpers'

interface PlayerPieceProps {
  player: PlayerConfig
  position: number
  isActive: boolean
  animate?: boolean
}

export const PlayerPiece = memo(
  ({ player, position, isActive, animate = true }: PlayerPieceProps) => {
    const coords = squareToCoords(position)
    const label = `${player.name} at square ${position}`

    return (
      <span
        role="img"
        aria-label={label}
        className={clsx(
          'absolute flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold text-white shadow-lg sm:h-7 sm:w-7 sm:text-xs',
          animate && 'transition-all duration-300',
          isActive && 'ring-2 ring-white ring-offset-1 ring-offset-black sm:ring-offset-2',
        )}
        style={{
          left: `${coords.leftPercent}%`,
          top: `${coords.topPercent}%`,
          backgroundColor: player.color,
        }}
      >
        {player.name?.at(0) ?? '?'}
      </span>
    )
  },
)

PlayerPiece.displayName = 'PlayerPiece'
