import { useEffect, useState } from 'react'

import { GameBoard } from '../features/game/GameBoard'
import { GameControls } from '../features/game/GameControls'
import { GameModal } from '../features/game/GameModal'
import { loadGame } from '../features/game/gameSlice'
import { useAppDispatch } from '../hooks/useRedux'
import { Skeleton } from '../components/Skeleton'

export const Play = () => {
  const dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      await dispatch(loadGame())
      setIsLoading(false)
    }
    load()
  }, [dispatch])

  if (isLoading) {
    return (
      <section className="space-y-8 text-white">
        <header>
          <Skeleton variant="text" width="200px" height="36px" className="mb-3" />
          <Skeleton variant="text" width="400px" height="24px" />
        </header>
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-8">
          <Skeleton variant="rectangular" width="100%" height="600px" className="rounded-2xl" />
          <Skeleton variant="rectangular" width="100%" height="300px" className="rounded-2xl" />
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
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 sm:gap-8">
        <GameBoard />
        <GameControls />
      </div>
      <GameModal />
    </section>
  )
}
