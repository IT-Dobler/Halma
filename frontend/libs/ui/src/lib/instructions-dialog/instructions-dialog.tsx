import rulesPng from './instructions.png';
import { gameInstanceActions } from 'game-logic';
import React from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../../src/main';

export interface RulesDialogProps {
  modal: React.RefObject<HTMLDialogElement>;
}

export function InstructionsDialog(props: RulesDialogProps) {
  const dispatch = useDispatch<AppDispatch>();
  return (
    <dialog id="my_modal_1" className="modal" ref={props.modal}>
      <div className="modal-box w-11/12 max-w-5xl">
        <img className="w-11/12 max-w-5xl" src={rulesPng} alt="Halma42 game instructions"/>
        <div className="modal-action justify-between">
          <span>The "don't show this again" button is in wip...</span>
          <form method="dialog">
            <button
              className="btn"
              onClick={() => dispatch(gameInstanceActions.instructionsShown())}
            >
              Ok
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}

export default InstructionsDialog;
