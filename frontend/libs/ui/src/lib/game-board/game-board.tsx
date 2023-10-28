/* eslint-disable-next-line */
import { useSelector } from 'react-redux';
import {selectAllGameStateIds, selectCurrentMove, selectGameConfig} from 'game-logic';
import GameCell from '../game-cell/game-cell';
import { PlayDirection } from '../../../../game-logic/src/lib/model/play-direction';

export interface GameBoardProps {}

export function GameBoard(props: GameBoardProps) {
  const nodes = useSelector(selectAllGameStateIds);
  const currentMove = useSelector(selectCurrentMove);
  const gameConfig = useSelector(selectGameConfig);

  const tiles = [];

  const horizontalNodesLayout = nodes.slice().sort((a, b) => {
    return b.toString().charCodeAt(0) - a.toString().charCodeAt(0);
  });

  // We can toggle this based on board rotation 
  function getSortedNodes() {
    switch (currentMove.playDirection) {
      case PlayDirection.BOTTOM_TO_TOP:
        return nodes;
      case PlayDirection.TOP_TO_BOTTOM:
        return nodes.slice().reverse();
      case PlayDirection.LEFT_TO_RIGHT:
        return horizontalNodesLayout;
      case PlayDirection.RIGHT_TO_LEFT:
        return horizontalNodesLayout.slice().reverse();
    }
  }

  for (const id of nodes) {
    tiles.push(<GameCell key={id} id={id} />);
  }

  const width = gameConfig.width;
  return (
    <div
      className="flex flex-wrap content-start"
      style={{ width: `${width * 64}px` }}
    >
      {tiles}
    </div>
  );
}

export default GameBoard;
