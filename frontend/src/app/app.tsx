import {Home} from 'home';
import {SoloPlay} from 'solo-play';
import {Route} from 'wouter';

export function App() {
    return (
        <div>
            <Route path={'/'}>
                <Home/>
            </Route>
            <Route path={'/solo-play'}>
                <SoloPlay/>
            </Route>
        </div>
    );
}

export default App;
