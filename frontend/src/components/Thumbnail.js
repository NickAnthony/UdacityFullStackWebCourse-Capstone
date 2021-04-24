import React from 'react';
import { Link } from "react-router-dom";

const Thumbnail = props => {
  const profile_link = `/${props.type}/${props.id}`;
  return (
    <Link to={profile_link} style={{ textDecoration: 'none' }}>
      <div className="Thumbnail" key={props.index}>
        <img src={props.image_src} alt={props.title + " Image"} height="250"></img>
        <div className="Thumbnail-text">
          <div>{props.title}</div>
        </div>
      </div>
    </Link>
  );
}

export default Thumbnail;
