import React from 'react';
import {DOMAIN, noPortraitPlaceholder} from '../Constants.js';
import ActorRow from './ActorRow';
import AppLoader from './AppLoader';

/**
 * Represents a column of actors and actresses.
 * Fetches the /actors from the database then constructs an array of ActorRows.
 * @component
 */
class ActorColumn extends React.Component {
  /**
   * Constructs ActorColumn and sets initial state.
   * @constructor
   * @param {object} props -  the default props object
   */
  constructor(props) {
    super(props);
    this.state = {
      actors: [],
    };
  }
  /**
   * Runs when component mounts. Fetches the list of actors from the database.
   */
  componentDidMount() {
    fetch(DOMAIN + '/actors')
        .then((response) => response.json())
        .then((result) => {
          this.setState({actors: result.actors});
        });
  }
  /**
   * Returns the constructed components and html.
   * If the RPC call has no yet returned, shows a loading icon.
   * @return {object} the list of ActorRows for all actors.
   */
  render() {
    if (this.state.actors === undefined || this.state.actors.length === 0) {
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
            let imageSrc = noPortraitPlaceholder;
            if (actor.portrait_url !== undefined) {
              imageSrc = actor.portrait_url;
            }
            return <ActorRow
              actor_id={actor.id}
              image_src={imageSrc}
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
