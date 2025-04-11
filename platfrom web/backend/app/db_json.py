import json
import os
import uuid
from datetime import datetime
from typing import Dict, List, Any, Optional, Union
import threading

class JsonDB:
    """A simple JSON file-based database implementation."""
    
    def __init__(self, db_path='database.json'):
        """Initialize the database with the path to the JSON file."""
        self.db_path = db_path
        self.lock = threading.RLock()  # Thread-safe operations
        
        # Initialize empty database structure if file doesn't exist
        if not os.path.exists(db_path):
            self.data = {
                'users': [],
                'teams': [],
                'leagues': [],
                'matches': [],
                'highlights': [],
                'events': [],
                'reports': [],
                'reels': []
            }
            self.save()
        else:
            self.load()
    
    def load(self):
        """Load the database from the JSON file."""
        with self.lock:
            try:
                with open(self.db_path, 'r') as f:
                    self.data = json.load(f)
            except json.JSONDecodeError:
                # Handle corrupted file
                print(f"Error: Database file {self.db_path} is corrupted. Creating new database.")
                self.data = {
                    'users': [],
                    'teams': [],
                    'leagues': [],
                    'matches': [],
                    'highlights': [],
                    'events': [],
                    'reports': [],
                    'reels': []
                }
                self.save()
    
    def save(self):
        """Save the database to the JSON file."""
        with self.lock:
            with open(self.db_path, 'w') as f:
                json.dump(self.data, f, indent=2, default=self._json_serialize)
    
    def _json_serialize(self, obj):
        """Helper method to serialize datetime objects."""
        if isinstance(obj, datetime):
            return obj.isoformat()
        raise TypeError(f"Type {type(obj)} not serializable")
    
    def _filter_items(self, collection: List[Dict], filters: Dict) -> List[Dict]:
        """Filter items based on filter criteria."""
        if not filters:
            return collection
            
        result = []
        for item in collection:
            match = True
            for key, value in filters.items():
                if key not in item or item[key] != value:
                    match = False
                    break
            
            if match:
                result.append(item)
                
        return result
    
    def _generate_id(self) -> str:
        """Generate a unique ID."""
        return str(uuid.uuid4())
    
    def _get_timestamp(self) -> str:
        """Get current timestamp in ISO format."""
        return datetime.utcnow().isoformat()
    
    # Generic CRUD operations
    def get_all(self, collection_name: str, filters: Optional[Dict] = None) -> List[Dict]:
        """Get all items from a collection, optionally filtered."""
        with self.lock:
            collection = self.data.get(collection_name, [])
            if filters:
                return self._filter_items(collection, filters)
            return collection
    
    def get_by_id(self, collection_name: str, item_id: str) -> Optional[Dict]:
        """Get an item by its ID."""
        with self.lock:
            collection = self.data.get(collection_name, [])
            for item in collection:
                if item.get('id') == item_id:
                    return item
            return None
    
    def create(self, collection_name: str, item_data: Dict) -> Dict:
        """Create a new item in a collection."""
        with self.lock:
            # Ensure the collection exists
            if collection_name not in self.data:
                self.data[collection_name] = []
            
            # Add ID and timestamps if not provided
            if 'id' not in item_data:
                item_data['id'] = self._generate_id()
            
            if 'created_at' not in item_data:
                item_data['created_at'] = self._get_timestamp()
            
            if 'updated_at' not in item_data:
                item_data['updated_at'] = self._get_timestamp()
            
            # Add the item to the collection
            self.data[collection_name].append(item_data)
            self.save()
            
            return item_data
    
    def update(self, collection_name: str, item_id: str, item_data: Dict) -> Optional[Dict]:
        """Update an existing item."""
        with self.lock:
            collection = self.data.get(collection_name, [])
            
            for i, item in enumerate(collection):
                if item.get('id') == item_id:
                    # Update existing item
                    updated_item = {**item, **item_data, 'updated_at': self._get_timestamp()}
                    collection[i] = updated_item
                    self.save()
                    return updated_item
            
            return None
    
    def delete(self, collection_name: str, item_id: str) -> bool:
        """Delete an item by its ID."""
        with self.lock:
            collection = self.data.get(collection_name, [])
            
            for i, item in enumerate(collection):
                if item.get('id') == item_id:
                    del collection[i]
                    self.save()
                    return True
            
            return False
    
    def query(self, collection_name: str, query_fn) -> List[Dict]:
        """
        Query items using a custom function.
        
        Args:
            collection_name: The name of the collection to query
            query_fn: A function that takes an item and returns a boolean
                     indicating whether to include it in the results
        """
        with self.lock:
            collection = self.data.get(collection_name, [])
            return [item for item in collection if query_fn(item)]
    
    # Relationship helpers
    def add_to_relationship(self, collection_name: str, item_id: str, 
                           related_items_key: str, related_item_id: str) -> bool:
        """Add an item to a relationship list."""
        with self.lock:
            item = self.get_by_id(collection_name, item_id)
            if not item:
                return False
                
            # Initialize relationship list if it doesn't exist
            if related_items_key not in item:
                item[related_items_key] = []
                
            # Check if the relationship already exists
            if related_item_id not in item[related_items_key]:
                item[related_items_key].append(related_item_id)
                self.save()
                
            return True
    
    def remove_from_relationship(self, collection_name: str, item_id: str, 
                               related_items_key: str, related_item_id: str) -> bool:
        """Remove an item from a relationship list."""
        with self.lock:
            item = self.get_by_id(collection_name, item_id)
            if not item or related_items_key not in item:
                return False
                
            if related_item_id in item[related_items_key]:
                item[related_items_key].remove(related_item_id)
                self.save()
                return True
                
            return False

# Create a singleton instance
db = JsonDB(os.path.join(os.path.dirname(__file__), 'assets', 'database.json')) 