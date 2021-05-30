import React, {useState, useEffect} from 'react';
import {useAuth0} from '@auth0/auth0-react';
import {
  DOMAIN,
  noPortraitPlaceholder,
  noMoviePlaceholder,
} from '../Constants.js';
import {useParams, Redirect} from 'react-router-dom';
import AppLoader from './AppLoader';
import Thumbnail from './Thumbnail';
import EditMovie from './EditMovie';
import AssociateMovieWithActor from './AssociateMovieWithActor';
import Moment from 'moment';
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

/**
 * Represents a profile of a movie.  This includes the title, release date,
 * and the set of actors/actress in the movie.
 * Gets the id from the url, then fetches that movie from the database, along
 * with all the actors.
 * Contains the callbacks and subcomponents edit this movie and save the edits
 * to the database.
 * When a user is signed in, they can then see the appropriate edit buttons.
 * @component
 * @return {Component} the movie profile page
 */
function MovieProfile() {
  // Get id from the url
  const {id} = useParams();
  const {isAuthenticated, getAccessTokenSilently} = useAuth0();
  Moment.locale('en');

  // Set up state
  const [movie, setMovie] = useState(null);
  const [actors, setActors] = useState([]);
  const [fetchMovie, setFetchMovie] = useState(false);
  const [showAssociateActorDialog, setAssociateActorDiaglog] = useState(false);
  const [showEditMovieDialog, setShowEditMovieDialog] = useState(false);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (!fetchMovie) {
      fetch(`${DOMAIN}/movies/${id}/actors`)
          .then((response) => response.json())
          .then((result) => {
            console.log(result);
            if (result.movie.movie_photo === undefined) {
              result.movie.movie_photo = noMoviePlaceholder;
            }
            setMovie(result.movie);
            setActors(result.actors);
          });
      setFetchMovie(true);
    }
  }, [fetchMovie, id]);


  /** Commits the chosen actor-to-movie association to the database.
   * @param {object} movieId - the id of the current movie being edited
   * @param {object} selectedActors - the set of actors selected to be in the
   *                                  movie.
   */
  const commitActorAssociation = async (movieId, selectedActors) => {
    // Save the current movie state in case the update fails.
    const originalActors = actors;

    try {
      const accessToken = await getAccessTokenSilently({
        audience: `casting-agency`,
        scope: 'read:current_user',
      });
      // Opportunistically use the setActors to set the movies.
      setActors(selectedActors);
      fetch(`${DOMAIN}/movies/${movieId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          actors: selectedActors.map((actor) => actor.id),
        }),
      })
          .then((response) => response.json())
          .then((result) => {
            if (result.success) {
              console.log(result);
            } else {
              movieUpdateFailed(result.message, originalActors);
            }
          });
    } catch (e) {
      console.log(e.message);
      movieUpdateFailed(e.message, originalActors);
    }
  };

  /**
   * Takes the current input and posts the patch to the database.
   * Opportunistically makes the edit, then rollbacks if it fails for some
   * reason.  Only Executive Producers can patch edits.
   * @param {string} newTitle - the new title of the movie
   * @param {Date} newReleaseDate - the new release date of the movie
   * @param {string} newMoviePhoto - the new poster photo of the movie
   * Note that these params will be default set to the existing values.
   */
  const commitMovieEdit = async (newTitle, newReleaseDate, newMoviePhoto) => {
    // Save the current state in case the update fails.
    const originalMovie = movie;

    try {
      const accessToken = await getAccessTokenSilently({
        audience: `casting-agency`,
        scope: 'read:current_user',
      });
      // Opportunistically set the new info.
      // Use Moment to format the release date.
      // eslint-disable-next-line new-cap
      const formattedNewReleaseDate = Moment(
          newReleaseDate.toString(),
      ).format('YYYY-MM-DD');
      setMovie({
        title: newTitle,
        release_date: formattedNewReleaseDate,
        movie_photo: newMoviePhoto,
        actors: movie.actors,
      });
      // TO-DO Make this Async
      fetch(`${DOMAIN}/movies/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newTitle,
          release_date: formattedNewReleaseDate,
          movie_photo: newMoviePhoto,
        }),
      })
          .then((response) => response.json())
          .then((result) => {
            if (result.success) {
              console.log(result);
            } else {
              editMovieFailed(result.message, originalMovie);
            }
          });
    } catch (e) {
      console.log(e.message);
      editMovieFailed(e.message, originalMovie);
    }
  };

  const editMovieFailed = (errorMessage, originalMovie) => {
    setMovie(originalMovie);
    editFailed(errorMessage);
  };

  const movieUpdateFailed = (errorMessage, originalActors) => {
    setActors(originalActors);
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

  /**
   * Confirm that the user wants to delete the movie.
   */
  const confirmDeleteMovie = async () => {
    confirmAlert({
      title: `Confirm to delete.`,
      message: `Permanently delete ${movie.title}?`,
      buttons: [
        {
          label: 'Yes',
          onClick: () => deleteMovie(),
        },
        {
          label: 'No',
          onClick: () => {},
        },
      ],
    });
  };

  /**
   * Permanently deletes the movie from the database.
   * Opportunistically makes the delete, then rollbacks if it fails for some
   * reason.  Only Executive Producers can delete movies.
   */
  const deleteMovie = async () => {
    try {
      const accessToken = await getAccessTokenSilently({
        audience: `casting-agency`,
        scope: 'read:current_user',
      });
      fetch(`${DOMAIN}/movies/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })
          .then((response) => response.json())
          .then((result) => {
            if (result.success) {
              console.log(result);
              setRedirect(true);
            } else {
              editMovieFailed(result.message, movie);
            }
          });
    } catch (e) {
      console.log(e.message);
      editMovieFailed(e.message, movie);
    }
  };

  if (redirect) {
    return <Redirect to="/" />;
  }

  if (!movie) {
    return <AppLoader />;
  }

  if (showEditMovieDialog) {
    return <EditMovie
      movie={movie}
      showDialog={setShowEditMovieDialog}
      commitMovieEdit={commitMovieEdit}/>;
  }

  if (showAssociateActorDialog) {
    return <AssociateMovieWithActor
      movieTitle={movie.title}
      movieId={movie.id}
      showDialog={setAssociateActorDiaglog}
      commitActorAssociation={commitActorAssociation}/>;
  }

  return (
    <div className="Profile-wrapper">
      <div className="Profile-body">

        <div className="Profile">
          <img
            src={movie.movie_photo}
            alt={movie.title + ' Poster Photo'}
            className="Profile-photo" />
          <div className="Profile-content">
            <p className="Profile-name">{movie.title}</p>
            <div>
              <h3>Release date:</h3>
              <h2>{
                // eslint-disable-next-line new-cap
                Moment(movie.release_date).format('MMMM Do, YYYY')
              }</h2>
            </div>
            {
              (isAuthenticated) &&
                  <div className="Profile-menu">
                    <button
                      className="Button Profile-menu-button"
                      onClick={() => setAssociateActorDiaglog(true)}>
                      Cast actors/actresses
                    </button>
                    <button
                      className="Button Profile-menu-button"
                      onClick={() => setShowEditMovieDialog(true)}>
                      Edit
                    </button>
                    <button
                      className="Button Profile-menu-button-delete"
                      onClick={() => confirmDeleteMovie()}>
                      Delete
                    </button>
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
          <h3 className="Column-header">Actors/Actresses</h3>
          <div className="Movie-column">
            {
              actors.map((actor, index) => {
                let imageSrc = noPortraitPlaceholder;
                if (actor.portrait_url !== undefined) {
                  imageSrc = actor.portrait_url;
                }
                return <Thumbnail
                  id={actor.id}
                  type="actors"
                  index={index}
                  key={index}
                  imageSrc={imageSrc}
                  title={actor.name}/>;
              })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default MovieProfile;
