import clsx from 'clsx'
import { memo, useRef, useState } from 'react'

interface JellySliderProps {
  value: number
  min?: number
  max?: number
  onChange: (value: number) => void
  className?: string
}

export const JellySlider = memo(
  ({ value, min = 1, max = 5, onChange, className }: JellySliderProps) => {
    const sliderRef = useRef<HTMLInputElement>(null)
    const [isDragging, setIsDragging] = useState(false)
    const range = max - min
    const percentage = ((value - min) / range) * 100

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(event.target.value)
      onChange(newValue)
    }

    const handleMouseDown = () => setIsDragging(true)
    const handleMouseUp = () => setIsDragging(false)

    return (
      <div className={clsx('relative w-full', className)}>
        {/* 3D Track - Deep groove with realistic shadows */}
        <div
          className="relative h-10 rounded-full"
          style={{
            background: 'linear-gradient(to bottom, #cbd5e1, #94a3b8)',
            boxShadow:
              'inset 0 2px 6px rgba(0, 0, 0, 0.3), inset 0 1px 2px rgba(0, 0, 0, 0.2), 0 2px 8px rgba(0, 0, 0, 0.15)',
          }}
        >
          {/* Jelly liquid fill - 3D translucent effect */}
          <div
            className="relative h-full overflow-hidden rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${percentage}%`,
            }}
          >
            {/* Base liquid layer - translucent orange/amber */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'linear-gradient(to right, rgba(251, 191, 36, 0.85), rgba(249, 115, 22, 0.9), rgba(245, 158, 11, 0.85))',
              }}
            />
            {/* Inner glow for liquid effect */}
            <div
              className="absolute inset-0 rounded-full blur-sm"
              style={{
                background: 'radial-gradient(circle, rgba(251, 146, 60, 0.6) 0%, transparent 70%)',
              }}
            />
            {/* Top highlight for 3D shine */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.2) 30%, transparent 70%)',
              }}
            />
            {/* Bottom shadow for depth */}
            <div
              className="absolute bottom-0 left-0 right-0 h-1/2 rounded-b-full"
              style={{
                background: 'linear-gradient(to bottom, transparent, rgba(180, 83, 9, 0.4))',
              }}
            />
            {/* Liquid surface ripples */}
            <div
              className="absolute inset-0 rounded-full opacity-40"
              style={{
                background:
                  'radial-gradient(ellipse at 30% 20%, rgba(255, 255, 255, 0.3) 0%, transparent 50%), radial-gradient(ellipse at 70% 60%, rgba(255, 255, 255, 0.2) 0%, transparent 50%)',
              }}
            />
          </div>

          {/* 3D Peel/Unrolling effect at the edge */}
          <div
            className="absolute top-0 h-full transition-all duration-500 ease-out"
            style={{
              left: `${Math.max(0, percentage - 1.5)}%`,
              width: '24px',
            }}
          >
            <div className="relative h-full w-full">
              {/* Peel shadow - creates depth */}
              <div
                className="absolute left-0 top-0 h-full w-3 rounded-l-full"
                style={{
                  background: 'linear-gradient(to right, rgba(100, 116, 139, 0.7), transparent)',
                  boxShadow: 'inset -1px 0 2px rgba(0, 0, 0, 0.3)',
                }}
              />
              {/* Peel highlight - top shine */}
              <div
                className="absolute left-0 top-0 h-full w-3 rounded-l-full"
                style={{
                  background: 'linear-gradient(to bottom right, rgba(255, 255, 255, 0.5), rgba(226, 232, 240, 0.3), transparent)',
                }}
              />
              {/* Peel edge - darker inside showing depth */}
              <div
                className="absolute left-0 top-1/2 h-1/2 w-3 -translate-y-1/2 rounded-l-full"
                style={{
                  background: 'linear-gradient(to right, rgba(146, 64, 14, 0.9), rgba(180, 83, 9, 0.7))',
                  boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.4)',
                }}
              />
            </div>
          </div>

          {/* Current value displayed in the unfilled area (right side) */}
          <div
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10"
            style={{
              display: percentage < 95 ? 'block' : 'none',
            }}
          >
            <span className="text-sm font-semibold text-slate-600 drop-shadow-sm">{value}</span>
          </div>

          {/* Current value displayed in the filled area (left side) when mostly filled */}
          <div
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10"
            style={{
              display: percentage >= 95 ? 'block' : 'none',
            }}
          >
            <span className="text-sm font-semibold text-white drop-shadow-md">{value}</span>
          </div>
        </div>

        {/* Hidden range input for dragging */}
        <input
          ref={sliderRef}
          type="range"
          min={min}
          max={max}
          step={1}
          value={value}
          onChange={handleChange}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          aria-label="Player count slider"
        />
      </div>
    )
  },
)

JellySlider.displayName = 'JellySlider'
