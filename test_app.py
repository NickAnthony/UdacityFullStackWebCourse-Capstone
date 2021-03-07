import os
import unittest
import json
import datetime
from flask import abort, jsonify, request
from flask_sqlalchemy import SQLAlchemy

from app import create_app
from models import setup_db, Actor, Movie

class CastingAgencyTestCase(unittest.TestCase):
    """This class represents the Casting Agency test case"""

    def setUp(self):
        """Define test variables and initialize app."""
        self.app = create_app()
        self.client = self.app.test_client
        self.database_name = "casting_agency_test"
        self.database_path = "postgresql://{}/{}".format('localhost:5432', self.database_name)
        setup_db(self.app, self.database_path)

        # binds the app to the current context
        with self.app.app_context():
            self.db = SQLAlchemy()
            self.db.init_app(self.app)
            # create all tables
            self.db.create_all()

        self.new_actor = {
            'name': 'George Clooney',
            'age': 59,
            'gender': "Male"
        }

        self.new_movie = {
            "title": "Ocean's Eleven",
            "release_date": datetime.datetime.strptime("2001-12-07",
                                                       "%Y-%m-%d").date()
        }
        # Prepopulate the database
        new_actress = Actor(
            name="Amy Adams",
            age=46,
            gender="Female"
        )
        new_movie = Movie(
            title="The Master",
            release_date=datetime.datetime.strptime("2012-09-21",
                                                    "%Y-%m-%d").date()
        )
        new_actress.insert()
        new_movie.insert()

    def tearDown(self):
        """Executed after reach test"""
        all_actors = Actor.query.all()
        for actor in all_actors:
            actor.delete()
        all_movies = Movie.query.all()
        for movie in all_movies:
            movie.delete()
        pass

    """
    @TODO
    Write at least one test for each test for successful operation and for
    expected errors.
    """

    # ------------------------------------------------------------
    # Testing '/actors' GET endpoint
    # ------------------------------------------------------------

    def test_basic_get_actors_succeeds(self):
        res = self.client().get('/actors')
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 200)
        self.assertEqual(data['success'], True)
        self.assertTrue(data['actors'])
        self.assertEqual(len(data['actors']), 1)

        self.assertTrue(data['actors'][0]['name'])
        self.assertTrue(data['actors'][0]['age'])
        self.assertTrue(data['actors'][0]['gender'])


    # ------------------------------------------------------------
    # Testing '/actors' POST endpoint
    # ------------------------------------------------------------

    def test_create_actor_succeeds(self):
        res = self.client().post('/actors', json={
            'name': self.new_actor['name'],
            'age': self.new_actor['age'],
            'gender': self.new_actor['gender']
        })
        data = json.loads(res.data)
        new_actor_id = data['actors'][0]['id']
        self.assertEqual(res.status_code, 200)
        self.assertEqual(data['success'], True)
        self.assertEqual(data['actors'][0]['name'], self.new_actor['name'])
        self.assertEqual(data['actors'][0]['age'], self.new_actor['age'])
        self.assertEqual(data['actors'][0]['gender'], self.new_actor['gender'])

        # Assert the new actor was inserted
        res = self.client().get('/actors')
        data = json.loads(res.data)
        actor_exists = False
        for actor in data['actors']:
            if actor['id'] == new_actor_id:
                actor_exists = True
        self.assertTrue(actor_exists)

        # Clean up DB after creating new actor
        res = self.client().delete('/actors/%d' % new_actor_id)
        self.assertEqual(res.status_code, 200)

    def test_create_actor_throw_400_for_missing_name(self):
        res = self.client().post('/actors', json={
            'age': self.new_actor['age'],
            'gender': self.new_actor['gender']
        })
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 400)
        self.assertEqual(data['success'], False)
        self.assertEqual(data['message'], 'Bad request')

    # ------------------------------------------------------------
    # Testing '/actors/${actor_id}' DELETE endpoint
    # ------------------------------------------------------------

    def test_delete_actor_succeeds(self):
        # Create actor to delete
        res = self.client().post('/actors', json={
            'name': self.new_actor['name'],
            'age': self.new_actor['age'],
            'gender': self.new_actor['gender']
        })
        data = json.loads(res.data)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(data['success'], True)
        new_actor_id = data['actors'][0]['id']

        # Check actor exists before deletion
        res = self.client().get('/actors')
        data = json.loads(res.data)
        actor_exists = False
        for actor in data['actors']:
            if actor['id'] == new_actor_id:
                actor_exists = True
        self.assertTrue(actor_exists)

        # Delete our new actor with id new_actor_id
        res = self.client().delete('/actors/%d' % new_actor_id)
        data = json.loads(res.data)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(data['success'], True)
        self.assertEqual(data['delete'], new_actor_id)

        # Check question does NOT exists after deletion
        res = self.client().get('/actors')
        data = json.loads(res.data)
        actor_exists = False
        for actor in data['actors']:
            if actor['id'] == new_actor_id:
                actor_exists = True
        self.assertFalse(actor_exists)

    def test_delete_actor_throws_404_for_bad_actor_id(self):
        res = self.client().delete('/actors/1000')
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 404)
        self.assertEqual(data['success'], False)
        self.assertEqual(data['message'], 'Resource was not found')

    # ------------------------------------------------------------
    # Testing '/actors' PATCH endpoint
    # ------------------------------------------------------------

    def test_patch_actor_succeeds(self):
        res = self.client().post('/actors', json={
            'name': self.new_actor['name'],
            'age': self.new_actor['age'],
            'gender': self.new_actor['gender']
        })
        data = json.loads(res.data)
        new_actor_id = data['actors'][0]['id']
        self.assertEqual(res.status_code, 200)
        self.assertEqual(data['success'], True)

        # Patch the new actor just inserted.
        res = self.client().patch('/actors/%d' % new_actor_id, json={
            'name': self.new_actor['name'],
            'age': 30,
            'gender': "Female"
        })
        data = json.loads(res.data)
        new_actor_id = data['actors'][0]['id']
        self.assertEqual(res.status_code, 200)
        self.assertEqual(data['success'], True)

        # Assert the new actor was patched.
        res = self.client().get('/actors')
        data = json.loads(res.data)
        actor_exists = False
        for actor in data['actors']:
            if actor['id'] == new_actor_id:
                actor_exists = True
                self.assertEqual(actor['name'], self.new_actor['name'])
                self.assertEqual(actor['age'], 30)
                self.assertEqual(actor['gender'], "Female")
        self.assertTrue(actor_exists)

        # Clean up DB after creating new actor
        res = self.client().delete('/actors/%d' % new_actor_id)
        self.assertEqual(res.status_code, 200)

    def test_patch_actors_throw_404_for_bad_actor_id(self):
        res = self.client().patch('/actors/1000', json={
            'name': self.new_actor['name'],
            'age': self.new_actor['age'],
            'gender': self.new_actor['gender']
        })
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 404)
        self.assertEqual(data['success'], False)
        self.assertEqual(data['message'], 'Resource was not found')

# Make the tests conveniently executable
if __name__ == "__main__":
    unittest.main()
