import React, { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { DOMAIN, no_portrait_placeholder, no_movie_placeholder } from '../Constants.js';
import { useParams } from "react-router-dom";
import AppLoader from "./AppLoader";
import NonLinkThumbnail from "./NonLinkThumbnail";
import { Redirect } from 'react-router-dom';


function AssociateActorWithMovie(props) {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [actor, setActor] = useState(null);
  const [movies, setMovies] = useState([]);
  const [fetch_movies, setFetchMovies] = useState(true);
  const [redirect, setRedirect] = useState(false);
  const [selected_movies, setSelectedMovies] = useState([]);
  const [original_selected_movies, setOriginalSelectedMovies] = useState([]);


  useEffect(() => {
    if (fetch_movies) {
      fetch(`${DOMAIN}/movies`)
          .then(response => response.json())
          .then((result) => {
              setMovies(result.movies);
              // If we try to use selected_movies directly, the state will
              // overwrite itself -> Use a local array then do one state update.
              var selected_movies_array = []
              result.movies.map((movie, index) => {
                if (movie.actors.includes(props.actor_id)) {
                  selected_movies_array = [...selected_movies_array, movie]
                }
              })
              setSelectedMovies(selected_movies_array);
              setOriginalSelectedMovies(selected_movies_array);
          });
      // Save original selected movies in case the fetch fails.
      setFetchMovies(false);
    }
  }, [fetch_movies, movies, selected_movies])

  /* Returns true if the given movie is in the set of selected movies.
   */
  const isSelectedMovie = (movie) => {
    return selected_movies.some(selected_movie => selected_movie.id === movie.id);
  }

  /* Toggles association of the current actor/actress (props.actor_id) with the
   * movie selected.  Just updates the state and UI, not the database.
   */
  const toggleAssociateActor = async (movie) => {
    if (isSelectedMovie(movie)) {
      // Remove movie.
      setSelectedMovies(selected_movies.filter(
        selected_movie => selected_movie.id !== movie.id));
    } else {
      // Add movie.
      setSelectedMovies([...selected_movies, movie]);
    }
  }

  /* On the parent page, send the update to the server. */
  const commitAssociationAndDismiss = () => {
    props.commitActorAssociation(props.actor_id, selected_movies);
    dismissPage();
  }
  const dismissPage = () => {
    setFetchMovies(true);
    // This callback dismisses this component and UI.
    props.showDialog(false);
  }

  if (fetch_movies) {
    return <AppLoader />
  }

  if (redirect) {
    return <Redirect to={`/actors/${props.actor_id}`} />;
  }

  return (
    <div className="Profile-wrapper">
      <div className="Profile-body">

        <div className="Profile-menu-horizontal">
          <button className="Button Profile-menu-button-save"  onClick={commitAssociationAndDismiss}>Save</button>
          <button className="Button Profile-menu-button-cancel"  onClick={dismissPage}>Cancel</button>
        </div>

        <h2>Select all movies that {props.actor_name} acted in or will act in.</h2>

        <div className="Movie-column-wrapper">
          <div className="Movie-column">
            {
              movies.map((movie, index) => {
                var image_src = no_movie_placeholder
                if (movie.movie_photo !== undefined) {
                  image_src = movie.movie_photo;
                }
                return (
                  <a onClick={() => {toggleAssociateActor(movie)}}>
                    <NonLinkThumbnail id={movie.id} index={index} key={index} image_src={image_src} title={movie.title} selected={isSelectedMovie(movie)}/>
                  </a>
                );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AssociateActorWithMovie;
