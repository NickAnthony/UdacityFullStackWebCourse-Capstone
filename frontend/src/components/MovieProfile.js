import React, { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { DOMAIN, no_portrait_placeholder, no_movie_placeholder } from '../Constants.js';
import { useParams } from "react-router-dom";
import AppLoader from "./AppLoader";
import Thumbnail from "./Thumbnail";
import EditMovie from "./EditMovie";
import AssociateMovieWithActor from "./AssociateMovieWithActor";
import Moment from 'moment';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

function MovieProfile() {
  // Get id from the url
  let { id } = useParams();
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  Moment.locale('en');

  // Set up state
  const [movie, setMovie] = useState(null);
  const [actors, setActors] = useState([]);
  const [fetch_movie, setFetchMovie] = useState(false);
  const [show_associate_actor_dialog, setAssociateActorDiaglog] = useState(false);
  const [show_edit_movie_dialog, setShowEditMovieDialog] = useState(false);

  useEffect(() => {
    if (!fetch_movie) {
      fetch(`${DOMAIN}/movies/${id}/actors`)
          .then(response => response.json())
          .then((result) => {
            console.log(result);
            if (result.movie.movie_photo === undefined) {
              result.movie.movie_photo = no_movie_placeholder;
            }
            setMovie(result.movie);
            setActors(result.actors);
          });
      setFetchMovie(true);
    }
  }, [fetch_movie, id])


  /* Commits the chosen actor-to-movie association to the database.
   */
  const commitActorAssociation = async (movie_id, selected_actors) => {
    // Save the current movie state in case the update fails.
    const original_actors = actors;

    try {
      const accessToken = await getAccessTokenSilently({
        audience: `casting-agency`,
        scope: "read:current_user",
      });
      // Opportunistically use the setActors to set the movies.
      setActors(selected_actors);
      fetch(`${DOMAIN}/movies/${movie_id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          actors: selected_actors.map(actor => actor.id)
        })
      })
      .then(response => response.json())
      .then((result) => {
        if (result.success) {
          console.log(result);
        } else {
          movieUpdateFailed(result.message, original_actors);
        }
      });
    } catch (e) {
      console.log(e.message);
      movieUpdateFailed(e.message, original_actors);
    }
  }

  const commitMovieEdit = async (new_title, new_release_date, new_movie_photo) => {
    // Save the current state in case the update fails.
    const original_movie = movie;

    try {
      const accessToken = await getAccessTokenSilently({
        audience: `casting-agency`,
        scope: "read:current_user",
      });
      // Opportunistically set the new info.
      const formatted_new_release_date = Moment(new_release_date.toString()).format("YYYY-MM-DD")
      setMovie({
        title: new_title,
        release_date: formatted_new_release_date,
        movie_photo: new_movie_photo,
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
          title: new_title,
          release_date: formatted_new_release_date,
        })
      })
      .then(response => response.json())
      .then((result) => {
        if (result.success) {
          console.log(result);
        } else {
          editMovieFailed(result.message, original_movie);
        }
      });
    } catch (e) {
      console.log(e.message);
      editMovieFailed(e.message, original_movie);
    }
  }

  const editMovieFailed = (error_message, original_movie) => {
    setMovie(original_movie);
    editFailed(error_message);
  }

  const movieUpdateFailed = (error_message, original_actors) => {
    setActors(original_actors);
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

  if (!movie) {
    return <AppLoader />
  }

  if (show_edit_movie_dialog) {
    return <EditMovie
              movie={movie}
              showDialog={setShowEditMovieDialog}
              commitMovieEdit={commitMovieEdit}/>
  }

  if (show_associate_actor_dialog) {
    return <AssociateMovieWithActor
              movie_title={movie.title}
              movie_id={movie.id}
              showDialog={setAssociateActorDiaglog}
              commitActorAssociation={commitActorAssociation}/>
  }

  return (
    <div className="Profile-wrapper">
      <div className="Profile-body">

        <div className="Profile">
          <img src={movie.movie_photo} alt={movie.title + " Poster Photo"} className="Profile-photo" />
          <div className="Profile-content">
            <p className="Profile-name">{movie.title}</p>
            <div>
              <h3>Release date:</h3>
              <h2>{Moment(movie.release_date).format("MMMM Do, YYYY")}</h2>
            </div>
            {
              (isAuthenticated) &&
                  <div className="Profile-menu">
                    <button className="Button Profile-menu-button"  onClick={() => setAssociateActorDiaglog(true)}>Cast actors/actresses</button>
                    <button className="Button Profile-menu-button"  onClick={() => setShowEditMovieDialog(true)}>Edit</button>
                    <button className="Button Profile-menu-button-delete"  onClick={() => {}}>Delete</button>
                  </div>
            }
            {
              (!isAuthenticated) &&
                  <div className="Profile-menu">
                    <h3>Edit movie menu:</h3>
                    <h4>
                        Only Casting Directors or Executive Producers can make
                        changes. <br/> Please log in to edit.
                    </h4>
                  </div>
            }
          </div>
        </div>

        <div className="Movie-column-wrapper">
          <h3 className="Upcoming-column-header">Actors/Actresses</h3>
          <div className="Movie-column">
            {
              actors.map((actor, index) => {
                var image_src = no_portrait_placeholder
                if (actor.portrait_url !== undefined) {
                  image_src = actor.portrait_url;
                }
                return <Thumbnail id={actor.id} type="actors" index={index} key={index} image_src={image_src} title={actor.name}/>;
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default MovieProfile;
