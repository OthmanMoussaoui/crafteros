import os
import sys
import json
import tempfile
from flask import Flask, render_template, request, jsonify, send_file
from dotenv import load_dotenv

# Add the current directory to the path so we can import our modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from commentator.football_commentator import FootballCommentator
from tts_module.arabic_tts import ArabicTTSModule
from tts_module.tts import TTSModule

# Load environment variables
load_dotenv()

# Create Flask app
app = Flask(__name__, 
            static_folder='static',
            template_folder='templates')

# Create temp directory for audio files
TEMP_DIR = tempfile.mkdtemp()
print(f"Created temporary directory for audio files: {TEMP_DIR}")

# Store audio files paths for serving
AUDIO_FILES = {}

@app.route('/')
def index():
    """Render the main page"""
    return render_template('index.html')

@app.route('/generate_commentary', methods=['POST'])
def generate_commentary():
    """Generate commentary from event description"""
    data = request.json
    
    event_description = data.get('event')
    language = data.get('language', 'english')
    style = data.get('style')
    
    if not event_description:
        return jsonify({"error": "No event description provided"}), 400
    
    # Initialize commentator with specified language
    commentator = FootballCommentator(language=language)
    
    # Generate commentary
    commentary = commentator._generate_commentary_for_event(event_description)
    
    # Return the commentary
    return jsonify({
        "commentary": commentary,
        "language": language
    })

@app.route('/generate_audio', methods=['POST'])
def generate_audio():
    """Generate audio from commentary"""
    data = request.json
    
    commentary = data.get('commentary')
    language = data.get('language', 'english')
    style = data.get('style')
    
    if not commentary:
        return jsonify({"error": "No commentary provided"}), 400
    
    # Create commentary segment format
    commentary_segment = {
        'timestamp': 0.0,
        'commentary': commentary,
        'event_description': data.get('event', ''),
        'sport': 'soccer',
        'language': language
    }
    
    # Select the appropriate TTS module based on language
    if language == "arabic":
        tts = ArabicTTSModule()
        # Set Arabic commentator style if specified
        if style:
            tts.set_commentator_style(style)
    else:
        tts = TTSModule()
    
    # Generate audio
    audio_segments = tts.text_to_speech([commentary_segment])
    
    if not audio_segments:
        return jsonify({"error": "Failed to generate audio"}), 500
    
    audio_path = audio_segments[0]['audio_path']
    
    # Store audio path with a unique ID
    audio_id = f"audio_{len(AUDIO_FILES) + 1}"
    AUDIO_FILES[audio_id] = audio_path
    
    # Return audio information
    return jsonify({
        "audio_id": audio_id
    })

@app.route('/audio/<audio_id>', methods=['GET'])
def get_audio(audio_id):
    """Serve the generated audio file"""
    if audio_id not in AUDIO_FILES:
        return jsonify({"error": "Audio not found"}), 404
    
    # Get audio path
    audio_path = AUDIO_FILES[audio_id]
    
    # Return audio file
    return send_file(audio_path, mimetype='audio/mpeg')

@app.route('/voices', methods=['GET'])
def get_voices():
    """Get available voices for Arabic"""
    tts = ArabicTTSModule()
    voices = tts.get_recommended_voices()
    
    # Return voices
    return jsonify({
        "voices": voices
    })

@app.route('/styles', methods=['GET'])
def get_styles():
    """Get available Arabic commentator styles"""
    tts = ArabicTTSModule()
    styles = tts.arabic_commentator_styles
    
    # Return styles
    return jsonify({
        "styles": styles
    })

@app.route('/events', methods=['GET'])
def get_sample_events():
    """Get sample football events"""
    try:
        with open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'football_events.json'), 'r') as f:
            events = json.load(f)
        return jsonify({"events": events})
    except Exception as e:
        print(f"Error reading events file: {e}")
        return jsonify({"events": []})

if __name__ == "__main__":
    app.run(debug=True) 