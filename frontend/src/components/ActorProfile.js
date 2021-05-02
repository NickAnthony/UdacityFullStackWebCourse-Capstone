import React, { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { DOMAIN, no_portrait_placeholder, no_movie_placeholder } from '../Constants.js';
import { useParams } from "react-router-dom";
import AppLoader from "./AppLoader";
import Thumbnail from "./Thumbnail";
import AssociateActorWithMovie from "./AssociateActorWithMovie";
import EditActor from "./EditActor";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

function ActorProfile() {
  let { id } = useParams();
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [actor, setActor] = useState(null);
  const [movies, setMovies] = useState([]);
  const [fetch_actor, setFetchActor] = useState(true);
  const [show_associate_movie_dialog, setAssociateMovieDiaglog] = useState(false);
  const [show_edit_actor_dialog, setShowEditActorDialog] = useState(false);

  useEffect(() => {
    if (fetch_actor) {
      fetch(`${DOMAIN}/actors/${id}/movies`)
          .then(response => response.json())
          .then((result) => {
            console.log(result);
            if (result.actor.portrait_url === undefined) {
              result.actor.portrait_url = no_portrait_placeholder;
            }
            setActor(result.actor);
            setMovies(result.movies);
          });
      setFetchActor(false);
    }
  }, [fetch_actor, id])

  /* Commits the chosen actor-to-movie association to the database.
   */
  const commitActorAssociation = async (actor_id, selected_movies) => {
    // Save the current movie state in case the update fails.
    const original_movies = movies;

    try {
      const accessToken = await getAccessTokenSilently({
        audience: `casting-agency`,
        scope: "read:current_user",
      });
      // Opportunistically use the setMovies to set the movies.
      setMovies(selected_movies);
      // TO-DO Make this Async
      fetch(`${DOMAIN}/actors/${actor_id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          movies: selected_movies.map(movie => movie.id)
        })
      })
      .then(response => response.json())
      .then((result) => {
        if (result.success) {
          console.log(result);
        } else {
          movieUpdateFailed(result.message, original_movies);
        }
      });
    } catch (e) {
      console.log(e.message);
      movieUpdateFailed(e.message, original_movies);
    }
  }

  const commitActorEdit = async (new_name, new_age, new_gender, new_portrait_url) => {
    // Save the current state in case the update fails.
    const original_actor = actor;

    try {
      const accessToken = await getAccessTokenSilently({
        audience: `casting-agency`,
        scope: "read:current_user",
      });
      // Opportunistically set the new info.
      setActor({
        name: new_name,
        age: new_age,
        gender: new_gender,
        portrait_url: new_portrait_url,
        movies: actor.movies,
      });
      // TO-DO Make this Async
      fetch(`${DOMAIN}/actors/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: new_name,
          age: new_age,
          gender: new_gender,
          portrait_url: new_portrait_url,
        })
      })
      .then(response => response.json())
      .then((result) => {
        if (result.success) {
          console.log(result);
        } else {
          editActorFailed(result.message, original_actor);
        }
      });
    } catch (e) {
      console.log(e.message);
      editActorFailed(e.message, original_actor);
    }
  }

  const editActorFailed = (error_message, original_actor) => {
    setActor(original_actor);
    editFailed(error_message);
  }

  const movieUpdateFailed = (error_message, original_movies) => {
    setMovies(original_movies);
    editFailed(error_message);
  }

  const editFailed = (error_message) => {
    confirmAlert({
        title: 'Failed to save changes!',
        message: error_message,
        buttons: [
          {
            label: 'Ok',
            onClick: () => {}
          }
        ]
    });
  }

  if (!actor) {
    return <AppLoader />
  }

  if (show_edit_actor_dialog) {
    return <EditActor
              actor={actor}
              showDialog={setShowEditActorDialog}
              commitActorEdit={commitActorEdit}/>
  }

  if (show_associate_movie_dialog) {
    return <AssociateActorWithMovie
              actor_name={actor.name}
              actor_id={actor.id}
              showDialog={setAssociateMovieDiaglog}
              commitActorAssociation={commitActorAssociation}/>
  }

  return (
    <div className="Profile-wrapper">
      <div className="Profile-body">

        <div className="Profile">
          <img src={actor.portrait_url} alt={actor.name + " Portrait"} className="Profile-photo" />
          <div className="Profile-content">
            <p className="Profile-name">{actor.name}</p>
            <h2>{actor.gender}, {actor.age}</h2>
            {
              (isAuthenticated) &&
                  <div className="Profile-menu">
                    <button className="Button Profile-menu-button"  onClick={() => setAssociateMovieDiaglog(true)}>Update movies</button>
                    <button className="Button Profile-menu-button"  onClick={() => setShowEditActorDialog(true)}>Edit</button>
                    <button className="Button Profile-menu-button-delete"  onClick={() => {}}>Delete actor</button>
                  </div>
            }
            {
              (!isAuthenticated) &&
                  <div className="Profile-menu">
                    <h4>
                        Only Casting Directors or Executive Producers can make
                        changes. <br/> Please log in to edit.
                    </h4>
                  </div>
            }
          </div>
        </div>

        <div className="Movie-column-wrapper">
          <h3 className="Upcoming-column-header">Upcoming</h3>
          <div className="Movie-column">
            {
              movies.map((movie, index) => {
                var image_src = no_movie_placeholder
                if (movie.movie_photo !== undefined) {
                  image_src = movie.movie_photo;
                }
                return <Thumbnail id={movie.id} type="movies" index={index} key={index} image_src={image_src} title={movie.title}/>;
            })}
          </div>
          <h3 className="Upcoming-column-header">Released</h3>
        </div>

      </div>
    </div>
  );
};

export default ActorProfile;
