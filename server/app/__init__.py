from flask import Flask
from flask_cors import CORS
from cfg import ApplicationConfig
from app.extension import db
from app.models import user

def create_app(config=ApplicationConfig):
    print("app_init_")
    app = Flask(__name__)
    app.config.from_object(config)
    CORS(app, 
         supports_credentials=True)

    db.init_app(app)
    with app.app_context():
        db.create_all() 

    from app.api.v1.routes import api_v1
    app.register_blueprint(api_v1, url_prefix='/api/v1')
    
    return app 