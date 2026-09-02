from flask import Flask
from config.settings import SECRET_KEY
from app.routes.auth import auth_bp
from app.routes.vehicle import vehicle_bp
from app.routes.visitor import visitor_bp
from app.routes.main import main_bp

def create_app():
    app = Flask(__name__, template_folder='../templates')
    app.secret_key = SECRET_KEY
    
    # Register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(vehicle_bp)
    app.register_blueprint(visitor_bp)
    app.register_blueprint(main_bp)
    
    return app