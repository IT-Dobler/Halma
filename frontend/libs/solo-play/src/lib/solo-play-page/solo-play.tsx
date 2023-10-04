import styles from './solo-play.module.scss';

/* eslint-disable-next-line */
export interface SoloPlayProps {}

export function SoloPlay(props: SoloPlayProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to SoloPlay!</h1>
    </div>
  );
}

export default SoloPlay;
