import { useDispatch, useSelector } from 'react-redux';
import {
  gameInstanceActions,
  selectCurrentMove,
  selectGameConfig,
  selectNodeById,
  selectPlayerById,
} from 'game-logic';
import { EntityId } from '@reduxjs/toolkit';
import { NodeTypeTS } from '../../../../game-logic/src/lib/model/node-type';

/* eslint-disable-next-line */
export interface GameCellProps {
  id: EntityId;
}

export function GameCell(props: GameCellProps) {
  const dispatch = useDispatch();
  const node = useSelector(selectNodeById(props.id))!;
  const player = useSelector(selectPlayerById(node.owningPlayerId));
  const currentMove = useSelector(selectCurrentMove);
  const config = useSelector(selectGameConfig);

  function onPieceClick() {
    dispatch(gameInstanceActions.clickPiece(node.id));
  }

  function onDestinationClick() {
    dispatch(gameInstanceActions.clickDestination(node.id));
  }

  let content;
  switch (node.type) {
    case NodeTypeTS.EMPTY:
      content = <div className="rounded-full h-[0.75vw] w-[0.75vw] bg-gray-500"></div>;
      break;
    case NodeTypeTS.BLOCKED:
      break;
    case NodeTypeTS.PIECE:
    case NodeTypeTS.SELECTED:
      if (player) {
        let color = player.color;
        if (node.type === NodeTypeTS.SELECTED) {
          color = 'bg-[#BE2EDD]';
        }
        let border = '';
        if (player.id === currentMove.playerIdToMove) {
          border = `shadow-[0px_0px_5px_2px_#FFFFFF]`;
        }
        content = (
          <div
            onClick={() => onPieceClick()}
            className={`${color} ${border} rounded-full h-[1.5vw] w-[1.5vw] cursor-pointer`}
          ></div>
        );
      }
      break;
    case NodeTypeTS.POSSIBLE_MOVE:
      if (config.showPossibleMoves) {
        content = (
          <div
            onClick={() => onDestinationClick()}
            className="rounded-full h-[1.10vw] w-[1.10vw] bg-[#E056FD] cursor-pointer"
          ></div>
        );
      } else {
        content = (
          <div
            onClick={() => onDestinationClick()}
            className="flex justify-center items-center h-12 w-12"
          >
            <div className="rounded-full h-[0.75vw] w-[0.75vw] bg-gray-500"></div>
          </div>
        );
      }
      break;
  }

  return (
    <div className="flex justify-center items-center h-[3vw] w-[3vw]">{content}</div>
  );
}

export default GameCell;
