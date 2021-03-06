from sqlalchemy import Column, String, Integer, Date, ForeignKey, create_engine
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
import json, os

database_path = os.environ.get('DATABASE_URL')
if not database_path:
    database_path = "postgres://localhost:5432/casting_agency"

db = SQLAlchemy()

'''
setup_db(app)
    binds a flask application and a SQLAlchemy service
'''
def setup_db(app, database_path=database_path):
    app.config["SQLALCHEMY_DATABASE_URI"] = database_path
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    db.app = app
    db.init_app(app)
    db.create_all()
    migrate = Migrate(app, db)

'''
Association table between movies and actors
'''
movie_actor_association = db.Table('order_items',
    Column('actor_id', Integer, ForeignKey('actors.id'), primary_key=True),
    Column('movie_id', Integer, ForeignKey('movies.id'), primary_key=True)
)
'''
Actor
Represents an actor with attributes name, age, and gender.
'''
class Actor(db.Model):
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
        formatted_movies = []
        for movie in self.movies:
            formatted_movies.append({
                "id": movie.id,
                "title": movie.title
            })
        return {
            'id': self.id,
            'name': self.name,
            'age': self.age,
            'gender': self.gender,
            'movies': formatted_movies
        }

    '''
    insert()
        inserts a new model into the database
        the model must have a unique id or null id
        EXAMPLE
            actor = Actor(name=req_name, age=req_age, gender=req_gender)
            actor.insert()
    '''
    def insert(self):
        db.session.add(self)
        db.session.commit()

    '''
    delete()
        deletes an existing model from the database
        the model must exist in the database
        EXAMPLE
            actor = Actor(name=req_name, age=req_age, gender=req_gender)
            actor.delete()
    '''
    def delete(self):
        db.session.delete(self)
        db.session.commit()

    '''
    update()
        updates an existing model in the database
        the model must exist in the database
        EXAMPLE
            actor = Actor.query.filter(Actor.id == id).one_or_none()
            actor.age = 28
            actor.update()
    '''
    def update(self):
        db.session.commit()

    def __repr__(self):
        return f'<Actor {self.id} {self.name}>'

'''
Movie
Represents a movie with attributes title and release date.
'''
class Movie(db.Model):
    __tablename__ = 'movies'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    # A datetime.date() object
    release_date = db.Column(db.Date, nullable=False)
    # Has many to many relationship with actors, with backref `actors`

    def __init__(self, title, release_date):
        self.title = title
        self.release_date = release_date

    '''
    insert()
        inserts a new model into the database
        the model must have a unique id or null id
        EXAMPLE
            movie = Movie(title=req_title, release_date=req_release_date)
            movie.insert()
    '''
    def insert(self):
        db.session.add(self)
        db.session.commit()

    '''
    delete()
        deletes an existing model from the database
        the model must exist in the database
        EXAMPLE
            movie = Movie(title=req_title, release_date=req_release_date)
            movie.delete()
    '''
    def delete(self):
        db.session.delete(self)
        db.session.commit()

    '''
    update()
        updates an existing model in the database
        the model must exist in the database
        EXAMPLE
            movie = Movie.query.filter(Movie.id == id).one_or_none()
            new_release_date = datetime.datetime.strptime("2022-01-15", "%Y-%m-%d").date()
            movie.release_date = new_release_date
            movie.update()
    '''
    def update(self):
        db.session.commit()

    def format(self):
        formatted_actors = []
        for actor in self.actors:
            formatted_actors.append({
                "id": actor.id,
                "name": actor.name
            })
        return {
            'id': self.id,
            'title': self.title,
            'release_date': "{:%Y-%m-%d}".format(self.release_date),
            'actors': formatted_actors
        }

    def __repr__(self):
        return f'<Movie {self.id} {self.title}>'
