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
      content = <div className="rounded-full h-8 w-8 bg-gray-500"></div>;
      break;
    case NodeTypeTS.BLOCKED:
      break;
    case NodeTypeTS.PIECE:
    case NodeTypeTS.SELECTED:
      if (player) {
        let color = player.color;
        if (node.type === NodeTypeTS.SELECTED) {
          color = "bg-red-700";
        }
        let border = '';
        if (player.id === currentMove.playerIdToMove) {
          border = `shadow-[0px_0px_5px_2px_#FFFFFF]`;


        }
        content = (
            <div onClick={() => onPieceClick()} className={`${color} ${border} rounded-full h-8 w-8 cursor-pointer`}></div>
        );
      }
      break;
    case NodeTypeTS.POSSIBLE_MOVE:
      content = (
        <div onClick={() => onDestinationClick()} className="rounded-full h-8 w-8 bg-white cursor-pointer"></div>
      );
      break;
  }

  return (
    <div className="flex justify-center items-center h-16 w-16">{content}</div>
  );
}

export default GameCell;
