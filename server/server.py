
from app import create_app
from cfg import ApplicationConfig

if __name__ == "__main__":
    app = create_app(ApplicationConfig)
    app.run(debug=True)