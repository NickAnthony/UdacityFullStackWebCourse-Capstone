import datetime
import json
import os
import unittest
from flask import (
    abort,
    jsonify,
    request
)
from flask_sqlalchemy import SQLAlchemy
from app import create_app
from models import setup_db, Actor, Movie
from env import (
    executive_producer_token,
    casting_director_token,
    fake_token
)

database_path = os.environ.get('DATABASE_URL')
if not database_path:
    database_path = "postgres://localhost:5432/casting_agency"

class CastingAgencyTestCase(unittest.TestCase):
    """This class represents the Casting Agency test case"""

    def setUp(self):
        """Define test variables and initialize app."""
        self.app = create_app()
        self.client = self.app.test_client
        self.database_path = database_path
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
            "release_date": "2001-12-07"
        }

        # Executive Producer Token, used for testing
        self.ex_producer_token = {
            'authorization': "Bearer %s" % executive_producer_token
        }
        self.casting_director_token = {
            'authorization': "Bearer %s" % casting_director_token
        }
        self.fake_token = {
            'authorization': "Bearer %s" % fake_token
        }

    def tearDown(self):
        """Executed after reach test"""
        all_actors = Actor.query.all()
        for actor in all_actors:
            actor.delete()
        all_movies = Movie.query.all()
        for movie in all_movies:
            movie.delete()
        pass

    # ------------------------------------------------------------
    # Testing '/actors' and '/movies' GET endpoint
    # ------------------------------------------------------------
    def test_basic_get_succeeds(self):
        res = self.client().get('/actors')
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 200)
        self.assertEqual(data['success'], True)
        self.assertTrue('actors' in data)

        res = self.client().get('/movies')
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 200)
        self.assertEqual(data['success'], True)
        self.assertTrue('movies' in data)

    # ------------------------------------------------------------
    # Testing '/actors' POST and DELETE endpoint
    # ------------------------------------------------------------
    def test_basic_create_and_delete_actor_succeeds(self):
        res = self.client().post('/actors',
                                 headers=self.ex_producer_token,
                                 json={
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
        res = self.client().delete('/actors/%d' % new_actor_id,
                                   headers=self.ex_producer_token)
        self.assertEqual(res.status_code, 200)

    # ------------------------------------------------------------
    # Testing '/movies' POST endpoint
    # ------------------------------------------------------------
    def test_basic_create_and_delete_movie_succeeds(self):
        res = self.client().post(
            '/movies',
            headers=self.ex_producer_token,
            json={
                'title': self.new_movie['title'],
                'release_date': self.new_movie['release_date']})
        data = json.loads(res.data)
        new_movie_id = data['movies'][0]['id']
        self.assertEqual(res.status_code, 200)
        self.assertEqual(data['success'], True)
        self.assertEqual(data['movies'][0]['title'], self.new_movie['title'])
        self.assertEqual(data['movies'][0]['release_date'],
                         self.new_movie['release_date'])

        # Assert the new movie was inserted
        res = self.client().get('/movies')
        data = json.loads(res.data)
        movie_exists = False
        for movie in data['movies']:
            if movie['id'] == new_movie_id:
                movie_exists = True
        self.assertTrue(movie_exists)

        # Clean up DB after creating new movie
        res = self.client().delete('/movies/%d' % new_movie_id,
                                   headers=self.ex_producer_token)
        self.assertEqual(res.status_code, 200)


# Make the tests conveniently executable
if __name__ == "__main__":
    unittest.main()
