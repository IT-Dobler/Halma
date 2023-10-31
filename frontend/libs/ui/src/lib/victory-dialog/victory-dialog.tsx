import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGameInstance, selectStepCounter } from 'game-logic';
import { AppDispatch } from '../../../../../src/main';

export interface VictoryDialogProps {
  modal: React.RefObject<HTMLDialogElement>;
}

export function VictoryDialog(props: VictoryDialogProps) {
  const dispatch = useDispatch<AppDispatch>();
  const stepCounter = useSelector(selectStepCounter);

  return (
    <dialog id="my_modal_1" className="modal" ref={props.modal}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">Victory!</h3>
        <p className="py-4">You won in {stepCounter} moves!</p>
        <div className="modal-action">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button
              className="btn"
              onClick={() => dispatch(fetchGameInstance())}
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
