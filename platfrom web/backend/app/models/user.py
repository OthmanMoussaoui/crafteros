from datetime import datetime
import uuid
import bcrypt
from marshmallow import fields
from .. import db, ma

class User(db.Model):
    """User model for authentication and profile management."""
    __tablename__ = 'users'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=True)  # Nullable for OAuth users
    first_name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))
    profile_image = db.Column(db.String(255))  # Path to profile image
    is_active = db.Column(db.Boolean, default=True)
    is_admin = db.Column(db.Boolean, default=False)
    preferences = db.Column(db.JSON, default=dict)  # User preferences JSON
    last_login = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    favorite_teams = db.relationship('Team', secondary='user_favorite_teams', backref='fans')
    saved_clips = db.relationship('Highlight', secondary='user_saved_clips', backref='saved_by')
    
    def __init__(self, email, password=None, **kwargs):
        self.email = email.lower()
        if password:
            self.set_password(password)
        
        for key, value in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, value)
    
    def set_password(self, password):
        """Hash password and store it."""
        salt = bcrypt.gensalt()
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
    
    def check_password(self, password):
        """Check if provided password matches stored hash."""
        if self.password_hash is None:
            return False
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))
    
    def update_last_login(self):
        """Update the last login timestamp."""
        self.last_login = datetime.utcnow()
        db.session.commit()
    
    def to_dict(self):
        """Return a dict representation of the user."""
        return {
            'id': self.id,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'profile_image': self.profile_image,
            'is_active': self.is_active,
            'is_admin': self.is_admin,
            'preferences': self.preferences,
            'last_login': self.last_login.isoformat() if self.last_login else None,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class UserSchema(ma.SQLAlchemyAutoSchema):
    """User schema for serialization."""
    class Meta:
        model = User
        exclude = ('password_hash',)
        load_instance = True
    
    id = fields.String(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
    password = fields.String(load_only=True)  # Password field for deserialization only

# Association tables
user_favorite_teams = db.Table('user_favorite_teams',
    db.Column('user_id', db.String(36), db.ForeignKey('users.id'), primary_key=True),
    db.Column('team_id', db.String(36), db.ForeignKey('teams.id'), primary_key=True)
)

user_saved_clips = db.Table('user_saved_clips',
    db.Column('user_id', db.String(36), db.ForeignKey('users.id'), primary_key=True),
    db.Column('highlight_id', db.String(36), db.ForeignKey('highlights.id'), primary_key=True),
    db.Column('saved_at', db.DateTime, default=datetime.utcnow)
) 