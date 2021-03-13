# UdacityFullStackWebCourse-Capstone

UdacityFullStackWebCourse Capstone Project.

The app is live at: https://nickanthony-casting-agency.herokuapp.com/

## Casting Agency Specifications

The Casting Agency models a company that is responsible for creating movies and managing and assigning actors to those movies. You are an Executive Producer within the company and are creating a system to simplify and streamline your process.

## Models

### Movie
- Movies with attributes title and release date
    - Table name: `movies`
    - Columns:
      - `id`: Integer, Primary key
      - `title`: String, Movie title
      - `release_date`: Date, Release date
      - `actors`: Backref to actors table; list of actors in movie

#### Insert example
  ```Python
    req_release_date = datetime.datetime.strptime("2022-01-15",
        "%Y-%m-%d").date()
    movie = Movie(title=req_title, release_date=req_release_date)
    movie.insert()
  ```
#### Update example
  ```Python
      movie = Movie.query.filter(Movie.id == id).one_or_none()
      new_release_date = datetime.datetime.strptime("2022-01-15",
          "%Y-%m-%d").date()
      movie.release_date = new_release_date
      movie.update()
  ```

## Actor
- Actors with attributes name, age and gender
    - Table name: `actors`
    - Columns:
      - `name`: String, actor's name
      - `age`: Integer, age
      - `gender`: String, genter
      - `movies`: Backref to movies table; list of movies actor is in

#### Insert example
  ```Python
    actor = Actor(name=req_name, age=req_age, gender=req_gender)
    actor.insert()
  ```

#### Update example
  ```Python
    actor = Actor.query.filter(Actor.id == id).one_or_none()
    actor.age = 28
    actor.update()
  ```

## movie_actor_association
- Association table between movies and actors
    - Table name: `movie_actor_association`
    - Associates many-to-many relationship between movies and actors

## Endpoints

### Actor Endpoints

#### `GET /actors`

- A Public Endpoint that fetches a list of all actors. If there are
  no actors, it will return an empty list.
- Permissions required: None
- Request Arguments: None
- Returns:
  - Status code 200 and json {"success": True, "actors": actors}
    where actors is a list of all actors.

#### `DELETE /actors`

- A Public Endpoint that deletes an existing actor from the database.
  Returns a 404 if the actor `<id>` is not found.
- Permissions required:
  - `'delete:actors'``
- Request Arguments: None
- Returns:
  - Status code 200 and json `{"success": True, "delete": id}` where id
      is the id of the deleted record or appropriate status code
      indicating reason for failure.

#### `POST /actors`

- Creates a new actors and stores it in the database.  It will throw
    a 400 if the incorrect parameters are passed.
- Permissions required:
    - `'post:actors'`
- Request Arguments:
    - `'name'`: A string that is the full name of the actor.
    - `'age'`: An Integer that is the age of the actor.
    - `'gender'`: A string that is the gender of the actor.
- Returns:
  - Status code 200 and json `{"success": True, "actors": [actor]}` where
      actors is an array containing only the newly created actor
      or appropriate status code indicating reason for failure

#### `PATCH /actors/<id>`

- Updates an existing actor.  It will throw a 404 if `<id>` is not found.
- Permissions required:
    - `'patch:actors'`
- Request Arguments:
    - [Optional] `'name'`: A string that is the full name of the actor.
    - [Optional] `'age'`: An Integer that is the age of the actor.
    - [Optional] `'gender'`: A string that is the gender of the actor.
    - The actor information will not change if none of the request
        arguments are supplied.  However, a 200 will still be returned.
- Returns:
  - Status code 200 and json `{"success": True, "actors": [actor]}` where
      actors is an array containing only the updated actor
              or appropriate status code indicating reason for failure.


### Movie Endpoints

#### `GET /movies`

- A Public Endpoint that fetches a list of all movies. If there are
    no movies, it will return an empty list.
- Permissions required: None
- Request Arguments: None
- Returns:
  - Status code 200 and json `{"success": True, "movies": movies}`
    where movies is a list of all movies.

#### `DELETE /movies`

- A Public Endpoint that deletes an existing movie from the database.
  Returns a 404 if the movie `<id>` is not found.
- Permissions required:
  - `'delete:movies'`
- Request Arguments: None
- Returns:
  - Status code 200 and json `{"success": True, "delete": id}` where id
      is the id of the deleted record or appropriate status code
      indicating reason for failure.

#### `POST /movies`

- Creates a new movies and stores it in the database.  It will throw
    a 400 if the incorrect parameters are passed.
- Permissions required:
    - `'post:movies'`
- Request Arguments:
    - `'title'`: A string that is the full title of the movie.
    - `'release_date'`: A string of the release date of the movie, in the
       format "YYYY-MM-DD"
- Returns:
  - Status code 200 and json `{"success": True, "movies": [movie]}` where
      movies is an array containing only the newly created movie
      or appropriate status code indicating reason for failure

#### `PATCH /movies/<id>`

- Updates an existing movie.  It will throw a 404 if `<id>` is not found.
- Permissions required:
    - `'patch:movies'`
- Request Arguments:
    - [Optional] `'title'`: A string that is the full title of the movie.
    - [Optional] `'release_date'`: A string of the release date of the movie, in the
       format "YYYY-MM-DD"
    - The movie information will not change if none of the request
        arguments are supplied.  However, a 200 will still be returned.
- Returns:
  - Status code 200 and json `{"success": True, "movies": [movie]}` where
      movies is an array containing only the updated movie
      or appropriate status code indicating reason for failure.


## Authentication

### Permissions

- `post:actors`: create a new actor
- `patch:actors`: modify an existing actor
- `delete:actors`: delete an actor
- `post:movies`: create a new movie
- `patch:movies`: modify an existing movie
- `delete:movies`: delete a movie

### Roles

1. Casting Assistant
    - Can view actors and movies.
    - Has permissions:
      - None, get actors/movies are public endpoints
2. Casting Director
    - All permissions a Casting Assistant has and…
    - Add or delete an actor from the database
    - Modify actors or movies
    - Has permissions:
      - `post:actors`
      - `patch:actors`
      - `delete:actors`
      - `patch:movies`
3. Executive Producer
    - All permissions a Casting Director has and…
    - Add or delete a movie from the database
    - Has permissions:
      - `post:actors`
      - `patch:actors`
      - `delete:actors`
      - `post:movies`
      - `patch:movies`
      - `delete:movies`

### Tokens

Generate a new token:

https://fsnd-app-nickanthony.us.auth0.com/authorize?audience=casting-agency&response_type=token&client_id=ExP2mxHo4wAMYB0MGc9nmWHxSHcfO1eu&redirect_uri=https://127.0.0.1:8100/login-results

1. Casting Assistant

N/A

2. Casting Director

See env.py, casting_director_token

3. Executive Producer

See env.py, executive_producer_token

## Testing

### Set up

`createdb casting_agency_test`

If the testing db was already created:

`dropdb casting_agency_test && createdb casting_agency_test`

### Run the tests

`python test_app.py`

All tests will run with the default executive director token above.  If more
than 50% of the tests are failing with 401, then it is likely the the JWTs
have expired.

### Live test: test_heroku_app.py

Because there is no front end, I wrote this script to test out the endpoints
live on heroku!

`python test_heroku_app.py --help`

The script will run queries against the live heroku application!  You can try
a couple pre-populated movies and actors.

## Python Code Style

All python files have been checked with `pycodestyle`.
Using the following to double check code style:

`pycodestyle <filename.py>`
