import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Redirect } from 'react-router-dom';
import { DOMAIN, no_portrait_placeholder } from '../Constants.js'

function NewActor() {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [portrait_url, setPortraitUrl] = useState("https://m.media-amazon.com/images/M/MV5BOTI3ODk1MTMyNV5BMl5BanBnXkFtZTcwNDEyNTE2Mg@@._V1_UY317_CR6,0,214,317_AL_.jpg");
  const [portrait_img_src, setPortraitImgSrc] = useState(no_portrait_placeholder);
  const [first_name, setFirstName] = useState("Ryan");
  const [last_name, setLastName] = useState("Reynolds");
  const [age, setAge] = useState(44);
  const [gender, setGender] = useState("Male");
  const [redirect, setRedirect] = useState(false);

  const handleChange = (event) => {
    setPortraitUrl(event.target.value);
    if (event.target.value) {
      setPortraitImgSrc(event.target.value);
    } else {
      setPortraitImgSrc(no_portrait_placeholder);
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    postNewUser();
  }

  const postNewUser = async () => {
    try {
      // TO-DO Make this occur on page load, not on submit
      const accessToken = await getAccessTokenSilently({
        audience: `casting-agency`,
        scope: "read:current_user",
      });
      console.log(JSON.stringify({
        name: first_name + " " + last_name,
        age: age,
        gender: gender,
        portrait_url: portrait_url,
      }))
      // TO-DO Make this Async
      fetch(DOMAIN + "/actors", {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: first_name + " " + last_name,
          age: age,
          gender: gender,
          portrait_url: portrait_url,
        })
      })
      .then(response => response.json())
      .then((result) => {
        console.log(result);
        if (result.success) {
          setRedirect(true)
        }
      });

    } catch (e) {
      console.log(e.message);
    }
  };

  if (redirect) {
    return <Redirect to={"/"} />;
  }
  if (!isAuthenticated) {
    return(
      <div className="New-actor-wrapper">
        <h1>Please log in to add actors</h1>
      </div>
    )
  }

  return (
      <div className="New-actor-wrapper">
        <form className="New-actor-form-wrapper" onSubmit={handleSubmit}>
          <h1>New Actor</h1>
          <p className="Form-label">First name</p>
          <input
            className="Form-input"
            type="text"
            value={first_name}
            onChange={e => setFirstName(e.target.value)}
          />
          <p className="Form-label">Last name</p>
          <input
            className="Form-input"
            type="text"
            value={last_name}
            onChange={e => setLastName(e.target.value)}
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
          &nbsp;
          <img
            src={portrait_img_src}
            alt={"Portait"}
            width="100"/>
          {
            !(portrait_url) &&
            <p className="Form-label">Image will load with url</p> }
          <div className="Submit-button-wrapper">
            <input type="submit" value="Submit" className="Submit-button" />
          </div>
        </form>
      </div>
  );
}

export default NewActor;
