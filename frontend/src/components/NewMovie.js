import React, {useState} from 'react';
import {useAuth0} from '@auth0/auth0-react';
import DatePicker from 'react-date-picker';
import {Redirect} from 'react-router-dom';
import {DOMAIN, noMoviePlaceholder} from '../Constants.js';
import Moment from 'moment';

/**
 * Represent the new movie route at "/new-movie".  This page lets you add an
 * movie.
  * @return {Component} NewMovie component to create new movies.
 */
function NewMovie() {
  const {isAuthenticated, getAccessTokenSilently} = useAuth0();
  Moment.locale('en');

  // Set up state
  const [moviePhotoUrl, setMoviePhotoUrl] = useState(null);
  const [photoImgSrc, setPhotoImgSrc] = useState(noMoviePlaceholder);
  const [title, setTitle] = useState('');
  const [releaseDate, setReleaseDate] = useState(new Date());
  const [redirect, setRedirect] = useState('');

  const handleChange = (event) => {
    setMoviePhotoUrl(event.target.value);
    if (event.target.value) {
      setPhotoImgSrc(event.target.value);
    } else {
      setPhotoImgSrc(noMoviePlaceholder);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    postNewMovie();
  };
  /**
   * Takes the current input and posts the movie to the database.
   * Requires user to have logged in and have the correct ACLs.  New movies can
   * only be posted by Executive Producers.
   */
  const postNewMovie = async () => {
    try {
      // TODO: Make this occur on page load, not on submit
      const accessToken = await getAccessTokenSilently({
        audience: `casting-agency`,
        scope: 'read:current_user',
      });
      // eslint-disable-next-line new-cap
      const formattedReleaseDate = Moment(
          releaseDate.toString(),
      ).format('YYYY-MM-DD');
      console.log(JSON.stringify({
        title: title,
        release_date: formattedReleaseDate,
        movie_photo: moviePhotoUrl,
      }));
      // TO-DO Make this Async
      fetch(DOMAIN + '/movies', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title,
          release_date: formattedReleaseDate,
          movie_photo: moviePhotoUrl,
        }),
      })
          .then((response) => response.json())
          .then((result) => {
            console.log(result);
            if (result.success) {
              setRedirect(`/movies/${result.id}`);
            }
          });
    } catch (e) {
      console.log(e.message);
    }
  };

  if (redirect) {
    return <Redirect to={redirect} />;
  }
  if (!isAuthenticated) {
    return (
      <div className="New-item-wrapper">
        <form className="New-item-form-wrapper">
          <h1>New Movie</h1>
          <h2>Only Executive Producers can add movies.  Please log in to
              continue.
          </h2>
        </form>
      </div>
    );
  }

  return (
    <div className="New-item-wrapper">
      <form className="New-item-form-wrapper" onSubmit={handleSubmit}>
        <h1>New Movie</h1>
        <p className="Form-label">Title</p>
        <input
          className="Form-input"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <p className="Form-label">Release date</p>
        <DatePicker
          onChange={setReleaseDate}
          value={releaseDate}
        />
        <p className="Form-label">Movie Poster Photo</p>
        <input
          className="Form-input"
          type="url"
          value={moviePhotoUrl}
          onChange={handleChange}/>
          &nbsp;
        <img
          src={photoImgSrc}
          alt={`${title} Poster`}
          width="100"/>
        {
          !(moviePhotoUrl) &&
            <p className="Form-label">Image will load with url</p>
        }
        <div className="Submit-button-wrapper">
          <input
            type="submit"
            value="Submit"
            className="Button Submit-button"/>
        </div>
      </form>
    </div>
  );
}

export default NewMovie;
