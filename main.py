import os
import argparse
from video_processor.processor import VideoProcessor
from event_generator.generator import EventGenerator
from commentator.commentator import Commentator
from tts_module.tts import TTSModule

def main():
    parser = argparse.ArgumentParser(description='AI Sports Commentator')
    parser.add_argument('--video', type=str, required=True, help='Path to the video file')
    parser.add_argument('--output', type=str, default='output.mp4', help='Path to the output video file')
    args = parser.parse_args()
    
    # Initialize modules
    video_processor = VideoProcessor()
    event_generator = EventGenerator()
    commentator = Commentator()
    tts_module = TTSModule()
    
    # Process the video to detect highlights
    print("Processing video to detect highlights...")
    highlights = video_processor.process_video(args.video)
    
    # Generate events from the highlights
    print("Generating events from highlights...")
    events = event_generator.generate_events(highlights)
    
    # Generate commentary from events
    print("Generating commentary...")
    commentary = commentator.generate_commentary(events)
    
    # Convert commentary to speech
    print("Converting commentary to speech...")
    audio_segments = tts_module.text_to_speech(commentary)
    
    # Sync speech with video
    print("Syncing speech with video...")
    video_processor.sync_audio_with_video(args.video, audio_segments, events, args.output)
    
    print(f"Output saved to {args.output}")

if __name__ == "__main__":
    main() 