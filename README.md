# UdacityFullStackWebCourse-Capstone

UdacityFullStackWebCourse Capstone Project

## Casting Agency Specifications

The Casting Agency models a company that is responsible for creating movies and managing and assigning actors to those movies. You are an Executive Producer within the company and are creating a system to simplify and streamline your process.

### Models

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

### Endpoints

- `GET` /actors
    - @TODO: Implement
- `DELETE` /actors/{id}
    - @TODO: Implement
- `POST` /actors
    - @TODO: Implement
- `PATCH` /actors/{id}
    - @TODO: Implement

- `GET` /movies
    - @TODO: Implement
- `DELETE` /movies/{id}
    - @TODO: Implement
- `POST` /movies
    - @TODO: Implement
- `PATCH` /movies/{id}
    - @TODO: Implement

### Roles

1. Casting Assistant
    - Can view actors and movies
    - @TODO: Implement  
2. Casting Director
    - All permissions a Casting Assistant has and…
    - Add or delete an actor from the database
    - Modify actors or movies
    - @TODO: Implement
3. Executive Producer
    - All permissions a Casting Director has and…
    - Add or delete a movie from the database
    - @TODO: Implement

### Tests

- One test for success behavior of each endpoint
    - @TODO: Implement
- One test for error behavior of each endpoint
    - @TODO: Implement
- At least two tests of RBAC for each role
    - @TODO: Implement
