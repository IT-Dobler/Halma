import {fetchGameInstance, selectGameConfig} from 'game-logic';
import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { AppDispatch } from '../../../../../src/main';
import { FieldValues, useForm } from 'react-hook-form';
import { GameTypeTS } from '../../../../game-logic/src/lib/model/game-type';
import { GameInitUtil } from '../../../../game-logic/src/lib/game-init.util';

/* eslint-disable-next-line */
export interface SettingsDialogProps {
  modal: React.RefObject<HTMLDialogElement>;
}

export function SettingsDialog(props: SettingsDialogProps) {
  const dispatch = useDispatch<AppDispatch>();
  const config = useSelector(selectGameConfig);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({defaultValues: {
      boardSize: config.width,
      rotateBoard: config.hasRotatingBoard,
      numberOfPlayers: config.playersId.length,
      showPossibleMoves: config.showPossibleMoves
  }});

  function onCreateGame(formData: FieldValues) {
    dispatch(
      fetchGameInstance({
        width: Number(formData['boardSize']),
        height: Number(formData['boardSize']),
        cornerSize: 2,
        gameType: GameTypeTS.CLAUDIO,
        hasRotatingBoard: formData['rotateBoard'],
        showPossibleMoves: formData['showPossibleMoves'],
        playersId: Array.from({ length: formData['numberOfPlayers'] }, (_, i) =>
          GameInitUtil.getPlayerName(i),
        ),
      }),
    );

    props.modal.current?.close();
  }

  return (
    <dialog id="settings_modal" className="modal justify-items-start ml-6" ref={props.modal}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">SETTINGS</h3>
        <p className="py-4"></p>
        <form onSubmit={handleSubmit((data) => onCreateGame(data))}>
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Rotate board</span>
              <input
                {...register('rotateBoard', {value: config.hasRotatingBoard})}
                type="checkbox"
                className="toggle"
              />
            </label>
          </div>

          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Number of players</span>
              <div className="rating">
                <input
                  {...register('numberOfPlayers')}
                  value={1}
                  defaultChecked={config.playersId.length === 1}
                  type="radio"
                  className="mask mask-star"
                />
                <input
                  {...register('numberOfPlayers')}
                  value={2}
                  defaultChecked={config.playersId.length === 2}
                  type="radio"
                  className="mask mask-star"
                />
                <input
                  {...register('numberOfPlayers')}
                  value={3}
                  defaultChecked={config.playersId.length === 3}
                  type="radio"
                  className="mask mask-star"
                />
                <input
                  {...register('numberOfPlayers')}
                  value={4}
                  defaultChecked={config.playersId.length === 4}
                  type="radio"
                  className="mask mask-star"
                />
              </div>
            </label>
          </div>

          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Show possible moves</span>
              <input
                {...register('showPossibleMoves')}
                type="checkbox"
                className="toggle"
                defaultChecked={true}
              />
            </label>
          </div>
          <div className="form-control">
            <select
              {...register('boardSize', { required: true })}
              defaultValue={''}
              className="select select-bordered w-full max-w-xs"
            >
              <option value="" disabled>
                Board size
              </option>
              <option value={5}>2 Pieces (EXPERIMENTAL)</option>
              <option value={8}>8 Pieces</option>
              <option value={9}>10 Pieces</option>
              <option value={11}>14 Pieces</option>
            </select>
          </div>
          {/* if there is a button in form, it will close the modal */}
          <div className="modal-action">
            <button className="btn" type="button" onClick={() => props.modal.current?.close()}>
              Cancel
            </button>
            <button className="btn" type="submit">
              Create New Game
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

export default SettingsDialog;
