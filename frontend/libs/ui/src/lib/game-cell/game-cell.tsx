import { useDispatch, useSelector } from 'react-redux';
import {
  gameInstanceActions,
  selectNodeById,
} from 'game-logic';
import { EntityId } from '@reduxjs/toolkit';
import { NodeTypeTS } from '../../../../game-logic/src/lib/node-type';

/* eslint-disable-next-line */
export interface GameCellProps {
  id: EntityId;
}

export function GameCell(props: GameCellProps) {
  const node = useSelector(selectNodeById(props.id))!;
  const dispatch = useDispatch();

  function onPieceClick() {
    dispatch(gameInstanceActions.clickPiece(node.id));
  }

  function onDestinationClick() {
    dispatch(gameInstanceActions.clickDestination(node.id));
  }

  let content;
  switch (node.type) {
    case NodeTypeTS.EMPTY:
      content = <h1>{node?.id}</h1>;
      break;
    case NodeTypeTS.BLOCKED:
      break;
    case NodeTypeTS.PIECE:
      content = (
        <h1 onClick={() => onPieceClick()} className="text-yellow-900">
          {node?.id}
        </h1>
      );
      break;
    case NodeTypeTS.SELECTED:
      content = (
        <h1 onClick={() => onPieceClick()} className="text-red-700">
          {node?.id}
        </h1>
      );
      break;
    case NodeTypeTS.POSSIBLE_MOVE:
      content = (
        <h1 onClick={() => onDestinationClick()} className="text-white">
          {node?.id}
        </h1>
      );
      break;
  }

  return (
    <div className="flex justify-center items-center h-16 w-16">{content}</div>
  );
}

export default GameCell;
