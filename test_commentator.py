import os
import argparse
import json
import time
from dotenv import load_dotenv
from commentator.commentator import Commentator
from tts_module.tts import TTSModule

# Load environment variables
load_dotenv()

def display_header():
    """Display a header for the test script"""
    print("\n" + "="*80)
    print("                       SPORTS AI COMMENTATOR TEST                       ")
    print("="*80 + "\n")

def read_events_from_file(file_path):
    """Read events from a JSON file"""
    try:
        with open(file_path, 'r') as f:
            events = json.load(f)
        return events
    except Exception as e:
        print(f"Error reading events file: {e}")
        return None

def save_events_to_file(events, file_path):
    """Save events to a JSON file"""
    try:
        with open(file_path, 'w') as f:
            json.dump(events, f, indent=2)
        print(f"Events saved to {file_path}")
    except Exception as e:
        print(f"Error saving events: {e}")

def list_voices():
    """List all available ElevenLabs voices"""
    tts = TTSModule()
    voices = tts.list_available_voices()
    
    print("\nAvailable Voices:")
    print("-----------------")
    for name, voice_id in voices.items():
        print(f"- {name}: {voice_id}")
    print()

def process_single_event(event_description, sport=None):
    """Process a single event for testing"""
    # Create a mock event
    event = {
        'timestamp': 0.0,
        'description': event_description
    }
    
    # Initialize modules
    commentator = Commentator()
    tts = TTSModule()
    
    # If sport is specified, customize commentator
    if sport:
        print(f"Using sport-specific settings for: {sport}")
    
    # Generate commentary
    print("\nGenerating commentary...")
    start_time = time.time()
    
    # Add sport info if available
    if sport:
        # Manually detect sport since we're only processing one event
        event['sport'] = sport
        commentary = commentator._generate_commentary_for_event(event_description, sport)
        commentary_segment = {
            'timestamp': 0.0,
            'commentary': commentary,
            'event_description': event_description,
            'sport': sport
        }
    else:
        commentary_segments = commentator.generate_commentary([event])
        commentary_segment = commentary_segments[0]
    
    # Print generated commentary
    print(f"\nGenerated commentary in {time.time() - start_time:.2f} seconds:")
    print(f"\"{commentary_segment['commentary']}\"")
    
    # Ask if user wants to generate audio
    response = input("\nGenerate audio with ElevenLabs? (y/n): ")
    if response.lower() == 'y':
        audio_segments = tts.text_to_speech([commentary_segment])
        if audio_segments:
            print(f"\nAudio saved to: {audio_segments[0]['audio_path']}")
    
    return commentary_segment

def run_test(args):
    """Run the test with the given arguments"""
    display_header()
    
    if args.list_voices:
        list_voices()
        return
    
    if args.event:
        # Process a single event
        process_single_event(args.event, args.sport)
        return
    
    # Process events from file or use default mock events
    events = None
    if args.events_file:
        events = read_events_from_file(args.events_file)
    
    if not events:
        # Use default mock events
        from mock_commentary import mock_events
        events = mock_events
    
    # Initialize modules
    commentator = Commentator()
    tts = TTSModule()
    
    # Process all events
    print(f"Processing {len(events)} events...")
    
    # Generate commentary
    start_time = time.time()
    commentary_segments = commentator.generate_commentary(events)
    print(f"Generated {len(commentary_segments)} commentary segments in {time.time() - start_time:.2f} seconds")
    
    # Print the first few commentaries
    print("\nSample commentaries:")
    for i, segment in enumerate(commentary_segments[:3]):
        print(f"{i+1}. [{segment['timestamp']:.2f}s] {segment['commentary']}")
    
    # Ask if user wants to generate audio
    if not args.skip_audio:
        response = input("\nGenerate audio with ElevenLabs? (y/n): ")
        if response.lower() == 'y':
            print("\nGenerating audio...")
            audio_segments = tts.text_to_speech(commentary_segments)
            
            # Save results
            output_file = args.output or "commentary_results.json"
            results = {
                "commentary": commentary_segments,
                "audio": [{
                    "timestamp": segment["timestamp"],
                    "path": segment["audio_path"],
                    "voice_id": segment.get("voice_id", "default")
                } for segment in audio_segments]
            }
            
            with open(output_file, 'w') as f:
                json.dump(results, f, indent=2)
            
            print(f"\nResults saved to {output_file}")
    
    print("\nDone!")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Test the Sports AI Commentator")
    parser.add_argument("--event", type=str, help="Single event description to test")
    parser.add_argument("--sport", type=str, help="Sport type for the event")
    parser.add_argument("--events-file", type=str, help="JSON file containing events")
    parser.add_argument("--output", type=str, help="Output file for results")
    parser.add_argument("--list-voices", action="store_true", help="List available voices")
    parser.add_argument("--skip-audio", action="store_true", help="Skip audio generation")
    
    args = parser.parse_args()
    run_test(args) 