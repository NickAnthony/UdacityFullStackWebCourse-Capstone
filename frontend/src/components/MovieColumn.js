import React from 'react';

class MovieColumn extends React.Component {
  render() {
    return (
      <div className="Movie-column-wrapper">
        <h2 className="Movie-column-header">Movies</h2>
        <div className="Movie-column">
          { this.props.movies.map((movie, index) =>
            <div className="Movie-thumbnail">
              <img src={movie.movie_photo} alt={movie.title + " Image"} height="250"></img>
              <div className="Movie-date">
                <div>{movie.release_date}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default MovieColumn;
