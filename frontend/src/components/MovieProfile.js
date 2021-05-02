import React, { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { DOMAIN, no_portrait_placeholder, no_movie_placeholder } from '../Constants.js';
import { useParams } from "react-router-dom";
import AppLoader from "./AppLoader";
import Thumbnail from "./Thumbnail";
import Moment from 'moment';

function MovieProfile() {
  // Get id from the url
  let { id } = useParams();
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  Moment.locale('en');

  // Set up state
  const [movie, setMovie] = useState(null);
  const [actors, setActors] = useState([]);
  const [fetch_movie, setFetchMovie] = useState(false);

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

  const associateMovie = async (movid_id) => {
    try {
      // TO-DO Make this occur on page load, not on submit
      const accessToken = await getAccessTokenSilently({
        audience: `casting-agency`,
        scope: "read:current_user",
      });
      // TO-DO Make this Async
      fetch(`${DOMAIN}/movies/${movid_id}`, {
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

  if (!movie) {
    return <AppLoader />
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
                    <h3>Edit movie menu:</h3>
                    <button className="Button Profile-menu-button"  onClick={() => associateMovie(id)}>Cast actor/actress</button>
                    <button className="Button Profile-menu-button"  onClick={() => {}}>Edit</button>
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
