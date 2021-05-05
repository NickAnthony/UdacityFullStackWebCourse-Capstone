import React, { useState } from 'react';
import { noPortraitPlaceholder } from '../Constants.js'

function EditActor(props) {
  // Set up state
  const [portrait_url, setPortraitUrl] = useState(props.actor.portrait_url);
  const [portrait_img_src, setPortraitImgSrc] = useState(props.actor.portrait_url);
  const [name, setName] = useState(props.actor.name);
  const [age, setAge] = useState(props.actor.age);
  const [gender, setGender] = useState(props.actor.gender);

  const handleChange = (event) => {
    setPortraitUrl(event.target.value);
    if (event.target.value) {
      setPortraitImgSrc(event.target.value);
    } else {
      setPortraitImgSrc(noPortraitPlaceholder);
    }
  }

  /* On the parent page, send the update to the server. */
  const commitEditAndDismiss = () => {
    props.commitActorEdit(name, age, gender, portrait_url);
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
              alt={`${name} Portait`}
              className="Profile-photo" />
            <div className="Profile-content Profile-content-wide">
              <p className="Form-label">Name</p>
              <input
                className="Form-input"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
              />
              <p className="Form-label">Age</p>
              <input
                className="Form-input"
                type="number"
                value={age}
                onChange={e => setAge(e.target.value)}
              />
              <p className="Form-label">Gender</p>
              <input
                className="Form-input"
                type="text"
                value={gender}
                onChange={e => setGender(e.target.value)}
              />
              <p className="Form-label">Portait Photo</p>
              <input
                className="Form-input"
                type="url"
                value={portrait_url}
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

export default EditActor;
