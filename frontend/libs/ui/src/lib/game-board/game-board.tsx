/* eslint-disable-next-line */
import {useSelector} from "react-redux";
import {selectAllGameState, selectAllGameStateIds} from "game-logic";
import GameCell from "../game-cell/game-cell";

export interface GameBoardProps {
}

export function GameBoard(props: GameBoardProps) {

  const nodes = useSelector(selectAllGameStateIds);

  const tiles = [];

  for (const id of nodes) {
    tiles.push(<GameCell key={id} id={id} />);
  }


  const width = 8;
  return (
      <div className="flex flex-wrap content-start" style={{width: `${(width * 64)}px`}}>
        {tiles}
      </div>
  );
}

export default GameBoard;
