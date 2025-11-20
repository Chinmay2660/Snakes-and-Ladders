import clsx from 'clsx'
import { memo } from 'react'

import { Button } from './Button'

interface DiceProps {
  value: number | null
  disabled?: boolean
  rolling?: boolean
  onRoll: () => void
}

export const Dice = memo(({ value, disabled = false, rolling = false, onRoll }: DiceProps) => (
  <div className="flex flex-col items-center gap-2 sm:gap-3">
    <div
      role="img"
      aria-label={`Dice result ${value ?? 'not rolled'}`}
      tabIndex={0}
      onKeyDown={(event) => {
        if ((event.key === 'Enter' || event.key === ' ') && !disabled) {
          event.preventDefault()
          onRoll()
        }
      }}
      className={clsx(
        'flex h-16 w-16 items-center justify-center rounded-xl border-2 border-slate-900 bg-white text-2xl font-bold text-slate-900 transition sm:h-20 sm:w-20 sm:rounded-2xl sm:border-4 sm:text-3xl',
        rolling && 'animate-pulse',
      )}
    >
      {value ?? '—'}
    </div>
    <Button onClick={onRoll} disabled={disabled} aria-label="Roll dice (Space or Enter)">
      Roll Dice
    </Button>
  </div>
))

Dice.displayName = 'Dice'
