import os
import requests
import json
import re
from dotenv import load_dotenv

load_dotenv()

class FootballCommentator:
    def __init__(self, language="english"):
        # Load API key from environment variables
        self.api_key = os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            print("Warning: OPENAI_API_KEY not found in environment variables")
        
        # Set the language for commentary
        self.language = language.lower()
        
        # Commentator personality and style
        if self.language == "arabic":
            self.commentator_style = "متحمس معلق كرة قدم عربي"
            self.voice_style = "متحمس وحماسي"
        else:
            self.commentator_style = "enthusiastic football commentator"
            self.voice_style = "excited and energetic"
        
        # Football teams and players for enhanced recognition
        self.teams = [
            "Barcelona", "Real Madrid", "Manchester United", "Liverpool", 
            "Bayern Munich", "PSG", "Al-Ahly", "Al-Hilal", "Al-Nassr",
            "Manchester City", "Chelsea", "Arsenal", "Juventus", "Inter Milan",
            "Al-Ittihad", "Al-Sadd", "Zamalek", "Raja Casablanca", "ES Tunis"
        ]
        
        self.players = [
            "Messi", "Ronaldo", "Salah", "Mbappé", "Haaland", "De Bruyne",
            "Benzema", "Lewandowski", "Neymar", "Mahrez", "Hakimi", "Ziyech",
            "Bounou", "Mané", "Mendy", "Osimhen", "Aboubakar", "Elneny"
        ]
    
    def generate_commentary(self, events):
        """
        Generate football commentary for each event
        
        Args:
            events: List of events with descriptions and timestamps
            
        Returns:
            List of commentary texts with timestamps
        """
        commentary_segments = []
        
        for event in events:
            # Generate commentary for the event
            commentary = self._generate_commentary_for_event(event['description'])
            
            if commentary:
                segment = {
                    'timestamp': event['timestamp'],
                    'commentary': commentary,
                    'event_description': event['description'],
                    'sport': 'soccer',
                    'language': self.language
                }
                commentary_segments.append(segment)
        
        return commentary_segments
    
    def _extract_entities(self, description):
        """
        Extract teams and players from the description
        """
        found_entities = {
            'teams': [],
            'players': []
        }
        
        # Extract teams
        for team in self.teams:
            if re.search(r'\b' + re.escape(team) + r'\b', description, re.IGNORECASE):
                found_entities['teams'].append(team)
        
        # Extract players
        for player in self.players:
            if re.search(r'\b' + re.escape(player) + r'\b', description, re.IGNORECASE):
                found_entities['players'].append(player)
        
        return found_entities
    
    def _generate_commentary_for_event(self, event_description):
        """
        Use OpenAI API to generate commentary for a specific football event
        
        Args:
            event_description: Description of the event
            
        Returns:
            Commentary text
        """
        if not self.api_key:
            # For demonstration, return dummy data if no API key
            if self.language == "arabic":
                return f"يا إلهي! لحظة رائعة! {event_description}"
            else:
                return f"Wow! What an incredible moment! {event_description}"
        
        try:
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {self.api_key}"
            }
            
            # Extract entities to emphasize in the commentary
            entities = self._extract_entities(event_description)
            entities_text = ""
            
            if entities['players'] or entities['teams']:
                entities_text = "Focus on these entities in your commentary: "
                if entities['players']:
                    entities_text += f"Players: {', '.join(entities['players'])}. "
                if entities['teams']:
                    entities_text += f"Teams: {', '.join(entities['teams'])}."
            
            # Create language-specific prompts
            if self.language == "arabic":
                prompt = f"""
                أنت {self.commentator_style}. قم بإنشاء تعليق {self.voice_style} للحدث التالي في مباراة كرة القدم:
                
                الحدث: {event_description}
                
                {entities_text}
                
                قدم تعليقًا واقعيًا وجذابًا وطبيعيًا كما قد يقوله معلق حقيقي.
                احتفظ بإيجاز (1-2 جمل كحد أقصى) وبأسلوب محادثة. ركز على الإثارة وأهمية اللحظة.
                استخدم مصطلحات كرة القدم العربية مثل "يسدد"، "يراوغ"، "هدف رائع"، "تسديدة صاروخية" إلخ.
                اذكر أسماء اللاعبين أو الفرق إذا ذكرت في الحدث.
                """
            else:
                prompt = f"""
                You are a {self.commentator_style}. Generate a {self.voice_style} commentary for the following event in a football match:
                
                Event: {event_description}
                
                {entities_text}
                
                Provide a realistic, engaging, and natural-sounding commentary that a real commentator might say.
                Keep it brief (1-2 sentences max) and conversational. Focus on the excitement and significance of the moment.
                Use football terminology like 'beautiful strike', 'clinical finish', 'top corner', etc.
                Include player names or teams if mentioned in the event.
                """
            
            # Set the appropriate system message based on language
            if self.language == "arabic":
                system_message = f"أنت {self.commentator_style}. يجب أن يكون تعليقك مثيرًا وأصيلًا وموجزًا."
            else:
                system_message = f"You are a {self.commentator_style}. Your commentary should be exciting, authentic, and concise."
            
            payload = {
                "model": "gpt-4-turbo",
                "messages": [
                    {
                        "role": "system",
                        "content": system_message
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