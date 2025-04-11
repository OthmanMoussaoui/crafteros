from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import ValidationError
from sqlalchemy import desc
from datetime import datetime
from werkzeug.exceptions import NotFound, BadRequest

from .. import db, cache
from ..models import (
    Match, MatchSchema, MatchEvent, MatchEventSchema,
    TacticalReport, TacticalReportSchema, MatchStatus
)

matches_bp = Blueprint('matches', __name__)

match_schema = MatchSchema()
matches_schema = MatchSchema(many=True)
match_event_schema = MatchEventSchema()
match_events_schema = MatchEventSchema(many=True)
tactical_report_schema = TacticalReportSchema()

@matches_bp.route('', methods=['GET'])
@cache.cached(timeout=60)  # Cache for 1 minute
def get_matches():
    """Get all matches with filtering options."""
    # Parse query parameters
    status = request.args.get('status')
    league_id = request.args.get('league_id')
    team_id = request.args.get('team_id')
    date_from = request.args.get('date_from')
    date_to = request.args.get('date_to')
    page = request.args.get('page', 1, type=int)
    per_page = min(request.args.get('per_page', 20, type=int), 50)  # Max 50 per page
    
    # Start with base query
    query = Match.query
    
    # Apply filters if provided
    if status:
        try:
            match_status = MatchStatus(status)
            query = query.filter(Match.status == match_status)
        except ValueError:
            pass  # Invalid status, ignore filter
    
    if league_id:
        query = query.filter(Match.league_id == league_id)
    
    if team_id:
        query = query.filter((Match.home_team_id == team_id) | (Match.away_team_id == team_id))
    
    if date_from:
        try:
            from_date = datetime.fromisoformat(date_from)
            query = query.filter(Match.kickoff_time >= from_date)
        except ValueError:
            pass  # Invalid date format, ignore filter
    
    if date_to:
        try:
            to_date = datetime.fromisoformat(date_to)
            query = query.filter(Match.kickoff_time <= to_date)
        except ValueError:
            pass  # Invalid date format, ignore filter
    
    # Order by kickoff time, most recent first
    query = query.order_by(desc(Match.kickoff_time))
    
    # Paginate results
    paginated_matches = query.paginate(page=page, per_page=per_page, error_out=False)
    
    result = {
        "matches": matches_schema.dump(paginated_matches.items),
        "pagination": {
            "total": paginated_matches.total,
            "pages": paginated_matches.pages,
            "page": page,
            "per_page": per_page,
            "has_next": paginated_matches.has_next,
            "has_prev": paginated_matches.has_prev
        }
    }
    
    return jsonify(result), 200

@matches_bp.route('/<match_id>', methods=['GET'])
def get_match(match_id):
    """Get a single match by ID."""
    match = Match.query.get_or_404(match_id)
    return jsonify(match_schema.dump(match)), 200

@matches_bp.route('/<match_id>/events', methods=['GET'])
def get_match_events(match_id):
    """Get all events for a match."""
    # Verify match exists
    match = Match.query.get_or_404(match_id)
    
    # Get events sorted by time
    events = MatchEvent.query.filter_by(match_id=match_id).order_by(
        MatchEvent.minute, MatchEvent.second
    ).all()
    
    return jsonify({
        "match_id": match_id,
        "events": match_events_schema.dump(events)
    }), 200

@matches_bp.route('/<match_id>/report', methods=['GET'])
def get_match_report(match_id):
    """Get the tactical report for a match."""
    # Verify match exists
    match = Match.query.get_or_404(match_id)
    
    # Get the report
    report = TacticalReport.query.filter_by(match_id=match_id).first()
    
    if not report:
        if match.status != MatchStatus.FINISHED:
            return jsonify({
                "error": "Report not available",
                "message": "Report will be generated after the match is finished"
            }), 404
        else:
            return jsonify({
                "error": "Report not available",
                "message": "Report is still being processed"
            }), 404
    
    return jsonify(tactical_report_schema.dump(report)), 200

@matches_bp.route('/live', methods=['GET'])
@cache.cached(timeout=30)  # Cache for 30 seconds
def get_live_matches():
    """Get all currently live matches."""
    live_matches = Match.query.filter_by(status=MatchStatus.LIVE).all()
    
    return jsonify({
        "count": len(live_matches),
        "matches": matches_schema.dump(live_matches)
    }), 200

@matches_bp.route('/upcoming', methods=['GET'])
@cache.cached(timeout=300)  # Cache for 5 minutes
def get_upcoming_matches():
    """Get upcoming matches for the next 24 hours."""
    now = datetime.utcnow()
    tomorrow = now.replace(hour=23, minute=59, second=59)
    
    upcoming_matches = Match.query.filter(
        Match.status == MatchStatus.SCHEDULED,
        Match.kickoff_time >= now,
        Match.kickoff_time <= tomorrow
    ).order_by(Match.kickoff_time).all()
    
    return jsonify({
        "count": len(upcoming_matches),
        "matches": matches_schema.dump(upcoming_matches)
    }), 200 