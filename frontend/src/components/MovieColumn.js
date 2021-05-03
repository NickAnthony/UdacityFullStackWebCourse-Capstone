import React from 'react';
import Thumbnail from './Thumbnail';
import { DOMAIN, no_movie_placeholder } from '../Constants.js';
import AppLoader from './AppLoader';

class MovieColumn extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
       movies: []
     }
  }
  componentDidMount() {
    fetch(DOMAIN + "/movies")
        .then(response => response.json())
        .then((result) => {
          this.setState({ movies: result.movies });
        });
  }
  render() {
    if (this.state.movies === undefined || this.state.movies.length === 0) {
      return (
        <AppLoader />
      );
    }
    return (
      <div className="Movie-column-wrapper">
        <h2 className="Movie-column-header">Movies</h2>
        <h3 className="Column-header">Upcoming</h3>
        <div className="Movie-column">
          {
            this.state.movies.filter((movie) => {
              // Filter to with release dates today or in the future.
              return (new Date() <= new Date(movie.release_date));
            }).map((movie, index) => {
              var image_src = no_movie_placeholder;
              if (movie.movie_photo !== undefined) {
                image_src = movie.movie_photo;
              }
              return <Thumbnail id={movie.id} type="movies" index={index} key={index} image_src={image_src} title={movie.title}/>;
          })}
        </div>
        <h3 className="Column-header">Released</h3>
        <div className="Movie-column">
          {
            this.state.movies.filter((movie) => {
              // Filter to with release dates in the past.
              return (new Date() > new Date(movie.release_date));
            }).map((movie, index) => {
              var image_src = no_movie_placeholder;
              if (movie.movie_photo !== undefined) {
                image_src = movie.movie_photo;
              }
              return <Thumbnail id={movie.id} type="movies" index={index} key={index} image_src={image_src} title={movie.title}/>;
          })}
        </div>
      </div>
    );
  }
}

export default MovieColumn;
