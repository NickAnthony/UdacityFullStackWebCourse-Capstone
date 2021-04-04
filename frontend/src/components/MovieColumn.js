import React from 'react';

class MovieColumn extends React.Component {
  render() {
    return (
      <div>
        <h2>Movies</h2>
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
