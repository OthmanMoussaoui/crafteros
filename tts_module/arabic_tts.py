import os
import requests
import json
import tempfile
import time
from dotenv import load_dotenv

load_dotenv()

class ArabicTTSModule:
    def __init__(self):
        # Load API key from environment variables
        self.api_key = os.getenv("ELEVENLABS_API_KEY")
        if not self.api_key:
            print("Warning: ELEVENLABS_API_KEY not found in environment variables")
        
        # Default voice ID for Arabic - can be configured
        # Note: ElevenLabs has limited Arabic voice options, so we use a versatile voice
        self.voice_id = os.getenv("ELEVENLABS_ARABIC_VOICE_ID", "ThT5KcBeYPX3keUQqHPh")  # Default is "Antoni" voice
        
        # Voice settings - adjusted for Arabic
        self.stability = 0.65  # Better for Arabic pronunciation
        self.similarity_boost = 0.75  # Higher similarity for consistent Arabic delivery
        
        # Available voice options that work well with Arabic
        self.voice_options = {
            "adam": "pNInz6obpgDQGcFmaJgB",     # Adam - versatile male voice
            "antoni": "ThT5KcBeYPX3keUQqHPh",   # Antoni - deeper voice, works well for Arabic
            "josh": "TxGEqnHWrfWFTfGW9XjX",     # Josh - another option for Arabic
            "rachel": "21m00Tcm4TlvDq8ikWAM",   # Rachel - female option
            "elli": "MF3mGyEYCl7XYWbV9V6O"      # Elli - female option
        }
        
        # Model selection - multilingual is better for Arabic
        self.model_id = "eleven_multilingual_v2"
        
        # Arabic-specific settings
        self.arabic_commentator_styles = [
            "حماسي",       # Enthusiastic
            "هادئ",        # Calm
            "رسمي",        # Formal
            "عاطفي"        # Emotional
        ]
        
        self.current_style = "حماسي"  # Default style
        
    def text_to_speech(self, commentary_segments):
        """
        Convert Arabic commentary text to speech using ElevenLabs API
        
        Args:
            commentary_segments: List of commentary segments with timestamps
            
        Returns:
            List of paths to audio files with timestamps
        """
        audio_segments = []
        
        # Create temp directory for audio files
        temp_dir = tempfile.mkdtemp()
        print(f"Created temporary directory for audio files: {temp_dir}")
        
        for i, segment in enumerate(commentary_segments):
            # Convert text to speech
            audio_path = self._generate_speech(
                segment['commentary'], 
                f"{temp_dir}/segment_{i}.mp3"
            )
            
            if audio_path:
                audio_data = {
                    'timestamp': segment['timestamp'],
                    'audio_path': audio_path,
                    'commentary': segment['commentary'],
                    'voice_id': self.voice_id,
                    'language': 'arabic'
                }
                audio_segments.append(audio_data)
                
                # Sleep briefly to avoid hitting rate limits
                if i < len(commentary_segments) - 1:
                    time.sleep(1.0)  # Slightly longer for Arabic TTS which can be more resource-intensive
        
        return audio_segments
    
    def set_commentator_style(self, style):
        """
        Set the Arabic commentator style
        
        Args:
            style: Arabic style name (حماسي, هادئ, رسمي, عاطفي)
        """
        if style in self.arabic_commentator_styles:
            self.current_style = style
            
            # Adjust voice settings based on style
            if style == "حماسي":  # Enthusiastic
                self.stability = 0.55
                self.similarity_boost = 0.8
            elif style == "هادئ":  # Calm
                self.stability = 0.75
                self.similarity_boost = 0.7
            elif style == "رسمي":  # Formal
                self.stability = 0.8
                self.similarity_boost = 0.6
            elif style == "عاطفي":  # Emotional
                self.stability = 0.5
                self.similarity_boost = 0.85
    
    def _generate_speech(self, text, output_path):
        """
        Generate speech from Arabic text using ElevenLabs API
        
        Args:
            text: Arabic text to convert to speech
            output_path: Path to save the audio file
            
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
            headers = {
                "Accept": "audio/mpeg",
                "Content-Type": "application/json",
                "xi-api-key": self.api_key
            }
            
            # Voice settings for Arabic
            payload = {
                "text": text,
                "model_id": self.model_id,  # Use multilingual model for Arabic
                "voice_settings": {
                    "stability": self.stability,
                    "similarity_boost": self.similarity_boost
                }
            }
            
            # Debug info
            print(f"Generating Arabic speech for: '{text[:30]}...' using voice ID: {self.voice_id}")
            
            response = requests.post(
                f"https://api.elevenlabs.io/v1/text-to-speech/{self.voice_id}",
                headers=headers,
                json=payload
            )
            
            if response.status_code == 200:
                with open(output_path, 'wb') as f:
                    f.write(response.content)
                print(f"Successfully generated Arabic audio: {output_path}")
                return output_path
            else:
                print(f"Error calling ElevenLabs API: {response.status_code}")
                print(response.text)
                return None
                
        except Exception as e:
            print(f"Exception in Arabic TTS generation: {e}")
            return None
            
    def get_recommended_voices(self):
        """
        Get recommended voices for Arabic
        
        Returns:
            Dictionary of recommended voices for Arabic
        """
        return {
            "حماسي (Enthusiastic)": self.voice_options.get("antoni"),
            "هادئ (Calm)": self.voice_options.get("adam"),
            "رسمي (Formal)": self.voice_options.get("josh"),
            "أنثوي (Female)": self.voice_options.get("rachel")
        } 