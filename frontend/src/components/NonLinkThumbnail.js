import React from 'react';
import { Link } from "react-router-dom";

const NonLinkThumbnail = props => {
  if (props.selected) {
    return (
        <div className="Thumbnail-selected" key={props.index}>
          <img src={props.image_src} alt={props.title + " Image"} height="250"></img>
          <div className="Thumbnail-text">
            <div>{props.title}</div>
          </div>
        </div>
    );
  } else {
    return (
        <div className="Thumbnail" key={props.index}>
          <img src={props.image_src} alt={props.title + " Image"} height="250"></img>
          <div className="Thumbnail-text">
            <div>{props.title}</div>
          </div>
        </div>
    );
  }
}

export default NonLinkThumbnail;
