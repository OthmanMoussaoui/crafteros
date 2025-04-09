import os
import json
from dotenv import load_dotenv
from commentator.commentator import Commentator
from tts_module.tts import TTSModule

# Load environment variables
load_dotenv()

# Check if API keys are available
openai_key = os.getenv("OPENAI_API_KEY")
eleven_key = os.getenv("ELEVENLABS_API_KEY")

if not openai_key:
    print("Warning: OPENAI_API_KEY not set. Commentary generation will use fallback text.")
if not eleven_key:
    print("Warning: ELEVENLABS_API_KEY not set. TTS will create dummy audio files.")

# Enhanced mock event data with player names and more details
mock_events = [
    {
        'timestamp': 10.5,
        'description': 'Lebron James makes an incredible three-point shot from downtown, giving the Lakers a 5-point lead!'
    },
    {
        'timestamp': 25.0,
        'description': 'Manuel Neuer makes a stunning diving save, preventing a certain goal from Messi\'s powerful shot.'
    },
    {
        'timestamp': 40.0,
        'description': 'Kevin De Bruyne delivers a brilliant through pass to Haaland who scores with a clinical finish!'
    },
    {
        'timestamp': 55.3,
        'description': 'Serena Williams delivers an ace at match point to win the championship!'
    },
    {
        'timestamp': 72.8,
        'description': 'Usain Bolt surges ahead in the final 20 meters to break the world record!'
    },
    {
        'timestamp': 90.1,
        'description': 'Tom Brady throws a perfect pass to Rob Gronkowski for a touchdown in the final seconds!'
    },
    {
        'timestamp': 105.4,
        'description': 'Stephen Curry hits his 10th three-pointer of the game, breaking the arena into wild cheers!'
    },
    {
        'timestamp': 118.7,
        'description': 'Simone Biles executes a flawless triple-twisting double backflip, stunning the judges and audience!'
    }
]

def setup_commentator():
    """Create a commentator with custom settings"""
    commentator = Commentator()
    
    # Customize commentator style if needed
    commentator.commentator_style = "enthusiastic sports commentator with deep knowledge of multiple sports"
    commentator.voice_style = "excited and energetic"
    
    return commentator

def setup_tts():
    """Create a TTS module with custom settings"""
    tts_module = TTSModule()
    
    # Customize voice if needed (only applies when API key is present)
    # For a sports commentator, we might want a more energetic voice
    voice_id = os.getenv("ELEVENLABS_VOICE_ID")
    if voice_id:
        tts_module.voice_id = voice_id
    
    # Adjust voice parameters for a more dynamic sound
    tts_module.stability = 0.6  # Lower stability for more variance
    tts_module.similarity_boost = 0.8  # Higher similarity to reference
    
    return tts_module

def save_results(commentary_segments, audio_segments):
    """Save the generated data to files for reference"""
    # Save commentary to JSON
    with open('commentary_output.json', 'w') as f:
        json.dump(commentary_segments, f, indent=2)
    
    # Create a report with all the information
    with open('commentary_report.txt', 'w') as f:
        f.write("AI SPORTS COMMENTATOR OUTPUT\n")
        f.write("===========================\n\n")
        
        for i, (comment, audio) in enumerate(zip(commentary_segments, audio_segments)):
            f.write(f"EVENT {i+1}:\n")
            f.write(f"Timestamp: {comment['timestamp']:.2f}s\n")
            f.write(f"Description: {comment['event_description']}\n")
            f.write(f"Commentary: {comment['commentary']}\n")
            f.write(f"Audio File: {audio['audio_path']}\n")
            f.write("\n---\n\n")

def main():
    # Initialize modules with custom settings
    commentator = setup_commentator()
    tts_module = setup_tts()
    
    # Generate commentary from mock events
    print("Generating commentary with GPT...")
    commentary_segments = commentator.generate_commentary(mock_events)
    
    # Print generated commentary
    print("\nGenerated Commentary:")
    for i, segment in enumerate(commentary_segments):
        print(f"{i+1}. [{segment['timestamp']:.2f}s] {segment['commentary']}")
    
    # Convert commentary to speech
    print("\nConverting commentary to speech with ElevenLabs...")
    audio_segments = tts_module.text_to_speech(commentary_segments)
    
    # Save results
    save_results(commentary_segments, audio_segments)
    
    print("\nComplete! Results:")
    for i, segment in enumerate(audio_segments):
        print(f"{i+1}. Timestamp: {segment['timestamp']:.2f}s")
        print(f"   Commentary: {segment['commentary']}")
        print(f"   Audio: {segment['audio_path']}")
        print()
    
    print(f"Full report saved to commentary_report.txt")

if __name__ == "__main__":
    main() 