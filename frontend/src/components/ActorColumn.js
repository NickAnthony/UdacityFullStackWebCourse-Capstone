import React from 'react';

class ActorColumn extends React.Component {
  render() {
    return (
      <div className="Actor-column">
        <h2 className="Actor-column-header">Actors</h2>
        <h3 className="Availablility-column-header">Available</h3>
        {
          this.props.actors.map((actor, index) =>
            <div className="Actor-row">
              <img src={actor.portait_url} alt={actor.name + " Portait"} width="50"></img>
              <div className="Actor-row-name">
                <div>{actor.name}</div>
              </div>
            </div>
          )
        }
        <h3 className="Availablility-column-header">Unavabilable</h3>
      </div>
    );
  }
}

export default ActorColumn;
