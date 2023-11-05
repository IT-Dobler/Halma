import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchGameInstance,
  selectAllPlayerEntities,
  selectCurrentMove,
  selectGameConfig,
  selectStepCounter,
} from 'game-logic';
import { AppDispatch } from '../../../../../src/main';

export interface VictoryDialogProps {
  modal: React.RefObject<HTMLDialogElement>;
}

export function VictoryDialog(props: VictoryDialogProps) {
  const dispatch = useDispatch<AppDispatch>();
  const stepCounter = useSelector(selectStepCounter);
  const config = useSelector(selectGameConfig);
  const players = useSelector(selectAllPlayerEntities);
  const currentMove = useSelector(selectCurrentMove);
  const playersLength = Object.keys(players).length;

  // TODO All these selectors cause a lot of rebuilds. A better approach would be to make a selector that prints the
  //  string to display whenever the isWon property is true. This way it only rebuilds when somebody has actually won

  return (
    <dialog id="my_modal_1" className="modal" ref={props.modal}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">Victory!</h3>
        <p className="py-4">
          {playersLength === 1
            ? 'You'
            : players[currentMove.playerIdToMove]?.displayName}{' '}
          won in {Math.ceil(stepCounter / playersLength).toString()} moves!
        </p>
        <div className="modal-action">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button
              className="btn"
              onClick={() => dispatch(fetchGameInstance(config))}
            >
              Play again
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}

export default VictoryDialog;
