/* eslint-disable-next-line */

import {GameBoard} from 'ui';
import {useDispatch} from 'react-redux';
import {fetchGameInstance} from 'game-logic';
import {AppDispatch} from '../../../../../src/main';
import {GameTypeTS} from "../../../../game-logic/src/lib/game-type";

export interface SoloPlayProps {}

// TODO this tutorial seems rather complete :) https://redux.js.org/tutorials/essentials/part-5-async-logic#example-rest-api-and-client
export function SoloPlay(props: SoloPlayProps) {
  const dispatch = useDispatch<AppDispatch>();

  const onCreateGame = async () => {
    await dispatch(fetchGameInstance({
      cornerSize: 2,
      height: 8,
      width: 8,
      gameType: GameTypeTS.CLAUDIO,
      playersId: ["1"]
    }));
  };

  return (
    <div className="grid grid-cols-3 mt-10 items-center">
      <div></div>
      <div className="grid justify-center text-center">
        <h1 className="mb-10 font-bold text-2xl">Welcome to SoloPlay!</h1>
        {/*<h3>Current player: {currentPlayer.playerIdToMove}, playing: {PlayDirection[direction]}</h3>*/}
        <GameBoard />
      </div>
      <div className="flex flex-col">
        <button className="mb-4" onClick={() => onCreateGame()}>
          Create Game
        </button>
        {/*<button className="mb-4" onClick={() => dispatch(initializeBoard({players: ["1", "2", "3"], gameType: GameType.CLAUDIO}))}>Create Game</button>*/}
        {/*<button className="mb-4" onClick={() => dispatch(nextTurn())}>Next turn</button>*/}
      </div>
    </div>
  );
}

export default SoloPlay;
