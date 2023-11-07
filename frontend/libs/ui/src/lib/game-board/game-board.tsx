/* eslint-disable-next-line */
import { useSelector } from 'react-redux';
import {
  selectAllGameStateIds,
  selectCurrentMove,
  selectGameConfig,
} from 'game-logic';
import GameCell from '../game-cell/game-cell';
import { PlayDirection } from '../../../../game-logic/src/lib/model/play-direction';
import background14PieceSvg from './background-14pieces.svg';
import background10PieceSvg from './background-10-pieces.svg';
import background8PieceSvg from './background-8-pieces.svg';
import background2PieceSvg from './background-2-pieces.svg';

export function GameBoard() {
  const nodes = useSelector(selectAllGameStateIds);
  const currentMove = useSelector(selectCurrentMove);
  const gameConfig = useSelector(selectGameConfig);

  const tiles = [];

  const horizontalNodesLayout = nodes.slice().sort((a, b) => {
    return b.toString().charCodeAt(0) - a.toString().charCodeAt(0);
  });

  // We can toggle this based on board rotation
  function getSortedNodes() {
    if (!gameConfig.hasRotatingBoard) {
      return nodes;
    }
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

  function getBackground(): string {
    if (gameConfig.width === 11) {
      return background14PieceSvg;
    }
    if (gameConfig.width === 9) {
      return background10PieceSvg;
    }
    if (gameConfig.width === 8) {
      return background8PieceSvg;
    }
    if (gameConfig.width === 5) {
      return background2PieceSvg;
    }

    return '';
  }

  for (const id of getSortedNodes()) {
    tiles.push(<GameCell key={id} id={id} />);
  }

  const width = gameConfig.width;
  return (
    <div
      style={{
        backgroundImage: `url(${getBackground()})`,
        backgroundSize: 'cover',
      }}
    >
      <div
        className="flex flex-wrap content-start"
        style={{
          minWidth: `${width * 3}vw`,
          maxWidth: `${width * 3}vw`,
        }}
      >
        {tiles}
      </div>
    </div>
  );
}

export default GameBoard;
