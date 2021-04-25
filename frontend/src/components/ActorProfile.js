import React, { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { DOMAIN, no_portrait_placeholder, no_movie_placeholder } from '../Constants.js';
import { useParams } from "react-router-dom";
import AppLoader from "./AppLoader";
import Thumbnail from "./Thumbnail"

function ActorProfile() {
  let { id } = useParams();
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [actor, setActor] = useState(null);
  const [movies, setMovies] = useState([]);
  const [fetch_actor, setFetchActor] = useState(false);

  useEffect(() => {
    if (!fetch_actor) {
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
      setFetchActor(true);
    }
  }, [fetch_actor, id])

  const associateActor = async (actor_id) => {
    try {
      // TO-DO Make this occur on page load, not on submit
      const accessToken = await getAccessTokenSilently({
        audience: `casting-agency`,
        scope: "read:current_user",
      });
      // TO-DO Make this Async
      fetch(`${DOMAIN}/actors/${actor_id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          movies: [5]
        })
      })
      .then(response => response.json())
      .then((result) => {
        console.log(result);
      });

    } catch (e) {
      console.log(e.message);
    }
  };

  if (!actor) {
    return <AppLoader />
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
                    <h3>Edit actor menu:</h3>
                    <button className="Profile-menu-button"  onClick={() => associateActor(id)}>Add actor to movie</button>
                    <button className="Profile-menu-button"  onClick={() => {}}>Update actor/actress information</button>
                    <button className="Profile-menu-button-delete"  onClick={() => {}}>Delete actor</button>
                  </div>

            }
            {
              (!isAuthenticated) &&
                  <div className="Profile-menu">
                    <h3>Edit actor menu:</h3>
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
