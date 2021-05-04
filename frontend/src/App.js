import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import './App.css';
/* Import CSS for react-loader-spinner */
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import Home from './components/Home';
import AppHeader from './components/AppHeader';
import NewActor from './components/NewActor';
import Profile from './components/Profile';
import ActorProfile from './components/ActorProfile';
import MovieProfile from './components/MovieProfile';
import NewMovie from './components/NewMovie';

/**
 * The base App wrapper.
 * Contains the Routes and Navigation for the whole app.
 * @constructor
 * @component
 */
function App() {
  return (
    <Router>
      <div className="App">
        <AppHeader />

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/new-actor">
            <NewActor />
          </Route>
          <Route path="/new-movie">
            <NewMovie />
          </Route>
          <Route path="/profile">
            <Profile />
          </Route>
          <Route path="/actors/:id">
            <ActorProfile />
          </Route>
          <Route path="/movies/:id">
            <MovieProfile />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
