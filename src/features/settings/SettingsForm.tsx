import { useEffect, useMemo, useState } from 'react'
import type { FormEvent, KeyboardEvent, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'

import { Button } from '../../components/Button'
import { GameLoader } from '../../components/GameLoader'
import { Snackbar } from '../../components/Snackbar'
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux'
import { BOARD_SIZE } from '../../utils/boardHelpers'
import { isValidPlayerName } from '../../utils/validation'
import { newGame } from '../game/gameSlice'
import { DEFAULT_JUMPS } from './settingsDefaults'
import {
  resetSettings,
  setJumps,
  setPlayerColor,
  setPlayerCount,
  setPlayerName,
  setStartingPlayer,
  toggleAnimations,
  toggleSound,
} from './settingsSlice'

type Jumps = Record<number, number>

/** Returns an error message, or undefined when the jump is valid. */
type JumpType = 'ladder' | 'snake'

const validateJump = (
  from: number,
  to: number,
  type: JumpType,
  jumps: Jumps,
  ignoreFrom?: number,
) => {
  const inRange = (n: number) => Number.isInteger(n) && n >= 1 && n <= BOARD_SIZE
  if (!inRange(from) || !inRange(to)) return `Use whole numbers from 1 to ${BOARD_SIZE}`
  if (from === to) return 'Start and end squares must be different'
  if (type === 'ladder' && from > to)
    return 'A ladder must go up: the start square must be lower than the end square'
  if (type === 'snake' && from < to)
    return 'A snake must go down: the head (start) square must be higher than the tail (end) square'
  if (from === BOARD_SIZE) return `Square ${BOARD_SIZE} is the finish — nothing can start there`
  for (const [f, t] of Object.entries(jumps)) {
    if (Number(f) === ignoreFrom) continue
    if ([Number(f), Number(t)].some((square) => square === from || square === to)) {
      return `Square already used by the jump ${f} → ${t}`
    }
  }
  return undefined
}

const Card = ({
  title,
  description,
  action,
  children,
}: {
  title: string
  description?: string
  action?: ReactNode
  children: ReactNode
}) => (
  <section className="themed-card rounded-xl border border-slate-200 bg-white/90 p-4 shadow-lg sm:rounded-2xl sm:p-5">
    <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
      <div>
        <h2 className="text-base font-semibold text-slate-900 sm:text-lg">{title}</h2>
        {description && <p className="mt-0.5 text-sm text-slate-600">{description}</p>}
      </div>
      {action}
    </div>
    {children}
  </section>
)

const Switch = ({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string
  hint: string
  checked: boolean
  onChange: () => void
}) => (
  <div className="flex items-center justify-between gap-4">
    <div>
      <p className="text-sm font-semibold text-slate-900">{label}</p>
      <p className="text-xs text-slate-600">{hint}</p>
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={clsx(
        'relative h-6 w-11 flex-none rounded-full transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500',
        checked ? '!bg-sky-600' : '!bg-slate-300',
      )}
    >
      <span
        className={clsx(
          'absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
          checked && 'translate-x-5',
        )}
      />
    </button>
  </div>
)

const JumpBadge = ({ from, to }: { from: number; to: number }) => (
  <span
    className={clsx(
      'rounded-full px-2 py-0.5 text-xs font-semibold',
      to > from ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-700',
    )}
  >
    {to > from ? '🪜 Ladder' : '🐍 Snake'}
  </span>
)

interface JumpRowProps {
  from: number
  to: number
  jumps: Jumps
  onChange: (next: Jumps) => void
  onError: (message: string) => void
}

const JumpRow = ({ from, to, jumps, onChange, onError }: JumpRowProps) => {
  const [draftFrom, setDraftFrom] = useState(String(from))
  const [draftTo, setDraftTo] = useState(String(to))

  // Commit on blur/Enter so half-typed numbers never create stray jumps.
  const commit = () => {
    const nextFrom = Number(draftFrom)
    const nextTo = Number(draftTo)
    if (nextFrom === from && nextTo === to) return
    const error = validateJump(nextFrom, nextTo, to > from ? 'ladder' : 'snake', jumps, from)
    if (error) {
      onError(error)
      setDraftFrom(String(from))
      setDraftTo(String(to))
      return
    }
    const next = { ...jumps }
    delete next[from]
    next[nextFrom] = nextTo
    onChange(next)
  }

  const inputProps = {
    type: 'number' as const,
    min: 1,
    max: BOARD_SIZE,
    onBlur: commit,
    onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        e.currentTarget.blur()
      }
    },
    className: 'w-16 rounded border border-slate-300 px-2 py-1 text-center text-sm text-black',
  }

  return (
    <li className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2">
      <input
        {...inputProps}
        aria-label={`Jump ${from} start square`}
        value={draftFrom}
        onChange={(e) => setDraftFrom(e.target.value)}
      />
      <span className="text-slate-400" aria-hidden="true">
        →
      </span>
      <input
        {...inputProps}
        aria-label={`Jump ${from} end square`}
        value={draftTo}
        onChange={(e) => setDraftTo(e.target.value)}
      />
      <JumpBadge from={from} to={to} />
      <button
        type="button"
        aria-label={`Remove jump ${from} to ${to}`}
        title="Remove"
        onClick={() => {
          const next = { ...jumps }
          delete next[from]
          onChange(next)
        }}
        className="ml-auto rounded px-2 py-1 text-slate-500 hover:bg-red-50 hover:text-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-400"
      >
        ✕
      </button>
    </li>
  )
}

