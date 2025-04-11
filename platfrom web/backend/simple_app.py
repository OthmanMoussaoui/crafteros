from flask import Flask, jsonify, send_from_directory
import os

app = Flask(__name__)

# Set up assets directory
assets_dir = os.path.join(os.path.dirname(__file__), 'app', 'assets')
images_dir = os.path.join(assets_dir, 'images')

# Create directories if they don't exist
os.makedirs(images_dir, exist_ok=True)

@app.route('/')
def index():
    return jsonify({
        "message": "MatchVisor API is running",
        "version": "1.0.0"
    })

@app.route('/api/assets/images')
def list_images():
    """List all available images in the assets folder."""
    image_files = []
    for file in os.listdir(images_dir):
        file_path = os.path.join(images_dir, file)
        if os.path.isfile(file_path):
            image_files.append({
                'filename': file,
                'url': f'/api/assets/images/{file}'
            })
    
    return jsonify({
        'images': image_files
    })

@app.route('/api/assets/images/<path:filename>')
def get_image(filename):
    """Serve images from the assets folder."""
    return send_from_directory(images_dir, filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True) 