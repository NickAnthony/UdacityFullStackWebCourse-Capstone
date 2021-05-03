import React from 'react';
import { Link } from 'react-router-dom';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';

class AppHeader extends React.Component {
  constructor(props) {
    super(props);
    // This binding is necessary to make `this` work in the callback
    console.log("window.location.origin: " + window.location.origin)
  }
  render() {
    return (
      <div className="App-header">
        <h2>CASTING AGENCY</h2>
        <div className="Menu">
          <Link to="/" className="Button Menu-button">Home</Link>
          <Link to="/new-actor" className="Button Menu-button">Add Actor</Link>
          <Link to="/new-movie" className="Button Menu-button">Add Movie</Link>
          <Link to="/profile" className="Button Menu-button">Profile</Link>
          <LoginButton />
          <LogoutButton />
        </div>
      </div>
    );
  }
}

export default AppHeader;
