import React from 'react';
import { Link } from "react-router-dom";

const ActorRow = props => {
  const actor_profile_link = `/actors/${props.actor_id}`;
  return (
    <Link to={actor_profile_link} style={{ textDecoration: 'none' }}>
      <div className="Actor-row" key={props.index}>
        <img src={props.image_src} alt={props.name + " Portait"} width="50"></img>
        <div className="Actor-row-name">
          <div>{props.name}</div>
        </div>
      </div>
    </Link>
  );
}

export default ActorRow;
