import React from 'react';
import ActorRow from './ActorRow';

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
    this.setState({
      actors: [
        {
          id: 1,
          name: "George Clooney",
          age: 59,
          gender: "Male",
          portait_url: "https://flxt.tmsimg.com/v9/AllPhotos/23213/23213_v9_bb.jpg",
          movies: [1]
        }, {
          id: 2,
          name: "Amy Adams",
          age: 46,
          gender: "Female",
          portait_url: "https://m.media-amazon.com/images/M/MV5BMTg2NTk2MTgxMV5BMl5BanBnXkFtZTgwNjcxMjAzMTI@._V1_.jpg",
          movies: [2]
        }
      ]
    })
    // Comment out while developing
    // fetch(HEROKU_DOMAIN + "/actors")
    //     .then(response => response.json())
    //     .then((result) => {
    //       console.log(result.actors);
    //       this.setState({ actors: result.actors });
    //     });
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
            var image_src = no_portait_placeholder
            if (actor.portait_url !== undefined) {
              image_src = actor.portait_url;
            }
            return <ActorRow image_src={image_src} index={index} name={actor.name}/>;
          })
        }
        <h3 className="Availablility-column-header">Unavabilable</h3>
      </div>
    );
  }
}

export default ActorColumn;
