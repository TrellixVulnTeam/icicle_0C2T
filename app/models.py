from datetime import datetime
from app import db, login_manager
from flask_login import UserMixin


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    image_file = db.Column(db.String(20), nullable=False, default='default.jpg')
    password = db.Column(db.String(60), nullable=False)

    def __repr__(self):
        return f"User('{self.username}', '{self.email}', '{self.image_file}')"

class Roads(db.Model):
    __tablename__ = 'roads'

    id = db.Column(db.Integer, primary_key=True)
    json_field = db.Column(db.String)


    def __init__(self, arg):
        self.json_field = arg


    def __repr__(self):
        return '<id {}>'.format(self.id)


