import React from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * Represents a linked Thumbnail.  On click, it will redirect to the given
 * resource type and it's id: `/type/id`.
 * @param {object} props - the props object.  Requires the following pieces:
 *     type - the resource type, either "actor" or "movie"
 *     id - the id of the resource
 *     index - the index of this thumbnail in the row/column
 *     imageSrc - the source of the image
 *     title - the text to be displayed below the image
 * @return {Component} NonLinkThumbnail component to represent a thumbnail.
 */
const Thumbnail = (props) => {
  const profileLink = `/${props.type}/${props.id}`;
  return (
    <Link to={profileLink} style={{textDecoration: 'none'}}>
      <div className="Thumbnail" key={props.index}>
        <img
          src={props.imageSrc}
          alt={props.title + ' Image'}
          height="250">
        </img>
        <div className="Thumbnail-text">
          <div>{props.title}</div>
        </div>
      </div>
    </Link>
  );
};

Thumbnail.propTypes = {
  type: PropTypes.string,
  id: PropTypes.number,
  index: PropTypes.number,
  imageSrc: PropTypes.string,
  title: PropTypes.string,
};

export default Thumbnail;
