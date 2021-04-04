import React from 'react';

const ActorRow = props => {
  return (
    <div className="Actor-row" key={props.index}>
      <img src={props.image_src} alt={props.name + " Portait"} width="50"></img>
      <div className="Actor-row-name">
        <div>{props.name}</div>
      </div>
    </div>
  );
}

export default ActorRow;
