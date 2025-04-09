import os
import requests
import json
import re
from dotenv import load_dotenv

load_dotenv()

class Commentator:
    def __init__(self):
        # Load API key from environment variables
        self.api_key = os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            print("Warning: OPENAI_API_KEY not found in environment variables")
        
        # Commentator personality and style can be adjusted here
        self.commentator_style = "enthusiastic sports commentator"
        self.voice_style = "excited"
        
        # Sports detection patterns
        self.sport_patterns = {
            'basketball': r'(basket|dunk|three-point|Lakers|NBA|court|Curry|Lebron|James|jump shot)',
            'soccer': r'(football|goal|goalkeeper|save|Messi|Ronaldo|Neuer|De Bruyne|Haaland|penalty|pitch)',
            'tennis': r'(tennis|serve|ace|backhand|forehand|court|Serena|Williams|match point|volley)',
            'athletics': r'(sprint|meter|track|Bolt|record|race|finish line)',
            'american_football': r'(touchdown|Brady|NFL|quarterback|pass|Gronkowski|yard|field)',
            'gymnastics': r'(gymnast|Biles|flip|routine|apparatus|judges|backflip|twist)'
        }
    
    def generate_commentary(self, events):
        """
        Generate commentary for each event
        
        Args:
            events: List of events with descriptions and timestamps
            
        Returns:
            List of commentary texts with timestamps
        """
        commentary_segments = []
        
        for event in events:
            # Detect sport type from event description
            sport = self._detect_sport(event['description'])
            
            # Generate commentary for the event
            commentary = self._generate_commentary_for_event(event['description'], sport)
            
            if commentary:
                segment = {
                    'timestamp': event['timestamp'],
                    'commentary': commentary,
                    'event_description': event['description'],
                    'sport': sport
                }
                commentary_segments.append(segment)
        
        return commentary_segments
    
    def _detect_sport(self, description):
        """
        Detect the sport from the event description
        
        Args:
            description: Event description
            
        Returns:
            Detected sport type
        """
        for sport, pattern in self.sport_patterns.items():
            if re.search(pattern, description, re.IGNORECASE):
                return sport
        
        return "general"  # Default if no specific sport is detected
    
    def _generate_commentary_for_event(self, event_description, sport):
        """
        Use OpenAI API to generate commentary for a specific event
        
        Args:
            event_description: Description of the event
            sport: Detected sport type
            
        Returns:
            Commentary text
        """
        if not self.api_key:
            # For demonstration, return dummy data if no API key
            return f"Wow! What an incredible moment! {event_description}"
        
        try:
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {self.api_key}"
            }
            
            # Customize the prompt based on the detected sport
            sport_specific_instruction = self._get_sport_specific_instruction(sport)
            
            prompt = f"""
            You are an {self.commentator_style} specializing in {sport}. Generate an {self.voice_style} commentary for the following event:
            
            Event: {event_description}
            
            {sport_specific_instruction}
            
            Provide a realistic, engaging, and natural-sounding commentary that a real commentator might say. 
            Keep it brief (1-2 sentences max) and conversational. Focus on the excitement and significance of the moment.
            Include player names if mentioned in the event.
            """
            
            payload = {
                "model": "gpt-4-turbo",
                "messages": [
                    {
                        "role": "system",
                        "content": f"You are an {self.commentator_style} specializing in {sport}. Your commentary should be exciting, authentic, and concise."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                "max_tokens": 100,
                "temperature": 0.7
            }
            
            response = requests.post(
                "https://api.openai.com/v1/chat/completions",
                headers=headers,
                json=payload
            )
            
            if response.status_code == 200:
                result = response.json()
                return result["choices"][0]["message"]["content"].strip()
            else:
                print(f"Error calling OpenAI API: {response.status_code}")
                print(response.text)
                return f"Amazing play! {event_description}"
                
        except Exception as e:
            print(f"Exception in commentary generation: {e}")
            return f"What a moment! {event_description}"
    
    def _get_sport_specific_instruction(self, sport):
        """
        Get sport-specific instructions for the commentator
        
        Args:
            sport: Detected sport type
            
        Returns:
            Sport-specific instruction
        """
        instructions = {
            'basketball': "Use basketball terminology like 'swish', 'downtown', 'from beyond the arc', etc. Reference team dynamics and game statistics if available.",
            'soccer': "Use soccer/football terminology like 'beautiful strike', 'clinical finish', 'top corner', etc. Emphasize the skill and tactical aspects.",
            'tennis': "Use tennis terminology like 'ace', 'down the line', 'backhand winner', etc. Reference the importance of the moment in the match context.",
            'athletics': "Emphasize the speed, power, and historical significance. Use terminology like 'surging ahead', 'powering down the track', etc.",
            'american_football': "Use terminology like 'touchdown pass', 'in the end zone', 'quarterback sneak', etc. Emphasize team strategy and player execution.",
            'gymnastics': "Emphasize the difficulty, execution, and artistry. Use terminology like 'perfect landing', 'high difficulty', 'flawless execution', etc."
        }
        
        return instructions.get(sport, "Focus on the excitement and significance of the moment.") 