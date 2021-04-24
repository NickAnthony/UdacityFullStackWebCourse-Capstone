import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Redirect } from 'react-router-dom';
import { DOMAIN, no_portrait_placeholder } from '../Constants.js';
import delete_icon from './../assets/delete_icon.png';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

function DeleteActor() {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [actors, setActors] = useState([]);
  const [redirect, setRedirect] = useState(false);
  const [fetch_actors, setFetchActors] = useState(false);

  useEffect(() => {
    if (!fetch_actors) {
      fetch(DOMAIN + "/actors")
          .then(response => response.json())
          .then((result) => {
            setActors(result.actors)
          });
      setFetchActors(true);
    }
  }, [fetch_actors])
  const confirmDelete = (actor_name, actor_id) => {
    confirmAlert({
        title: 'Confirm to delete',
        message: `Are you sure you want to permanently remove ${actor_name}?`,
        buttons: [
          {
            label: 'Yes',
            onClick: () => deleteActor(actor_id)
          },
          {
            label: 'No',
            onClick: () => {}
          }
        ]
      });
  }

  const deleteActor = async (actor_id) => {
    try {
      // TO-DO Make this occur on page load, not on submit
      const accessToken = await getAccessTokenSilently({
        audience: `casting-agency`,
        scope: "read:current_user",
      });
      // TO-DO Make this Async
      fetch(`${DOMAIN}/actors/${actor_id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.json())
      .then((result) => {
        console.log(result);
        if (result.success) {
          setRedirect(true)
        }
      });

    } catch (e) {
      console.log(e.message);
    }
  };

  if (redirect) {
    return <Redirect to={"/"} />;
  }

  if (!isAuthenticated) {
    return(
      <div className="New-actor-wrapper">
        <h1>Please log in to be able to delete actors</h1>
      </div>
    )
  }

  return (
      <div className="Delete-actor-wrapper">
        {
          actors.map((actor, index) => {
            var image_src = no_portrait_placeholder;
            if (actor.portrait_url !== undefined) {
              image_src = actor.portrait_url;
            }
            return (
              <div className="Delete-actor-row" key={index}>
                <img src={image_src} alt={actor.name + " Portait"} width="50"></img>
                <div className="Delete-actor-row-name">
                  <div>{actor.name}</div>
                </div>
                <img src={delete_icon} alt="Delete button" className="Delete-button" onClick={() => confirmDelete(actor.name, actor.id)}></img>
              </div>
            )
          })
        }
      </div>
  );
}

export default DeleteActor;
