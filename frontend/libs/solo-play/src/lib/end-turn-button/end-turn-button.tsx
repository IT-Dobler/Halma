import { gameInstanceActions, selectCurrentMove } from 'game-logic';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../../../src/main';

/* eslint-disable-next-line */
export interface EndTurnButtonProps {}

export function EndTurnButton(props: EndTurnButtonProps) {
  const dispatch = useDispatch<AppDispatch>();
  const currentMove = useSelector(selectCurrentMove);
  return (
    <button
      disabled={currentMove.lastMovedNodeId === undefined}
      className="btn btn-outline"
      onClick={() => dispatch(gameInstanceActions.nextTurn())}
    >
      End Turn
    </button>
  );
}

export default EndTurnButton;
