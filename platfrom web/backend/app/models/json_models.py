import uuid
from datetime import datetime
import re

# Email validation regex
EMAIL_REGEX = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'

# Helper functions for creating model objects
def generate_id():
    """Generate a unique ID."""
    return str(uuid.uuid4())

def get_timestamp():
    """Get current timestamp in ISO format."""
    return datetime.utcnow().isoformat()

# Model creation functions
def create_user(email, password_hash=None, first_name="", last_name="", profile_image=""):
    """Create a user object with the specified properties."""
    return {
        'id': generate_id(),
        'email': email.lower(),
        'password_hash': password_hash,
        'first_name': first_name,
        'last_name': last_name,
        'profile_image': profile_image,
        'is_active': True,
        'is_admin': False,
        'preferences': {},
        'last_login': None,
        'created_at': get_timestamp(),
        'updated_at': get_timestamp(),
        'favorite_teams': [],
        'saved_clips': []
    }

def create_team(name, short_name="", logo="", country="", league_id=None, 
               founded_year=None, stadium="", colors="", website=""):
    """Create a team object with the specified properties."""
    return {
        'id': generate_id(),
        'name': name,
        'short_name': short_name,
        'logo': logo,
        'country': country,
        'league_id': league_id,
        'founded_year': founded_year,
        'stadium': stadium,
        'colors': colors,
        'website': website,
        'created_at': get_timestamp(),
        'updated_at': get_timestamp()
    }

def create_league(name, short_name="", logo="", country="", season_start=None, season_end=None):
    """Create a league object with the specified properties."""
    return {
        'id': generate_id(),
        'name': name,
        'short_name': short_name,
        'logo': logo,
        'country': country,
        'season_start': season_start,
        'season_end': season_end,
        'created_at': get_timestamp(),
        'updated_at': get_timestamp()
    }

def create_match(home_team_id, away_team_id, kickoff_time, league_id=None, 
                stadium="", referee="", status="scheduled"):
    """Create a match object with the specified properties."""
    return {
        'id': generate_id(),
        'home_team_id': home_team_id,
        'away_team_id': away_team_id,
        'league_id': league_id,
        'kickoff_time': kickoff_time,
        'status': status,
        'home_score': 0,
        'away_score': 0,
        'stadium': stadium,
        'referee': referee,
        'attendance': None,
        'video_path': None,
        'stream_url': None,
        'has_multi_cam': False,
        'stats': {},
        'is_processed': False,
        'processing_status': "pending",
        'created_at': get_timestamp(),
        'updated_at': get_timestamp()
    }

def create_highlight(match_id, title, type, start_time, end_time, description="", 
                    match_time="", team_id=None, player_name="", player_id=None):
    """Create a highlight object with the specified properties."""
    return {
        'id': generate_id(),
        'match_id': match_id,
        'title': title,
        'description': description,
        'type': type,
        'match_time': match_time,
        'start_time': start_time,
        'end_time': end_time,
        'clip_path': None,
        'thumbnail_path': None,
        'team_id': team_id,
        'player_name': player_name,
        'player_id': player_id,
        'ai_caption': description,
        'importance_score': 0.5,
        'tags': [type, 'auto-generated'],
        'views_count': 0,
        'likes_count': 0,
        'created_at': get_timestamp(),
        'updated_at': get_timestamp()
    }

def create_match_event(match_id, event_type, minute, second=0, team_id=None, 
                      player_name="", description="", video_timestamp=None):
    """Create a match event object with the specified properties."""
    return {
        'id': generate_id(),
        'match_id': match_id,
        'event_type': event_type,
        'minute': minute,
        'second': second,
        'team_id': team_id,
        'player_name': player_name,
        'player_id': None,
        'description': description,
        'assist_by': None,
        'card_type': None,
        'var_decision': None,
        'video_timestamp': video_timestamp or (minute * 60 + second),
        'created_at': get_timestamp()
    }

def create_tactical_report(match_id, summary="", heatmap_data=None, pass_map_data=None, 
                          shot_map_data=None, player_ratings=None, key_stats=None):
    """Create a tactical report object with the specified properties."""
    return {
        'id': generate_id(),
        'match_id': match_id,
        'summary': summary,
        'heatmap_data': heatmap_data or {},
        'pass_map_data': pass_map_data or {},
        'shot_map_data': shot_map_data or {},
        'player_ratings': player_ratings or {},
        'key_stats': key_stats or {},
        'generated_at': get_timestamp(),
        'updated_at': get_timestamp()
    }

def create_reel(user_id, title, description="", highlight_ids=None, is_public=True):
    """Create a reel object with the specified properties."""
    return {
        'id': generate_id(),
        'user_id': user_id,
        'title': title,
        'description': description,
        'thumbnail_path': None,
        'highlight_ids': highlight_ids or [],
        'is_public': is_public,
        'created_at': get_timestamp(),
        'updated_at': get_timestamp()
    }

# Validation functions
def validate_user_data(data):
    """Validate user data and return any errors."""
    errors = {}
    
    # Email validation
    if not data.get('email'):
        errors['email'] = ["Email is required"]
    elif not re.match(EMAIL_REGEX, data.get('email', '')):
        errors['email'] = ["Invalid email format"]
    
    # Password validation for new users
    if 'password' not in data:
        errors['password'] = ["Password is required"]
    elif len(data.get('password', '')) < 8:
        errors['password'] = ["Password must be at least 8 characters long"]
    
    return errors

def validate_team_data(data):
    """Validate team data and return any errors."""
    errors = {}
    
    if not data.get('name'):
        errors['name'] = ["Team name is required"]
    
    return errors

def validate_match_data(data):
    """Validate match data and return any errors."""
    errors = {}
    
    if not data.get('home_team_id'):
        errors['home_team_id'] = ["Home team is required"]
    
    if not data.get('away_team_id'):
        errors['away_team_id'] = ["Away team is required"]
    
    if not data.get('kickoff_time'):
        errors['kickoff_time'] = ["Kickoff time is required"]
    
    return errors

def validate_highlight_data(data):
    """Validate highlight data and return any errors."""
    errors = {}
    
    if not data.get('match_id'):
        errors['match_id'] = ["Match ID is required"]
    
    if not data.get('title'):
        errors['title'] = ["Title is required"]
    
    if not data.get('type'):
        errors['type'] = ["Type is required"]
    
    if 'start_time' not in data:
        errors['start_time'] = ["Start time is required"]
    
    if 'end_time' not in data:
        errors['end_time'] = ["End time is required"]
    
    return errors 