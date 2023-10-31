import { Route } from 'wouter';
import { Home } from 'home';
import { SoloPlay } from 'solo-play';

export function App() {
  return (
    <div className="bg-base-100 h-screen">
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
