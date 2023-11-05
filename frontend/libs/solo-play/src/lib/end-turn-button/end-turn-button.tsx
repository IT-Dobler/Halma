import { gameInstanceActions, selectCanEndTurn } from 'game-logic';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../../../src/main';

export function EndTurnButton() {
  const dispatch = useDispatch<AppDispatch>();
  const canEndTurn = useSelector(selectCanEndTurn);
  return (
    <button
      disabled={!canEndTurn}
      className="btn btn-outline w-72"
      onClick={() => dispatch(gameInstanceActions.nextTurn())}
    >
      End Turn
    </button>
  );
}

export default EndTurnButton;
