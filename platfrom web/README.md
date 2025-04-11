# MatchVisor - AI-Powered Football Analysis Platform

MatchVisor is a modern web application that revolutionizes football match analysis by combining live streaming, AI-powered insights, and comprehensive statistics to deliver an immersive experience for fans, analysts, and coaches.

![MatchVisor Platform Screenshot](https://github.com/OthmanMoussaoui/crafteros/blob/main/platfrom%20web/assets/image/screen.png)

## Features

### 🎮 Live Match Experience
- Real-time match streaming with interactive controls
- Live statistics and match updates
- Dynamic score and time tracking
- Multi-language support

### 🎯 Smart Highlights
- AI-generated highlight clips of key moments
- Automated goal detection and replay creation
- Player-focused action sequences
- Easy sharing and social media integration

### 📊 Tactical Analysis
- Detailed match statistics and visualizations
- Heat maps and player positioning analysis
- Possession and shot analysis
- Team and player performance metrics

### 🤖 AI Features
- Automated commentary generation
- Smart event detection
- Performance predictions
- Tactical pattern recognition

## Technology Stack

### Frontend
- Next.js 13+ with App Router
- React 18
- TypeScript
- Tailwind CSS
- Shadcn UI Components
- Lucide Icons

### Backend
- Flask (Python)
- JWT Authentication
- RESTful API
- JSON-based data storage

## Getting Started

### Prerequisites
- Node.js 18+ 
- Python 3.8+
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/matchvisor.git
cd matchvisor
```

2. Install frontend dependencies:
```bash
pnpm install
```

3. Install backend dependencies:
```bash
cd backend
pip install -r requirements.txt
```

4. Set up environment variables:
```bash
cp .env.example .env.local
```

5. Start the development servers:
```bash
# Start both frontend and backend
./start.bat
```

## Project Structure

```
matchvisor/
├── app/                  # Next.js app directory
├── components/          # React components
├── lib/                 # Utility functions and API client
├── public/             # Static assets
├── styles/             # Global styles
├── backend/            # Flask backend
│   ├── app/           # Backend application code
│   ├── assets/        # Backend assets
│   └── requirements.txt
└── assets/            # Project assets
```

## Contributing

We welcome contributions! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Screenshots

### Home Page
![Home Page](assets/image/screen.png)
*The main dashboard showing live matches and highlights*

## Contact

For any inquiries or support, please reach out to:
- Email: support@matchvisor.com
- Twitter: [@MatchVisor](https://twitter.com/matchvisor)
- Website: [www.matchvisor.com](https://www.matchvisor.com) 