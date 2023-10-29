import { useSelector } from 'react-redux';
import { selectStepCounter } from 'game-logic';

/* eslint-disable-next-line */
export interface StepCounterProps {}

export function StepCounter(props: StepCounterProps) {
  const stepCounter = useSelector(selectStepCounter);

  return (
    <div className="stats mt-10">
      <div className="stat">
        <div className="stat-title">Steps</div>
        <div className="stat-value text-right">{stepCounter}</div>
      </div>
    </div>
  );
}

export default StepCounter;
