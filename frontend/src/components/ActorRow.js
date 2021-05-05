import React from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * Represents a single actor or actress.
 * Links out to that specific actor's or actress's page.
 * @component
 * @param {object} props - the props object.  Requires the following pieces:
 *     actorId - the database id of the actor/actress
 *     index - the index of this actor/actress row in the column
 *     imageSrc - the source of the actor/actress portrait/profile image
 *     name - the full name of the actor/actress
 * @return {Link} the formatted actor row as a link to the actor page
 */
const ActorRow = (props) => {
  const actorProfileLink = `/actors/${props.actorId}`;
  return (
    <Link to={actorProfileLink} style={{textDecoration: 'none'}}>
      <div className="Actor-row" key={props.index}>
        <img src={props.imageSrc} alt={props.name + ' Portait'} width="50"/>
        <div className="Actor-row-name">
          <div>{props.name}</div>
        </div>
      </div>
    </Link>
  );
};

ActorRow.propTypes = {
  actorId: PropTypes.number,
  index: PropTypes.number,
  imageSrc: PropTypes.string,
  name: PropTypes.string,
};

export default ActorRow;
