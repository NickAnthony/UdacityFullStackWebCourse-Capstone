import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import ActorColumn from './components/ActorColumn';
import MovieColumn from './components/MovieColumn';
import AppHeader from './components/AppHeader';
import NewActor from './components/NewActor';

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
          <Route path="/login">
            <Login />
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

function Login() {
  return <h2>Login Page</h2>;
}

export default App;
