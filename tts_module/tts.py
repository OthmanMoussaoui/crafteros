import os
import requests
import json
import tempfile
import time
from dotenv import load_dotenv

load_dotenv()

class TTSModule:
    def __init__(self):
        # Load API key from environment variables
        self.api_key = os.getenv("ELEVENLABS_API_KEY")
        if not self.api_key:
            print("Warning: ELEVENLABS_API_KEY not found in environment variables")
        
        # Default voice ID - can be configured
        self.voice_id = os.getenv("ELEVENLABS_VOICE_ID", "pNInz6obpgDQGcFmaJgB")  # Default is "Adam" voice
        
        # Voice settings
        self.stability = 0.7  # Higher stability = less variance
        self.similarity_boost = 0.7  # Higher similarity boost = more similar to the reference voice
        
        # Available voice options
        self.voice_options = {
            "adam": "pNInz6obpgDQGcFmaJgB",       # Adam - versatile male voice
            "antoni": "ErXwobaYiN019PkySvjV",     # Antoni - deep, well-rounded male voice
            "arnold": "VR6AewLTigWG4xSOukaG",     # Arnold - powerful male voice, good for intense commentary
            "bella": "EXAVITQu4vr4xnSDxMaL",      # Bella - female voice with depth
            "rachel": "21m00Tcm4TlvDq8ikWAM",     # Rachel - calm, professional female voice
            "domi": "AZnzlk1XvdvUeBnXmlld",       # Domi - young, energetic female voice
            "elli": "MF3mGyEYCl7XYWbV9V6O"        # Elli - female voice with presence
        }
        
    def text_to_speech(self, commentary_segments):
        """
        Convert commentary text to speech using ElevenLabs API
        
        Args:
            commentary_segments: List of commentary segments with timestamps
            
        Returns:
            List of paths to audio files with timestamps
        """
        audio_segments = []
        
        # Create temp directory for audio files
        temp_dir = tempfile.mkdtemp()
        print(f"Created temporary directory for audio files: {temp_dir}")
        
        # Check if we want to adjust voice based on the sport
        for i, segment in enumerate(commentary_segments):
            # Select voice based on the sport if available
            voice_id = self._select_voice_for_sport(segment.get('sport', 'general'))
            
            # Convert text to speech
            audio_path = self._generate_speech(
                segment['commentary'], 
                f"{temp_dir}/segment_{i}.mp3",
                voice_id
            )
            
            if audio_path:
                audio_data = {
                    'timestamp': segment['timestamp'],
                    'audio_path': audio_path,
                    'commentary': segment['commentary'],
                    'voice_id': voice_id
                }
                audio_segments.append(audio_data)
                
                # Sleep briefly to avoid hitting rate limits
                if i < len(commentary_segments) - 1:
                    time.sleep(0.5)
        
        return audio_segments
    
    def _select_voice_for_sport(self, sport):
        """
        Select a voice based on the sport type
        
        Args:
            sport: Sport type
            
        Returns:
            Voice ID for the given sport
        """
        # Map sports to specific voices
        sport_voice_map = {
            'basketball': self.voice_options.get('arnold'),  # More energetic voice for basketball
            'american_football': self.voice_options.get('arnold'),  # Powerful voice for football
            'soccer': self.voice_options.get('antoni'),  # Well-rounded voice for soccer
            'tennis': self.voice_options.get('adam'),  # Versatile voice for tennis
            'athletics': self.voice_options.get('arnold'),  # Powerful voice for track events
            'gymnastics': self.voice_options.get('bella')  # Refined voice for gymnastics
        }
        
        return sport_voice_map.get(sport, self.voice_id)
    
    def _generate_speech(self, text, output_path, voice_id=None):
        """
        Generate speech from text using ElevenLabs API
        
        Args:
            text: Text to convert to speech
            output_path: Path to save the audio file
            voice_id: Optional voice ID to use
            
        Returns:
            Path to the generated audio file or None if failed
        """
        if not self.api_key:
            print("No ElevenLabs API key provided. Skipping TTS.")
            # Create a dummy file for testing without API
            with open(output_path, 'w') as f:
                f.write("dummy audio file")
            return output_path
        
        try:
            # Use provided voice_id or default
            voice_id = voice_id or self.voice_id
            
            headers = {
                "Accept": "audio/mpeg",
                "Content-Type": "application/json",
                "xi-api-key": self.api_key
            }
            
            payload = {
                "text": text,
                "model_id": "eleven_monolingual_v1",
                "voice_settings": {
                    "stability": self.stability,
                    "similarity_boost": self.similarity_boost
                }
            }
            
            # Debug info
            print(f"Generating speech for: '{text[:30]}...' using voice ID: {voice_id}")
            
            response = requests.post(
                f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}",
                headers=headers,
                json=payload
            )
            
            if response.status_code == 200:
                with open(output_path, 'wb') as f:
                    f.write(response.content)
                print(f"Successfully generated audio: {output_path}")
                return output_path
            else:
                print(f"Error calling ElevenLabs API: {response.status_code}")
                print(response.text)
                
                # Fallback to default voice if there was an error with the selected voice
                if voice_id != self.voice_id:
                    print(f"Retrying with default voice: {self.voice_id}")
                    return self._generate_speech(text, output_path, self.voice_id)
                return None
                
        except Exception as e:
            print(f"Exception in TTS generation: {e}")
            return None
            
    def list_available_voices(self):
        """
        List all available voices from ElevenLabs
        
        Returns:
            Dictionary of available voices
        """
        if not self.api_key:
            print("No ElevenLabs API key provided. Cannot list voices.")
            return self.voice_options
            
        try:
            headers = {"xi-api-key": self.api_key}
            response = requests.get("https://api.elevenlabs.io/v1/voices", headers=headers)
            
            if response.status_code == 200:
                voices = response.json().get("voices", [])
                return {voice["name"]: voice["voice_id"] for voice in voices}
            else:
                print(f"Error fetching voices: {response.status_code}")
                return self.voice_options
                
        except Exception as e:
            print(f"Exception fetching voices: {e}")
            return self.voice_options 