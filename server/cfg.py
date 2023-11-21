from dotenv import load_dotenv
import os

load_dotenv()

class ApplicationConfig:
    SECRET_KEY = os.environ['SECRET_KEY']
    SQLALCHEMY_TRACK_MODIFICATIONS = False  # Not logging messeges
    SQLALCHEMY_ECHO = True                  # print echo query to database
    SQLALCHEMY_DATABASE_URI = r'sqlite:///./db.sqlite'