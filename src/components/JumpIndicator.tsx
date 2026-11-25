import { memo } from 'react'

import { squareToCoords } from '../utils/boardHelpers'

interface JumpIndicatorProps {
  from: number
  to: number
  type: 'ladder' | 'snake'
}

// [body, stripe, outline]
const SNAKE_PALETTES = [
  ['#16a34a', '#bbf7d0', '#14532d'],
  ['#dc2626', '#fecaca', '#7f1d1d'],
  ['#7c3aed', '#ddd6fe', '#4c1d95'],
  ['#ea580c', '#fed7aa', '#7c2d12'],
  ['#0891b2', '#a5f3fc', '#164e63'],
]

const f = (n: number) => n.toFixed(2)

/**
 * Renders inside a 0-100 viewBox <svg> that covers the board.
 * Ladders: wooden rails with rungs. Snakes: tapered, patterned body with head, eyes and tongue.
 */
export const JumpIndicator = memo(({ from, to, type }: JumpIndicatorProps) => {
  const a = squareToCoords(from)
  const b = squareToCoords(to)
  const x1 = a.leftPercent
  const y1 = a.topPercent
  const x2 = b.leftPercent
  const y2 = b.topPercent
  const dx = x2 - x1
  const dy = y2 - y1
  const length = Math.hypot(dx, dy) || 1
  const ux = dx / length
  const uy = dy / length
  const nx = -uy
  const ny = ux

  if (type === 'ladder') {
    const offset = 1.3
    const rungCount = Math.max(2, Math.round(length / 4))
    return (
      <g aria-label={`Ladder from ${from} to ${to}`}>
        {[-offset, offset].map((side) => (
          <line
            key={`s${side}`}
            x1={x1 + nx * side + 0.4}
            y1={y1 + ny * side + 0.5}
            x2={x2 + nx * side + 0.4}
            y2={y2 + ny * side + 0.5}
            stroke="#000"
            strokeOpacity={0.25}
            strokeWidth={1}
            strokeLinecap="round"
          />
        ))}
        {Array.from({ length: rungCount }).map((_, i) => {
          const t = (i + 0.5) / rungCount
          const cx = x1 + dx * t
          const cy = y1 + dy * t
          return (
            <line
              key={i}
              x1={cx - nx * offset}
              y1={cy - ny * offset}
              x2={cx + nx * offset}
              y2={cy + ny * offset}
              stroke="#92400e"
              strokeWidth={0.6}
              strokeLinecap="round"
            />
          )
        })}
        {[-offset, offset].map((side) => (
          <g key={side}>
            <line
              x1={x1 + nx * side}
              y1={y1 + ny * side}
              x2={x2 + nx * side}
              y2={y2 + ny * side}
              stroke="#78350f"
              strokeWidth={1}
              strokeLinecap="round"
            />
            <line
              x1={x1 + nx * side}
              y1={y1 + ny * side}
              x2={x2 + nx * side}
              y2={y2 + ny * side}
              stroke="#d97706"
              strokeWidth={0.55}
              strokeLinecap="round"
            />
          </g>
        ))}
      </g>
    )
  }

  // Snake: head at `from` (higher square), tail at `to`.
  const [body, stripe, outline] = SNAKE_PALETTES[(from + to) % SNAKE_PALETTES.length]
  const waves = Math.max(1.5, length / 14)
  const points = 48
  const center: { x: number; y: number; w: number }[] = []
  for (let i = 0; i <= points; i++) {
    const t = i / points
    const sway = Math.sin(t * waves * Math.PI * 2) * 2.4 * Math.sin(Math.PI * Math.min(1, t * 1.15))
    center.push({
      x: x1 + dx * t + nx * sway,
      y: y1 + dy * t + ny * sway,
      w: 1.55 * (1 - t) + 0.25 * t,
    })
  }
  const left: string[] = []
  const right: string[] = []
  center.forEach((p, i) => {
    const prev = center[Math.max(0, i - 1)]
    const next = center[Math.min(points, i + 1)]
    const tx = next.x - prev.x
    const ty = next.y - prev.y
    const tl = Math.hypot(tx, ty) || 1
    const px = -ty / tl
    const py = tx / tl
    left.push(`${f(p.x + px * p.w)} ${f(p.y + py * p.w)}`)
    right.unshift(`${f(p.x - px * p.w)} ${f(p.y - py * p.w)}`)
  })
  const shape = `M ${left.join(' L ')} L ${right.join(' L ')} Z`
  const spine = `M ${center.map((p) => `${f(p.x)} ${f(p.y)}`).join(' L ')}`

  const head = center[0]
  const second = center[3]
  const hl = Math.hypot(head.x - second.x, head.y - second.y) || 1
  const hux = (head.x - second.x) / hl
  const huy = (head.y - second.y) / hl
  const angle = (Math.atan2(huy, hux) * 180) / Math.PI
  const hnx = -huy
  const hny = hux
  const at = (along: number, across = 0) =>
    `${f(head.x + hux * along + hnx * across)} ${f(head.y + huy * along + hny * across)}`

  return (
    <g aria-label={`Snake from ${from} to ${to}`}>
      <path d={shape} fill="#000" fillOpacity={0.22} transform="translate(0.4 0.5)" />
      <path d={shape} fill={body} stroke={outline} strokeWidth={0.35} strokeLinejoin="round" />
      <path
        d={spine}
        fill="none"
        stroke={stripe}
        strokeWidth={0.7}
        strokeDasharray="0.9 1.6"
        strokeOpacity={0.85}
      />
      <path
        d={`M ${at(1.6)} L ${at(3.1)} M ${at(2.6)} L ${at(3.4, 0.7)} M ${at(2.6)} L ${at(3.4, -0.7)}`}
        stroke="#e11d48"
        strokeWidth={0.3}
        strokeLinecap="round"
        fill="none"
      />
      <ellipse
        cx={head.x}
        cy={head.y}
        rx={2.1}
        ry={1.7}
        fill={body}
        stroke={outline}
        strokeWidth={0.35}
        transform={`rotate(${f(angle)} ${f(head.x)} ${f(head.y)})`}
      />
      {[1, -1].map((s) => {
        const [ex, ey] = at(0.6, 0.9 * s).split(' ')
        const [px, py] = at(0.75, 0.9 * s).split(' ')
        return (
          <g key={s}>
            <circle cx={ex} cy={ey} r={0.55} fill="#fff" />
            <circle cx={px} cy={py} r={0.25} fill="#111" />
          </g>
        )
      })}
    </g>
  )
})

JumpIndicator.displayName = 'JumpIndicator'
