from sqlalchemy import Column, String, Integer, Date, ForeignKey, create_engine
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
import json
import os

database_path = os.environ.get('DATABASE_URL')
if not database_path:
    database_path = "postgres://localhost:5432/casting_agency"

db = SQLAlchemy()


def setup_db(app, database_path=database_path):
    """setup_db(app)

    Binds a flask application and a SQLAlchemy service
    """
    app.config["SQLALCHEMY_DATABASE_URI"] = database_path
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    db.app = app
    db.init_app(app)
    db.create_all()
    migrate = Migrate(app, db)


"""
Association table between movies and actors
"""
movie_actor_association = db.Table(
    'order_items',
    Column('actor_id', Integer, ForeignKey('actors.id'), primary_key=True),
    Column('movie_id', Integer, ForeignKey('movies.id'), primary_key=True)
)


class Actor(db.Model):
    """Actor

    Represents an actor with attributes name, age, and gender.
    """
    __tablename__ = 'actors'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    age = db.Column(db.Integer, nullable=False)
    gender = db.Column(db.String, nullable=False)
    # Many to many relationship with movies
    movies = db.relationship('Movie', secondary=movie_actor_association,
                             backref=db.backref('actors', lazy=True))

    def __init__(self, name, age, gender):
        self.name = name
        self.age = age
        self.gender = gender

    def format(self):
        formatted_movies = [movie.id for movie in self.movies]
        return {
            'id': self.id,
            'name': self.name,
            'age': self.age,
            'gender': self.gender,
            'movies': formatted_movies
        }

    def insert(self):
        """Inserts a new model into the database

        The model must have a unique id or null id
        EXAMPLE:
            actor = Actor(name=req_name, age=req_age, gender=req_gender)
            actor.insert()
        """
        db.session.add(self)
        db.session.commit()

    def delete(self):
        """Deletes an existing model from the database

        The model must exist in the database
        EXAMPLE
            actor = Actor(name=req_name, age=req_age, gender=req_gender)
            actor.delete()
        """
        db.session.delete(self)
        db.session.commit()

    def update(self):
        """Updates an existing model in the database

        the model must exist in the database
        EXAMPLE
            actor = Actor.query.filter(Actor.id == id).one_or_none()
            actor.age = 28
            actor.update()
        """
        db.session.commit()

    def __repr__(self):
        return f'<Actor {self.id} {self.name}>'


class Movie(db.Model):
    """Movie

    Represents a movie with attributes title and release date.
    """
    __tablename__ = 'movies'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    # A datetime.date() object
    release_date = db.Column(db.Date, nullable=False)
    # Has many to many relationship with actors, with backref `actors`

    def __init__(self, title, release_date):
        self.title = title
        self.release_date = release_date

    def insert(self):
        """Inserts a new model into the database

        The model must have a unique id or null id
        EXAMPLE
            req_release_date = datetime.datetime.strptime("2022-01-15",
                "%Y-%m-%d").date()
            movie = Movie(title=req_title, release_date=req_release_date)
            movie.insert()
        """
        db.session.add(self)
        db.session.commit()

    def delete(self):
        """Deletes an existing model from the database

        The model must exist in the database
        EXAMPLE
            req_release_date = datetime.datetime.strptime("2022-01-15",
                "%Y-%m-%d").date()
            movie = Movie(title=req_title, release_date=req_release_date)
            movie.delete()
        """
        db.session.delete(self)
        db.session.commit()

    def update(self):
        """Updates an existing model in the database

        The model must exist in the database
        EXAMPLE
            movie = Movie.query.filter(Movie.id == id).one_or_none()
            new_release_date = datetime.datetime.strptime("2022-01-15",
                "%Y-%m-%d").date()
            movie.release_date = new_release_date
            movie.update()
        """
        db.session.commit()

    def format(self):
        formatted_actors = [actor.id for actor in self.actors]
        return {
            'id': self.id,
            'title': self.title,
            'release_date': "{:%Y-%m-%d}".format(self.release_date),
            'actors': formatted_actors
        }

    def __repr__(self):
        return f'<Movie {self.id} {self.title}>'
