import { memo } from 'react'

import { squareToCoords } from '../utils/boardHelpers'

interface JumpIndicatorProps {
  from: number
  to: number
  type: 'ladder' | 'snake'
}

export const JumpIndicator = memo(({ from, to, type }: JumpIndicatorProps) => {
  const fromCoords = squareToCoords(from)
  const toCoords = squareToCoords(to)
  const isLadder = type === 'ladder'

  // Ladders = GREEN, Snakes = BROWN
  // Make lines thicker and more visible
  const height = 10

  // Ensure coordinates are valid
  const fromX = Math.max(0, Math.min(100, fromCoords.leftPercent))
  const fromY = Math.max(0, Math.min(100, fromCoords.topPercent))
  const toX = Math.max(0, Math.min(100, toCoords.leftPercent))
  const toY = Math.max(0, Math.min(100, toCoords.topPercent))

  const finalDx = toX - fromX
  const finalDy = toY - fromY
  const finalDistance = Math.sqrt(finalDx * finalDx + finalDy * finalDy)
  const finalAngle = Math.atan2(finalDy, finalDx) * (180 / Math.PI)

  return (
    <div
      className="pointer-events-none absolute z-20"
      style={{
        left: `${fromX}%`,
        top: `${fromY}%`,
        transform: `translate(0, -50%) rotate(${finalAngle}deg)`,
        transformOrigin: '0% 50%',
        width: `${Math.max(finalDistance, 2)}%`,
        height: `${height}px`,
      }}
    >
      {isLadder ? (
        // LADDER = GREEN
        <svg
          viewBox="0 0 100 10"
          preserveAspectRatio="none"
          className="h-full w-full"
          aria-label={`Ladder from ${from} to ${to}`}
        >
          <rect x="0" y="0" width="100" height="10" fill="#16a34a" opacity="1" />
          <rect x="0" y="0" width="5" height="10" fill="#15803d" />
          <rect x="95" y="0" width="5" height="10" fill="#15803d" />
          {Array.from({ length: Math.max(6, Math.floor(finalDistance / 15)) }).map((_, i) => {
            const numRungs = Math.max(6, Math.floor(finalDistance / 15))
            return (
              <rect
                key={i}
                x={((i + 1) * 100) / (numRungs + 1)}
                y="0"
                width="2"
                height="10"
                fill="#15803d"
              />
            )
          })}
        </svg>
      ) : (
        // SNAKE = BROWN
        <svg
          viewBox="0 0 100 10"
          preserveAspectRatio="none"
          className="h-full w-full"
          aria-label={`Snake from ${from} to ${to}`}
        >
          <path
            d="M 0 5 Q 25 2.5, 50 5 T 100 5"
            stroke="#8B4513"
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            opacity="1"
          />
          <circle cx="0" cy="5" r="6" fill="#8B4513" />
          <circle cx="0" cy="5" r="3" fill="#fff" />
          <circle cx="100" cy="5" r="6" fill="#8B4513" />
        </svg>
      )}
    </div>
  )
})

JumpIndicator.displayName = 'JumpIndicator'
