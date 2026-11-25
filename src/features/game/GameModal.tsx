import { Button } from '../../components/Button'
import { Confetti } from '../../components/Confetti'
import { Modal } from '../../components/Modal'
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux'
import { newGame } from './gameSlice'
import { selectGameState, selectWinner } from './gameSelectors'

export const GameModal = () => {
  const winner = useAppSelector(selectWinner)
  const game = useAppSelector(selectGameState)
  const settings = useAppSelector((state) => state.settings)
  const dispatch = useAppDispatch()
  const isGameComplete = game.status === 'complete'

  const resetToSettings = () =>
    dispatch(
      newGame({
        players: settings.playerConfigs,
        startingIndex: settings.startingPlayer,
      }),
    )

  return (
    <>
      <Confetti isActive={isGameComplete} />
      <Modal
        title="Game complete"
        isOpen={isGameComplete}
        onClose={resetToSettings}
        actions={
          <Button onClick={resetToSettings} autoFocus>
            Play again
          </Button>
        }
      >
        <div className="text-center">
          <p className="text-2xl font-bold text-slate-900 sm:text-3xl">
            {winner ? (
              <>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500">
                  🎉 {winner.name} wins! 🎉
                </span>
              </>
            ) : (
              'Great game!'
            )}
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Reset to start a new round or load another game.
          </p>
        </div>
      </Modal>
    </>
  )
}
