import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchGameInstance,
  gameInstanceActions,
  selectGameConfig,
  selectVictoryDialogConfig,
} from 'game-logic';
import { AppDispatch } from '../../../../../src/main';

export interface VictoryDialogProps {
  modal: React.RefObject<HTMLDialogElement>;
}

export function VictoryDialog(props: VictoryDialogProps) {
  const dispatch = useDispatch<AppDispatch>();
  const config = useSelector(selectGameConfig);

  const victoryDialogConfig = useSelector(selectVictoryDialogConfig);

  function continuePlaying() {
    dispatch(gameInstanceActions.continuePlay());
    props.modal.current?.close();
  }

  function playAgain() {
    dispatch(fetchGameInstance(config));
    props.modal.current?.close();
  }

  return (
    <dialog id="my_modal_1" className="modal" ref={props.modal}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">Victory!</h3>
        <p className="py-4">{victoryDialogConfig.text}</p>
        <div className="modal-action">
          {victoryDialogConfig.showContinuePlay && (
            <button
              className="btn"
              onClick={() => continuePlaying()}
            >
              Continue playing
            </button>
          )}

          <button className="btn" onClick={() => playAgain()}>
            Play again
          </button>
        </div>
      </div>
    </dialog>
  );
}

export default VictoryDialog;
