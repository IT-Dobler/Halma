import {useDispatch, useSelector} from 'react-redux';
import {gameInstanceActions, selectCurrentMove, selectNodeById, selectPlayerById,} from 'game-logic';
import {EntityId} from '@reduxjs/toolkit';
import {NodeTypeTS} from '../../../../game-logic/src/lib/model/node-type';

/* eslint-disable-next-line */
export interface GameCellProps {
  id: EntityId;
}

export function GameCell(props: GameCellProps) {
  const dispatch = useDispatch();
  const node = useSelector(selectNodeById(props.id))!;
  const player = useSelector(selectPlayerById(node.owningPlayerId));
  const currentMove = useSelector(selectCurrentMove);

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
    case NodeTypeTS.SELECTED:
      if (player) {
        let color = player.color;
        if (node.type === NodeTypeTS.SELECTED) {
          color = "text-red-700";
        }
        let border = '';
        if (player.id === currentMove.playerIdToMove) {
          border = `border-2 border-${color}-300`;
        }
        content = (
            <h1 onClick={() => onPieceClick()} className={`${color} ${border}`}>
              {node?.id}
            </h1>
        );
      }
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
