import React, {useState} from 'react';
import {noMoviePlaceholder} from '../Constants.js';
import DatePicker from 'react-date-picker';
import PropTypes from 'prop-types';

/**
 * Represents the subcomponent that enables a use to edit details about a
 * movie.
 * The movie being edited is passed as props.movie.
 * Users can edit the Title, Release Date, or Poster Movie Photo.  To edit the
 * the actors in the movie, users need to to go to the AssociateMovieWithActor
 * dialog.
 * When save is clicked, this component is taken down and the user is returned
 * back to the MovieProfile, where the save will be committed to the database.
 * If the save cannot be completed, the UI resets to the original values.
 * @component
 * @param {object} props - the props object.  Requires the following pieces:
 *     movie - the movie being edited
 *     showDialog - callback whether or not to show this component
 *     commitActorEdit - callback to commit the new actor patches to the
 *                       database.
 * @return {Component} this component
 */
function EditMovie(props) {
  // Set up state
  const [title, setTitle] = useState(props.movie.title);
  const [releaseDate, setReleaseDate] = useState(
      new Date(props.movie.release_date));
  const [moviePhotoUrl, setMoviePhotoUrl] = useState(
      props.movie.movie_photo);
  const [posterPhotoImgSrc, setPosterPhotoImgSrc] = useState(
      props.movie.movie_photo);

  /**
   * Updates the movie poster photo url to the value, or sets it to the default
   * when no value is supplied.
   * @param {object} event - the edit text event.
   */
  const handleChange = (event) => {
    setMoviePhotoUrl(event.target.value);
    if (event.target.value) {
      setPosterPhotoImgSrc(event.target.value);
    } else {
      setPosterPhotoImgSrc(noMoviePlaceholder);
    }
  };

  /** On the parent page, send the update to the server. */
  const commitEditAndDismiss = () => {
    props.commitMovieEdit(title, releaseDate, moviePhotoUrl);
    dismissPage();
  };
  /** Dismiss this component/UI and return to the parent component. */
  const dismissPage = () => {
    props.showDialog(false);
  };

  return (
    <div className="Profile-wrapper">
      <div className="Profile-body">

        <form onSubmit={commitEditAndDismiss}>
          <div className="Profile">
            <img
              src={posterPhotoImgSrc}
              alt={`${title} Poster`}
              className="Profile-photo" />
            <div className="Profile-content Profile-content-wide">
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
              <p className="Form-label">Movie Photo</p>
              <input
                className="Form-input"
                type="url"
                value={posterPhotoImgSrc}
                onChange={handleChange}/>
            </div>
          </div>
        </form>
        <div className="Profile-menu-horizontal">
          <button className="Button Profile-menu-button-save"
            onClick={commitEditAndDismiss}>
            Save
          </button>
          <button className="Button Profile-menu-button-cancel"
            onClick={dismissPage}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

EditMovie.propTypes = {
  movie: PropTypes.object,
  commitMovieEdit: PropTypes.func,
  showDialog: PropTypes.func,
};

export default EditMovie;
