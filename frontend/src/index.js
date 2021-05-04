import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import './styles/DatePicker.css';
import './styles/Calendar.css';
import App from './App';
import {Auth0Provider} from '@auth0/auth0-react';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
    <React.StrictMode>
      <Auth0Provider
        domain="fsnd-app-nickanthony.us.auth0.com"
        clientId="ExP2mxHo4wAMYB0MGc9nmWHxSHcfO1eu"
        redirectUri={window.location.origin + '/profile'}
        audience="casting-agency"
        scope="read:current_user update:current_user_metadata"
      >
        <App />
      </Auth0Provider>
    </React.StrictMode>,
    document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
