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

EXECUTIVE_PRODUCER_TOKEN = os.environ.get('EXECUTIVE_PRODUCER_TOKEN')
CASTING_DIRECTOR_TOKEN = os.environ.get('CASTING_DIRECTOR_TOKEN')
FAKE_TOKEN = os.environ.get('FAKE_TOKEN')


class CastingAgencyTestCase(unittest.TestCase):
    """This class represents the Casting Agency test case"""

    def setUp(self):
        """Define test variables and initialize app."""
        self.app = create_app()
        self.client = self.app.test_client
        self.database_name = "casting_agency_test"
        self.database_path = "postgresql://{}/{}".format(
            'localhost:5432',
            self.database_name
        )
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
            'gender': "Male",
            'portrait_url': "https://m.media-amazon.com/images/M/MV5BMjEyMTEyOTQ0MV5BMl5BanBnXkFtZTcwNzU3NTMzNw@@._V1_UY1200_CR126,0,630,1200_AL_.jpg",

        }

        self.new_movie = {
            "title": "Ocean's Eleven",
            "release_date": "2001-12-07",
            "movie_photo": "https://m.media-amazon.com/images/M/MV5BYzVmYzVkMmUtOGRhMi00MTNmLThlMmUtZTljYjlkMjNkMjJkXkEyXkFqcGdeQXVyNDk3NzU2MTQ@._V1_.jpg",
        }
        # Prepopulate the database
        new_actress = Actor(
            name="Amy Adams",
            age=46,
            gender="Female",
            portrait_url="https://m.media-amazon.com/images/M/MV5BMTg2NTk2MTgxMV5BMl5BanBnXkFtZTgwNjcxMjAzMTI@._V1_.jpg",
        )
        new_movie = Movie(
            title="The Master",
            release_date=datetime.datetime.strptime("2012-09-21",
                                                    "%Y-%m-%d").date(),
            movie_photo="https://m.media-amazon.com/images/M/MV5BMTQ2NjQ5MzMwMF5BMl5BanBnXkFtZTcwMjczNTAzOA@@._V1_UY1200_CR90,0,630,1200_AL_.jpg",

        )
        new_actress.insert()
        new_movie.insert()

        # Executive Producer Token, used for testing
        self.ex_producer_token = {
            'authorization': "Bearer %s" % EXECUTIVE_PRODUCER_TOKEN
        }
        self.casting_director_token = {
            'authorization': "Bearer %s" % CASTING_DIRECTOR_TOKEN
        }
        self.fake_token = {
            'authorization': "Bearer %s" % FAKE_TOKEN
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
        self.assertTrue(data['actors'][0]['portrait_url'])

    # ------------------------------------------------------------
    # Testing '/actors/%id/movies' GET endpoint
    # ------------------------------------------------------------
    def test_get_movies_for_actor_succeeds(self):
        # Get the existing actor and movie.
        res = self.client().get('/actors')
        data = json.loads(res.data)
        self.assertEqual(res.status_code, 200)
        actor_id = data['actors'][0]['id']
        res = self.client().get('/movies')
        data = json.loads(res.data)
        self.assertEqual(res.status_code, 200)
        movie_id = data['movies'][0]['id']
        # Check the endpoint defaults to 0 for no movies.
        res = self.client().get('/actors/%d/movies' % actor_id)
        data = json.loads(res.data)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(data['actor']['id'], actor_id)
        self.assertEqual(len(data['movies']), 0)
        # Associate the movie and the actor.
        res = self.client().patch('/actors/%d' % actor_id,
                                  headers=self.ex_producer_token,
                                  json={'movies': [movie_id]})
        # Check the endpoint now shoes 1 movie.
        res = self.client().get('/actors/%d/movies' % actor_id)
        data = json.loads(res.data)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(data['actor']['id'], actor_id)
        self.assertEqual(len(data['movies']), 1)
        self.assertEqual(data['movies'][0]['id'], movie_id)

    # ------------------------------------------------------------
    # Testing '/actors' POST endpoint
    # ------------------------------------------------------------
    def test_executive_producer_auth0_token_works(self):
        res = self.client().post(
            '/movies',
            headers=self.ex_producer_token,
            json={
                'title': self.new_movie['title'],
                'release_date': self.new_movie['release_date']})
        data = json.loads(res.data)
        self.assertEqual(res.status_code, 200)
        new_movie_id = data['movies'][0]['id']

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

    def test_create_actor_succeeds(self):
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

    def test_create_actor_with_movie_succeeds(self):
        # Get existing movies
        res = self.client().get('/movies')
        data = json.loads(res.data)
        self.assertEqual(res.status_code, 200)
        movie_id = data['movies'][0]['id']

        # Add new actor and associate it with movie
        res = self.client().post('/actors',
                                 headers=self.ex_producer_token,
                                 json={
                                     'name': self.new_actor['name'],
                                     'age': self.new_actor['age'],
                                     'gender': self.new_actor['gender'],
                                     'movies': [movie_id]
                                 })
        data = json.loads(res.data)
        new_actor_id = data['actors'][0]['id']

        # Assert the new actor was inserted
        res = self.client().get('/actors')
        data = json.loads(res.data)
        actor_exists = False
        for actor in data['actors']:
            if actor['id'] == new_actor_id:
                actor_exists = True
        self.assertTrue(actor_exists)

        # Assert the movie was also associated with the actor.
        res = self.client().get('/movies')
        data = json.loads(res.data)
        self.assertEqual(res.status_code, 200)
        for movie in data['movies']:
            if movie['id'] == movie_id:
                self.assertTrue(movie['actors'][0], new_actor_id)

        # Clean up DB after creating new actor
        res = self.client().delete('/actors/%d' % new_actor_id,
                                   headers=self.ex_producer_token)
        self.assertEqual(res.status_code, 200)

    def test_create_actor_throw_400_for_missing_name(self):
        res = self.client().post('/actors',
                                 headers=self.ex_producer_token,
                                 json={
                                     'age': self.new_actor['age'],
                                     'gender': self.new_actor['gender']
                                 })
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 400)
        self.assertEqual(data['success'], False)
        self.assertEqual(data['message'], 'Bad request')

    def test_create_actor_throws_404_for_bad_movie_id(self):
        res = self.client().post('/actors',
                                 headers=self.ex_producer_token,
                                 json={
                                     'name': self.new_actor['name'],
                                     'age': self.new_actor['age'],
                                     'gender': self.new_actor['gender'],
                                     'movies': [100000]
                                 })
        data = json.loads(res.data)
        self.assertEqual(res.status_code, 404)
        self.assertEqual(data['success'], False)
        self.assertEqual(data['message'], 'Resource was not found')

    def test_create_actor_succeeds_for_casting_directory(self):
        res = self.client().post('/actors',
                                 headers=self.casting_director_token,
                                 json={
                                     'name': self.new_actor['name'],
                                     'age': self.new_actor['age'],
                                     'gender': self.new_actor['gender']
                                 })
        data = json.loads(res.data)
        new_actor_id = data['actors'][0]['id']
        self.assertEqual(res.status_code, 200)

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
                                   headers=self.casting_director_token)
        self.assertEqual(res.status_code, 200)

    def test_create_actor_throws_401_for_invalid_auth(self):
        res = self.client().post('/actors',
                                 headers=self.fake_token,
                                 json={
                                     'name': self.new_actor['name'],
                                     'age': self.new_actor['age'],
                                     'gender': self.new_actor['gender']
                                 })
        data = json.loads(res.data)
        self.assertEqual(res.status_code, 401)
        self.assertEqual(data['success'], False)
        self.assertEqual(data['message'],
                         'Unable to parse authentication token.')

    # ------------------------------------------------------------
    # Testing '/actors/${actor_id}' DELETE endpoint
    # ------------------------------------------------------------
    def test_delete_actor_succeeds(self):
        # Create actor to delete
        res = self.client().post('/actors',
                                 headers=self.ex_producer_token,
                                 json={
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
        res = self.client().delete('/actors/%d' % new_actor_id,
                                   headers=self.ex_producer_token)
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
        res = self.client().delete('/actors/100000',
                                   headers=self.ex_producer_token)
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 404)
        self.assertEqual(data['success'], False)
        self.assertEqual(data['message'], 'Resource was not found')

    # ------------------------------------------------------------
    # Testing '/actors' PATCH endpoint
    # ------------------------------------------------------------
    def test_patch_actor_succeeds(self):
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

        # Patch the new actor just inserted.
        res = self.client().patch('/actors/%d' % new_actor_id,
                                  headers=self.ex_producer_token,
                                  json={
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
        res = self.client().delete('/actors/%d' % new_actor_id,
                                   headers=self.ex_producer_token)
        self.assertEqual(res.status_code, 200)

    def test_patch_actor_with_movie_succeeds(self):
        res = self.client().post('/actors',
                                 headers=self.ex_producer_token,
                                 json={
                                     'name': self.new_actor['name'],
                                     'age': self.new_actor['age'],
                                     'gender': self.new_actor['gender']
                                 })
        data = json.loads(res.data)
        new_actor_id = data['actors'][0]['id']
        # Get an existing movie.
        res = self.client().get('/movies')
        data = json.loads(res.data)
        movie_id = data['movies'][0]['id']
        # Patch the new actor just inserted.
        res = self.client().patch('/actors/%d' % new_actor_id,
                                  headers=self.ex_producer_token,
                                  json={'movies': [movie_id]})
        data = json.loads(res.data)
        # Assert the new actor was patched.
        res = self.client().get('/actors')
        data = json.loads(res.data)
        actor_exists = False
        for actor in data['actors']:
            if actor['id'] == new_actor_id:
                actor_exists = True
                self.assertEqual(actor['movies'], [movie_id])

        self.assertTrue(actor_exists)
        # Clean up DB after creating new actor
        res = self.client().delete('/actors/%d' % new_actor_id,
                                   headers=self.ex_producer_token)
        self.assertEqual(res.status_code, 200)

    def test_patch_actors_throw_404_for_bad_actor_id(self):
        res = self.client().patch('/actors/100000',
                                  headers=self.ex_producer_token,
                                  json={
                                      'name': self.new_actor['name'],
                                      'age': self.new_actor['age'],
                                      'gender': self.new_actor['gender']
                                  })
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 404)
        self.assertEqual(data['success'], False)
        self.assertEqual(data['message'], 'Resource was not found')

    # ------------------------------------------------------------
    # Testing '/movies' GET endpoint
    # ------------------------------------------------------------
    def test_basic_get_movies_succeeds(self):
        res = self.client().get('/movies')
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 200)
        self.assertEqual(data['success'], True)
        self.assertTrue(data['movies'])
        self.assertEqual(len(data['movies']), 1)

        self.assertTrue(data['movies'][0]['title'])
        self.assertTrue(data['movies'][0]['release_date'])
        self.assertTrue(data['movies'][0]['movie_photo'])

    # ------------------------------------------------------------
    # Testing '/movies/%id/actors' GET endpoint
    # ------------------------------------------------------------
    def test_get_actors_for_movie_succeeds(self):
        # Get the existing actor and movie.
        res = self.client().get('/actors')
        data = json.loads(res.data)
        self.assertEqual(res.status_code, 200)
        actor_id = data['actors'][0]['id']
        res = self.client().get('/movies')
        data = json.loads(res.data)
        self.assertEqual(res.status_code, 200)
        movie_id = data['movies'][0]['id']
        # Check the endpoint defaults to 0 for no actors.
        res = self.client().get('/movies/%d/actors' % actor_id)
        data = json.loads(res.data)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(data['movie']['id'], movie_id)
        self.assertEqual(len(data['actors']), 0)
        # Associate the movie and the actor.
        res = self.client().patch('/movies/%d' % movie_id,
                                  headers=self.ex_producer_token,
                                  json={'actors': [actor_id]})
        # Check the endpoint now shoes 1 movie.
        res = self.client().get('/movies/%d/actors' % movie_id)
        data = json.loads(res.data)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(data['movie']['id'], movie_id)
        self.assertEqual(len(data['actors']), 1)
        self.assertEqual(data['actors'][0]['id'], actor_id)

    # ------------------------------------------------------------
    # Testing '/movies' POST endpoint
    # ------------------------------------------------------------
    def test_create_movie_succeeds(self):
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

    def test_create_movie_with_actors_succeeds(self):
        res = self.client().get('/actors')
        data = json.loads(res.data)
        self.assertEqual(res.status_code, 200)
        actor_id = data['actors'][0]['id']

        res = self.client().post(
            '/movies',
            headers=self.ex_producer_token,
            json={
                'title': self.new_movie['title'],
                'release_date': self.new_movie['release_date'],
                'actors': [actor_id]})
        data = json.loads(res.data)
        new_movie_id = data['movies'][0]['id']

        # Assert the new movie was inserted
        res = self.client().get('/movies')
        data = json.loads(res.data)
        movie_exists = False
        for movie in data['movies']:
            if movie['id'] == new_movie_id:
                movie_exists = True
        self.assertTrue(movie_exists)

        # Assert the actor was also associated with the movie.
        res = self.client().get('/actors')
        data = json.loads(res.data)
        self.assertEqual(res.status_code, 200)
        for actor in data['actors']:
            if actor['id'] == actor_id:
                self.assertTrue(actor['movies'][0], new_movie_id)

        # Clean up DB after creating new movie
        res = self.client().delete('/movies/%d' % new_movie_id,
                                   headers=self.ex_producer_token)
        self.assertEqual(res.status_code, 200)

    def test_create_movie_throws_400_for_missing_title(self):
        res = self.client().post('/movies', headers=self.ex_producer_token,
                                 json={'release_date':
                                       self.new_movie['release_date']})
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 400)
        self.assertEqual(data['success'], False)
        self.assertEqual(data['message'], 'Bad request')

    def test_create_movie_throws_400_for_incorrectly_formated_date(self):
        res = self.client().post('/movies',
                                 headers=self.ex_producer_token,
                                 json={
                                     'title': self.new_movie['title'],
                                     'release_date': "1965-35-35"
                                 })
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 400)
        self.assertEqual(data['success'], False)
        self.assertEqual(data['message'], 'Bad request')

    def test_create_movie_throws_404_for_bad_actor_id(self):
        res = self.client().post(
            '/movies',
            headers=self.ex_producer_token,
            json={
                'title': self.new_movie['title'],
                'release_date': self.new_movie['release_date'],
                'actors': [100000]})
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 404)
        self.assertEqual(data['success'], False)
        self.assertEqual(data['message'], 'Resource was not found')

    def test_create_movie_throws_401_for_wrong_permissions(self):
        res = self.client().post(
            '/movies',
            headers=self.casting_director_token,
            json={
                'title': self.new_movie['title'],
                'release_date': self.new_movie['release_date']})
        data = json.loads(res.data)
        self.assertEqual(res.status_code, 401)
        self.assertEqual(data['success'], False)
        self.assertEqual(data['message'], 'Permission not found.')

    # ------------------------------------------------------------
    # Testing '/movies/${movie_id}' DELETE endpoint
    # ------------------------------------------------------------
    def test_delete_movie_succeeds(self):
        # Create movie to delete
        res = self.client().post(
            '/movies',
            headers=self.ex_producer_token,
            json={
                'title': self.new_movie['title'],
                'release_date': self.new_movie['release_date']})
        data = json.loads(res.data)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(data['success'], True)
        new_movie_id = data['movies'][0]['id']

        # Check movie exists before deletion
        res = self.client().get('/movies')
        data = json.loads(res.data)
        movie_exists = False
        for movie in data['movies']:
            if movie['id'] == new_movie_id:
                movie_exists = True
        self.assertTrue(movie_exists)

        # Delete our new movie with id new_movie_id
        res = self.client().delete('/movies/%d' % new_movie_id,
                                   headers=self.ex_producer_token)
        data = json.loads(res.data)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(data['success'], True)
        self.assertEqual(data['delete'], new_movie_id)

        # Check question does NOT exists after deletion
        res = self.client().get('/movies')
        data = json.loads(res.data)
        movie_exists = False
        for movie in data['movies']:
            if movie['id'] == new_movie_id:
                movie_exists = True
        self.assertFalse(movie_exists)

    def test_delete_movie_throws_404_for_bad_movie_id(self):
        res = self.client().delete('/movies/100000',
                                   headers=self.ex_producer_token)
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 404)
        self.assertEqual(data['success'], False)
        self.assertEqual(data['message'], 'Resource was not found')

    def test_delete_movie_throws_401_for_wrong_permissions(self):
        res = self.client().delete('/movies/0',
                                   headers=self.casting_director_token)
        data = json.loads(res.data)
        self.assertEqual(res.status_code, 401)
        self.assertEqual(data['success'], False)
        self.assertEqual(data['message'], 'Permission not found.')

    # ------------------------------------------------------------
    # Testing '/movies' PATCH endpoint
    # ------------------------------------------------------------
    def test_patch_movie_succeeds(self):
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

        # Patch the new movie just inserted.
        res = self.client().patch('/movies/%d' % new_movie_id,
                                  headers=self.ex_producer_token,
                                  json={
                                      'title': self.new_movie['title'],
                                      'release_date': '2024-02-04'
                                  })
        data = json.loads(res.data)
        new_movie_id = data['movies'][0]['id']
        self.assertEqual(res.status_code, 200)
        self.assertEqual(data['success'], True)

        # Assert the new movie was patched.
        res = self.client().get('/movies')
        data = json.loads(res.data)
        movie_exists = False
        for movie in data['movies']:
            if movie['id'] == new_movie_id:
                movie_exists = True
                self.assertEqual(movie['title'], self.new_movie['title'])
                self.assertEqual(movie['release_date'], '2024-02-04')
        self.assertTrue(movie_exists)

    def test_patch_movie_with_new_actor_succeeds(self):
        # Create a new movie with no actors.
        res = self.client().post(
            '/movies',
            headers=self.ex_producer_token,
            json={
                'title': self.new_movie['title'],
                'release_date': self.new_movie['release_date']})
        data = json.loads(res.data)
        new_movie_id = data['movies'][0]['id']
        # Get an existing actor.
        res = self.client().get('/actors')
        data = json.loads(res.data)
        actor_id = data['actors'][0]['id']
        # Patch the new movie just inserted with an actor.
        self.client().patch('/movies/%d' % new_movie_id,
                            headers=self.ex_producer_token,
                            json={
                                'actors': [actor_id]
                            })
        # Assert the new movie was patched correctly.
        res = self.client().get('/movies')
        data = json.loads(res.data)
        movie_exists = False
        for movie in data['movies']:
            if movie['id'] == new_movie_id:
                movie_exists = True
                self.assertEqual(movie['actors'], [actor_id])
        self.assertTrue(movie_exists)
        # Clean up DB after creating new movie
        res = self.client().delete('/movies/%d' % new_movie_id,
                                   headers=self.ex_producer_token)
        self.assertEqual(res.status_code, 200)

    def test_patch_movies_throw_404_for_bad_movie_id(self):
        res = self.client().patch(
            '/movies/100000',
            headers=self.ex_producer_token,
            json={
                'title': self.new_movie['title'],
                'release_date': self.new_movie['release_date']})
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 404)
        self.assertEqual(data['success'], False)
        self.assertEqual(data['message'], 'Resource was not found')


# Make the tests conveniently executable
if __name__ == "__main__":
    unittest.main()
