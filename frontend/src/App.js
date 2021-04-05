import './App.css';
import ActorColumn from './components/ActorColumn';
import MovieColumn from './components/MovieColumn';
import AppHeader from './components/AppHeader';
import NewActor from './components/NewActor';

// <div className="Column-wrapper">
//   <ActorColumn/>
//   <MovieColumn/>
// </div>
function App() {
  return (
    <div className="App">
      <AppHeader/>
      <NewActor />
    </div>
  );
}

export default App;
