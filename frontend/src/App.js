import './App.css';
import ActorColumn from './components/ActorColumn';
import MovieColumn from './components/MovieColumn';
import AppHeader from './components/AppHeader';


var basic_data = {
  actors: [
    {
      id: 1,
      name: "George Clooney",
      age: 59,
      gender: "Male",
      portait_url: "https://flxt.tmsimg.com/v9/AllPhotos/23213/23213_v9_bb.jpg",
      movies: [1]
    }, {
      id: 2,
      name: "Amy Adams",
      age: 46,
      gender: "Female",
      portait_url: "https://m.media-amazon.com/images/M/MV5BMTg2NTk2MTgxMV5BMl5BanBnXkFtZTgwNjcxMjAzMTI@._V1_.jpg",
      movies: [2]
    }
  ],
  movies: [
    {
      id: 1,
      title: "Ocean's Eleven",
      release_date: "2001-12-07",
      movie_photo: "https://m.media-amazon.com/images/M/MV5BYzVmYzVkMmUtOGRhMi00MTNmLThlMmUtZTljYjlkMjNkMjJkXkEyXkFqcGdeQXVyNDk3NzU2MTQ@._V1_.jpg",
      actors: [1]
    }, {
      id: 2,
      title: "The Master",
      release_date: "2012-09-21",
      movie_photo: "https://m.media-amazon.com/images/M/MV5BMTQ2NjQ5MzMwMF5BMl5BanBnXkFtZTcwMjczNTAzOA@@._V1_UY1200_CR90,0,630,1200_AL_.jpg",
      actors: [2]
    },
  ],
};

function App() {
  return (
    <div className="App">
      <AppHeader/>
      <div className="Column-wrapper">
        <ActorColumn actors={basic_data.actors}/>
        <MovieColumn movies={basic_data.movies}/>
      </div>
    </div>
  );
}

export default App;
