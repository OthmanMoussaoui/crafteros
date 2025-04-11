# AI Sports Commentary & Analysis Platform (CrafterOS)

**Project Submission for the AI League (SDAIA & Ministry of Sport, Saudi Arabia)**

## Overview

CrafterOS is an innovative AI-powered platform designed to revolutionize the sports viewing and analysis experience, with a primary focus on football. It automatically generates dynamic, human-like commentary for sports video highlights in multiple languages (English and Arabic), analyzes video content for key events and tactical insights, and provides interactive web interfaces for users and administrators.

This project leverages state-of-the-art AI models for vision analysis (OpenAI Vision, YOLO), commentary generation (GPT-4), and text-to-speech synthesis (ElevenLabs) to create engaging and informative sports content.

## Features

* **AI-Generated Commentary:**
    * Natural-sounding commentary generation for sports highlights using GPT-4.
    * Support for multiple languages (English, Arabic) with specific styles (e.g., enthusiastic, calm Arabic commentary).
    * Realistic text-to-speech conversion using ElevenLabs, including dedicated Arabic voices.
* **Video Analysis & Highlight Detection:**
    * Automated detection of highlight moments in sports videos.
    * Event generation using OpenAI Vision API to describe actions within highlights.
    * Integration with YOLO models for **Player and Field Detection** (`Playground_Detection_Process/`) enabling deeper tactical analysis (player positions, pitch keypoints).
* **Audio Syncing:** Generated commentary audio tracks are precisely synced with the original video timestamps.
* **Web Interfaces:**
    * **Core Web App (`web_app.py`):** A simple Flask interface to test football commentary generation (English/Arabic) and TTS conversion for single events.
    * **MatchVisor Platform (`platfrom web/`):** A comprehensive Next.js frontend with a Flask backend, offering:
        * Live match simulation/viewing.
        * Display of AI-generated highlights and tactical reports.
        * Detailed statistics and visualizations (heat maps, player positioning - leveraging detection models).
        * User authentication and profiles.
        * Admin dashboard for managing users, content, and system settings.
* **Modular Design:** The system is broken down into distinct modules for video processing, event generation, commentary, TTS, and web presentation.

## Project Architecture

The platform consists of several key components:

1.  **Video Processor (`video_processor/`):** Handles ingestion, analysis (highlight detection), and output generation (syncing audio). Uses OpenCV and MoviePy.
2.  **Event Generator (`event_generator/`):** Takes video frames/highlights and uses OpenAI Vision API to generate textual descriptions of the events.
3.  **Commentator (`commentator/`):**
    * `commentator.py`: Base commentator class using GPT-4.
    * `football_commentator.py`: Specialized commentator for football, supporting English and Arabic, aware of football terminology, players, and teams.
4.  **TTS Module (`tts_module/`):**
    * `tts.py`: Handles English TTS using ElevenLabs.
    * `arabic_tts.py`: Handles Arabic TTS using ElevenLabs, including different voice styles.
5.  **Detection Playground (`Playground_Detection_Process/`):** Contains trained YOLO models (YoloV8) for detecting field keypoints and players, crucial for advanced tactical analysis presented in MatchVisor. Includes a Streamlit app for visualization.
6.  **Core Web App (`web_app.py`, `templates/`, `static/`):** A basic Flask application demonstrating the core football commentary generation for single events.
7.  **MatchVisor Platform (`platfrom web/`):** A full-fledged Next.js application providing a rich user experience for viewing matches, highlights, stats, and reports. It interacts with its own Flask backend (`platfrom web/backend/`) which manages data (potentially using `database.json`) and serves assets.

## Technology Stack

* **Backend & Core Logic:** Python, Flask, OpenAI API (GPT-4, Vision), ElevenLabs API, OpenCV, MoviePy, YOLOv8 (Ultralytics), NumPy, python-dotenv
* **MatchVisor Frontend:** Next.js, React, TypeScript, Tailwind CSS, Shadcn UI, Lucide Icons, Recharts, date-fns
* **MatchVisor Backend:** Python, Flask, JWT (potentially)
* **Database (MatchVisor):** JSON-based file storage (`database.json`)
* **Development:** Node.js, pnpm (for MatchVisor), Git

## Setup

