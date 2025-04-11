from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import ValidationError
from werkzeug.exceptions import NotFound, BadRequest, Forbidden
import os
from werkzeug.utils import secure_filename
import uuid
from datetime import datetime
import shutil

from .. import db
from ..models import (
    User, Match, MatchSchema, MatchStatus, Team, TeamSchema, 
    League, LeagueSchema, Highlight, HighlightSchema
)
from ..services.video_processor import process_match_video

admin_bp = Blueprint('admin', __name__)

user_schema = UserSchema()
match_schema = MatchSchema()
team_schema = TeamSchema()
teams_schema = TeamSchema(many=True)
league_schema = LeagueSchema()
leagues_schema = LeagueSchema(many=True)
highlight_schema = HighlightSchema()

def admin_required(fn):
    """Decorator to check if the current user is an admin."""
    @jwt_required()
    def wrapper(*args, **kwargs):
        current_user_id = get_jwt_identity()
        user = User.query.get_or_404(current_user_id)
        
        if not user.is_admin:
            raise Forbidden("Admin access required")
        
        return fn(*args, **kwargs)
    
    # Preserve the original function's metadata
    wrapper.__name__ = fn.__name__
    return wrapper

@admin_bp.route('/users', methods=['GET'])
@admin_required
def get_users():
    """Get all users (admin only)."""
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 20, type=int), 50)  # Max 50 per page
    
    # Query with pagination
    paginated_users = User.query.paginate(page=page, per_page=per_page, error_out=False)
    
    result = {
        "users": [user.to_dict() for user in paginated_users.items],
        "pagination": {
            "total": paginated_users.total,
            "pages": paginated_users.pages,
            "page": page,
            "per_page": per_page,
            "has_next": paginated_users.has_next,
            "has_prev": paginated_users.has_prev
        }
    }
    
    return jsonify(result), 200

@admin_bp.route('/users/<user_id>', methods=['PUT'])
@admin_required
def update_user(user_id):
    """Update a user (admin only)."""
    user = User.query.get_or_404(user_id)
    
    try:
        data = request.get_json()
        if not data:
            raise BadRequest("No input data provided")
        
        # Update allowed fields
        if 'first_name' in data:
            user.first_name = data['first_name']
        
        if 'last_name' in data:
            user.last_name = data['last_name']
        
        if 'is_active' in data:
            user.is_active = bool(data['is_active'])
        
        if 'is_admin' in data:
            user.is_admin = bool(data['is_admin'])
        
        db.session.commit()
        
        return jsonify({
            "message": "User updated successfully",
            "user": user.to_dict()
        }), 200
        
    except BadRequest as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@admin_bp.route('/matches', methods=['POST'])
@admin_required
def create_match():
    """Create a new match (admin only)."""
    try:
        data = request.get_json()
        if not data:
            raise BadRequest("No input data provided")
        
        # Validate required fields
        required_fields = ['home_team_id', 'away_team_id', 'kickoff_time']
        for field in required_fields:
            if field not in data:
                raise ValidationError({field: [f"{field} is required"]})
        
        # Parse kickoff time
        try:
            kickoff_time = datetime.fromisoformat(data['kickoff_time'])
        except ValueError:
            raise ValidationError({"kickoff_time": ["Invalid datetime format"]})
        
        # Create the match
        match = Match(
            home_team_id=data['home_team_id'],
            away_team_id=data['away_team_id'],
            kickoff_time=kickoff_time,
            league_id=data.get('league_id'),
            stadium=data.get('stadium'),
            referee=data.get('referee'),
            status=MatchStatus.SCHEDULED
        )
        
        db.session.add(match)
        db.session.commit()
        
        return jsonify({
            "message": "Match created successfully",
            "match": match_schema.dump(match)
        }), 201
        
    except ValidationError as e:
        return jsonify({"error": "Validation error", "details": e.messages}), 422
    except BadRequest as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@admin_bp.route('/matches/<match_id>', methods=['PUT'])
@admin_required
def update_match(match_id):
    """Update a match (admin only)."""
    match = Match.query.get_or_404(match_id)
    
    try:
        data = request.get_json()
        if not data:
            raise BadRequest("No input data provided")
        
        # Update match fields
        if 'home_team_id' in data:
            match.home_team_id = data['home_team_id']
        
        if 'away_team_id' in data:
            match.away_team_id = data['away_team_id']
        
        if 'league_id' in data:
            match.league_id = data['league_id']
        
        if 'kickoff_time' in data:
            try:
                match.kickoff_time = datetime.fromisoformat(data['kickoff_time'])
            except ValueError:
                raise ValidationError({"kickoff_time": ["Invalid datetime format"]})
        
        if 'status' in data:
            try:
                match.status = MatchStatus(data['status'])
            except ValueError:
                raise ValidationError({"status": ["Invalid status"]})
        
        if 'home_score' in data:
            match.home_score = int(data['home_score'])
        
        if 'away_score' in data:
            match.away_score = int(data['away_score'])
        
        if 'stadium' in data:
            match.stadium = data['stadium']
        
        if 'referee' in data:
            match.referee = data['referee']
        
        if 'attendance' in data:
            match.attendance = int(data['attendance'])
        
        if 'stats' in data and isinstance(data['stats'], dict):
            match.stats = data['stats']
        
        db.session.commit()
        
        return jsonify({
            "message": "Match updated successfully",
            "match": match_schema.dump(match)
        }), 200
        
    except ValidationError as e:
        return jsonify({"error": "Validation error", "details": e.messages}), 422
    except BadRequest as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@admin_bp.route('/matches/<match_id>/video', methods=['POST'])
