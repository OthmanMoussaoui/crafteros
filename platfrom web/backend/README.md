# MatchVisor Backend API

This is the Flask backend for the MatchVisor football analysis platform. It provides RESTful APIs for match data, highlights, user management, and more.

## Features

- **User Authentication**: JWT-based authentication with register, login, and refresh endpoints
- **Match Management**: API endpoints for retrieving match data, events, and reports
- **Highlights**: API for accessing auto-generated match highlights and creating reels
- **User Profiles**: User preference management, saved clips, and favorite teams
- **Admin Dashboard**: Upload and manage matches, teams, and other content
- **Real-time Features**: WebSocket support for live match updates
- **JSON Database**: File-based JSON storage for development simplicity
- **Assets**: Pre-loaded images and sample data

## Setup

### Prerequisites

- Python 3.8+

### Installation

1. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Create a `.env` file from the example:
   ```
   cp .env.example .env
   ```
   Edit the `.env` file with your settings.

4. Run the development server:
   ```
   python wsgi.py
   ```
   The API will be available at http://localhost:5000/

## Database

This implementation uses a JSON file-based database located at `app/assets/database.json`. The database includes the following collections:
- users
- teams
- leagues
- matches
- highlights
- events
- reports
- reels

## Assets

The application includes static assets in the `app/assets` directory:
- `images/`: Contains images used throughout the application
  - Sample team logos
  - Profile pictures
  - Highlight thumbnails

These images are served through the `/api/assets/images/` endpoint.

To add new images:
1. Place them in the `app/assets/images/` directory
2. Access them at `/api/assets/images/[filename]`
3. List all available images at `/api/assets/images`

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT tokens
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/logout` - Logout (revokes token)

### Match Endpoints

- `GET /api/matches` - List matches with filtering options
- `GET /api/matches/<match_id>` - Get match details
- `GET /api/matches/<match_id>/events` - Get match events
- `GET /api/matches/<match_id>/report` - Get tactical report
- `GET /api/matches/live` - Get currently live matches
- `GET /api/matches/upcoming` - Get upcoming matches

### Highlight Endpoints

- `GET /api/highlights` - List highlights with filtering
- `GET /api/highlights/<highlight_id>` - Get highlight details
- `POST /api/highlights/<highlight_id>/like` - Like a highlight
- `POST /api/highlights/<highlight_id>/save` - Save a highlight
- `GET /api/highlights/match/<match_id>` - Get highlights for a match
- `GET /api/highlights/reels` - Get all public reels
- `POST /api/highlights/reels` - Create a new reel

### User Endpoints

- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/profile/password` - Change password
- `POST /api/users/profile/image` - Upload profile image
- `GET /api/users/favorite-teams` - Get favorite teams
- `POST /api/users/favorite-teams/<team_id>` - Add team to favorites

### Admin Endpoints

- `GET /api/admin/users` - List all users
- `PUT /api/admin/users/<user_id>` - Update a user
- `POST /api/admin/matches` - Create a match
- `PUT /api/admin/matches/<match_id>` - Update a match
- `POST /api/admin/matches/<match_id>/video` - Upload match video
- `POST /api/admin/teams` - Create a team
- `POST /api/admin/leagues` - Create a league
- `GET /api/admin/dashboard` - Get admin dashboard stats

### Stats Endpoints

- `GET /api/stats/summary` - Get platform stats summary
- `GET /api/stats/matches/recent` - Get recent match stats
- `GET /api/stats/highlights` - Get highlight stats
- `GET /api/stats/teams` - Get team stats

### Assets Endpoints

- `GET /api/assets/images` - List all available images
- `GET /api/assets/images/<filename>` - Get a specific image

## Frontend Integration

To integrate this backend with your Next.js frontend:

1. Set up an API client in your Next.js app:
   ```javascript
   // api/client.js
   const API_URL = 'http://localhost:5000/api';
   
   export async function fetchData(endpoint, options = {}) {
     const response = await fetch(`${API_URL}${endpoint}`, {
       ...options,
       headers: {
         'Content-Type': 'application/json',
         ...(options.headers || {}),
       },
     });
     
     if (!response.ok) {
       throw new Error(`API error: ${response.status}`);
     }
     
     return response.json();
   }
   ```

2. Use the API client in your components:
   ```javascript
   import { fetchData } from '../api/client';
   
   export default function MatchesPage() {
     const [matches, setMatches] = useState([]);
     
     useEffect(() => {
       async function loadMatches() {
         const data = await fetchData('/matches');
         setMatches(data.matches);
       }
       
       loadMatches();
     }, []);
     
     return (
       <div>
         {matches.map(match => (
           <MatchCard key={match.id} match={match} />
         ))}
       </div>
     );
   }
   ```

3. Replace placeholder images with images from the assets API:
   ```jsx
   <Image 
     src={`http://localhost:5000/api/assets/images/team_logo.jpg`} 
     alt="Team Logo" 
     width={100} 
     height={100} 
   />
   ```

## Login Credentials

Use these credentials to test the application:
- Admin: admin@matchvisor.com / password123
- Regular user: user@example.com / password123 