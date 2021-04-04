import React from 'react';

const MovieThumbnail = props => {
  return (
    <div className="Movie-thumbnail" key={props.index}>
      <img src={props.image_src} alt={props.title + " Image"} height="250"></img>
      <div className="Movie-date">
        <div>{props.title}</div>
      </div>
    </div>
  );
}

export default MovieThumbnail;
