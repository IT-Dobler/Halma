import { useSelector } from 'react-redux';
import {selectAllPlayerIds, selectStepCounter} from 'game-logic';

export function StepCounter() {
  const stepCounter = useSelector(selectStepCounter);
  const playersId = useSelector(selectAllPlayerIds);

  return (
    <div className="stats w-24 mr-4">
      <div className="stat">
        <div className="stat-title">{playersId.length === 1 ? 'Steps' : 'Round'}</div>
        <div className="stat-value text-right">{Math.ceil(stepCounter / playersId.length).toString()}</div>
      </div>
    </div>
  );
}

export default StepCounter;
