import React from 'react';

class MovieColumn extends React.Component {
  render() {
    return (
      <div className="Movie-column-wrapper">
        <h2 className="Movie-column-header">Movies</h2>
        <h3 className="Upcoming-column-header">Upcoming</h3>
        <div className="Movie-column">
          { this.props.movies.map((movie, index) =>
            <div className="Movie-thumbnail">
              <img src={movie.movie_photo} alt={movie.title + " Image"} height="250"></img>
              <div className="Movie-date">
                <div>{movie.title}</div>
              </div>
            </div>
          )}
        </div>
        <h3 className="Upcoming-column-header">Released</h3>
      </div>
    );
  }
}

export default MovieColumn;
