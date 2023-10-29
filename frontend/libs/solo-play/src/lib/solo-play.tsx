import {Footer, Header} from 'ui';
import styles from './solo-play.module.scss';

/* eslint-disable-next-line */
export interface SoloPlayProps {
}

export function SoloPlay(props: SoloPlayProps) {
    return (
        <div className={styles['container']}>
            <Header/>
            <h1>Welcome to SoloPlay!</h1>
            <Footer/>
        </div>
    );
}

export default SoloPlay;
