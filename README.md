# UdacityFullStackWebCourse-Capstone

UdacityFullStackWebCourse Capstone Project

## Casting Agency Specifications

The Casting Agency models a company that is responsible for creating movies and managing and assigning actors to those movies. You are an Executive Producer within the company and are creating a system to simplify and streamline your process.

## Models

- Movies with attributes title and release date
    - Table name: `movies`
    - Columns:
      - `id`: Integer, Primary key
      - `title`: String, Movie title
      - `release_date`: Date, Release date
      - `actors`: Backref to actors table; list of actors in movie
- Actors with attributes name, age and gender
    - Table name: `actors`
    - Columns:
      - `name`: String, actor's name
      - `age`: Integer, age
      - `gender`: String, genter
      - `movies`: Backref to movies table; list of movies actor is in
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
    - @TODO: Implement  
2. Casting Director
    - All permissions a Casting Assistant has and…
    - Add or delete an actor from the database
    - Modify actors or movies
    - Has permissions:
      - `post:actors`
      - `patch:actors`
      - `delete:actors`
      - `patch:movies`
    - @TODO: Implement
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
    - @TODO: Implement

### Tokens

Generate a new token:

https://fsnd-app-nickanthony.us.auth0.com/authorize?audience=casting-agency&response_type=token&client_id=ExP2mxHo4wAMYB0MGc9nmWHxSHcfO1eu&redirect_uri=https://127.0.0.1:8100/login-results

1. Casting Assistant

N/A

2. Casting Director

eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ikh6Z3Z4U3lDNm9fU0t4c25nSnR0ZiJ9.eyJpc3MiOiJodHRwczovL2ZzbmQtYXBwLW5pY2thbnRob255LnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHw2MDBkMDQ0OGZmY2JlMjAwNmE4ODY2MWUiLCJhdWQiOiJjYXN0aW5nLWFnZW5jeSIsImlhdCI6MTYxNTI1NDkzOCwiZXhwIjoxNjE1MzQxMzM4LCJhenAiOiJFeFAybXhIbzR3QU1ZQjBNR2M5bm1XSHhTSGNmTzFldSIsInNjb3BlIjoiIiwicGVybWlzc2lvbnMiOlsiZGVsZXRlOmFjdG9ycyIsInBhdGNoOmFjdG9ycyIsInBhdGNoOm1vdmllcyIsInBvc3Q6YWN0b3JzIl19.kXVKUP8yrsCgWljqvUjZUPBdL_g9N4AEU2SkHRmN3mXD1zo74lQKindElF5j0suPBc2N9G6JkZJ5GiBTcjZsPCyRW2N9IGvI8hs1aPZSn4E6g_XNAmECC3bwpOhCr78jDPR0ZaqL1dWzCIJnSmpHxUVc4wapIRJOTHJkxdMGj2Bh7Y_CMi7KdeZfULrn9hAg1aHd1eDSiMRQhshI5R4FWTZ3L5ujw7TtBNlGn6wXHqZ4h6da8Cy4nVkKde3g9wkq0Hy3CRdrooZGQuPjgqtx7K9RKI77z9OqvIheZQYiimtdAPESVpagfo0NXrz-3aGnz3ywBtYdbVIV0o7ER6DTrw

3. Executive Producer

eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ikh6Z3Z4U3lDNm9fU0t4c25nSnR0ZiJ9.eyJpc3MiOiJodHRwczovL2ZzbmQtYXBwLW5pY2thbnRob255LnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHw2MDBkMDQ0OGZmY2JlMjAwNmE4ODY2MWUiLCJhdWQiOiJjYXN0aW5nLWFnZW5jeSIsImlhdCI6MTYxNTIwMTU2MCwiZXhwIjoxNjE1Mjg3OTYwLCJhenAiOiJFeFAybXhIbzR3QU1ZQjBNR2M5bm1XSHhTSGNmTzFldSIsInNjb3BlIjoiIiwicGVybWlzc2lvbnMiOlsiZGVsZXRlOmFjdG9ycyIsImRlbGV0ZTptb3ZpZXMiLCJwYXRjaDphY3RvcnMiLCJwYXRjaDptb3ZpZXMiLCJwb3N0OmFjdG9ycyIsInBvc3Q6bW92aWVzIl19.SUxEzgLQTjkiAW-EbN4NTMMc1Cy5EdWy8jvo5EkR5-xnzuLeH2ZbPYdtGwqkjmks2c0HRwGAMO8qbF9Z9pXi3U1CKHzydo_BdjuDusbu7HIUGGIli8kxZ35fp0eiMM3sE7Q2KBSOXZlh0v30-Ln3YlQODsOmb5BsSXhu8eBS9oM1J1c63BRillUg6jz-MjkLTuNg8We3n9yzaxyLdE_UTVXn0JMk1NaSfIxrR5rlv6vLGGHykwF5LKN1vhl_Zx2XgjhFq8zdyNf-fnuwOlkAB6J9glWlDv7S0h3xbSE9wWRQoGFHbH6C4EOWRm2IlfmNdWDkzX_o-Y6gKcINPSG_EQ

## Testing

### Set up

`createdb casting_agency_test`

If the testing db was already created:

`dropdb casting_agency_test && createdb casting_agency_test`

### Run the tests

`python test_app.py`

## Python Code Style

All python files have been checked with `pycodestyle`.
Using the following to double check code style:

`pycodestyle <filename.py>`
