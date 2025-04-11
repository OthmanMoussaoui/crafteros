import os
from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_caching import Cache
from flask_socketio import SocketIO
from flask_marshmallow import Marshmallow

from ..config import config

# Initialize extensions
jwt = JWTManager()
cors = CORS()
cache = Cache()
socketio = SocketIO()
ma = Marshmallow()

def create_app(config_name=None):
    """
    Application factory function to create and configure a Flask app.
    """
    if config_name is None:
        config_name = os.environ.get('FLASK_ENV', 'default')
    
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # Create uploads and assets folders if they don't exist
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    
    assets_dir = os.path.join(os.path.dirname(__file__), 'assets')
    images_dir = os.path.join(assets_dir, 'images')
    os.makedirs(images_dir, exist_ok=True)
    
    # Initialize extensions with app
    jwt.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}})  # Allow all origins for development
    cache.init_app(app)
    socketio.init_app(app, async_mode=app.config['SOCKETIO_ASYNC_MODE'])
    ma.init_app(app)
    
    # Register blueprints
    from .routes.auth import auth_bp
    from .routes.matches import matches_bp
    from .routes.highlights import highlights_bp
    from .routes.users import users_bp
    from .routes.admin import admin_bp
    from .routes.stats import stats_bp
    from .routes.assets import assets_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(matches_bp, url_prefix='/api/matches')
    app.register_blueprint(highlights_bp, url_prefix='/api/highlights')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(stats_bp, url_prefix='/api/stats')
    app.register_blueprint(assets_bp, url_prefix='/api/assets')
    
    # Register error handlers
    from .utils.error_handlers import register_error_handlers
    register_error_handlers(app)
    
    # Register before request handler to initialize JSON DB connection
    @app.before_request
    def before_request():
        # Our JSON DB is a singleton, so we don't need to do anything here
        pass
    
    return app 