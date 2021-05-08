import React from 'react';
import {Link, NavLink} from 'react-router-dom';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';

/**
 * The header navigation bar of the application that sits at the top of the
 * page.
 * @component
 * @return {Component} the navigation bar.
 */
const AppHeader = () => {
  return (
    <div className="App-header">
      <NavLink to="/" style={{textDecoration: 'none'}}>
        <h2>CASTING AGENCY</h2>
      </NavLink>
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
};

export default AppHeader;
