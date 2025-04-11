from flask import jsonify
from werkzeug.exceptions import (
    BadRequest, 
    Unauthorized, 
    Forbidden, 
    NotFound, 
    MethodNotAllowed, 
    RequestEntityTooLarge,
    InternalServerError
)
from sqlalchemy.exc import SQLAlchemyError

def register_error_handlers(app):
    """Register error handlers with the Flask application."""
    
    @app.errorhandler(BadRequest)
    def handle_bad_request(e):
        return jsonify(error="Bad Request", message=str(e)), 400
    
    @app.errorhandler(Unauthorized)
    def handle_unauthorized(e):
        return jsonify(error="Unauthorized", message="Authentication required"), 401
    
    @app.errorhandler(Forbidden)
    def handle_forbidden(e):
        return jsonify(error="Forbidden", message="You don't have permission to access this resource"), 403
    
    @app.errorhandler(NotFound)
    def handle_not_found(e):
        return jsonify(error="Not Found", message="The requested resource was not found"), 404
    
    @app.errorhandler(MethodNotAllowed)
    def handle_method_not_allowed(e):
        return jsonify(error="Method Not Allowed", message=f"The method {e.valid_methods[0] if e.valid_methods else 'used'} is not allowed for this endpoint"), 405
    
    @app.errorhandler(RequestEntityTooLarge)
    def handle_file_too_large(e):
        return jsonify(error="File Too Large", message="The uploaded file exceeds the maximum allowed size"), 413
    
    @app.errorhandler(SQLAlchemyError)
    def handle_db_error(e):
        return jsonify(error="Database Error", message="A database error occurred"), 500
    
    @app.errorhandler(InternalServerError)
    def handle_internal_server_error(e):
        return jsonify(error="Server Error", message="An internal server error occurred"), 500
    
    @app.errorhandler(Exception)
    def handle_generic_exception(e):
        # Log the exception here
        return jsonify(
            error="Unexpected Error", 
            message="An unexpected error occurred"
        ), 500 