@admin_required
def upload_match_video(match_id):
    """Upload a video file for a match (admin only)."""
    match = Match.query.get_or_404(match_id)
    
    # Check if request has the file part
    if 'video' not in request.files:
        return jsonify({"error": "No video part in the request"}), 400
    
    file = request.files['video']
    
    # If user does not select file, browser might submit an empty part without filename
    if file.filename == '':
        return jsonify({"error": "No video selected"}), 400
    
    # Check file type
    allowed_extensions = {'mp4', 'avi', 'mov', 'mkv'}
    if not '.' in file.filename or file.filename.rsplit('.', 1)[1].lower() not in allowed_extensions:
        return jsonify({"error": "File type not allowed"}), 400
    
    # Generate unique filename
    filename = secure_filename(file.filename)
    unique_filename = f"{str(uuid.uuid4())}_{filename}"
    
    # Create match videos directory if it doesn't exist
    upload_folder = os.path.join(current_app.config['UPLOAD_FOLDER'], 'match_videos')
    os.makedirs(upload_folder, exist_ok=True)
    
    # Save the file
    file_path = os.path.join(upload_folder, unique_filename)
    file.save(file_path)
    
    # Update match
    match.video_path = f"/uploads/match_videos/{unique_filename}"
    match.is_processed = False
    match.processing_status = "pending"
    db.session.commit()
    
    # Start async processing task (in a real app, this would be a background job)
    try:
        # This is a placeholder for a real background task
        process_match_video.delay(match.id, file_path)
    except Exception as e:
        # If task scheduling fails, still return success for video upload
        # but log the error and update processing status
        match.processing_status = "error"
        db.session.commit()
        print(f"Error scheduling processing task: {str(e)}")
    
    return jsonify({
        "message": "Video uploaded successfully and processing started",
        "video_path": match.video_path,
        "processing_status": match.processing_status
    }), 200

@admin_bp.route('/teams', methods=['POST'])
@admin_required
def create_team():
    """Create a new team (admin only)."""
    try:
        data = request.get_json()
        if not data:
            raise BadRequest("No input data provided")
        
        # Validate required fields
        if not data.get('name'):
            raise ValidationError({"name": ["Team name is required"]})
        
        # Create the team
        team = Team(
            name=data['name'],
            short_name=data.get('short_name'),
            country=data.get('country'),
            league_id=data.get('league_id'),
            founded_year=data.get('founded_year'),
            stadium=data.get('stadium'),
            colors=data.get('colors'),
            website=data.get('website')
        )
        
        db.session.add(team)
        db.session.commit()
        
        return jsonify({
            "message": "Team created successfully",
            "team": team_schema.dump(team)
        }), 201
        
    except ValidationError as e:
        return jsonify({"error": "Validation error", "details": e.messages}), 422
    except BadRequest as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@admin_bp.route('/leagues', methods=['POST'])
@admin_required
def create_league():
    """Create a new league (admin only)."""
    try:
        data = request.get_json()
        if not data:
            raise BadRequest("No input data provided")
        
        # Validate required fields
        if not data.get('name'):
            raise ValidationError({"name": ["League name is required"]})
        
        # Parse dates if provided
        season_start = None
        season_end = None
        
        if data.get('season_start'):
            try:
                season_start = datetime.fromisoformat(data['season_start']).date()
            except ValueError:
                raise ValidationError({"season_start": ["Invalid date format"]})
        
        if data.get('season_end'):
            try:
                season_end = datetime.fromisoformat(data['season_end']).date()
            except ValueError:
                raise ValidationError({"season_end": ["Invalid date format"]})
        
        # Create the league
        league = League(
            name=data['name'],
            short_name=data.get('short_name'),
            country=data.get('country'),
            season_start=season_start,
            season_end=season_end
        )
        
        db.session.add(league)
        db.session.commit()
        
        return jsonify({
            "message": "League created successfully",
            "league": league_schema.dump(league)
        }), 201
        
    except ValidationError as e:
        return jsonify({"error": "Validation error", "details": e.messages}), 422
    except BadRequest as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@admin_bp.route('/dashboard', methods=['GET'])
@admin_required
def get_dashboard():
    """Get admin dashboard stats."""
    # Get counts
    user_count = User.query.count()
    match_count = Match.query.count()
    team_count = Team.query.count()
    league_count = League.query.count()
    highlight_count = Highlight.query.count()
    
    # Get processing stats
    pending_matches = Match.query.filter_by(processing_status="pending").count()
    processing_matches = Match.query.filter_by(processing_status="processing").count()
    error_matches = Match.query.filter_by(processing_status="error").count()
    completed_matches = Match.query.filter_by(is_processed=True).count()
    
    # Get recent uploads
    recent_matches = Match.query.order_by(Match.created_at.desc()).limit(5).all()
    
    return jsonify({
        "counts": {
            "users": user_count,
            "matches": match_count,
            "teams": team_count,
            "leagues": league_count,
            "highlights": highlight_count
        },
        "processing": {
            "pending": pending_matches,
            "processing": processing_matches,
            "error": error_matches,
            "completed": completed_matches
        },
        "recent_matches": match_schema.dump(recent_matches, many=True)
    }), 200 