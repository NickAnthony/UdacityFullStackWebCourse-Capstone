import React, {useState, useEffect} from 'react';
import {DOMAIN, noPortraitPlaceholder} from '../Constants.js';
import AppLoader from './AppLoader';
import NonLinkThumbnail from './NonLinkThumbnail';
import PropTypes from 'prop-types';

/**
 * Represents a subcomponent that associates the movie with props.movieId with
 * actors selected on the page.
 * The selectedActors state is the current set of selected actors.  It defaults
 * to the actors already associated with the movie.  A user can then
 * select actors/actresses and deselect actors/actresses and the state will be
 * updated.
 * When save is clicked, this component is taken down and the user is returned
 * back to the MovieProfile
 * @component
 * @param {object} props - the props object.  Requires the following pieces:
 *     movieId - the database id of the movie
 *     movieTitle - the title of the movie
 *     showDialog - callback whether or not to show this component
 *     commitActorAssociation - callback to commit the new actor-to-movie
 *                              associations to the database.
 * @return {Component} this component
 */
function AssociateMovieWithActor(props) {
  const [actors, setActors] = useState([]);
  const [fetchActors, setFetchActors] = useState(true);
  const [selectedActors, setSelectedActors] = useState([]);

  useEffect(() => {
    if (fetchActors) {
      fetch(`${DOMAIN}/actors`)
          .then((response) => response.json())
          .then((result) => {
            setActors(result.actors);
            // If we try to use selectedActors directly, the state will
            // overwrite itself -> Use a local array then do one state update.
            let selectedActorsArray = [];
            result.actors.forEach((actor, index) => {
              if (actor.movies.includes(props.movieId)) {
                selectedActorsArray = [...selectedActorsArray, actor];
              }
            });
            setSelectedActors(selectedActorsArray);
          });
      // Save original selected actors in case the fetch fails.
      setFetchActors(false);
    }
  }, [fetchActors, actors, selectedActors, props.movieId]);

  /* Returns true if the given actor is in the set of selected actors.
   */
  const isSelectedActor = (actor) => {
    return selectedActors.some(
        (selectedActor) => selectedActor.id === actor.id,
    );
  };

  /* Toggles association of the current movie (props.movieId) with the
   * actor selected.  Just updates the state and UI, not the database.
   */
  const toggleAssociateActor = async (actor) => {
    if (isSelectedActor(actor)) {
      // Remove actor.
      setSelectedActors(selectedActors.filter(
          (selectedActor) => selectedActor.id !== actor.id));
    } else {
      // Add actor.
      setSelectedActors([...selectedActors, actor]);
    }
  };

  /* On the parent page, send the update to the server. */
  const commitAssociationAndDismiss = () => {
    props.commitActorAssociation(props.movieId, selectedActors);
    dismissPage();
  };
  const dismissPage = () => {
    setFetchActors(true);
    // This callback dismisses this component and UI.
    props.showDialog(false);
  };

  if (fetchActors) {
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
          Select all actors/actresses that acted in or will act
          in {props.movieTitle}.
        </h2>

        <div className="Movie-column-wrapper">
          <div className="Movie-column">
            {
              actors.map((actor, index) => {
                let imageSrc = noPortraitPlaceholder;
                if (actor.portrait_url !== undefined) {
                  imageSrc = actor.portrait_url;
                }
                return (
                  <div
                    onClick={() => {
                      toggleAssociateActor(actor);
                    }}
                    key={index}>
                    <NonLinkThumbnail
                      id={actor.id}
                      index={index}
                      key={index}
                      imageSrc={imageSrc}
                      title={actor.name}
                      selected={isSelectedActor(actor)}/>
                  </div>
                );
              })}
          </div>
        </div>

      </div>
    </div>
  );
};

AssociateMovieWithActor.propTypes = {
  movieTitle: PropTypes.string,
  movieId: PropTypes.number,
  showDialog: PropTypes.func,
  commitActorAssociation: PropTypes.func,
};

export default AssociateMovieWithActor;
