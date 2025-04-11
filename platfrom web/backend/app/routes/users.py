from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import ValidationError
from werkzeug.exceptions import NotFound, BadRequest, Forbidden
import os
from werkzeug.utils import secure_filename
import uuid

from .. import db
from ..models import User, UserSchema, Team, TeamSchema

users_bp = Blueprint('users', __name__)

user_schema = UserSchema()
team_schema = TeamSchema()
teams_schema = TeamSchema(many=True)

@users_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get the current user's profile."""
    current_user_id = get_jwt_identity()
    user = User.query.get_or_404(current_user_id)
    
    return jsonify(user_schema.dump(user)), 200

@users_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update the current user's profile."""
    current_user_id = get_jwt_identity()
    user = User.query.get_or_404(current_user_id)
    
    try:
        data = request.get_json()
        if not data:
            raise BadRequest("No input data provided")
        
        # Update allowed fields
        if 'first_name' in data:
            user.first_name = data['first_name']
        
        if 'last_name' in data:
            user.last_name = data['last_name']
        
        if 'preferences' in data and isinstance(data['preferences'], dict):
            # Update preferences but don't completely replace
            current_prefs = user.preferences or {}
            current_prefs.update(data['preferences'])
            user.preferences = current_prefs
        
        db.session.commit()
        
        return jsonify({
            "message": "Profile updated successfully",
            "user": user_schema.dump(user)
        }), 200
        
    except BadRequest as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@users_bp.route('/profile/password', methods=['PUT'])
@jwt_required()
def update_password():
    """Update the current user's password."""
    current_user_id = get_jwt_identity()
    user = User.query.get_or_404(current_user_id)
    
    try:
        data = request.get_json()
        if not data:
            raise BadRequest("No input data provided")
        
        # Validate required fields
        if not data.get('current_password'):
            raise ValidationError({"current_password": ["Current password is required"]})
        
        if not data.get('new_password'):
            raise ValidationError({"new_password": ["New password is required"]})
        
        # Verify current password
        if not user.check_password(data['current_password']):
            return jsonify({"error": "Current password is incorrect"}), 401
        
        # Update password
        user.set_password(data['new_password'])
        db.session.commit()
        
        return jsonify({
            "message": "Password updated successfully"
        }), 200
        
    except ValidationError as e:
        return jsonify({"error": "Validation error", "details": e.messages}), 422
    except BadRequest as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@users_bp.route('/profile/image', methods=['POST'])
@jwt_required()
def upload_profile_image():
    """Upload a profile image for the current user."""
    current_user_id = get_jwt_identity()
    user = User.query.get_or_404(current_user_id)
    
    # Check if request has the file part
    if 'image' not in request.files:
        return jsonify({"error": "No image part in the request"}), 400
    
    file = request.files['image']
    
    # If user does not select file, browser might submit an empty part without filename
    if file.filename == '':
        return jsonify({"error": "No image selected"}), 400
    
    # Check file type
    allowed_extensions = {'png', 'jpg', 'jpeg', 'gif'}
    if not '.' in file.filename or file.filename.rsplit('.', 1)[1].lower() not in allowed_extensions:
        return jsonify({"error": "File type not allowed"}), 400
    
    # Generate unique filename
    filename = secure_filename(file.filename)
    unique_filename = f"{str(uuid.uuid4())}_{filename}"
    
    # Create user uploads directory if it doesn't exist
    upload_folder = os.path.join(current_app.config['UPLOAD_FOLDER'], 'profile_images')
    os.makedirs(upload_folder, exist_ok=True)
    
    # Save the file
    file_path = os.path.join(upload_folder, unique_filename)
    file.save(file_path)
    
    # Update user profile
    user.profile_image = f"/uploads/profile_images/{unique_filename}"
    db.session.commit()
    
    return jsonify({
        "message": "Profile image uploaded successfully",
        "profile_image": user.profile_image
    }), 200

@users_bp.route('/favorite-teams', methods=['GET'])
@jwt_required()
def get_favorite_teams():
    """Get the current user's favorite teams."""
    current_user_id = get_jwt_identity()
    user = User.query.get_or_404(current_user_id)
    
    return jsonify({
        "count": len(user.favorite_teams),
        "teams": teams_schema.dump(user.favorite_teams)
    }), 200

@users_bp.route('/favorite-teams/<team_id>', methods=['POST'])
@jwt_required()
def add_favorite_team(team_id):
    """Add a team to the current user's favorites."""
    current_user_id = get_jwt_identity()
    user = User.query.get_or_404(current_user_id)
    team = Team.query.get_or_404(team_id)
    
    # Check if already a favorite
    if team in user.favorite_teams:
        return jsonify({
            "message": "Team is already a favorite",
            "is_favorite": True
        }), 200
    
    # Add to favorites
    user.favorite_teams.append(team)
    db.session.commit()
    
    return jsonify({
        "message": "Team added to favorites",
        "is_favorite": True,
        "team": team_schema.dump(team)
    }), 200

@users_bp.route('/favorite-teams/<team_id>', methods=['DELETE'])
@jwt_required()
def remove_favorite_team(team_id):
    """Remove a team from the current user's favorites."""
    current_user_id = get_jwt_identity()
    user = User.query.get_or_404(current_user_id)
    team = Team.query.get_or_404(team_id)
    
    # Check if in favorites
    if team not in user.favorite_teams:
        return jsonify({
            "message": "Team is not in favorites",
            "is_favorite": False
        }), 200
    
    # Remove from favorites
    user.favorite_teams.remove(team)
    db.session.commit()
    
    return jsonify({
        "message": "Team removed from favorites",
        "is_favorite": False
    }), 200

@users_bp.route('/<user_id>', methods=['GET'])
def get_user(user_id):
    """Get a public user profile."""
    user = User.query.get_or_404(user_id)
    
    # Return limited public information
    return jsonify({
        "id": user.id,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "profile_image": user.profile_image
    }), 200