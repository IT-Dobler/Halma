import {GameBoard, StepCounter, VictoryDialog} from 'ui';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchGameInstance,
  gameInstanceActions,
  selectIsWon,
} from 'game-logic';
import { AppDispatch } from '../../../../../src/main';
import { useEffect, useRef } from 'react';

export interface SoloPlayProps {}

// TODO this tutorial seems rather complete :) https://redux.js.org/tutorials/essentials/part-5-async-logic#example-rest-api-and-client
export function SoloPlay(props: SoloPlayProps) {
  const dispatch = useDispatch<AppDispatch>();
  const isWon = useSelector(selectIsWon);

  const modal = useRef<HTMLDialogElement>(null);
  // const stepCounter = useSelector(selectStepCounter);

  useEffect(() => {
    if (isWon) {
      modal.current?.showModal();
    }
  }, [isWon]);

  // Run only once at startup
  useEffect(() => {
    onCreateGame();
  }, []);

  const onCreateGame = async () => {
    await dispatch(
      fetchGameInstance(),
    );
  };

  return (
    <div>
      <VictoryDialog modal={modal}/>
      <div className="grid grid-cols-3 mt-10 items-center">
        <div></div>
        <div className="grid justify-center text-center">
          <h1 className="mb-10 font-bold text-2xl">Welcome to SoloPlay!</h1>
          <GameBoard />
        </div>
        <div className="flex flex-wrap items-center justify-center flex-col p-4">
          <button
            className="btn mb-4 btn-outline"
            onClick={() => onCreateGame()}
          >
            Reset
          </button>
          <button
            className="btn btn-outline"
            onClick={() => dispatch(gameInstanceActions.nextTurn())}
          >
            End Turn
          </button>
          <StepCounter />
        </div>
      </div>
    </div>
  );
}

export default SoloPlay;
