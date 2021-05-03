import React, { useState, useEffect } from 'react';
import { DOMAIN, no_portrait_placeholder } from '../Constants.js';
import AppLoader from "./AppLoader";
import NonLinkThumbnail from "./NonLinkThumbnail";


function AssociateMovieWithActor(props) {
  const [actors, setActors] = useState([]);
  const [fetch_actors, setFetchActors] = useState(true);
  const [selected_actors, setSelectedActors] = useState([]);

  useEffect(() => {
    if (fetch_actors) {
      fetch(`${DOMAIN}/actors`)
          .then(response => response.json())
          .then((result) => {
              setActors(result.actors);
              // If we try to use selected_actors directly, the state will
              // overwrite itself -> Use a local array then do one state update.
              var selected_actors_array = []
              result.actors.forEach((actor, index) => {
                if (actor.movies.includes(props.movie_id)) {
                  selected_actors_array = [...selected_actors_array, actor]
                }
              })
              setSelectedActors(selected_actors_array);
          });
      // Save original selected actors in case the fetch fails.
      setFetchActors(false);
    }
  }, [fetch_actors, actors, selected_actors, props.movie_id])

  /* Returns true if the given actor is in the set of selected actors.
   */
  const isSelectedActor = (actor) => {
    return selected_actors.some(selected_actor => selected_actor.id === actor.id);
  }

  /* Toggles association of the current movie (props.movie_id) with the
   * actor selected.  Just updates the state and UI, not the database.
   */
  const toggleAssociateActor = async (actor) => {
    if (isSelectedActor(actor)) {
      // Remove actor.
      setSelectedActors(selected_actors.filter(
        selected_actor => selected_actor.id !== actor.id));
    } else {
      // Add actor.
      setSelectedActors([...selected_actors, actor]);
    }
  }

  /* On the parent page, send the update to the server. */
  const commitAssociationAndDismiss = () => {
    props.commitActorAssociation(props.movie_id, selected_actors);
    dismissPage();
  }
  const dismissPage = () => {
    setFetchActors(true);
    // This callback dismisses this component and UI.
    props.showDialog(false);
  }

  if (fetch_actors) {
    return <AppLoader />
  }

  return (
    <div className="Profile-wrapper">
      <div className="Profile-body">

        <div className="Profile-menu-horizontal">
          <button className="Button Profile-menu-button-save"  onClick={commitAssociationAndDismiss}>Save</button>
          <button className="Button Profile-menu-button-cancel"  onClick={dismissPage}>Cancel</button>
        </div>

        <h2>Select all actors that {props.actor_name} acted in or will act in.</h2>

        <div className="Movie-column-wrapper">
          <div className="Movie-column">
            {
              actors.map((actor, index) => {
                var image_src = no_portrait_placeholder;
                if (actor.portrait_url !== undefined) {
                  image_src = actor.portrait_url;
                }
                return (
                  <div onClick={() => {toggleAssociateActor(actor)}}>
                    <NonLinkThumbnail id={actor.id} index={index} key={index} image_src={image_src} title={actor.name} selected={isSelectedActor(actor)}/>
                  </div>
                );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AssociateMovieWithActor;
