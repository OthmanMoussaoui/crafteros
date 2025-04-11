from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func, desc
from datetime import datetime, timedelta

from .. import db, cache
from ..models import Match, MatchStatus, Highlight, MatchEvent, Team

stats_bp = Blueprint('stats', __name__)

@stats_bp.route('/summary', methods=['GET'])
@cache.cached(timeout=3600)  # Cache for 1 hour
def get_stats_summary():
    """Get summary statistics for the platform."""
    match_count = Match.query.count()
    live_match_count = Match.query.filter_by(status=MatchStatus.LIVE).count()
    finished_match_count = Match.query.filter_by(status=MatchStatus.FINISHED).count()
    highlight_count = Highlight.query.count()
    goal_count = MatchEvent.query.filter_by(event_type='goal').count()
    team_count = Team.query.count()
    
    return jsonify({
        "matches": {
            "total": match_count,
            "live": live_match_count,
            "finished": finished_match_count
        },
        "highlights": highlight_count,
        "goals": goal_count,
        "teams": team_count
    }), 200

@stats_bp.route('/matches/recent', methods=['GET'])
@cache.cached(timeout=1800)  # Cache for 30 minutes
def get_recent_match_stats():
    """Get statistics for recently completed matches."""
    # Get matches completed in the last 7 days
    one_week_ago = datetime.utcnow() - timedelta(days=7)
    
    recent_matches = Match.query.filter(
        Match.status == MatchStatus.FINISHED,
        Match.kickoff_time >= one_week_ago
    ).all()
    
    # Calculate stats
    total_goals = sum(match.home_score + match.away_score for match in recent_matches)
    avg_goals_per_match = total_goals / len(recent_matches) if recent_matches else 0
    
    # Get highlight counts
    highlight_counts = {}
    for match in recent_matches:
        highlight_counts[match.id] = Highlight.query.filter_by(match_id=match.id).count()
    
    # Get matches with most goals
    highest_scoring = sorted(
        recent_matches, 
        key=lambda m: m.home_score + m.away_score, 
        reverse=True
    )[:5]
    
    highest_scoring_data = [{
        "id": match.id,
        "home_team": match.home_team.name,
        "away_team": match.away_team.name,
        "score": f"{match.home_score}-{match.away_score}",
        "total_goals": match.home_score + match.away_score,
        "kickoff_time": match.kickoff_time.isoformat()
    } for match in highest_scoring]
    
    return jsonify({
        "recent_matches_count": len(recent_matches),
        "total_goals": total_goals,
        "avg_goals_per_match": round(avg_goals_per_match, 2),
        "highest_scoring_matches": highest_scoring_data,
        "highlight_counts": highlight_counts
    }), 200

@stats_bp.route('/highlights', methods=['GET'])
@cache.cached(timeout=1800)  # Cache for 30 minutes
def get_highlight_stats():
    """Get statistics for highlights."""
    # Most viewed highlights
    most_viewed = Highlight.query.order_by(desc(Highlight.views_count)).limit(10).all()
    most_viewed_data = [{
        "id": highlight.id,
        "title": highlight.title,
        "type": highlight.type,
        "views_count": highlight.views_count,
        "match_id": highlight.match_id,
        "match": f"{highlight.match.home_team.name} vs {highlight.match.away_team.name}"
    } for highlight in most_viewed]
    
    # Most liked highlights
    most_liked = Highlight.query.order_by(desc(Highlight.likes_count)).limit(10).all()
    most_liked_data = [{
        "id": highlight.id,
        "title": highlight.title,
        "type": highlight.type,
        "likes_count": highlight.likes_count,
        "match_id": highlight.match_id,
        "match": f"{highlight.match.home_team.name} vs {highlight.match.away_team.name}"
    } for highlight in most_liked]
    
    # Highlight counts by type
    highlight_by_type = db.session.query(
        Highlight.type, 
        func.count(Highlight.id).label('count')
    ).group_by(Highlight.type).all()
    
    highlight_type_data = {h_type: count for h_type, count in highlight_by_type}
    
    # Recent highlights
    recent_highlights = Highlight.query.order_by(desc(Highlight.created_at)).limit(10).all()
    recent_data = [{
        "id": highlight.id,
        "title": highlight.title,
        "type": highlight.type,
        "created_at": highlight.created_at.isoformat(),
        "match_id": highlight.match_id
    } for highlight in recent_highlights]
    
    return jsonify({
        "most_viewed": most_viewed_data,
        "most_liked": most_liked_data,
        "by_type": highlight_type_data,
        "recent": recent_data,
        "total_count": Highlight.query.count()
    }), 200

@stats_bp.route('/teams', methods=['GET'])
@cache.cached(timeout=3600)  # Cache for 1 hour
def get_team_stats():
    """Get statistics for teams."""
    # Teams with most matches
    teams_with_most_matches = db.session.query(
        Team,
        func.count(Match.id).label('match_count')
    ).outerjoin(Match, (Team.id == Match.home_team_id) | (Team.id == Match.away_team_id)
    ).group_by(Team.id
    ).order_by(desc('match_count')
    ).limit(10).all()
    
    teams_data = [{
        "id": team.id,
        "name": team.name,
        "match_count": match_count,
        "country": team.country
    } for team, match_count in teams_with_most_matches]
    
    # Teams with most goals
    # Note: In a real app, this would likely be more complex and efficient
    teams = Team.query.all()
    team_goals = {}
    
    for team in teams:
        # Goals as home team
        home_goals = db.session.query(func.sum(Match.home_score)).filter(
            Match.home_team_id == team.id,
            Match.status == MatchStatus.FINISHED
        ).scalar() or 0
        
        # Goals as away team
        away_goals = db.session.query(func.sum(Match.away_score)).filter(
            Match.away_team_id == team.id,
            Match.status == MatchStatus.FINISHED
        ).scalar() or 0
        
        team_goals[team.id] = {
            "id": team.id,
            "name": team.name,
            "total_goals": home_goals + away_goals,
            "home_goals": home_goals,
            "away_goals": away_goals
        }
    
    # Sort by total goals
    top_scoring_teams = sorted(
        team_goals.values(),
        key=lambda t: t["total_goals"],
        reverse=True
    )[:10]
    
    return jsonify({
        "most_matches": teams_data,
        "top_scoring": top_scoring_teams,
        "total_teams": Team.query.count()
    }), 200 