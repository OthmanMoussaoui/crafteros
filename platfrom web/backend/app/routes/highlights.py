from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import ValidationError
from sqlalchemy import desc, func
from werkzeug.exceptions import NotFound, BadRequest, Forbidden

from .. import db, cache
from ..models import (
    Highlight, HighlightSchema, Reel, ReelSchema, 
    Match, User, user_saved_clips
)

highlights_bp = Blueprint('highlights', __name__)

highlight_schema = HighlightSchema()
highlights_schema = HighlightSchema(many=True)
reel_schema = ReelSchema()
reels_schema = ReelSchema(many=True)

@highlights_bp.route('', methods=['GET'])
@cache.cached(timeout=60, query_string=True)
def get_highlights():
    """Get all highlights with filtering options."""
    # Parse query parameters
    match_id = request.args.get('match_id')
    team_id = request.args.get('team_id')
    type = request.args.get('type')  # goal, save, etc.
    player = request.args.get('player')
    sort_by = request.args.get('sort_by', 'newest')  # newest, most_viewed, importance
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 20, type=int), 50)  # Max 50 per page
    
    # Start with base query
    query = Highlight.query
    
    # Apply filters if provided
    if match_id:
        query = query.filter(Highlight.match_id == match_id)
    
    if team_id:
        query = query.filter(Highlight.team_id == team_id)
    
    if type:
        query = query.filter(Highlight.type == type)
    
    if player:
        query = query.filter(Highlight.player_name.ilike(f'%{player}%'))
    
    # Apply sorting
    if sort_by == 'most_viewed':
        query = query.order_by(desc(Highlight.views_count))
    elif sort_by == 'importance':
        query = query.order_by(desc(Highlight.importance_score))
    else:  # default to newest
        query = query.order_by(desc(Highlight.created_at))
    
    # Paginate results
    paginated_highlights = query.paginate(page=page, per_page=per_page, error_out=False)
    
    result = {
        "highlights": highlights_schema.dump(paginated_highlights.items),
        "pagination": {
            "total": paginated_highlights.total,
            "pages": paginated_highlights.pages,
            "page": page,
            "per_page": per_page,
            "has_next": paginated_highlights.has_next,
            "has_prev": paginated_highlights.has_prev
        }
    }
    
    return jsonify(result), 200

@highlights_bp.route('/<highlight_id>', methods=['GET'])
def get_highlight(highlight_id):
    """Get a single highlight by ID."""
    highlight = Highlight.query.get_or_404(highlight_id)
    
    # Increment view counter
    highlight.views_count += 1
    db.session.commit()
    
    return jsonify(highlight_schema.dump(highlight)), 200

@highlights_bp.route('/<highlight_id>/like', methods=['POST'])
@jwt_required()
def like_highlight(highlight_id):
    """Like a highlight."""
    highlight = Highlight.query.get_or_404(highlight_id)
    
    # Increment like counter
    highlight.likes_count += 1
    db.session.commit()
    
    return jsonify({
        "message": "Highlight liked successfully",
        "likes_count": highlight.likes_count
    }), 200

@highlights_bp.route('/<highlight_id>/save', methods=['POST'])
@jwt_required()
def save_highlight(highlight_id):
    """Save a highlight to the current user's saved clips."""
    current_user_id = get_jwt_identity()
    user = User.query.get_or_404(current_user_id)
    highlight = Highlight.query.get_or_404(highlight_id)
    
    # Check if already saved
    saved = db.session.query(user_saved_clips).filter_by(
        user_id=current_user_id, 
        highlight_id=highlight_id
    ).first()
    
    if saved:
        return jsonify({
            "message": "Highlight already saved",
            "saved": True
        }), 200
    
    # Add to saved clips
    stmt = user_saved_clips.insert().values(
        user_id=current_user_id,
        highlight_id=highlight_id
    )
    db.session.execute(stmt)
    db.session.commit()
    
    return jsonify({
        "message": "Highlight saved successfully",
        "saved": True
    }), 200

