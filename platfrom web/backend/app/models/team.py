import uuid
from datetime import datetime
from marshmallow import fields
from .. import db, ma

class Team(db.Model):
    """Team model for storing football team information."""
    __tablename__ = 'teams'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), nullable=False)
    short_name = db.Column(db.String(20))
    logo = db.Column(db.String(255))  # Path to logo image
    country = db.Column(db.String(100))
    league_id = db.Column(db.String(36), db.ForeignKey('leagues.id'))
    founded_year = db.Column(db.Integer)
    stadium = db.Column(db.String(100))
    colors = db.Column(db.String(50))
    website = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    home_matches = db.relationship('Match', foreign_keys='Match.home_team_id', backref='home_team')
    away_matches = db.relationship('Match', foreign_keys='Match.away_team_id', backref='away_team')
    
    def __repr__(self):
        return f'<Team {self.name}>'
    
    def to_dict(self):
        """Return a dict representation of the team."""
        return {
            'id': self.id,
            'name': self.name,
            'short_name': self.short_name,
            'logo': self.logo,
            'country': self.country,
            'league_id': self.league_id,
            'founded_year': self.founded_year,
            'stadium': self.stadium,
            'colors': self.colors,
            'website': self.website
        }

class League(db.Model):
    """League model for storing football league information."""
    __tablename__ = 'leagues'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(100), nullable=False)
    short_name = db.Column(db.String(20))
    logo = db.Column(db.String(255))  # Path to logo image
    country = db.Column(db.String(100))
    season_start = db.Column(db.Date)
    season_end = db.Column(db.Date)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    teams = db.relationship('Team', backref='league')
    matches = db.relationship('Match', backref='league')
    
    def __repr__(self):
        return f'<League {self.name}>'

class TeamSchema(ma.SQLAlchemyAutoSchema):
    """Team schema for serialization."""
    class Meta:
        model = Team
        include_fk = True
    
    id = fields.String(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

class LeagueSchema(ma.SQLAlchemyAutoSchema):
    """League schema for serialization."""
    class Meta:
        model = League
    
    id = fields.String(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
    teams = fields.List(fields.Nested(TeamSchema(exclude=('league',))), dump_only=True) 