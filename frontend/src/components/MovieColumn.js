import React from 'react';

class MovieColumn extends React.Component {
  render() {
    return (
      <div className="Movie-column">
        <h2 className="Movie-column-header">Movies</h2>
        <ul>
          { this.props.movies.map((movie, index) => {
              return <li key={index}>{movie.title}</li>
           })}
        </ul>
      </div>
    );
  }
}

export default MovieColumn;
