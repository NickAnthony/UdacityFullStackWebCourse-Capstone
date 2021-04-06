import React from 'react';
import {Link} from 'react-router-dom';

class AppHeader extends React.Component {
  constructor(props) {
    super(props);
    // This binding is necessary to make `this` work in the callback
    this.loginWithAuth0 = this.loginWithAuth0.bind(this);
  }
  loginWithAuth0(e) {
    e.preventDefault();
    console.log('The link was clicked.');

  }
  render() {
    return (
      <div className="App-header">
        <h2>CASTING AGENCY</h2>
        <div className="Menu">
          <Link to="/" className="Menu-button">Home</Link>
          <Link to="/new-actor" className="Menu-button">Add Actor</Link>
          <Link to="/login" className="Menu-button">Login</Link>
        </div>
      </div>
    );
  }
}

export default AppHeader;
