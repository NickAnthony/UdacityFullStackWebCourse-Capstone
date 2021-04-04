import './App.css';
import ActorColumn from './components/ActorColumn';
import MovieColumn from './components/MovieColumn';
import AppHeader from './components/AppHeader';

function App() {
  return (
    <div className="App">
      <AppHeader/>
      <div className="Column-wrapper">
        <ActorColumn/>
        <MovieColumn/>
      </div>
    </div>
  );
}

export default App;
