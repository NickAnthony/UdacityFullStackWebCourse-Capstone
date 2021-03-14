import argparse
import json
import os
from flask import request
from urllib.request import urlopen
import requests

HEROKU_DOMAIN = "https://nickanthony-casting-agency.herokuapp.com"
EXECUTIVE_PRODUCER_TOKEN = os.environ.get('EXECUTIVE_PRODUCER_TOKEN')
CASTING_DIRECTOR_TOKEN = os.environ.get('CASTING_DIRECTOR_TOKEN')

ex_producer_token_auth = {
    'authorization': "Bearer %s" % EXECUTIVE_PRODUCER_TOKEN
}
casting_director_token_auth = {
    'authorization': "Bearer %s" % CASTING_DIRECTOR_TOKEN
}

parser = argparse.ArgumentParser(
    description="Test Nick's Casting Agency Website Live!")
# Actors
parser.add_argument("--get-actors", help="Get all actors.",
                    action="store_true")
parser.add_argument("--post-actor", help="Adds a new actor/actress.",
                    action="store_true")
parser.add_argument("--post-actor-2", help="Adds another new actor/actress.",
                    action="store_true")
parser.add_argument("--patch-actor", help="Modifies an existing actor.",
                    action="store_true")
parser.add_argument("--delete-actor", help="Delete an existing actor.",
                    action="store_true")

# Movies
parser.add_argument("--get-movies", help="Get all movies.",
                    action="store_true")
parser.add_argument("--post-movie", help="Adds a new movie.",
                    action="store_true")
parser.add_argument("--post-movie-2", help="Adds another new movie.",
                    action="store_true")
parser.add_argument("--patch-movie", help="Modifies an existing movie.",
                    action="store_true")
parser.add_argument("--delete-movie", help="Delete an existing movie.",
                    action="store_true")


def get_index():
    r = requests.get(f'{HEROKU_DOMAIN}/')
    welcome = r.json()
    print("Welcome message:", welcome['welcome_message'])


def get_actors():
    r = requests.get(f'{HEROKU_DOMAIN}/actors')
    actors = r.json()
    print("All actors:", actors['actors'])


def post_actor():
    new_actor = {
        'name': "Amy Adams",
        'age': 46,
        'gender': "Femail"
    }
    r = requests.post(f'{HEROKU_DOMAIN}/actors',
                      headers=casting_director_token_auth,
                      json=new_actor)
    if r.status_code == 200:
        print("Successfully added ", new_actor['name'])
    else:
        print("Failed to post a new actor with error: ", r.status_code)


def post_actor_2():
    new_actor = {
        'name': 'George Clooney',
        'age': 59,
        'gender': "Male"
    }
    r = requests.post(f'{HEROKU_DOMAIN}/actors',
                      headers=casting_director_token_auth,
                      json=new_actor)
    if r.status_code == 200:
        print("Successfully added ", new_actor['name'])
    else:
        print("Failed to post a new actor with error: ", r.status_code)


def patch_actor():
    r = requests.get(f'{HEROKU_DOMAIN}/actors')
    actors = r.json()
    existing_actor = actors[0]
    old_age = existing_actor['age']
    existing_actor['age'] = 33
    r = requests.patch(f'{HEROKU_DOMAIN}/actors/%d' % existing_actor['id'],
                       headers=casting_director_token_auth,
                       json=existing_actor)
    if r.status_code == 200:
        actor = r.json()[0]
        print("Successfully changed %s from age %d to %d" % (
            actor['name'], old_age, actor['age']
        ))
    else:
        print("Failed to post a new actor with error: ", r.status_code)


def delete_actor():
    r = requests.get(f'{HEROKU_DOMAIN}/actors')
    actors = r.json()
    actor_id = actors[0]['id']
    r = requests.post(f'{HEROKU_DOMAIN}/actors/%d' % actor_id,
                      headers=casting_director_token_auth)
    if r.status_code == 200:
        print("Successfully deleted ", actors[0]['name'])
    else:
        print("Failed to delete actor with error: ", r.status_code)


def get_movies():
    r = requests.get(f'{HEROKU_DOMAIN}/movies')
    movies = r.json()
    print("All movies:", movies['movies'])


def post_movie():
    new_movie = {
        "title": "The Master",
        "release_date": "2012-09-21"
    }
    r = requests.post(f'{HEROKU_DOMAIN}/movies',
                      headers=ex_producer_token_auth,
                      json=new_movie)
    if r.status_code == 200:
        print("Successfully added ", new_movie['title'])
    else:
        print("Failed to post a new movie with error: ", r.status_code)


def post_movie_2():
    new_movie = {
        "title": "Ocean's Eleven",
        "release_date": "2001-12-07"
    }
    r = requests.post(f'{HEROKU_DOMAIN}/movies',
                      headers=ex_producer_token_auth,
                      json=new_movie)
    if r.status_code == 200:
        print("Successfully added ", new_movie['title'])
    else:
        print("Failed to post a new movie with error: ", r.status_code)


def patch_movie():
    r = requests.get(f'{HEROKU_DOMAIN}/movies')
    movies = r.json()
    existing_movie = movies[0]
    old_release_date = existing_movie['release_date']
    existing_movie['release_date'] = "2020-01-01"
    r = requests.patch(f'{HEROKU_DOMAIN}/movies/%d' % existing_movie['id'],
                       headers=casting_director_token_auth,
                       json=existing_movie)
    if r.status_code == 200:
        movie = r.json()[0]
        print("Successfully changed %s from age %d to %d" % (
            movie['title'], old_release_date, movie['release_date']
        ))
    else:
        print("Failed to post a new actor with error: ", r.status_code)


def delete_movie():
    r = requests.get(f'{HEROKU_DOMAIN}/movies')
    movies = r.json()
    movid_id = movies[0]['id']
    r = requests.post(f'{HEROKU_DOMAIN}/movies/%d' % movid_id,
                      headers=ex_producer_token_auth)
    if r.status_code == 200:
        print("Successfully deleted ", movies[0]['title'])
    else:
        print("Failed to delete movie with error: ", r.status_code)


if __name__ == '__main__':
    args = parser.parse_args()
    if args.get_actors:
        get_actors()
    if args.post_actor:
        post_actor()
    if args.post_actor_2:
        post_actor_2()
    if args.patch_actor:
        patch_actor()
    if args.delete_actor:
        delete_actor()

    if args.get_movies:
        get_movies()
    if args.post_movie:
        post_movie()
    if args.post_movie_2:
        post_movie_2()
    if args.patch_movie:
        patch_movie()
    if args.delete_movie:
        delete_movie()
