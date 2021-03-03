from sqlalchemy import Column, String, Integer, Date, create_engine
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
Person
Have title and release year
'''
class Person(db.Model):
  __tablename__ = 'People'

  id = Column(Integer, primary_key=True)
  name = Column(String)
  catchphrase = Column(String)

  def __init__(self, name, catchphrase=""):
    self.name = name
    self.catchphrase = catchphrase

  def format(self):
    return {
      'id': self.id,
      'name': self.name,
      'catchphrase': self.catchphrase}

'''
Actor
Represents an actor with attributes name, age, and gender.
'''
# class Actor(db.Model):
#   __tablename__ = 'actors'
#
#   id = Column(Integer, primary_key=True)
#   name = db.Column(String, nullable=False)
#   age = db.Column(Integer, nullable=False)
#   gender = db.Column(String, nullable=False)
#   # @TODO: Establish many to many relationship with movies
#   # movies = db.relationship('Movie', backref='actor', lazy=True, cascade="all, delete")
#
#   def __init__(self, name, age, gender):
#     self.name = name
#     self.age = age
#     self.gender = gender
#
#   def format(self):
#     return {
#       'id': self.id,
#       'name': self.name,
#       'age': self.age,
#       'gender': self.gender}
#
#   def __repr__(self):
#     return f'<Actor {self.id} {self.name}>'

'''
Movie
Represents a movie with attributes title and release date.
'''
# class Movie(db.Model):
#   __tablename__ = 'movies'
#
#   id = Column(Integer, primary_key=True)
#   title = Column(String, nullable=False)
#   # A datetime.date() object
#   release_date = Column(Date, nullable=False)
#   # @TODO: Establish many to many relationship with actors
#   # actor_id = db.Column(db.Integer, db.ForeignKey('actors.id'),
#   #                      nullable=False, default=1)
#
#   def __init__(self, title, release_date):
#     self.title = title
#     self.release_date = release_date
#
#   def format(self):
#     return {
#       'id': self.id,
#       'title': self.title,
#       'release_date': "{:%m/%d/%Y}".format(self.release_date)}
#
#   def __repr__(self):
#     return f'<Movie {self.id} {self.title}>'
