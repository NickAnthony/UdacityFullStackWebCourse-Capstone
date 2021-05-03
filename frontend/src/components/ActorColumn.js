import React from 'react';
import ActorRow from './ActorRow';
import { DOMAIN, no_portrait_placeholder } from '../Constants.js';
import AppLoader from './AppLoader';

class ActorColumn extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
       actors: []
     }
  }
  componentDidMount() {
    fetch(DOMAIN + "/actors")
        .then(response => response.json())
        .then((result) => {
          this.setState({ actors: result.actors });
        });
  }
  render() {
    if (this.state.actors === undefined || this.state.actors.length == 0) {
      return (
        <AppLoader />
      );
    }
    return (
      <div className="Actor-column">
        <h2 className="Actor-column-header">Actors & Actresses</h2>
        <h3 className="Column-header">Available</h3>
        {
          this.state.actors.map((actor, index) => {
            var image_src = no_portrait_placeholder
            if (actor.portrait_url !== undefined) {
              image_src = actor.portrait_url;
            }
            return <ActorRow
                      actor_id={actor.id}
                      image_src={image_src}
                      key={index}
                      index={index}
                      name={actor.name}/>;
          })
        }
        <h3 className="Column-header">Unavabilable</h3>
      </div>
    );
  }
}

export default ActorColumn;
