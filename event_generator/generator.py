import os
import requests
import json
import base64
import cv2
import numpy as np
from dotenv import load_dotenv

load_dotenv()

class EventGenerator:
    def __init__(self):
        # Load API key from environment variables
        self.api_key = os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            print("Warning: OPENAI_API_KEY not found in environment variables")
    
    def generate_events(self, highlights):
        """
        Generate events from video highlights using an LLM (OpenAI Vision API)
        
        Args:
            highlights: List of highlights with timestamps and frame data
            
        Returns:
            List of events with descriptions and timestamps
        """
        events = []
        
        for highlight in highlights:
            # Convert frame to base64 for API
            _, buffer = cv2.imencode('.jpg', highlight['frame'])
            encoded_frame = base64.b64encode(buffer).decode('utf-8')
            
            # Generate event description using OpenAI Vision
            event_description = self._analyze_frame_with_llm(encoded_frame)
            
            if event_description:
                event = {
                    'timestamp': highlight['timestamp'],
                    'description': event_description,
                    'frame_idx': highlight['frame_idx']
                }
                events.append(event)
                
        return events
    
    def _analyze_frame_with_llm(self, encoded_frame):
        """
        Use OpenAI Vision API to analyze the frame
        
        Args:
            encoded_frame: Base64 encoded frame
            
        Returns:
            Event description
        """
        if not self.api_key:
            # For demonstration, return dummy data if no API key
            return "Exciting play detected at this timestamp"
            
        try:
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {self.api_key}"
            }
            
            payload = {
                "model": "gpt-4-vision-preview",
                "messages": [
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": "You are a sports analyst AI. Describe the key event happening in this sports highlight. Be specific and concise. Focus on what makes this a highlight moment."
                            },
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/jpeg;base64,{encoded_frame}"
                                }
                            }
                        ]
                    }
                ],
                "max_tokens": 100
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
                return "Error analyzing highlight"
                
        except Exception as e:
            print(f"Exception in LLM analysis: {e}")
            return "Error analyzing highlight" 