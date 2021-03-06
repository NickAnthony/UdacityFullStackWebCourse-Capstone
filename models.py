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
    return {
      'id': self.id,
      'name': self.name,
      'age': self.age,
      'gender': self.gender}

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

  def format(self):
    return {
      'id': self.id,
      'title': self.title,
      'release_date': "{:%m/%d/%Y}".format(self.release_date)}

  def __repr__(self):
    return f'<Movie {self.id} {self.title}>'
