import React from 'react';
import MovieThumbnail from './MovieThumbnail';

const HEROKU_DOMAIN = "https://nickanthony-casting-agency.herokuapp.com"
const no_movie_placeholder = "https://image.flaticon.com/icons/png/512/2790/2790961.png"

class MovieColumn extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
       movies: []
     }
  }
  componentDidMount() {
    this.setState({
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
      ]
    });
    // Comment out while developing
    // fetch(HEROKU_DOMAIN + "/movies")
    //     .then(response => response.json())
    //     .then((result) => {
    //       this.setState({ movies: result.movies });
    //     });
  }
  render() {
    if (this.state.movies === undefined) {
      return (
        <div className="Movie-column-wrapper">
          <h2 className="Movie-column-header">Movies</h2>
          <h3 className="Upcoming-column-header">Loading...</h3>
        </div>
      );
    }
    return (
      <div className="Movie-column-wrapper">
        <h2 className="Movie-column-header">Movies</h2>
        <h3 className="Upcoming-column-header">Upcoming</h3>
        <div className="Movie-column">
          {
            this.state.movies.map((movie, index) => {
              var image_src = no_movie_placeholder
              if (movie.movie_photo !== undefined) {
                image_src = movie.movie_photo;
              }
              return <MovieThumbnail index={index} image_src={image_src} title={movie.title}/>;
          })}
        </div>
        <h3 className="Upcoming-column-header">Released</h3>
      </div>
    );
  }
}

export default MovieColumn;
