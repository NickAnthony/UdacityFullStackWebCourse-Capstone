import React from 'react';

const HEROKU_DOMAIN = "https://nickanthony-casting-agency.herokuapp.com"
const no_portait_placeholder = "https://upload.wikimedia.org/wikipedia/en/b/b1/Portrait_placeholder.png"

class ActorColumn extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
       actors: []
     }
  }
  componentDidMount() {
    fetch(HEROKU_DOMAIN + "/actors")
        .then(response => response.json())
        .then((result) => {
          console.log(result.actors);
          this.setState({ actors: result.actors });
        });
  }
  render() {
    if (this.state.actors === undefined) {
      return (
        <div className="Actor-column">
          <h2 className="Actor-column-header">Actors</h2>
          <h3 className="Availablility-column-header">Loading...</h3>
        </div>
      );
    }
    return (
      <div className="Actor-column">
        <h2 className="Actor-column-header">Actors</h2>
        <h3 className="Availablility-column-header">Available</h3>
        {
          this.state.actors.map((actor, index) => {
            if (actor.portait_url !== undefined) {
              return (
                <div className="Actor-row" key={index}>
                  <img src={actor.portait_url} alt={actor.name + " Portait"} width="50"></img>
                  <div className="Actor-row-name">
                    <div>{actor.name}</div>
                  </div>
                </div>
              )
            } else {
              return (
                <div className="Actor-row" key={index}>
                  <img src={no_portait_placeholder} alt={actor.name + " Portait"} width="50"></img>
                  <div className="Actor-row-name">
                    <div>{actor.name}</div>
                  </div>
                </div>
              )
            }
          })
        }
        <h3 className="Availablility-column-header">Unavabilable</h3>
      </div>
    );
  }
}

export default ActorColumn;