@highlights_bp.route('/<highlight_id>/unsave', methods=['POST'])
@jwt_required()
def unsave_highlight(highlight_id):
    """Remove a highlight from the current user's saved clips."""
    current_user_id = get_jwt_identity()
    
    # Remove from saved clips
    stmt = user_saved_clips.delete().where(
        (user_saved_clips.c.user_id == current_user_id) & 
        (user_saved_clips.c.highlight_id == highlight_id)
    )
    db.session.execute(stmt)
    db.session.commit()
    
    return jsonify({
        "message": "Highlight removed from saved clips",
        "saved": False
    }), 200

@highlights_bp.route('/match/<match_id>', methods=['GET'])
def get_match_highlights(match_id):
    """Get all highlights for a specific match."""
    # Verify match exists
    Match.query.get_or_404(match_id)
    
    # Get highlights sorted by time
    highlights = Highlight.query.filter_by(match_id=match_id).order_by(
        Highlight.start_time
    ).all()
    
    return jsonify({
        "match_id": match_id,
        "count": len(highlights),
        "highlights": highlights_schema.dump(highlights)
    }), 200

@highlights_bp.route('/reels', methods=['GET'])
def get_reels():
    """Get all public reels."""
    # Query only public reels
    reels = Reel.query.filter_by(is_public=True).order_by(desc(Reel.created_at)).all()
    
    return jsonify({
        "count": len(reels),
        "reels": reels_schema.dump(reels)
    }), 200

@highlights_bp.route('/reels/<reel_id>', methods=['GET'])
def get_reel(reel_id):
    """Get a single reel by ID."""
    reel = Reel.query.get_or_404(reel_id)
    
    # Check if reel is private and user is not the owner
    if not reel.is_public:
        # If JWT provided, check if user is owner
        try:
            current_user_id = get_jwt_identity()
            if current_user_id != reel.user_id:
                raise Forbidden("You don't have permission to view this reel")
        except:
            raise Forbidden("You don't have permission to view this reel")
    
    return jsonify(reel_schema.dump(reel)), 200

@highlights_bp.route('/reels', methods=['POST'])
@jwt_required()
def create_reel():
    """Create a new highlight reel."""
    current_user_id = get_jwt_identity()
    
    try:
        data = request.get_json()
        if not data:
            raise BadRequest("No input data provided")
        
        # Validate required fields
        if not data.get('title'):
            raise ValidationError({"title": ["Title is required"]})
        
        if not data.get('highlight_ids') or not isinstance(data.get('highlight_ids'), list):
            raise ValidationError({"highlight_ids": ["At least one highlight is required"]})
        
        # Create the reel
        reel = Reel(
            user_id=current_user_id,
            title=data.get('title'),
            description=data.get('description', ''),
            is_public=data.get('is_public', True)
        )
        
        # Add highlights
        highlight_ids = data.get('highlight_ids')
        highlights = Highlight.query.filter(Highlight.id.in_(highlight_ids)).all()
        
        if not highlights:
            raise BadRequest("No valid highlights provided")
        
        reel.highlights = highlights
        
        db.session.add(reel)
        db.session.commit()
        
        return jsonify({
            "message": "Reel created successfully",
            "reel": reel_schema.dump(reel)
        }), 201
        
    except ValidationError as e:
        return jsonify({"error": "Validation error", "details": e.messages}), 422
    except BadRequest as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@highlights_bp.route('/my-saved', methods=['GET'])
@jwt_required()
def get_saved_highlights():
    """Get the current user's saved highlights."""
    current_user_id = get_jwt_identity()
    
    # Get the user object
    user = User.query.get_or_404(current_user_id)
    
    return jsonify({
        "count": len(user.saved_clips),
        "highlights": highlights_schema.dump(user.saved_clips)
    }), 200 