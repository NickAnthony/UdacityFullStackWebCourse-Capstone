import React, {useState, useEffect} from 'react';
import {useAuth0} from '@auth0/auth0-react';
import {
  DOMAIN,
  noPortraitPlaceholder,
  noMoviePlaceholder,
} from '../Constants.js';
import {useParams} from 'react-router-dom';
import AppLoader from './AppLoader';
import Thumbnail from './Thumbnail';
import AssociateActorWithMovie from './AssociateActorWithMovie';
import EditActor from './EditActor';
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

/**
 * Represents a profile of an actor/actress.  This includes the name, gender,
 * age and the set of movies the actor is in.
 * Gets the id from the url, then fetches that actor/actress from the database,
 * along with all the movies.
 * Contains the callbacks and subcomponents edit this movie and save the edits
 * to the database.
 * When a user is signed in, they can then see the appropriate edit buttons.
 * @component
 * @return {Component} the actor/actress profile page
 */
function ActorProfile() {
  const {id} = useParams();
  const {isAuthenticated, getAccessTokenSilently} = useAuth0();
  const [actor, setActor] = useState(null);
  const [movies, setMovies] = useState([]);
  const [fetchActor, setFetchActor] = useState(true);
  const [showAssociateMovieDialog, setAssociateMovieDiaglog] = useState(false);
  const [showEditActorDialog, setShowEditActorDialog] = useState(false);

  useEffect(() => {
    if (fetchActor) {
      fetch(`${DOMAIN}/actors/${id}/movies`)
          .then((response) => response.json())
          .then((result) => {
            console.log(result);
            if (result.actor.portrait_url === undefined) {
              result.actor.portrait_url = noPortraitPlaceholder;
            }
            setActor(result.actor);
            setMovies(result.movies);
          });
      setFetchActor(false);
    }
  }, [fetchActor, id]);

  /** Commits the chosen actor-to-movie association to the database.
   * @param {object} actorId - the id of the current actor being edited
   * @param {object} selectedMovies - the set of movies selected in which the
   *                                  actor/actress will act
   */
  const commitActorAssociation = async (actorId, selectedMovies) => {
    // Save the current movie state in case the update fails.
    const originalMovies = movies;

    try {
      const accessToken = await getAccessTokenSilently({
        audience: `casting-agency`,
        scope: 'read:current_user',
      });
      // Opportunistically use the setMovies to set the movies.
      setMovies(selectedMovies);
      // TO-DO Make this Async
      fetch(`${DOMAIN}/actors/${actorId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          movies: selectedMovies.map((movie) => movie.id),
        }),
      })
          .then((response) => response.json())
          .then((result) => {
            if (result.success) {
              console.log(result);
            } else {
              movieUpdateFailed(result.message, originalMovies);
            }
          });
    } catch (e) {
      console.log(e.message);
      movieUpdateFailed(e.message, originalMovies);
    }
  };

  /**
   * Takes the current input and posts the patch to the database.
   * Opportunistically makes the edit, then rollbacks if it fails for some
   * reason.  Executive Producers and Casting Agents can make patch edits.
   * @param {object} newName - the new name of the actor/actress
   * @param {number} newAge - the new age of the actor/actress
   * @param {number} newGender - the new gender of the actor/actress
   * @param {object} newPortraitUrl - the new portrait photo of the
   *                                  actor/actress
   * Note that these params will be default set to the existing values.
   */
  const commitActorEdit = async (
      newName, newAge, newGender, newPortraitUrl,
  ) => {
    // Save the current state in case the update fails.
    const originalActor = actor;

    try {
      const accessToken = await getAccessTokenSilently({
        audience: `casting-agency`,
        scope: 'read:current_user',
      });
      // Opportunistically set the new info.
      setActor({
        name: newName,
        age: newAge,
        gender: newGender,
        portrait_url: newPortraitUrl,
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
          name: newName,
          age: newAge,
          gender: newGender,
          portrait_url: newPortraitUrl,
        }),
      })
          .then((response) => response.json())
          .then((result) => {
            if (result.success) {
              console.log(result);
            } else {
              editActorFailed(result.message, originalActor);
            }
          });
    } catch (e) {
      console.log(e.message);
      editActorFailed(e.message, originalActor);
    }
  };

  const editActorFailed = (errorMessage, originalActor) => {
    setActor(originalActor);
    editFailed(errorMessage);
  };

  const movieUpdateFailed = (errorMessage, originalMovies) => {
    setMovies(originalMovies);
    editFailed(errorMessage);
  };

  const editFailed = (errorMessage) => {
    confirmAlert({
      title: 'Failed to save changes!',
      message: errorMessage,
      buttons: [
        {
          label: 'Ok',
          onClick: () => {},
        },
      ],
    });
  };

  if (!actor) {
    return <AppLoader />;
  }

  if (showEditActorDialog) {
    return <EditActor
      actor={actor}
      showDialog={setShowEditActorDialog}
      commitActorEdit={commitActorEdit}/>;
  }

  if (showAssociateMovieDialog) {
    return <AssociateActorWithMovie
      actorName={actor.name}
      actorId={actor.id}
      showDialog={setAssociateMovieDiaglog}
      commitActorAssociation={commitActorAssociation}/>;
  }

  return (
    <div className='Profile-wrapper'>
      <div className='Profile-body'>

        <div className='Profile'>
          <img
            src={actor.portrait_url}
            alt={actor.name + ' Portrait'}
            className='Profile-photo' />
          <div className='Profile-content'>
            <p className='Profile-name'>{actor.name}</p>
            <h2>{actor.gender}, {actor.age}</h2>
            {
              (isAuthenticated) &&
                  <div className='Profile-menu'>
                    <button
                      className='Button Profile-menu-button'
                      onClick={() => setAssociateMovieDiaglog(true)}>
                      Update movies
                    </button>
                    <button
                      className='Button Profile-menu-button'
                      onClick={() => setShowEditActorDialog(true)}>
                      Edit
                    </button>
                    { /* TODO Implement: Delete */ }
                    <button
                      className='Button Profile-menu-button-delete'
                      onClick={() => {}}>
                      Delete actor
                    </button>
                  </div>
            }
            {
              (!isAuthenticated) &&
                  <div className='Profile-menu'>
                    <h4>
                        Only Casting Directors or Executive Producers can make
                        changes. <br/> Please log in to edit.
                    </h4>
                  </div>
            }
          </div>
        </div>

        <div className='Movie-column-wrapper'>
          <h3 className='Column-header'>Upcoming</h3>
          <div className='Movie-column'>
            {
              movies.filter((movie) => {
                // Filter to with release dates today or in the future.
                return (new Date() <= new Date(movie.release_date));
              }).map((movie, index) => {
                let imageSrc = noMoviePlaceholder;
                if (movie.movie_photo !== undefined) {
                  imageSrc = movie.movie_photo;
                }
                return <Thumbnail
                  id={movie.id}
                  type='movies'
                  index={index}
                  key={index}
                  imageSrc={imageSrc}
                  title={movie.title}/>;
              })}
          </div>
          <h3 className='Column-header'>Released</h3>
          <div className='Movie-column'>
            {
              movies.filter((movie) => {
                // Filter to with release dates in the past.
                return (new Date() > new Date(movie.release_date));
              }).map((movie, index) => {
                let imageSrc = noMoviePlaceholder;
                if (movie.movie_photo !== undefined) {
                  imageSrc = movie.movie_photo;
                }
                return <Thumbnail
                  id={movie.id}
                  type='movies'
                  index={index}
                  key={index}
                  imageSrc={imageSrc}
                  title={movie.title}/>;
              })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ActorProfile;
