from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token, 
    create_refresh_token, 
    jwt_required, 
    get_jwt_identity, 
    get_jwt
)
from werkzeug.exceptions import BadRequest, Unauthorized
import bcrypt
from datetime import datetime

from ..db_json import db
from ..models.json_models import create_user, validate_user_data

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user."""
    try:
        user_data = request.get_json()
        if not user_data:
            raise BadRequest("No input data provided")
        
        # Validate user data
        errors = validate_user_data(user_data)
        if errors:
            return jsonify({"error": "Validation error", "details": errors}), 422
        
        # Check if user already exists
        existing_users = db.query('users', lambda user: user.get('email') == user_data.get('email').lower())
        if existing_users:
            return jsonify({"error": "Email already registered"}), 409
        
        # Hash password
        password = user_data.get('password')
        salt = bcrypt.gensalt()
        password_hash = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
        
        # Create user object
        user = create_user(
            email=user_data.get('email').lower(),
            password_hash=password_hash,
            first_name=user_data.get('first_name', ''),
            last_name=user_data.get('last_name', ''),
            profile_image=user_data.get('profile_image', '')
        )
        
        # Save user to database
        db.create('users', user)
        
        # Create tokens
        access_token = create_access_token(identity=user['id'])
        refresh_token = create_refresh_token(identity=user['id'])
        
        # Remove password hash from response
        user_response = {k: v for k, v in user.items() if k != 'password_hash'}
        
        return jsonify({
            "message": "User registered successfully",
            "user": user_response,
            "access_token": access_token,
            "refresh_token": refresh_token
        }), 201
        
    except BadRequest as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """Log in a user and return JWT tokens."""
    try:
        login_data = request.get_json()
        if not login_data or not login_data.get('email') or not login_data.get('password'):
            raise BadRequest("Email and password are required")
        
        # Find user by email
        users = db.query('users', lambda user: user.get('email') == login_data.get('email').lower())
        
        if not users:
            raise Unauthorized("Invalid credentials")
            
        user = users[0]
        
        # Check password
        password_matches = bcrypt.checkpw(
            login_data.get('password').encode('utf-8'), 
            user.get('password_hash', '').encode('utf-8')
        )
        
        if not password_matches:
            raise Unauthorized("Invalid credentials")
        
        if not user.get('is_active', True):
            return jsonify({"error": "Account is disabled"}), 403
        
        # Update last login time
        user['last_login'] = datetime.utcnow().isoformat()
        db.update('users', user['id'], user)
        
        # Create tokens
        access_token = create_access_token(identity=user['id'])
        refresh_token = create_refresh_token(identity=user['id'])
        
        # Remove password hash from response
        user_response = {k: v for k, v in user.items() if k != 'password_hash'}
        
        return jsonify({
            "message": "Login successful",
            "user": user_response,
            "access_token": access_token,
            "refresh_token": refresh_token
        }), 200
        
    except Unauthorized as e:
        return jsonify({"error": str(e)}), 401
    except BadRequest as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token."""
    current_user_id = get_jwt_identity()
    new_access_token = create_access_token(identity=current_user_id)
    
    return jsonify({
        "access_token": new_access_token
    }), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """Get the current user's profile."""
    current_user_id = get_jwt_identity()
    user = db.get_by_id('users', current_user_id)
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    # Remove password hash from response
    user_response = {k: v for k, v in user.items() if k != 'password_hash'}
    
    return jsonify({
        "user": user_response
    }), 200

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """Log out a user by revoking their JWT token."""
    # In a real implementation, you would add the token to a blocklist
    # or use a token database to invalidate tokens
    return jsonify({
        "message": "Successfully logged out"
    }), 200 