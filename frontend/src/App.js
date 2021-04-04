import './App.css';
import ActorColumn from './components/ActorColumn';
import MovieColumn from './components/MovieColumn';

var basic_data = {
  actors: [
    {
      id: 1,
      name: "George Clooney",
      age: 59,
      gender: "Male",
      movies: [1]
    }, {
      id: 2,
      name: "Amy Adams",
      age: 46,
      gender: "Female",
      movies: [2]
    }
  ],
  movies: [
    {
      id: 1,
      title: "Ocean's Eleven",
      release_date: "2001-12-07",
      actors: [1]
    }, {
      id: 2,
      title: "The Master",
      release_date: "2012-09-21",
      actors: [2]
    },
  ],
};

function App() {
  return (
    <div className="App">
      <ActorColumn actors={basic_data.actors}/>
      <MovieColumn movies={basic_data.movies}/>
    </div>
  );
}

export default App;
