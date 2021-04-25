import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import DatePicker from 'react-date-picker';
import { Redirect } from 'react-router-dom';
import { DOMAIN, no_movie_placeholder } from '../Constants.js'
import Moment from 'moment';


function NewMovie() {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  Moment.locale('en');

  // Set up state
  const [movie_photo_url, setMoviePhotoUrl] = useState(null);
  const [photo_img_src, setPhotoImgSrc] = useState(no_movie_placeholder);
  const [title, setTitle] = useState("");
  const [release_date, setReleaseDate] = useState(new Date());
  const [redirect, setRedirect] = useState("");

  const handleChange = (event) => {
    setMoviePhotoUrl(event.target.value);
    if (event.target.value) {
      setPhotoImgSrc(event.target.value);
    } else {
      setPhotoImgSrc(no_movie_placeholder);
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    postNewMovie();
  }

  const postNewMovie = async () => {
    try {
      // TO-DO Make this occur on page load, not on submit
      const accessToken = await getAccessTokenSilently({
        audience: `casting-agency`,
        scope: "read:current_user",
      });
      const formatted_release_date = Moment(release_date.toString()).format("YYYY-MM-DD")
      console.log(JSON.stringify({
        title: title,
        release_date: formatted_release_date,
        movie_photo: movie_photo_url,
      }))
      // TO-DO Make this Async
      fetch(DOMAIN + "/movies", {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title,
          release_date: formatted_release_date,
          movie_photo: movie_photo_url,
        })
      })
      .then(response => response.json())
      .then((result) => {
        console.log(result);
        if (result.success) {
          setRedirect(`/movies/${result.id}`)
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
    return(
      <div className="New-item-wrapper">
        <form className="New-item-form-wrapper">
          <h1>New Movie</h1>
          <h2>Only Executive Producers can add movies.  Please log in to continue.</h2>
        </form>
      </div>
    )
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
            onChange={e => setTitle(e.target.value)}
          />
          <p className="Form-label">Release date</p>
          <DatePicker
              onChange={setReleaseDate}
              value={release_date}
            />
          <p className="Form-label">Portait Photo</p>
          <input
            className="Form-input"
            type="url"
            value={movie_photo_url}
            onChange={handleChange}/>
          &nbsp;
          <img
            src={photo_img_src}
            alt={`${title} Poster`}
            width="100"/>
          {
            !(movie_photo_url) &&
            <p className="Form-label">Image will load with url</p> }
          <div className="Submit-button-wrapper">
            <input type="submit" value="Submit" className="Submit-button" />
          </div>
        </form>
      </div>
  );
}

export default NewMovie;
