import os
from flask import Flask
from flask_cors import CORS
from models import setup_db

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
        actor_to_delete = Actory.query.get(actor_id)
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
        - Returns:
          - Status code 200 and json {"success": True, "actors": [actor]} where
              actors is an array containing only the newly created actor
              or appropriate status code indicating reason for failure
    '''
    @app.route('/actors', methods=['POST'])
    def add_new_actor(payload):
        if not request.get_json():
            abort(400)
        name = request.get_json().get('name', None)
        age = request.get_json().get('age', 0)
        gender = request.get_json().get('gender', None)

        # Verify that the appropriate parameters were passed.
        if (not name or not age or not gender):
            abort(400)

        try:
            new_actor = Actor(
                name=name,
                age=age,
                gender=gender
            )
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
    PATCH /drinks/<id>
        - Updates an existing actor.  It will throw a 404 if <id> is not found.
        - Permissions required:
            - 'patch:actors'
        - Request Arguments:
            - [Optional] 'name': A string that is the full name of the actor.
            - [Optional] 'age': An Integer that is the age of the actor.
            - [Optional] 'gender': A string that is the gender of the actor.
            - The actor information will not change if none of the request
                arguments are supplied.  However, a 200 will be returned.
        - Returns:
          - Status code 200 and json {"success": True, "actors": [actor]} where
              actors is an array containing only the updated actor
              or appropriate status code indicating reason for failure.
    '''
    @app.route('/actors/<int:actor_id>', methods=['PATCH'])
    def modify_exiting_drink(actor_id):
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

    return app

app = create_app()

if __name__ == '__main__':
    app.run()
