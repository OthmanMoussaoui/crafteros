import uuid
from datetime import datetime
from enum import Enum
from marshmallow import fields
from .. import db, ma

class MatchStatus(Enum):
    """Enum for match status."""
    SCHEDULED = "scheduled"
    LIVE = "live"
    FINISHED = "finished"
    POSTPONED = "postponed"
    CANCELLED = "cancelled"

class Match(db.Model):
    """Match model for storing football match information."""
    __tablename__ = 'matches'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    home_team_id = db.Column(db.String(36), db.ForeignKey('teams.id'), nullable=False)
    away_team_id = db.Column(db.String(36), db.ForeignKey('teams.id'), nullable=False)
    league_id = db.Column(db.String(36), db.ForeignKey('leagues.id'))
    
    # Match details
    kickoff_time = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.Enum(MatchStatus), default=MatchStatus.SCHEDULED)
    home_score = db.Column(db.Integer, default=0)
    away_score = db.Column(db.Integer, default=0)
    stadium = db.Column(db.String(100))
    referee = db.Column(db.String(100))
    attendance = db.Column(db.Integer)
    
    # Media
    video_path = db.Column(db.String(255))  # Path to main video file
    stream_url = db.Column(db.String(255))  # URL for live streaming
    has_multi_cam = db.Column(db.Boolean, default=False)
    
    # Match stats (summary)
    stats = db.Column(db.JSON, default=dict)  # Possession, shots, cards, etc.
    
    # Processing status
    is_processed = db.Column(db.Boolean, default=False)  # Whether AI analysis is complete
    processing_status = db.Column(db.String(50), default="pending")
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    highlights = db.relationship('Highlight', backref='match', cascade='all, delete-orphan')
    events = db.relationship('MatchEvent', backref='match', cascade='all, delete-orphan')
    reports = db.relationship('TacticalReport', backref='match', cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<Match {self.home_team.name} vs {self.away_team.name}>'
    
    def to_dict(self):
        """Return a dict representation of the match."""
        return {
            'id': self.id,
            'home_team': self.home_team.to_dict() if self.home_team else None,
            'away_team': self.away_team.to_dict() if self.away_team else None,
            'league': self.league.name if self.league else None,
            'kickoff_time': self.kickoff_time.isoformat(),
            'status': self.status.value,
            'home_score': self.home_score,
            'away_score': self.away_score,
            'stadium': self.stadium,
            'referee': self.referee,
            'attendance': self.attendance,
            'has_multi_cam': self.has_multi_cam,
            'stats': self.stats,
            'is_processed': self.is_processed,
            'processing_status': self.processing_status,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class MatchEvent(db.Model):
    """Events that occur during a match (goals, cards, substitutions, etc.)."""
    __tablename__ = 'match_events'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    match_id = db.Column(db.String(36), db.ForeignKey('matches.id'), nullable=False)
    
    event_type = db.Column(db.String(50), nullable=False)  # goal, card, sub, foul, etc.
    minute = db.Column(db.Integer, nullable=False)
    second = db.Column(db.Integer, default=0)
    team_id = db.Column(db.String(36), db.ForeignKey('teams.id'))
    player_name = db.Column(db.String(100))
    player_id = db.Column(db.String(36))  # If we have player entities
    description = db.Column(db.Text)
    
    # For goals
    assist_by = db.Column(db.String(100))
    
    # For cards
    card_type = db.Column(db.String(20))  # yellow, red
    
    # For VAR
    var_decision = db.Column(db.String(50))
    
    # Video timestamp
    video_timestamp = db.Column(db.Integer)  # Seconds from start of video
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship
    team = db.relationship('Team', backref='events')

class TacticalReport(db.Model):
    """AI-generated tactical analysis of a match."""
    __tablename__ = 'tactical_reports'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    match_id = db.Column(db.String(36), db.ForeignKey('matches.id'), nullable=False)
    
    # Report data
    summary = db.Column(db.Text)  # Text summary of match analysis
    heatmap_data = db.Column(db.JSON)  # Team and player heatmaps
    pass_map_data = db.Column(db.JSON)  # Pass networks and patterns
    shot_map_data = db.Column(db.JSON)  # Shot locations and xG
    player_ratings = db.Column(db.JSON)  # AI ratings for each player
    key_stats = db.Column(db.JSON)  # Important stats highlighted by AI
    
    generated_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class MatchSchema(ma.SQLAlchemyAutoSchema):
    """Match schema for serialization."""
    class Meta:
        model = Match
        include_fk = True
    
    id = fields.String(dump_only=True)
    status = fields.Function(lambda obj: obj.status.value)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
    home_team = fields.Nested('TeamSchema', exclude=('home_matches', 'away_matches'))
    away_team = fields.Nested('TeamSchema', exclude=('home_matches', 'away_matches'))
    league = fields.Nested('LeagueSchema', exclude=('teams', 'matches'))

class MatchEventSchema(ma.SQLAlchemyAutoSchema):
    """MatchEvent schema for serialization."""
    class Meta:
        model = MatchEvent
        include_fk = True
    
    id = fields.String(dump_only=True)
    created_at = fields.DateTime(dump_only=True)

class TacticalReportSchema(ma.SQLAlchemyAutoSchema):
    """TacticalReport schema for serialization."""
    class Meta:
        model = TacticalReport
        include_fk = True
    
    id = fields.String(dump_only=True)
    generated_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True) 