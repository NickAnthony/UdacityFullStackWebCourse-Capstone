import React, {useState} from 'react';
import {noPortraitPlaceholder} from '../Constants.js';
import PropTypes from 'prop-types';

/**
 * Represents the subcomponent that enables a use to edit details about an
 * actor.
 * The actor being edited is passed as props.actor.
 * Users can edit the Name, Age, Gender, or Portrait Photo.  To edit the movies
 * the actor is in, they need to go to the AssociateActorWithMovie page.
 * When save is clicked, this component is taken down and the user is returned
 * back to the ActorProfile, where the save will be committed to the database.
 * If the save cannot be completed, the UI resets to the original values.
 * @component
 * @param {object} props - the props object.  Requires the following pieces:
 *     actor - the actor being edited
 *     showDialog - callback whether or not to show this component
 *     commitActorEdit - callback to commit the new actor patches to the
 *                       database.
 * @return {Component} this component
 */
function EditActor(props) {
  // Set up state
  const [portraitUrl, setPortraitUrl] = useState(props.actor.portrait_url);
  const [portraitImgSrc, setPortraitImgSrc] = useState(
      props.actor.portrait_url);
  const [name, setName] = useState(props.actor.name);
  const [age, setAge] = useState(props.actor.age);
  const [gender, setGender] = useState(props.actor.gender);

  /**
   * Updates the portrait url to the value, or sets it to the default when no
   * value is supplied.
   * @param {object} event - the edit text event.
   */
  const handleChange = (event) => {
    setPortraitUrl(event.target.value);
    if (event.target.value) {
      setPortraitImgSrc(event.target.value);
    } else {
      setPortraitImgSrc(noPortraitPlaceholder);
    }
  };

  /** On the parent page, send the update to the server. */
  const commitEditAndDismiss = () => {
    props.commitActorEdit(name, age, gender, portraitUrl);
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
              src={portraitImgSrc}
              alt={`${name} Portait`}
              className="Profile-photo" />
            <div className="Profile-content Profile-content-wide">
              <p className="Form-label">Name</p>
              <input
                className="Form-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <p className="Form-label">Age</p>
              <input
                className="Form-input"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
              <p className="Form-label">Gender</p>
              <input
                className="Form-input"
                type="text"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              />
              <p className="Form-label">Portait Photo</p>
              <input
                className="Form-input"
                type="url"
                value={portraitUrl}
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

EditActor.propTypes = {
  actor: PropTypes.object,
  commitActorEdit: PropTypes.func,
  showDialog: PropTypes.func,
};

export default EditActor;
