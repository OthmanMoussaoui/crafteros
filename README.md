# AI Sports Commentator

An AI-powered system that automatically generates commentary for sports video highlights and syncs it with the original video.

## Features

- Detects highlight moments in sports videos
- Analyzes highlights using OpenAI Vision API
- Generates natural-sounding commentary using GPT-4
- Converts commentary to speech using ElevenLabs TTS
- Syncs generated commentary with the original video

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/crafteros.git
   cd crafteros
   ```

2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Create a `.env` file in the root directory with your API keys:
   ```
   OPENAI_API_KEY=your_openai_api_key
   ELEVENLABS_API_KEY=your_elevenlabs_api_key
   ELEVENLABS_VOICE_ID=your_preferred_voice_id  # Optional, defaults to "Adam"
   ELEVENLABS_ARABIC_VOICE_ID=your_arabic_voice_id  # Optional, defaults to "Antoni"
   ```

## Running the Web Application

The project includes a web interface for generating football commentary in both English and Arabic:

1. Start the web application:
   ```
   ./run_web_app.sh
   ```
   This script will:
   - Create a virtual environment if it doesn't exist
   - Install required dependencies
   - Start the Flask server at http://localhost:5000

2. Visit `http://localhost:5000` in your browser to use the web interface.

3. Features of the web interface:
   - Generate commentary in English or Arabic
   - Choose different Arabic commentator styles (enthusiastic, calm, formal, emotional)
   - Convert commentary to speech with ElevenLabs
   - Use sample football events or create your own

## Usage (Command Line)

Run the AI commentator on a video file:

```
python main.py --video path/to/your/video.mp4 --output path/to/output.mp4
```

## Testing the Commentator and TTS

You can test the commentator and TTS modules directly without processing video:

1. Test with mock events:
   ```
   python test_commentator.py
   ```

2. Test with a specific event description:
   ```
   python test_commentator.py --event "LeBron James hits a three-pointer at the buzzer!" --sport basketball
   ```

3. Test with custom events from a JSON file:
   ```
   python test_commentator.py --events-file custom_events.json
   ```

4. List available ElevenLabs voices:
   ```
   python test_commentator.py --list-voices
   ```

5. Test specific components:
   ```
   python mock_commentary.py  # Tests the full pipeline with mock events
   ```

## Testing Football Commentary

For testing football commentary specifically:

1. Test football commentary in English:
   ```
   python test_football_commentator.py --language english
   ```

2. Test football commentary in Arabic:
   ```
   python test_football_commentator.py --language arabic
   ```

3. Test with a specific Arabic style:
   ```
   python test_football_commentator.py --language arabic --style "حماسي"
   ```

## How It Works

1. **Video Processing**: The system analyzes the video to detect interesting highlight moments
2. **Event Generation**: OpenAI Vision API analyzes the highlights to understand what's happening
3. **Commentary Generation**: GPT-4 generates natural, enthusiastic commentary based on the events
4. **Text-to-Speech**: ElevenLabs converts the commentary to realistic speech
5. **Audio Syncing**: The generated commentary is synced with the original video at the appropriate timestamps

## Customization

- Adjust commentator style in `commentator/commentator.py`
- Configure voice settings in `tts_module/tts.py`
- Modify highlight detection parameters in `video_processor/processor.py`
- Add custom event descriptions in `custom_events.json`
- For Arabic commentary, modify settings in `commentator/football_commentator.py`

## Requirements

- Python 3.8+
- OpenAI API key
- ElevenLabs API key
- Video processing libraries (OpenCV, MoviePy)
- Flask (for web interface)

## License

MIT