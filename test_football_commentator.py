import os
import argparse
import json
import time
from dotenv import load_dotenv
from commentator.football_commentator import FootballCommentator
from tts_module.arabic_tts import ArabicTTSModule

# Load environment variables
load_dotenv()

def display_header():
    """Display a header for the test script"""
    print("\n" + "="*80)
    print("                   FOOTBALL COMMENTATOR TEST                   ")
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

def save_results(commentary_segments, audio_segments, output_file="football_commentary_results.json"):
    """Save the results to a JSON file"""
    results = {
        "commentary": commentary_segments,
        "audio": [{
            "timestamp": segment["timestamp"],
            "path": segment["audio_path"],
            "voice_id": segment.get("voice_id", "default"),
            "language": segment.get("language", "english")
        } for segment in audio_segments]
    }
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    
    # Also create a human-readable report
    with open('football_commentary_report.txt', 'w', encoding='utf-8') as f:
        f.write("FOOTBALL COMMENTATOR OUTPUT\n")
        f.write("===========================\n\n")
        
        for i, (comment, audio) in enumerate(zip(commentary_segments, audio_segments)):
            f.write(f"EVENT {i+1}:\n")
            f.write(f"Timestamp: {comment['timestamp']:.2f}s\n")
            f.write(f"Description: {comment['event_description']}\n")
            f.write(f"Commentary: {comment['commentary']}\n")
            f.write(f"Language: {comment.get('language', 'english')}\n")
            f.write(f"Audio File: {audio['audio_path']}\n")
            f.write("\n---\n\n")
    
    print(f"Results saved to {output_file}")
    print(f"Report saved to football_commentary_report.txt")

def process_single_event(event_description, language="english"):
    """Process a single football event for testing"""
    # Create a mock event
    event = {
        'timestamp': 0.0,
        'description': event_description
    }
    
    # Initialize commentator with specified language
    commentator = FootballCommentator(language=language)
    
    if language == "arabic":
        tts = ArabicTTSModule()
    else:
        # Import the regular TTS for English
        from tts_module.tts import TTSModule
        tts = TTSModule()
    
    # Generate commentary
    print(f"\nGenerating {language} football commentary...")
    start_time = time.time()
    
    commentary = commentator._generate_commentary_for_event(event_description)
    commentary_segment = {
        'timestamp': 0.0,
        'commentary': commentary,
        'event_description': event_description,
        'sport': 'soccer',
        'language': language
    }
    
    # Print generated commentary
    print(f"\nGenerated commentary in {time.time() - start_time:.2f} seconds:")
    print(f"\"{commentary_segment['commentary']}\"")
    
    # Ask if user wants to generate audio
    response = input("\nGenerate audio with ElevenLabs? (y/n): ")
    if response.lower() == 'y':
        audio_segments = tts.text_to_speech([commentary_segment])
        if audio_segments:
            print(f"\nAudio saved to: {audio_segments[0]['audio_path']}")
            
            # Save results
            save_results([commentary_segment], audio_segments, "single_event_result.json")
    
    return commentary_segment

def run_football_test(args):
    """Run the football commentator test with the given arguments"""
    display_header()
    
    # Process a single event if provided
    if args.event:
        process_single_event(args.event, args.language)
        return
    
    # Process events from file
    events_file = args.events_file or "football_events.json"
    events = read_events_from_file(events_file)
    
    if not events:
        print(f"No events found in {events_file}")
        return
    
    # Initialize commentator with specified language
    commentator = FootballCommentator(language=args.language)
    
    # Select the appropriate TTS module based on language
    if args.language == "arabic":
        tts = ArabicTTSModule()
        # Set Arabic commentator style if specified
        if args.style:
            tts.set_commentator_style(args.style)
    else:
        from tts_module.tts import TTSModule
        tts = TTSModule()
    
    # Process all events
    print(f"Processing {len(events)} football events in {args.language}...")
    
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
        response = input(f"\nGenerate {args.language} audio with ElevenLabs? (y/n): ")
        if response.lower() == 'y':
            print(f"\nGenerating {args.language} audio...")
            audio_segments = tts.text_to_speech(commentary_segments)
            
            # Save results
            output_file = args.output or f"football_commentary_{args.language}.json"
            save_results(commentary_segments, audio_segments, output_file)
    
    print("\nDone!")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Test the Football Commentator")
    parser.add_argument("--event", type=str, help="Single event description to test")
    parser.add_argument("--events-file", type=str, help="JSON file containing football events")
    parser.add_argument("--language", type=str, default="english", choices=["english", "arabic"], help="Commentary language")
    parser.add_argument("--style", type=str, help="Arabic commentator style (حماسي, هادئ, رسمي, عاطفي)")
    parser.add_argument("--output", type=str, help="Output file for results")
    parser.add_argument("--skip-audio", action="store_true", help="Skip audio generation")
    
    args = parser.parse_args()
    run_football_test(args) 