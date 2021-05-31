# UdacityFullStackWebCourse-Capstone Frontend

UdacityFullStackWebCourse Capstone Project frontend, which provides a UI to
interact with the backend server.  Please see `../README.md` for more
information on the backend.

The frontend app client is live at:
https://nickanthony-casting-agency-c.herokuapp.com/

The backend server is live at: https://nickanthony-casting-agency.herokuapp.com/

This project is the Capstone in the Udacity Full Stack Web Developer Nanodegree.
I was hoping to leverage many of the different skills I learned in the course
and create a project that incorporates all the different pieces of the course.
This frontend lets you interact and use the APIs provided within the flask
application underneath.

---

## Larger TODOs

1. Look into adding redux
2. Restore the page/history after an Auth0 login
3. Add react tests

---

## Npm

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

### `npm run publishToHeroku`

This will push the tip-of-tree frontend source to heroku at
https://nickanthony-casting-agency-c.herokuapp.com/.

This command specifically only pushes the frontend directory to the frontend
heroku instance.  The backend is pushed to
https://nickanthony-casting-agency.herokuapp.com/ separately.

They must be deployed separately.

---

## Deployment

The frontend of the application is served through heroku.  It uses a react
builder to build and then serve the application.

It runs on a different instance of heroku than the backend because React Router
only works if it controls the URL.  When you deploy to the same instance, the
flask application actually serves the content, so any reloading of the page
causes a 404 because the flask application does not have the route.

### `npm run publishToHeroku`

To deploy the tip-of-tree source code to heroku, run `npm run publishToHeroku`.

This will push the tip-of-tree frontend source to heroku at
https://nickanthony-casting-agency-c.herokuapp.com/.

This command specifically only pushes the frontend directory to the frontend
heroku instance.  The backend is pushed to
https://nickanthony-casting-agency.herokuapp.com/ separately.

They must be deployed separately.

---

## Code Style

### Javascript Code Style

All react/javascript files have been checked with `eslint`.  Please see
https://eslint.org/ for more information.  It follows the Google style guide
defaults.

Using the following to double check code style:

```Shell
npx eslint <filename.js> --fix
```

### PropTypes

All components that take props all need to use PropTypes to type check the
props.  See https://reactjs.org/docs/typechecking-with-proptypes.html for
more detailed information.

---

## Components

### `Home`

This is the base home page loaded on index.  It provides the columns of
Actors/Actresses and the column of movies.

### `MovieProfile`

Provides a profile of the movie, which includes it's information and the actors
or actresses in that movie.  Also provide edit abilities to logged in Users
with the appropriate ACLs.   These are done through subcomponents `EditMovie`
and `AssociateActorWithMovie`, which callback to `MovieProfile` to save
the edits to the database.

This is the page that loads when a movie thumbnail is clicked.

### `ActorProfile`

Provides a profile of an Actor/Actress, which includes it's information and the
movies in which that actor/actress is in.  Also provide edit abilities to logged
in Users with the appropriate ACLs.   These are done through subcomponents
`EditActor` and `AssociateMovieWithActor`, which callback to `ActorProfile` to
save the edits to the database.

This is the page that loads when an actor/actress thumbnail is clicked.

### `UserProfile`

The User profile of the currently logged in user.  Gets all it's information
from Auth0.

---

## Authentication

Authentication is provided by [Auth0](https://auth0.com/).  It is configured
for a single page application using the
[React Auth0 SDK docs/guide](https://auth0.com/docs/libraries/auth0-react).
All calls to the database will check the ACLs of the calling user, except
`GET /actors` and `GET /movies`, which are public by default.