### 1. Core Python Application (Commentary Generation & Basic Web App)

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/othmanmoussaoui/crafteros.git](https://github.com/othmanmoussaoui/crafteros.git)
    cd othmanmoussaoui-crafteros
    ```

2.  **Create a virtual environment (recommended):**
    ```bash
    python -m venv venv
    source venv/bin/activate # Linux/macOS
    # or
    venv\Scripts\activate # Windows
    ```

3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
    *Note: You might need additional dependencies for the YOLO models if running detection locally, check `Playground_Detection_Process/requirements.txt`.*

4.  **Set up Environment Variables:**
    * Copy `.env.example` to `.env`.
    * Fill in your API keys:
        ```dotenv
        OPENAI_API_KEY=your_openai_api_key
        ELEVENLABS_API_KEY=your_elevenlabs_api_key
        ELEVENLABS_VOICE_ID=your_preferred_english_voice_id # Optional (Defaults provided)
        ELEVENLABS_ARABIC_VOICE_ID=your_preferred_arabic_voice_id # Optional (Defaults provided)
        ```

### 2. MatchVisor Platform (Advanced Frontend & Backend)

1.  **Navigate to the platform directory:**
    ```bash
    cd "platfrom web"
    ```

2.  **Install Frontend Dependencies:**
    ```bash
    pnpm install # Or npm install / yarn install
    ```

3.  **Install Backend Dependencies:**
    ```bash
    cd backend
    # Create/activate a separate virtual environment if desired
    pip install -r requirements.txt
    cd .. # Return to 'platfrom web' directory
    ```

4.  **Set up Environment Variables (Frontend):**
    * Navigate to the `platfrom web` directory.
    * Copy `.env.example` (if it exists in this directory, otherwise create `.env.local`) and add any frontend-specific variables if needed. Usually shares API keys via the backend.

## Usage

### 1. Core Web Application (Simple Commentary Demo)

This app allows you to test the football commentary generation for single event descriptions.

1.  Ensure you are in the root `othmanmoussaoui-crafteros` directory and your virtual environment is active.
2.  Run the shell script:
    ```bash
    ./run_web_app.sh
    ```
    (or manually `python -m flask --app web_app run --host=0.0.0.0 --port=5000`)
3.  Open your browser and navigate to `http://localhost:5000`.
4.  Enter a football event description, select language/style, and generate commentary and speech.

### 2. MatchVisor Platform (Full Experience)

This provides the complete user interface with match viewing, highlights, stats, etc.

1.  Navigate to the `platfrom web` directory.
2.  Use the provided start script (if on Windows):
    ```bash
    ./start.bat
    ```
    *This script attempts to start both the Next.js frontend and the platform's Flask backend.*
3.  Alternatively, start them manually:
    * **Backend:** `cd backend && python app_with_assets.py` (Runs on `http://localhost:5000` by default)
    * **Frontend:** `cd "platfrom web" && pnpm dev` (Runs on `http://localhost:3000` by default)
4.  Open your browser and navigate to `http://localhost:3000`.

### 3. Command Line Interface (Video Processing)

Process a full video file to generate commentary and sync it.

1.  Ensure you are in the root `othmanmoussaoui-crafteros` directory and your virtual environment is active.
2.  Run `main.py`:
    ```bash
    python main.py --video path/to/your/video.mp4 --output path/to/output_with_commentary.mp4
    ```
    *Note: This requires the full pipeline including highlight detection and OpenAI Vision calls, which might incur costs.*

## Testing

Several scripts are provided for testing specific modules:

* **Test General Commentator & TTS:** Uses mock events (non-football) or custom JSON.
    ```bash
    python test_commentator.py # Use mock events
    python test_commentator.py --events-file custom_events.json # Use custom events
    python test_commentator.py --event "Description of a sports event" --sport basketball # Test single event
    python test_commentator.py --list-voices # List available ElevenLabs voices
    ```
* **Test Full Pipeline with Mock Events:**
    ```bash
    python mock_commentary.py
    ```
* **Test Football Commentator:** Focuses on the football-specific module.
    ```bash
    python test_football_commentator.py --language english # Test English football commentary
    python test_football_commentator.py --language arabic # Test Arabic football commentary
    python test_football_commentator.py --language arabic --style "حماسي" # Test specific Arabic style
    ```

## Acknowledgements

* SDAIA & Saudi Ministry of Sport (AI League Initiative)
* OpenAI
* ElevenLabs
* Ultralytics (for YOLO models)
* Creators of libraries used in this project.
