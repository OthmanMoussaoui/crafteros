import uuid
from datetime import datetime
from marshmallow import fields
from .. import db, ma

class HighlightType(db.Enum):
    """Enum for highlight types."""
    GOAL = "goal"
    SAVE = "save"
    SKILL = "skill"
    CHANCE = "chance"
    FOUL = "foul"
    CARD = "card"
    VAR = "var"
    OTHER = "other"

class Highlight(db.Model):
    """Highlight model for storing match highlight clips."""
    __tablename__ = 'highlights'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    match_id = db.Column(db.String(36), db.ForeignKey('matches.id'), nullable=False)
    
    # Highlight details
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    type = db.Column(db.String(50), nullable=False)  # goal, save, skill, chance, foul, card, var
    
    # Time information
    match_time = db.Column(db.String(10))  # Format: MM:SS
    start_time = db.Column(db.Integer, nullable=False)  # Start time in video (seconds)
    end_time = db.Column(db.Integer, nullable=False)  # End time in video (seconds)
    
    # Media
    clip_path = db.Column(db.String(255))  # Path to the highlight video file
    thumbnail_path = db.Column(db.String(255))  # Path to the thumbnail image
    
    # Team and player involved
    team_id = db.Column(db.String(36), db.ForeignKey('teams.id'))
    player_name = db.Column(db.String(100))
    player_id = db.Column(db.String(36))  # If we have player entities
    
    # AI generated data
    ai_caption = db.Column(db.Text)  # AI-generated caption
    importance_score = db.Column(db.Float, default=0.0)  # AI-rated importance (0-1)
    tags = db.Column(db.JSON, default=list)  # List of tags for searchability
    
    # Stats
    views_count = db.Column(db.Integer, default=0)
    likes_count = db.Column(db.Integer, default=0)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    team = db.relationship('Team', backref='highlights')
    
    def __repr__(self):
        return f'<Highlight {self.title}>'
    
    def to_dict(self):
        """Return a dict representation of the highlight."""
        return {
            'id': self.id,
            'match_id': self.match_id,
            'title': self.title,
            'description': self.description,
            'type': self.type,
            'match_time': self.match_time,
            'start_time': self.start_time,
            'end_time': self.end_time,
            'clip_path': self.clip_path,
            'thumbnail_path': self.thumbnail_path,
            'team_id': self.team_id,
            'player_name': self.player_name,
            'player_id': self.player_id,
            'ai_caption': self.ai_caption,
            'importance_score': self.importance_score,
            'tags': self.tags,
            'views_count': self.views_count,
            'likes_count': self.likes_count,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class Reel(db.Model):
    """User-created compilations of highlights."""
    __tablename__ = 'reels'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    thumbnail_path = db.Column(db.String(255))
    is_public = db.Column(db.Boolean, default=True)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    highlights = db.relationship('Highlight', secondary='reel_highlights', backref='reels')
    user = db.relationship('User', backref='reels')

# Association table for reels and highlights
reel_highlights = db.Table('reel_highlights',
    db.Column('reel_id', db.String(36), db.ForeignKey('reels.id'), primary_key=True),
    db.Column('highlight_id', db.String(36), db.ForeignKey('highlights.id'), primary_key=True),
    db.Column('order', db.Integer),
    db.Column('added_at', db.DateTime, default=datetime.utcnow)
)

class HighlightSchema(ma.SQLAlchemyAutoSchema):
    """Highlight schema for serialization."""
    class Meta:
        model = Highlight
        include_fk = True
    
    id = fields.String(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
    match = fields.Nested('MatchSchema', only=('id', 'home_team', 'away_team', 'kickoff_time', 'status'))
    team = fields.Nested('TeamSchema', only=('id', 'name', 'logo'))

class ReelSchema(ma.SQLAlchemyAutoSchema):
    """Reel schema for serialization."""
    class Meta:
        model = Reel
        include_fk = True
    
    id = fields.String(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
    highlights = fields.List(fields.Nested(HighlightSchema(exclude=('reels',))))
    user = fields.Nested('UserSchema', only=('id', 'first_name', 'last_name')) 