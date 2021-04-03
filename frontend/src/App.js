import './App.css';

var basic_data = {
  actors: [
    {
      id: 1,
      name: "George Clooney",
      age: 59,
      gender: "Male",
      movies: [1]
    },
    {
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
    },
    {
      id: 1,
      title: "The Master",
      release_date: "2012-09-21",
      actors: [2]
    },
  ],
};

function App() {
  return (
    <div className="App">
      <h2>Actors</h2>
      <ul>
        {
          basic_data.actors.map((actor, index) => {
            return <li key={index}>{actor.name}</li>
          })
        }
      </ul>
      <h2>Movies</h2>
      <ul>
        {
          basic_data.movies.map((movie, index) => {
            return <li key={index}>{movie.title}</li>
          })
        }
      </ul>
    </div>
  );
}

export default App;
