import { useEffect, useState, useRef } from 'react'

import { GameBoard } from '../features/game/GameBoard'
import { GameControls } from '../features/game/GameControls'
import { GameModal } from '../features/game/GameModal'
import { loadGame } from '../features/game/gameSlice'
import { useAppDispatch } from '../hooks/useRedux'
import { Skeleton } from '../components/Skeleton'

const Play = () => {
  const dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = useState(true)
  const hasLoadedRef = useRef(false)

  useEffect(() => {
    if (hasLoadedRef.current) return
    hasLoadedRef.current = true

    // Load game state (non-blocking)
    dispatch(loadGame())

    // Show content immediately after a microtask
    Promise.resolve().then(() => {
      setIsLoading(false)
    })
  }, [dispatch])

  if (isLoading) {
    return (
      <section className="space-y-8 text-white">
        <header>
          <Skeleton variant="text" width="200px" height="36px" className="mb-3" />
          <Skeleton variant="text" width="400px" height="24px" />
        </header>
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 lg:flex-row lg:items-start lg:justify-center">
          <div className="w-full lg:flex-1 lg:max-w-3xl">
            <Skeleton variant="rectangular" width="100%" height="600px" className="rounded-2xl" />
          </div>
          <div className="w-full lg:w-auto lg:min-w-[320px] lg:max-w-md">
            <Skeleton variant="rectangular" width="100%" height="300px" className="rounded-2xl" />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-4 text-white sm:space-y-8">
      <header className="text-center sm:text-left">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Game</h1>
        <p className="mt-1 text-sm text-white/80 sm:mt-2 sm:text-base">
          Roll the dice with Space or Enter, and keep an eye on the move history.
        </p>
      </header>
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-3 sm:gap-4 lg:flex-row lg:items-stretch lg:justify-center">
        <div className="w-full lg:flex-1 lg:flex lg:max-w-xl lg:items-center lg:justify-center">
          <GameBoard />
        </div>
        <div className="w-full lg:w-auto lg:min-w-[280px] lg:max-w-sm lg:flex lg:flex-col">
          <GameControls />
        </div>
      </div>
      <GameModal />
    </section>
  )
}

export default Play
