import { Button } from '../../components/Button'
import { Modal } from '../../components/Modal'
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux'
import { resetGame } from './gameSlice'
import { selectGameState, selectWinner } from './gameSelectors'

export const GameModal = () => {
  const winner = useAppSelector(selectWinner)
  const game = useAppSelector(selectGameState)
  const settings = useAppSelector((state) => state.settings)
  const dispatch = useAppDispatch()

  const resetToSettings = () =>
    dispatch(
      resetGame({
        players: settings.playerConfigs,
        startingIndex: settings.startingPlayer,
      }),
    )

  return (
    <Modal
      title="Game complete"
      isOpen={game.status === 'complete'}
      onClose={resetToSettings}
      actions={
        <Button onClick={resetToSettings} autoFocus>
          Play again
        </Button>
      }
    >
      <p className="text-lg font-semibold text-slate-900">
        {winner ? `${winner.name} wins!` : 'Great game!'}
      </p>
      <p className="text-sm text-slate-600">Reset to start a new round or load another game.</p>
    </Modal>
  )
}
