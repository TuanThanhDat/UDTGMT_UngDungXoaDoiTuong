from uuid import uuid4
from app.extension import db
from datetime import datetime

def get_uuid():
    return uuid4().hex

class Photo(db.Model):
    __tablename__ = "photos"
    id = db.Column(db.Integer, primary_key=True, unique=True, default=get_uuid)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    time = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    image = db.Column(db.String)