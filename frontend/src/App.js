import './App.css';
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
          <Route path="/profile">
            <Profile />
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
    <div className="Column-wrapper">
      <ActorColumn/>
      <MovieColumn/>
    </div>
  );
}

function NewActorRoute() {
  return <NewActor />;
}
function DeleteActorRoute() {
  return <DeleteActor />;
}

export default App;
