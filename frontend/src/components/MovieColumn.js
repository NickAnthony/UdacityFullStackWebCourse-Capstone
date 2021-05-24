import React from 'react';
import Thumbnail from './Thumbnail';
import {DOMAIN, noMoviePlaceholder} from '../Constants.js';
import AppLoader from './AppLoader';

/**
 * Represents a column of actors and actresses.
 * Fetches the /actors from the database then constructs an array of Movie
 * Thumbnails.
 * @component
 */
class MovieColumn extends React.Component {
  /**
   * Constructs MovieColumn and sets initial state.
   * @constructor
   * @param {object} props -  the default props object
   */
  constructor(props) {
    super(props);
    this.state = {
      movies: [],
    };
  }
  /**
   * Runs when component mounts. Fetches the list of all movies from the
   * database.
   */
  componentDidMount() {
    fetch(DOMAIN + '/movies')
        .then((response) => response.json())
        .then((result) => {
          this.setState({movies: result.movies});
        });
  }
  /**
   * Returns the constructed components and html.
   * If the RPC call has no yet returned, shows a loading icon.
   * @return {object} the list of Thumbnails for all actors.
   */
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
              let imageSrc = noMoviePlaceholder;
              if (movie.movie_photo !== undefined) {
                imageSrc = movie.movie_photo;
              }
              return <Thumbnail
                id={movie.id}
                type="movies"
                index={index}
                key={index}
                imageSrc={imageSrc}
                title={movie.title}/>;
            })}
        </div>
        <h3 className="Column-header">Released</h3>
        <div className="Movie-column">
          {
            this.state.movies.filter((movie) => {
              // Filter to with release dates in the past.
              return (new Date() > new Date(movie.release_date));
            }).map((movie, index) => {
              let imageSrc = noMoviePlaceholder;
              if (movie.movie_photo !== undefined) {
                imageSrc = movie.movie_photo;
              }
              return <Thumbnail
                id={movie.id}
                type="movies"
                index={index}
                key={index}
                imageSrc={imageSrc}
                title={movie.title}/>;
            })}
        </div>
      </div>
    );
  }
}

export default MovieColumn;
