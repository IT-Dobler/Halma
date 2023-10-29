import { Link, Route } from 'wouter';
import { Home } from 'home';
import { SoloPlay } from 'solo-play';
import styles from './app.module.scss';

export function App() {
  return (
    <div className="bg-base-100 h-screen">
      <Link href={'/'}>
        <a className={styles.spacing}>Home</a>
      </Link>
      <Link href={'/solo-play'}>
        <a>Play</a>
      </Link>

      <Route path={'/'}>
        <Home />
      </Route>
      <Route path={'/solo-play'}>
        <SoloPlay />
      </Route>
    </div>
  );
}

export default App;
