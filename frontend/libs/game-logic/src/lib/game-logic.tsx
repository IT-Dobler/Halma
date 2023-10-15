import styles from './game-logic.module.scss';

/* eslint-disable-next-line */
export interface GameLogicProps {}

export function GameLogic(props: GameLogicProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to GameLogic!</h1>
    </div>
  );
}

export default GameLogic;
