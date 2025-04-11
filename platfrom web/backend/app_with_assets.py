from flask import Flask, jsonify, send_from_directory
import os
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Set up assets directories
backend_assets_dir = os.path.join(os.path.dirname(__file__), 'app', 'assets')
backend_images_dir = os.path.join(backend_assets_dir, 'images')
project_assets_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'assets')
project_images_dir = os.path.join(project_assets_dir, 'image')

# Create directories if they don't exist
os.makedirs(backend_images_dir, exist_ok=True)

@app.route('/')
def index():
    return jsonify({
        "message": "MatchVisor API is running",
        "version": "1.0.0",
        "assets_info": {
            "backend_images_path": backend_images_dir,
            "project_images_path": project_images_dir
        }
    })

@app.route('/api/assets/images')
def list_images():
    """List all available images from both assets folders."""
    image_files = []
    
    # Add backend images
    if os.path.exists(backend_images_dir):
        for file in os.listdir(backend_images_dir):
            file_path = os.path.join(backend_images_dir, file)
            if os.path.isfile(file_path):
                image_files.append({
                    'filename': file,
                    'url': f'/api/assets/images/{file}',
                    'source': 'backend'
                })
    
    # Add project images
    if os.path.exists(project_images_dir):
        for file in os.listdir(project_images_dir):
            file_path = os.path.join(project_images_dir, file)
            if os.path.isfile(file_path):
                image_files.append({
                    'filename': file,
                    'url': f'/api/assets/project-images/{file}',
                    'source': 'project'
                })
    
    return jsonify({
        'images': image_files,
        'count': len(image_files),
        'backend_path': backend_images_dir,
        'project_path': project_images_dir
    })

@app.route('/api/assets/images/<path:filename>')
def get_backend_image(filename):
    """Serve images from the backend assets folder."""
    return send_from_directory(backend_images_dir, filename)

@app.route('/api/assets/project-images/<path:filename>')
def get_project_image(filename):
    """Serve images from the project assets folder."""
    return send_from_directory(project_images_dir, filename)

@app.route('/api/database')
def get_database():
    """Serve the database.json file."""
    try:
        with open(os.path.join(backend_assets_dir, 'database.json'), 'r') as f:
            return jsonify(json.load(f))
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print(f"Backend images directory: {backend_images_dir}")
    print(f"Project images directory: {project_images_dir}")
    app.run(host='0.0.0.0', port=5000, debug=True) 