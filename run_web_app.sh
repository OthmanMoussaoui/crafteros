#!/bin/bash

# Navigate to the project directory
cd "$(dirname "$0")"

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate || source venv/Scripts/activate

# Install requirements
echo "Installing requirements..."
pip install -r requirements.txt

# Run the Flask app
echo "Starting the web application..."
python -m flask --app web_app.py run --host=0.0.0.0 --port=5000

# Deactivate at the end
# This may not run if you Ctrl+C to exit, but that's OK
trap "echo 'Deactivating virtual environment...'; deactivate" EXIT 