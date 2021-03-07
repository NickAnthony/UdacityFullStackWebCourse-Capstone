import datetime, os
from flask import Flask, abort, jsonify, request
from flask_cors import CORS
from models import setup_db, Actor, Movie

def create_app(test_config=None):

    app = Flask(__name__)
    setup_db(app)
    CORS(app)

    # CORS Headers
    @app.after_request
    def after_request(response):
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,true')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PATCH,POST,DELETE,OPTIONS')
        return response

    @app.route('/')
    def get_greeting():
        excited = os.environ.get('EXCITED')
        if not excited:
            excited = 'true'
        greeting = "Hello"
        if excited == 'true': greeting = greeting + "!!!!!"
        return greeting

    @app.route('/coolkids')
    def be_cool():
        return "Be cool, man, be coooool! You're almost a FSND grad!"

    #----------------------------------------------------------------------------#
    # Actor endpoints/routes.
    #----------------------------------------------------------------------------#
    def format_actors(actors):
        return [actor.format() for actor in actors]

    def format_movies(movies):
        return [movie.format() for movie in movies]

    #----------------------------------------------------------------------------#
    # Actor endpoints/routes.
    #----------------------------------------------------------------------------#
    '''
    GET /actors
        - A Public Endpoint that fetches a list of all actors. If there are
            no actors, it will return an empty list.
        - Permissions required: None
        - Request Arguments: None
        - Returns:
          - Status code 200 and json {"success": True, "actors": actors}
            where actors is a list of all actors.
    '''
    @app.route('/actors', methods=['GET'])
    def get_actors():
        actors = Actor.query.all()
        return jsonify({
                'success': True,
                'actors': format_actors(actors)
            })

    '''
    DELETE /actors
        - A Public Endpoint that deletes an existing actor from the database.
          Returns a 404 if the actor <id> is not found.
        - Permissions required:
          - 'delete:actors'
        - Request Arguments: None
        - Returns:
          - Status code 200 and json {"success": True, "delete": id} where id
              is the id of the deleted record or appropriate status code
              indicating reason for failure.
    '''
    @app.route('/actors/<int:actor_id>', methods=['DELETE'])
    def delete_actor(actor_id):
        actor_to_delete = Actor.query.get(actor_id)
        if not actor_to_delete:
            abort(404)
        try:
            actor_to_delete_id = actor_to_delete.id
            actor_to_delete.delete()
            return jsonify({
                'success': True,
                'delete': actor_to_delete_id
            })
        except Exception as e:
            abort(422)

    '''
    POST /actors
        - Creates a new actors and stores it in the database.  It will throw
            a 400 if the incorrect parameters are passed.
        - Permissions required:
            - 'post:actors'
        - Request Arguments:
            - 'name': A string that is the full name of the actor.
            - 'age': An Integer that is the age of the actor.
            - 'gender': A string that is the gender of the actor.
            - 'movies': A list of movie ids that are the movies this actor is
                in.
        - Returns:
          - Status code 200 and json {"success": True, "actors": [actor]} where
              actors is an array containing only the newly created actor
              or appropriate status code indicating reason for failure
    @TODO: Implement ability to associate an actor with a movie.
    '''
    @app.route('/actors', methods=['POST'])
    def add_new_actor():
        if not request.get_json():
            abort(400)
        name = request.get_json().get('name', None)
        age = request.get_json().get('age', 0)
        gender = request.get_json().get('gender', None)
        movie_ids = request.get_json().get('movies', [])

        # Verify that the appropriate parameters were passed.
        if (not name or not age or not gender):
            abort(400)

        # Verify that the associated movies exist.
        for movie_id in movie_ids:
            movie = Movie.query.filter(Movie.id == movie_id).one_or_none()
            if not movie:
                abort(404)
        # Movies exist, associate actors with movies.
        movies_to_associate = Movie.query.filter(
            Movie.id.in_(movie_ids)
        ).all()

        try:
            new_actor = Actor(
                name=name,
                age=age,
                gender=gender
            )
            new_actor.movies = movies_to_associate
            new_actor.insert()
            # We can get the id of the new_actor because it has been flushed.
            return jsonify({
                'success': True,
                'id': new_actor.id,
                'actors': format_actors([new_actor])
            })
        except Exception as e:
            abort(422)

    '''
    PATCH /actors/<id>
        - Updates an existing actor.  It will throw a 404 if <id> is not found.
        - Permissions required:
            - 'patch:actors'
        - Request Arguments:
            - [Optional] 'name': A string that is the full name of the actor.
            - [Optional] 'age': An Integer that is the age of the actor.
            - [Optional] 'gender': A string that is the gender of the actor.
            - The actor information will not change if none of the request
                arguments are supplied.  However, a 200 will still be returned.
        - Returns:
          - Status code 200 and json {"success": True, "actors": [actor]} where
              actors is an array containing only the updated actor
              or appropriate status code indicating reason for failure.
    @TODO: Implement ability to update the movies an actor is in.
    '''
    @app.route('/actors/<int:actor_id>', methods=['PATCH'])
    def modify_exiting_actor(actor_id):
        actor = Actor.query.filter(Actor.id == actor_id).one_or_none()
        if not actor:
            abort(404)

        name = request.get_json().get('name', actor.name)
        age = request.get_json().get('age', actor.age)
        gender = request.get_json().get('gender', actor.gender)

        # Verify that an inappropriate value was not passed.
        if (not name or not age or not gender):
            abort(400)

        try:
            actor.name = name
            actor.age = age
            actor.gender = gender
            actor.update()
            return jsonify({
                'success': True,
                'id': actor.id,
                'actors': format_actors([actor])
            })
        except Exception as e:
            abort(422)

    #----------------------------------------------------------------------------#
    # Movie endpoints/routes.
    #----------------------------------------------------------------------------#
    '''
    GET /movies
        - A Public Endpoint that fetches a list of all movies. If there are
            no movies, it will return an empty list.
        - Permissions required: None
        - Request Arguments: None
        - Returns:
          - Status code 200 and json {"success": True, "movies": movies}
            where movies is a list of all movies.
    '''
    @app.route('/movies', methods=['GET'])
    def get_movies():
        movies = Movie.query.all()
        return jsonify({
                'success': True,
                'movies': format_movies(movies)
            })

    '''
    DELETE /movies
        - A Public Endpoint that deletes an existing movie from the database.
          Returns a 404 if the movie <id> is not found.
        - Permissions required:
          - 'delete:movies'
        - Request Arguments: None
        - Returns:
          - Status code 200 and json {"success": True, "delete": id} where id
              is the id of the deleted record or appropriate status code
              indicating reason for failure.
    '''
    @app.route('/movies/<int:movie_id>', methods=['DELETE'])
    def delete_movie(movie_id):
        movie_to_delete = Movie.query.get(movie_id)
        if not movie_to_delete:
            abort(404)
        try:
            movie_to_delete_id = movie_to_delete.id
            movie_to_delete.delete()
            return jsonify({
                'success': True,
                'delete': movie_to_delete_id
            })
        except Exception as e:
            abort(422)

    '''
    POST /movies
        - Creates a new movies and stores it in the database.  It will throw
            a 400 if the incorrect parameters are passed.
        - Permissions required:
            - 'post:movies'
        - Request Arguments:
            - 'title': A string that is the full title of the movie.
            - 'release_date': A string of the release date of the movie, in the
               format "YYYY-MM-DD"
        - Returns:
          - Status code 200 and json {"success": True, "movies": [movie]} where
              movies is an array containing only the newly created movie
              or appropriate status code indicating reason for failure
    @TODO: Implement ability to associate actors with this movie.
    '''
    @app.route('/movies', methods=['POST'])
    def add_new_movie():
        if not request.get_json():
            abort(400)
        title = request.get_json().get('title', None)
        release_date_str = request.get_json().get('release_date', None)

        # Verify that the appropriate parameters were passed.
        if (not title or not release_date_str):
            abort(400)

        # Verify that the date is in a valid format and a valid date.
        try:
            release_date = datetime.datetime.strptime(release_date_str,
                                                      "%Y-%m-%d").date()
        except ValueError as e:
            abort(400)

        try:
            new_movie = Movie(
                title=title,
                release_date=release_date
            )
            new_movie.insert()
            # We can get the id of the new_movie because it has been flushed.
            return jsonify({
                'success': True,
                'id': new_movie.id,
                'movies': format_movies([new_movie])
            })
        except Exception as e:
            abort(422)

    '''
    PATCH /movies/<id>
        - Updates an existing movie.  It will throw a 404 if <id> is not found.
        - Permissions required:
            - 'patch:movies'
        - Request Arguments:
            - [Optional] 'title': A string that is the full title of the movie.
            - [Optional] 'release_date': A string of the release date of the movie, in the
               format "YYYY-MM-DD"
            - The movie information will not change if none of the request
                arguments are supplied.  However, a 200 will still be returned.
        - Returns:
          - Status code 200 and json {"success": True, "movies": [movie]} where
              movies is an array containing only the updated movie
              or appropriate status code indicating reason for failure.
    @TODO: Implement ability to modify the actors in this movie.
    '''
    @app.route('/movies/<int:movie_id>', methods=['PATCH'])
    def modify_exiting_movie(movie_id):
        movie = Movie.query.filter(Movie.id == movie_id).one_or_none()
        if not movie:
            abort(404)

        req_json = request.get_json()
        title = req_json.get('title', None)
        release_date_str = req_json.get(
            'release_date',
            "{:%Y-%m-%d}".format(movie.release_date)
        )

        # Verify that the appropriate parameters were passed.
        if (not title or not release_date_str):
            abort(400)

        # Verify that the date is in a valid format and a valid date.
        try:
            release_date = datetime.datetime.strptime(release_date_str,
                                                      "%Y-%m-%d").date()
        except ValueError as e:
            abort(400)

        try:
            movie.title = title
            movie.release_date = release_date
            movie.update()
            return jsonify({
                'success': True,
                'id': movie.id,
                'movies': format_movies([movie])
            })
        except Exception as e:
            abort(422)

    '''
    @DONE:
    Create error handlers for all expected errors
    including 404 and 422.
    '''
    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({
            "success": False,
            "error": 400,
            "message": "Bad request"
        }), 400

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            "success": False,
            "error": 404,
            "message": "Resource was not found"
        }), 404

    @app.errorhandler(405)
    def not_found(error):
        return jsonify({
            "success": False,
            "error": 405,
            "message": "Method is not allowed"
        }), 405

    @app.errorhandler(422)
    def unprocessable(error):
        return jsonify({
            "success": False,
            "error": 422,
            "message": "Unprocessable"
        }), 422

    @app.errorhandler(500)
    def unprocessable(error):
        return jsonify({
            "success": False,
            "error": 500,
            "message": "Internal server error"
        }), 500

    return app

app = create_app()

if __name__ == '__main__':
    app.run()