export const SettingsForm = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const settings = useAppSelector((state) => state.settings)
  const [newFrom, setNewFrom] = useState('')
  const [newTo, setNewTo] = useState('')
  const [newType, setNewType] = useState<JumpType>('ladder')
  const [addError, setAddError] = useState<string>()
  const [isStarting, setIsStarting] = useState(false)

  // Brief loading screen after applying, then open the game.
  useEffect(() => {
    if (!isStarting) return
    const timer = window.setTimeout(() => navigate('/play'), 1400)
    return () => window.clearTimeout(timer)
  }, [isStarting, navigate])
  const [snackbar, setSnackbar] = useState<{
    isOpen: boolean
    message: string
    type: 'success' | 'error'
  }>({ isOpen: false, message: '', type: 'success' })

  const sortedJumps = useMemo(
    () =>
      Object.entries(settings.jumps)
        .map(([from, to]) => [Number(from), Number(to)] as const)
        .sort(([a], [b]) => a - b),
    [settings.jumps],
  )
  const ladders = sortedJumps.filter(([from, to]) => to > from).length
  const snakes = sortedJumps.length - ladders
  const notify = (message: string, type: 'success' | 'error' = 'error') =>
    setSnackbar({ isOpen: true, message, type })

  const addJump = () => {
    const from = Number(newFrom)
    const to = Number(newTo)
    const error =
      newFrom === '' || newTo === ''
        ? 'Enter both squares'
        : validateJump(from, to, newType, settings.jumps)
    if (error) {
      setAddError(error)
      return
    }
    dispatch(setJumps({ ...settings.jumps, [from]: to }))
    setNewFrom('')
    setNewTo('')
    setAddError(undefined)
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (settings.playerConfigs.some((p) => !isValidPlayerName(p.name))) {
      notify('Every player needs a name of at least 2 characters')
      return
    }
    void dispatch(
      newGame({ players: settings.playerConfigs, startingIndex: settings.startingPlayer }),
    )
    setIsStarting(true)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pb-2">
      {isStarting && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900">
          <GameLoader />
        </div>
      )}
      <Card title="Players" description="Who's playing, in turn order.">
        <div
          role="radiogroup"
          aria-label="Number of players"
          className="mb-4 inline-flex overflow-hidden rounded-lg border border-slate-300"
        >
          {[2, 3, 4, 5].map((count) => {
            const selected = settings.playerConfigs.length === count
            return (
              <button
                key={count}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => dispatch(setPlayerCount(count))}
                className={clsx(
                  'px-4 py-1.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-sky-500',
                  selected
                    ? '!bg-sky-600 !text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-100',
                )}
              >
                {count}
              </button>
            )
          })}
        </div>

        <ul className="space-y-2">
          {settings.playerConfigs.map((player, index) => {
            const invalid = !isValidPlayerName(player.name)
            return (
              <li
                key={player.id}
                className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2"
              >
                <input
                  type="color"
                  value={player.color}
                  aria-label={`${player.name || `Player ${index + 1}`} color`}
                  onChange={(e) =>
                    dispatch(setPlayerColor({ id: player.id, color: e.target.value }))
                  }
                  className="h-9 w-9 flex-none cursor-pointer rounded-full border border-slate-300 bg-transparent p-0.5"
                />
                <div className="min-w-[8rem] flex-1">
                  <input
                    value={player.name}
                    maxLength={20}
                    aria-label={`Player ${index + 1} name`}
                    aria-invalid={invalid}
                    placeholder={`Player ${index + 1}`}
                    onChange={(e) =>
                      dispatch(setPlayerName({ id: player.id, name: e.target.value }))
                    }
                    className={clsx(
                      'w-full rounded border px-3 py-1.5 text-sm text-black',
                      invalid ? 'border-red-500' : 'border-slate-300',
                    )}
                  />
                  {invalid && <p className="mt-0.5 text-xs text-red-600">At least 2 characters</p>}
                </div>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                  <input
                    type="radio"
                    name="starting-player"
                    checked={settings.startingPlayer === index}
                    onChange={() => dispatch(setStartingPlayer(index))}
                  />
                  Goes first
                </label>
              </li>
            )
          })}
        </ul>
      </Card>

      <Card
        title="Snakes & Ladders"
        description={`${ladders} ladders · ${snakes} snakes. Edit a number and press Enter, or remove a jump.`}
        action={
          <Button
            type="button"
            variant="ghost"
            className="text-sm"
            onClick={() => dispatch(setJumps({ ...DEFAULT_JUMPS }))}
          >
            Restore classic board
          </Button>
        }
      >
        <details className="group">
          <summary className="mb-3 cursor-pointer select-none text-sm font-semibold text-sky-700 dark:text-sky-300">
            Customize snakes &amp; ladders
          </summary>
          <div className="mb-4 rounded-lg border-2 border-dashed border-slate-300 p-3">
            <div className="flex flex-wrap items-center gap-2">
              <div
                role="radiogroup"
                aria-label="Jump type"
                className="inline-flex overflow-hidden rounded-lg border border-slate-300"
              >
                {(['ladder', 'snake'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    role="radio"
                    aria-checked={newType === type}
                    onClick={() => {
                      setNewType(type)
                      setAddError(undefined)
                    }}
                    className={clsx(
                      'px-3 py-1 text-sm font-semibold',
                      newType === type ? '!bg-sky-600 !text-white' : 'bg-white text-slate-700',
                    )}
                  >
                    {type === 'ladder' ? '🪜 Ladder' : '🐍 Snake'}
                  </button>
                ))}
              </div>
              <input
                type="number"
                min={1}
                max={BOARD_SIZE}
                placeholder={newType === 'ladder' ? 'Bottom' : 'Head'}
                aria-label="New jump start square"
                value={newFrom}
                onChange={(e) => setNewFrom(e.target.value)}
                className="w-20 rounded border border-slate-300 px-2 py-1 text-center text-sm text-black"
              />
              <span className="text-slate-400" aria-hidden="true">
                →
              </span>
              <input
                type="number"
                min={1}
                max={BOARD_SIZE}
                placeholder={newType === 'ladder' ? 'Top' : 'Tail'}
                aria-label="New jump end square"
                value={newTo}
                onChange={(e) => setNewTo(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addJump()
                  }
                }}
                className="w-20 rounded border border-slate-300 px-2 py-1 text-center text-sm text-black"
              />
              <Button
                type="button"
                variant="secondary"
                className="ml-auto py-1.5"
                onClick={addJump}
              >
                Add
              </Button>
            </div>
            <p className="mt-1.5 text-xs text-slate-600">
              {newType === 'ladder'
                ? 'Ladder: climbs from a lower square up to a higher one.'
                : 'Snake: slides from the head (higher square) down to the tail (lower square).'}
            </p>
            {addError && (
              <p role="alert" className="mt-1 text-xs text-red-600">
                {addError}
              </p>
            )}
          </div>

          {sortedJumps.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-500">
              No snakes or ladders — a plain race to {BOARD_SIZE}.
            </p>
          ) : (
            <ul className="grid max-h-80 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
              {sortedJumps.map(([from, to]) => (
                <JumpRow
                  key={`${from}-${to}`}
                  from={from}
                  to={to}
                  jumps={settings.jumps}
                  onChange={(next) => dispatch(setJumps(next))}
                  onError={notify}
                />
              ))}
            </ul>
          )}
        </details>
      </Card>

      <Card title="Preferences">
        <div className="space-y-4">
          <Switch
            label="Animations"
            hint="Smooth piece movement"
            checked={settings.animationsEnabled}
            onChange={() => dispatch(toggleAnimations())}
          />
          <Switch
            label="Sound effects"
            hint="Dice, ladders, snakes and the win jingle"
            checked={settings.soundEnabled}
            onChange={() => dispatch(toggleSound())}
          />
        </div>
      </Card>

      <div className="sticky bottom-0 -mx-1 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-900/80 p-3 backdrop-blur">
        <Button
          type="button"
          variant="ghost"
          className="!text-white hover:!bg-white/10"
          onClick={() => {
            dispatch(resetSettings())
            notify('Default settings restored', 'success')
          }}
        >
          Restore defaults
        </Button>
        <Button type="submit">Apply &amp; start new game</Button>
      </div>

      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        isOpen={snackbar.isOpen}
        onClose={() => setSnackbar((prev) => ({ ...prev, isOpen: false }))}
      />
    </form>
  )
}
