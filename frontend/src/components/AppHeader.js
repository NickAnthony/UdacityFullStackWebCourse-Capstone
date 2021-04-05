import React from 'react';

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
          <button onClick={this.loginWithAuth0} className="Menu-button">
            Login
          </button>
        </div>
      </div>
    );
  }
}

export default AppHeader;
