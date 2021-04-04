import React from 'react';

class ActorColumn extends React.Component {
  render() {
    return (
      <div className="Actor-column">
        <h2 className="Actor-column-header">Actors</h2>
        <ul>
          { this.props.actors.map((actor, index) => {
              return <li key={index}>{actor.name}</li>
           })}
        </ul>
      </div>
    );
  }
}

export default ActorColumn;
