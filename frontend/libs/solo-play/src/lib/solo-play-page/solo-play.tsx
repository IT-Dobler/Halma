import {
  StandardPageLayout,
  GameBoard,
  StepCounter,
  VictoryDialog,
  SettingsDialog,
  InstructionsDialog,
} from 'ui';
import { useDispatch, useSelector } from 'react-redux';
import {fetchGameInstance, selectGameConfig, selectIsWon, selectShowInstructions} from 'game-logic';
import { AppDispatch } from '../../../../../src/main';
import { useEffect, useRef } from 'react';
import EndTurnButton from '../end-turn-button/end-turn-button';

// TODO this tutorial seems rather complete :) https://redux.js.org/tutorials/essentials/part-5-async-logic#example-rest-api-and-client
export function SoloPlay() {
  const dispatch = useDispatch<AppDispatch>();
  const isWon = useSelector(selectIsWon);
  const showInstructions = useSelector(selectShowInstructions);
  const gameConfig = useSelector(selectGameConfig);

  const victoryModal = useRef<HTMLDialogElement>(null);
  const settingsModal = useRef<HTMLDialogElement>(null);
  const instructionModal = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isWon) {
      victoryModal.current?.showModal();
    }
  }, [isWon]);

  useEffect(() => {
    if (showInstructions) {
      instructionModal.current?.showModal();
    }
  }, [showInstructions]);

  // Run only once at startup
  useEffect(() => {
    onCreateGame();
  }, []);

  const onCreateGame = async () => {
    await dispatch(fetchGameInstance(gameConfig));
  };

  return (
    <StandardPageLayout>
      <div>
        <VictoryDialog modal={victoryModal} />
        <SettingsDialog modal={settingsModal} />
        <InstructionsDialog modal={instructionModal} />

        <div className="flex flex-col items-center">
          <GameBoard />
        </div>
        <div className="flex flex-row justify-center items-center">
          <StepCounter />
          <EndTurnButton />
        </div>

        <div className="flex flex-row justify-center">
          <button
            className="btn btn-outline w-48 mr-4"
            onClick={() => onCreateGame()}
          >
            Reset
          </button>

          <button
            className="btn btn-outline w-48"
            onClick={() => settingsModal.current?.showModal()}
          >
            Settings
          </button>
        </div>
        <div className="flex flex-row justify-center mt-4">
          <button
            className="btn w-48 mr-4"
            onClick={() => instructionModal.current?.show()}
          >
            HELP
          </button>
        </div>
      </div>
    </StandardPageLayout>
  );
}

export default SoloPlay;
