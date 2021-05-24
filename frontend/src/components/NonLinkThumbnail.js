import React from 'react';
import PropTypes from 'prop-types';

/**
 * Represents a non-linked Thumbnail.  This means it won't redirect on click
 * so the on click functionality can be overriden.
 * Used as the select-deselect thumbnail in the associate components.
 * If props.selected == true, then it highlights as green.
 * @param {object} props - the props object.  Requires the following pieces:
 *     selected - true == highlight as green. false == no highlight.
 *     index - the index of this thumbnail in the row/column
 *     imageSrc - the source of the image
 *     title - the text to be displayed below the image
 * @return {Component} NonLinkThumbnail component to represent a thumbnail.
 */
const NonLinkThumbnail = (props) => {
  if (props.selected) {
    return (
      <div className="Thumbnail-selected" key={props.index}>
        <img
          src={props.imageSrc}
          alt={props.title + ' Image'}
          height="250">
        </img>
        <div className="Thumbnail-text">
          <div>{props.title}</div>
        </div>
      </div>
    );
  } else {
    return (
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
    );
  }
};

NonLinkThumbnail.propTypes = {
  selected: PropTypes.bool,
  index: PropTypes.number,
  imageSrc: PropTypes.string,
  title: PropTypes.string,
};

export default NonLinkThumbnail;
