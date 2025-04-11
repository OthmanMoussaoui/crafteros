from flask import Blueprint, send_from_directory, current_app, jsonify
import os
import mimetypes

assets_bp = Blueprint('assets', __name__)

@assets_bp.route('/images/<path:filename>', methods=['GET'])
def get_image(filename):
    """Serve images from the assets folder."""
    assets_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'assets', 'images')
    return send_from_directory(assets_dir, filename)

@assets_bp.route('/images', methods=['GET'])
def list_images():
    """List all available images in the assets folder."""
    assets_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'assets', 'images')
    
    # Get list of image files
    image_files = []
    for file in os.listdir(assets_dir):
        file_path = os.path.join(assets_dir, file)
        if os.path.isfile(file_path):
            mime_type = mimetypes.guess_type(file_path)[0]
            if mime_type and mime_type.startswith('image/'):
                image_files.append({
                    'filename': file,
                    'url': f'/api/assets/images/{file}',
                    'type': mime_type
                })
    
    return jsonify({
        'images': image_files
    }) 