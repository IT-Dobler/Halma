/* eslint-disable-next-line */

import {GameBoard} from "ui";

export interface SoloPlayProps {}

export function SoloPlay(props: SoloPlayProps) {
  return (
    <div className="grid grid-cols-3 mt-10 items-center">
      <div></div>
      <div className="grid justify-center text-center">
        <h1 className="mb-10 font-bold text-2xl">Welcome to SoloPlay!</h1>
        {/*<h3>Current player: {currentPlayer.playerIdToMove}, playing: {PlayDirection[direction]}</h3>*/}
        <GameBoard />
      </div>
      <div className="flex flex-col">
        {/*<button className="mb-4" onClick={() => dispatch(initializeBoard({players: ["1", "2", "3"], gameType: GameType.CLAUDIO}))}>Create Game</button>*/}
        {/*<button className="mb-4" onClick={() => dispatch(nextTurn())}>Next turn</button>*/}
      </div>
    </div>
  );
}

export default SoloPlay;
