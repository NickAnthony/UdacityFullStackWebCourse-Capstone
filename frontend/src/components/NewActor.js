import React from 'react';

const no_portait_placeholder = "https://upload.wikimedia.org/wikipedia/en/b/b1/Portrait_placeholder.png"

class NewActor extends React.Component {
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
