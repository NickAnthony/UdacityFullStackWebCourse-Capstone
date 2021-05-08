import React, {useState, useEffect} from 'react';
import {DOMAIN, noMoviePlaceholder} from '../Constants.js';
import AppLoader from './AppLoader';
import NonLinkThumbnail from './NonLinkThumbnail';
import PropTypes from 'prop-types';

/**
 * Represents a subcomponent that associates the actor with props.actorId with
 * movies selected on the page.
 * The selectedMovies state is the current set of selected movies.  It defaults
 * to the movies already associated with the actor/actress.  A user can then
 * select movies and deselect movies and the state will be updated.
 * When save is clicked, this component is taken down and the user is returned
 * back to the ActorProfile
 * @component
 * @param {object} props - the props object.  Requires the following pieces:
 *     actorId - the database id of the actor/actress
 *     actorName - the name of the actor/actress.
 *     showDialog - callback whether or not to show this component
 *     commitActorAssociation - callback to commit the new actor-to-move
 *                              associations to the database.
 * @return {Component} this component
 */
function AssociateActorWithMovie(props) {
  const [movies, setMovies] = useState([]);
  const [fetchMovies, setFetchMovies] = useState(true);
  const [selectedMovies, setSelectedMovies] = useState([]);

  useEffect(() => {
    if (fetchMovies) {
      fetch(`${DOMAIN}/movies`)
          .then((response) => response.json())
          .then((result) => {
            setMovies(result.movies);
            // If we try to use selectedMovies directly, the state will
            // overwrite itself -> Use a local array then do one state update.
            let selectedMoviesArray = [];
            result.movies.forEach((movie, index) => {
              if (movie.actors.includes(props.actorId)) {
                selectedMoviesArray = [...selectedMoviesArray, movie];
              }
            });
            setSelectedMovies(selectedMoviesArray);
          });
      // Save original selected movies in case the fetch fails.
      setFetchMovies(false);
    }
  }, [fetchMovies, movies, selectedMovies, props.actorId]);

  /**
   * @return {boolean} true if the given movie is in the set of selected
   * movies.
   * @param {object} movie - movie to check
   */
  const isSelectedMovie = (movie) => {
    return selectedMovies.some(
        (selectedMovie) => selectedMovie.id === movie.id,
    );
  };

  /** Toggles association of the current actor/actress (props.actorId) with the
   * movie selected.  Just updates the state and UI, not the database.
   * @param {object} movie - movie that was just clicked
   */
  const toggleAssociateActor = async (movie) => {
    if (isSelectedMovie(movie)) {
      // Remove movie.
      setSelectedMovies(selectedMovies.filter(
          (selectedMovie) => selectedMovie.id !== movie.id));
    } else {
      // Add movie.
      setSelectedMovies([...selectedMovies, movie]);
    }
  };

  /** On the parent page, send the update to the server. */
  const commitAssociationAndDismiss = () => {
    props.commitActorAssociation(props.actorId, selectedMovies);
    dismissPage();
  };
  const dismissPage = () => {
    setFetchMovies(true);
    // This callback dismisses this component and UI.
    props.showDialog(false);
  };

  if (fetchMovies) {
    return <AppLoader />;
  }

  return (
    <div className="Profile-wrapper">
      <div className="Profile-body">

        <div className="Profile-menu-horizontal">
          <button className="Button Profile-menu-button-save"
            onClick={commitAssociationAndDismiss}>
              Save
          </button>
          <button className="Button Profile-menu-button-cancel"
            onClick={dismissPage}>
              Cancel
          </button>
        </div>

        <h2>
          Select all movies that {props.actorName} acted in or will act in.
        </h2>

        <div className="Movie-column-wrapper">
          <div className="Movie-column">
            {
              movies.map((movie, index) => {
                let imageSrc = noMoviePlaceholder;
                if (movie.movie_photo !== undefined) {
                  imageSrc = movie.movie_photo;
                }
                return (
                  <div
                    onClick={() => {
                      toggleAssociateActor(movie);
                    }}
                    key={index}>
                    <NonLinkThumbnail
                      id={movie.id}
                      index={index}
                      imageSrc={imageSrc}
                      title={movie.title}
                      selected={isSelectedMovie(movie)}/>
                  </div>
                );
              })}
          </div>
        </div>

      </div>
    </div>
  );
};

AssociateActorWithMovie.propTypes = {
  actorName: PropTypes.string,
  actorId: PropTypes.number,
  showDialog: PropTypes.func,
  commitActorAssociation: PropTypes.func,
};

export default AssociateActorWithMovie;
