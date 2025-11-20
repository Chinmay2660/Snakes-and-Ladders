import { FormEvent, useMemo, useState } from 'react'

import { Button } from '../../components/Button'
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux'
import { setPlayers } from '../game/gameSlice'
import {
  resetSettings,
  setPlayerColor,
  setPlayerCount,
  setPlayerName,
  setStartingPlayer,
  setJumps,
  toggleAnimations,
  toggleSound,
} from './settingsSlice'

export const SettingsForm = () => {
  const dispatch = useAppDispatch()
  const settings = useAppSelector((state) => state.settings)
  const serializedJumps = useMemo(() => JSON.stringify(settings.jumps, null, 2), [settings.jumps])
  const [draftOverride, setDraftOverride] = useState<string | null>(null)
  const [jumpsError, setJumpsError] = useState<string>()
  const textareaValue = draftOverride ?? serializedJumps

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    dispatch(
      setPlayers({ players: settings.playerConfigs, startingIndex: settings.startingPlayer }),
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-xl border border-slate-200 bg-white/90 p-4 shadow-lg sm:space-y-8 sm:rounded-2xl sm:p-6"
    >
      <section>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900 sm:text-lg">Players</h2>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-slate-700">Player Count</label>
              <select
                className="w-auto rounded border border-slate-300 pl-3 pr-10 py-2 text-black"
                style={{ width: 'fit-content', minWidth: '80px' }}
                value={settings.playerConfigs.length}
                onChange={(event) => dispatch(setPlayerCount(Number(event.target.value)))}
              >
                {[1, 2, 3, 4, 5].map((count) => (
                  <option key={count} value={count} className="text-black">
                    {count}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:gap-4 md:grid-cols-2">
          {settings.playerConfigs.map((player, index) => (
            <div key={player.id} className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
              <p className="text-sm font-semibold text-slate-700">Player {index + 1}</p>
              <label className="mt-3 block text-sm text-slate-600">
                Name
                <input
                  required
                  minLength={2}
                  value={player.name}
                  onChange={(event) =>
                    dispatch(setPlayerName({ id: player.id, name: event.target.value }))
                  }
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
                />
              </label>
              <label className="mt-3 flex items-center gap-3 text-sm text-slate-600">
                Color
                <input
                  type="color"
                  value={player.color}
                  aria-label={`${player.name} color`}
                  onChange={(event) =>
                    dispatch(setPlayerColor({ id: player.id, color: event.target.value }))
                  }
                  className="h-10 w-10 cursor-pointer rounded border border-slate-300"
                />
              </label>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-900">Snakes &amp; Ladders map</h2>
        <p className="text-sm text-slate-600">
          Provide a JSON object where each key/value is a start → destination jump.
        </p>
        <textarea
          className="mt-3 w-full min-h-[150px] rounded-xl border border-slate-200 bg-white/70 p-3 font-mono text-sm text-black"
          value={textareaValue}
          onChange={(event) => {
            const value = event.target.value
            setDraftOverride(value)
            setJumpsError(undefined)
            try {
              const parsed = JSON.parse(value) as Record<number, number>
              // Validate it's an object with numeric keys/values
              if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                dispatch(setJumps(parsed))
              }
            } catch {
              // Invalid JSON - keep error state but don't show until blur
            }
          }}
          onBlur={() => {
            try {
              const parsed = JSON.parse(textareaValue) as Record<number, number>
              dispatch(setJumps(parsed))
              setDraftOverride(null)
              setJumpsError(undefined)
            } catch (parseError) {
              console.warn('Invalid JSON mapping', parseError)
              setJumpsError('Invalid JSON mapping')
            }
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
              event.preventDefault()
              try {
                const parsed = JSON.parse(textareaValue) as Record<number, number>
                dispatch(setJumps(parsed))
                setDraftOverride(null)
                setJumpsError(undefined)
              } catch (parseError) {
                console.warn('Invalid JSON mapping', parseError)
                setJumpsError('Invalid JSON mapping')
              }
            }
          }}
        />
        {jumpsError && <p className="mt-2 text-sm text-red-600">{jumpsError}</p>}
      </section>

      <section className="grid gap-3 sm:gap-4 md:grid-cols-3">
        <label className="flex flex-col rounded-xl border border-slate-200 p-4">
          <span className="text-sm font-semibold text-black">Starting player</span>
          <select
            className="mt-2 rounded border border-slate-300 px-3 py-2 pr-8 text-black"
            value={settings.startingPlayer}
            onChange={(event) => dispatch(setStartingPlayer(Number(event.target.value)))}
          >
            {settings.playerConfigs.map((player, index) => (
              <option key={player.id} value={index} className="text-black">
                {player.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center justify-between rounded-xl border border-slate-200 p-4 text-sm font-semibold text-black">
          Animations
          <input
            type="checkbox"
            checked={settings.animationsEnabled}
            onChange={() => dispatch(toggleAnimations())}
          />
        </label>

        <label className="flex items-center justify-between rounded-xl border border-slate-200 p-4 text-sm font-semibold text-black">
          Sound
          <input
            type="checkbox"
            checked={settings.soundEnabled}
            onChange={() => dispatch(toggleSound())}
          />
        </label>
      </section>

      <div className="flex flex-wrap gap-3">
        <Button type="submit">Apply to game</Button>
        <Button type="button" variant="secondary" onClick={() => dispatch(resetSettings())}>
          Reset settings
        </Button>
      </div>
    </form>
  )
}
