import { useSelector } from 'react-redux';
import {selectAllPlayerIds, selectStepCounter} from 'game-logic';

/* eslint-disable-next-line */
export interface StepCounterProps {}

export function StepCounter(props: StepCounterProps) {
  const stepCounter = useSelector(selectStepCounter);
  const playersId = useSelector(selectAllPlayerIds);

  return (
    <div className="stats mt-10">
      <div className="stat">
        <div className="stat-title">{playersId.length === 1 ? 'Steps' : 'Rounds'}</div>
        <div className="stat-value text-right">{Math.ceil(stepCounter / playersId.length).toString()}</div>
      </div>
    </div>
  );
}

export default StepCounter;
