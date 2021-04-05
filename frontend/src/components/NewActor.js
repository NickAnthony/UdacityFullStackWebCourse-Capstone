import React from 'react';
import ActorRow from './ActorRow';

const HEROKU_DOMAIN = "https://nickanthony-casting-agency.herokuapp.com"
const no_portait_placeholder = "https://upload.wikimedia.org/wikipedia/en/b/b1/Portrait_placeholder.png"

class NewActor extends React.Component {
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
    return (
      <div className="New-actor-wrapper">
        <form>
          <h1>New Actor</h1>
          <p>First name</p>
          <input type="text" />
          <p>Last name</p>
          <input type="text" />
          <p>Age</p>
          <input type="number" />
          <p>Portait Photo</p>
          <input type="number" />
          &nbsp;
          <img src={no_portait_placeholder} alt={"Portait"} width="50"/>
        </form>
      </div>
    );
  }
}

export default NewActor;
