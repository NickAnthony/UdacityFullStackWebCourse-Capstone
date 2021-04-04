import React from 'react';

class ActorColumn extends React.Component {
  render() {
    return (
      <div className="Actor-column">
        <h2 className="Actor-column-header">Actors</h2>
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
      </div>
    );
  }
}

export default ActorColumn;
