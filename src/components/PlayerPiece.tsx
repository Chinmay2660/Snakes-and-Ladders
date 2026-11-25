import clsx from 'clsx'
import { memo } from 'react'

import type { PlayerConfig } from '../features/game/gameTypes'
import { squareToCoords } from '../utils/boardHelpers'

interface PlayerPieceProps {
  player: PlayerConfig
  position: number
  isActive: boolean
  animate?: boolean
  offset?: { x: number; y: number }
}

/** A classic board-game pawn; its base sits on the square's centre. */
export const PlayerPiece = memo(
  ({ player, position, isActive, animate = true, offset }: PlayerPieceProps) => {
    const coords = squareToCoords(position)
    const label = `${player.name} at square ${position}`

    return (
      <span
        role="img"
        aria-label={label}
        className={clsx(
          'absolute z-30 h-7 w-5 -translate-x-1/2 -translate-y-[82%] sm:h-10 sm:w-7',
          animate && 'transition-all duration-300',
        )}
        style={{
          left: `${coords.leftPercent + (offset?.x ?? 0)}%`,
          top: `${coords.topPercent + (offset?.y ?? 0)}%`,
        }}
      >
        <svg
          viewBox="0 0 24 32"
          className={clsx(
            'h-full w-full overflow-visible',
            isActive && animate && 'animate-bounce',
          )}
          style={{
            filter: isActive
              ? 'drop-shadow(0 0 3px #fff) drop-shadow(0 2px 2px rgba(0,0,0,.6))'
              : 'drop-shadow(0 2px 1.5px rgba(0,0,0,.55))',
          }}
          aria-hidden="true"
        >
          <ellipse
            cx="12"
            cy="28"
            rx="10.5"
            ry="3.6"
            fill={player.color}
            stroke="#fff"
            strokeWidth="1.2"
          />
          <path
            d="M6.5 27 C7.5 20 9 16.5 10.2 14.2 H13.8 C15 16.5 16.5 20 17.5 27 Z"
            fill={player.color}
            stroke="#fff"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="9" r="6" fill={player.color} stroke="#fff" strokeWidth="1.2" />
          <ellipse cx="10" cy="7" rx="2.2" ry="1.6" fill="#fff" opacity="0.55" />
          <path
            d="M9 24 C10 20 10.6 18 11 16"
            stroke="#fff"
            strokeWidth="1.2"
            opacity="0.35"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </span>
    )
  },
)

PlayerPiece.displayName = 'PlayerPiece'
