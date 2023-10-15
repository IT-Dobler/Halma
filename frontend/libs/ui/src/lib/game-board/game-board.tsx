/* eslint-disable-next-line */
export interface GameBoardProps {
}

export function GameBoard(props: GameBoardProps) {
  const width = 0;
  return (
      <div className="flex flex-wrap content-start" style={{width: `${(width * 64)}px`}}>

      </div>
  );
}

export default GameBoard;
