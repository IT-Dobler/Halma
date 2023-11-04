import { gameInstanceActions, selectCanEndTurn } from 'game-logic';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../../../src/main';

/* eslint-disable-next-line */
export interface EndTurnButtonProps {}

export function EndTurnButton(props: EndTurnButtonProps) {
  const dispatch = useDispatch<AppDispatch>();
  const canEndTurn = useSelector(selectCanEndTurn);
  return (
    <button
      disabled={!canEndTurn}
      className="btn btn-outline"
      onClick={() => dispatch(gameInstanceActions.nextTurn())}
    >
      End Turn
    </button>
  );
}

export default EndTurnButton;
