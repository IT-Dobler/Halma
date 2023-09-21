import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Hello World!
          <br/>
          I am Halma42
          <br/>
          Help me become awesome: <a target={"_blank"} rel={"noreferrer"} href={"https://github.com/dobler-it/Halma"}>GitHub</a>
        </p>
      </header>
    </div>
  );
}

export default App;
