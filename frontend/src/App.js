import './App.css';
/* Import CSS for react-loader-spinner */
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import ActorColumn from './components/ActorColumn';
import MovieColumn from './components/MovieColumn';
import AppHeader from './components/AppHeader';
import NewActor from './components/NewActor';
import DeleteActor from './components/DeleteActor';
import Profile from './components/Profile';
import ActorProfile from './components/ActorProfile';
import MovieProfile from './components/MovieProfile';
import NewMovie from './components/NewMovie';

function App() {
  return (
    <Router>
      <div className="App">
        <AppHeader />

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/new-actor">
            <NewActorRoute />
          </Route>
          <Route path="/delete-actor">
            <DeleteActorRoute />
          </Route>
          <Route path="/new-movie">
            <NewMovieRoute />
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

function Home() {
  return (
    <div className=".Body-wrapper">
      <div className="Column-wrapper">
        <ActorColumn/>
        <MovieColumn/>
      </div>
    </div>
  );
}

function NewActorRoute() {
  return <NewActor />;
}
function DeleteActorRoute() {
  return <DeleteActor />;
}
function NewMovieRoute() {
  return <NewMovie />;
}

export default App;
