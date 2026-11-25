import { useEffect } from 'react'

import { GameBoard } from '../features/game/GameBoard'
import { GameControls } from '../features/game/GameControls'
import { GameModal } from '../features/game/GameModal'
import { loadGame } from '../features/game/gameSlice'
import { useAppDispatch } from '../hooks/useRedux'

const Play = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(loadGame())
  }, [dispatch])

  return (
    <section className="flex flex-col items-center justify-center gap-3 lg:h-full lg:flex-row lg:items-center lg:gap-6">
      <div className="w-full min-w-0 lg:flex-1">
        <GameBoard />
      </div>
      <div className="w-full max-w-xl lg:w-72 lg:flex-none">
        <GameControls />
      </div>
      <GameModal />
    </section>
  )
}

export default Play
