# import sys
# # sys.path.insert(1, '..')
from uuid import uuid4
from app.extension import db
from .photo import Photo
import numpy as np

def get_uuid():
    return uuid4().hex

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.String(60), primary_key=True, unique=True, default=get_uuid)
    name = db.Column(db.String(60), unique=True)
    email = db.Column(db.String(60), unique=True, nullable=True)
    password = db.Column(db.String(60), nullable=False)
    salt = db.Column(db.String(60), nullable=False)
    image = db.Column(db.LargeBinary, nullable=True)
    embed = db.Column(db.String(2800), nullable=True)
    auth_token = db.Column(db.String(60), nullable=True)
    
    photos = db.relationship('Photo', backref='user', lazy=True) # Khai báo quan hệ 1-n