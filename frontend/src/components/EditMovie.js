import React, { useState } from 'react';
import { no_movie_placeholder } from '../Constants.js'
import DatePicker from 'react-date-picker';

function EditMovie(props) {
  // Set up state
  const [title, setTitle] = useState(props.movie.title);
  const [release_date, setReleaseDate] = useState(new Date(props.movie.release_date));
  const [movie_photo_url, setMoviePhotoUrl] = useState(props.movie.movie_photo);
  const [portrait_img_src, setPortraitImgSrc] = useState(props.movie.movie_photo);

  const handleChange = (event) => {
    setMoviePhotoUrl(event.target.value);
    if (event.target.value) {
      setPortraitImgSrc(event.target.value);
    } else {
      setPortraitImgSrc(no_movie_placeholder);
    }
  }

  /* On the parent page, send the update to the server. */
  const commitEditAndDismiss = () => {
    props.commitMovieEdit(title, release_date, movie_photo_url);
    dismissPage();
  }
  const dismissPage = () => {
    // This callback dismisses this component and UI.
    props.showDialog(false);
  }

  return (
    <div className="Profile-wrapper">
      <div className="Profile-body">

        <form onSubmit={commitEditAndDismiss}>
          <div className="Profile">
            <img
              src={portrait_img_src}
              alt={`${title} Photo`}
              className="Profile-photo" />
            <div className="Profile-content Profile-content-wide">
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
              <p className="Form-label">Movie Photo</p>
              <input
                className="Form-input"
                type="url"
                value={portrait_img_src}
                onChange={handleChange}/>
            </div>
          </div>
        </form>
        <div className="Profile-menu-horizontal">
          <button className="Button Profile-menu-button-save"  onClick={commitEditAndDismiss}>Save</button>
          <button className="Button Profile-menu-button-cancel"  onClick={dismissPage}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default EditMovie;
