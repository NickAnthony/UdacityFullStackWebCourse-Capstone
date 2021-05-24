import React from 'react';
import AppLoader from './AppLoader';
import {useAuth0} from '@auth0/auth0-react';
import {noPortraitPlaceholder} from '../Constants.js';
import {confirmAlert} from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

/**
 * Represents a user profile of a user.  Uses Auth0 to log in and obtain the
 * users data.
 * @component
 * @return {Component} the actor/actress profile page
 */
const UserProfile = () => {
  const {user, isAuthenticated, isLoading, error} = useAuth0();

  const authFailed = (errorMessage) => {
    confirmAlert({
      title: 'Failed to authenticate.',
      message: errorMessage,
      buttons: [
        {
          label: 'Ok',
          onClick: () => {},
        },
      ],
    });
  };

  if (isLoading) {
    return <AppLoader />;
  }

  if (!isAuthenticated) {
    if (error) {
      authFailed(error.message);
    }
    return (
      <div className="User-profile">
        <img src={noPortraitPlaceholder} alt={'Portait'} width="100"/>
        <h2>Please log in.</h2>
      </div>
    );
  }

  return (
    <div className="User-profile">
      <div className="User-profile-wrapper">
        <img src={user.picture} alt={user.name} height="150"/>
        <div className="User-profile-content">
          <h2>Name:</h2>
          <h4>{user.name}</h4>
          <h2>Email:</h2>
          <h4>{user.email}</h4>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
