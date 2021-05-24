import React, {useState} from 'react';
import {useAuth0} from '@auth0/auth0-react';
import {Redirect} from 'react-router-dom';
import {DOMAIN, noPortraitPlaceholder} from '../Constants.js';

/**
 * Represent the new actor route at "/new-actor".  This page lets you add an
 * actor or actress.
 * @return {Component} NewActor component to create new actors.
 */
function NewActor() {
  const {isAuthenticated, getAccessTokenSilently} = useAuth0();

  // Set up state
  const [portraitUrl, setPortraitUrl] = useState('');
  const [portraitImgSrc, setPortraitImgSrc] = useState(noPortraitPlaceholder);
  const [name, setName] = useState('');
  const [age, setAge] = useState(0);
  const [gender, setGender] = useState('');
  const [redirect, setRedirect] = useState('');

  const handleChange = (event) => {
    setPortraitUrl(event.target.value);
    if (event.target.value) {
      setPortraitImgSrc(event.target.value);
    } else {
      setPortraitImgSrc(noPortraitPlaceholder);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    postNewActor();
  };

  /**
   * Takes the current input and posts the new actor to the database.
   * Requires user to have logged in and have the correct ACLs.  New
   * actors/actresses can only be posted by Executive Producers or Casting
   * Agents.
   */
  const postNewActor = async () => {
    try {
      // TO-DO Make this occur on page load, not on submit
      const accessToken = await getAccessTokenSilently({
        audience: `casting-agency`,
        scope: 'read:current_user',
      });
      // TO-DO Make this Async
      fetch(DOMAIN + '/actors', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          age: age,
          gender: gender,
          portrait_url: portraitUrl,
        }),
      })
          .then((response) => response.json())
          .then((result) => {
            if (result.success) {
              setRedirect(`/actors/${result.id}`);
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
        <h1>Please log in to add actors</h1>
      </div>
    );
  }

  return (
    <div className="New-item-wrapper">
      <form className="New-item-form-wrapper" onSubmit={handleSubmit}>
        <h1>New Actor</h1>
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
          &nbsp;
        <img
          src={portraitImgSrc}
          alt={`${name} Portait`}
          width="100"/>
        {
          !(portraitUrl) &&
            <p className="Form-label">Image will load with url</p>
        }
        <div className="Submit-button-wrapper">
          <input
            type="submit"
            value="Submit"
            className="Button Submit-button" />
        </div>
      </form>
    </div>
  );
}

export default NewActor;
