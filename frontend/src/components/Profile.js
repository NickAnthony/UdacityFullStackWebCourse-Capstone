import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import AppLoader from './AppLoader';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

const no_portait_placeholder = "https://upload.wikimedia.org/wikipedia/en/b/b1/Portrait_placeholder.png"

const Profile = () => {
  const { user, isAuthenticated, isLoading, error } = useAuth0();

  const authFailed = (error_message) => {
    confirmAlert({
        title: 'Failed to authenticate.',
        message: error_message,
        buttons: [
          {
            label: 'Ok',
            onClick: () => {}
          }
        ]
    });
  }

  if (isLoading) {
    return <AppLoader />;
  }

  if (!isAuthenticated) {
    if (error) {
      authFailed(error.message);
    }
    return (
      <div className="User-profile">
        <img src={no_portait_placeholder} alt={"Portait"} width="100"/>
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

export default Profile;
