# 🃏 TrickTally - Call Break Game Tracker

A full-stack MERN application for tracking Call Break card game sessions with round-by-round scoring, player performance analytics, and statistics.

## 🎮 About Call Break

Call Break is a popular trick-taking card game played with 4 players and a standard 52-card deck. Players bid on how many tricks they can win each round, and points are awarded based on whether they meet their bid.

## 🚀 Features

### Core Functionality
- ✅ **User Authentication** - Secure signup/login with JWT
- ✅ **Session Management** - Create, view, edit, delete game sessions
- ✅ **Round-by-Round Tracking** - Record calls, tricks won, and trump suit for each round
- ✅ **Automatic Scoring** - Points calculated automatically (Call Break rules)
- ✅ **Player Statistics** - Track success rates, total points, and performance
- ✅ **Trump Analytics** - Statistics by trump suit
- ✅ **Leaderboard** - See top players and winners

### Scoring Rules
- If tricks won ≥ call: **+call points**
- If tricks won < call: **-call points**

### Tech Stack

**Frontend:**
- React 18 + TypeScript
- React Router for navigation
- Context API for state management
- Vite for build tooling
- CSS-in-JS for styling

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- bcryptjs for password hashing
- RESTful API architecture

## 📦 Installation

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file
# Add the following:
MONGO_URI=mongodb://localhost:27017/tricktally
JWT_SECRET=your_super_secret_jwt_key
PORT=5000

# Start development server
npm run dev
```

### Frontend Setup

```bash
# Navigate to client directory
cd client/trickytally

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## 📁 Project Structure

```
TrickTally/
├── server/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── sessionController.js
│   │   └── statsController.js
│   ├── models/
│   │   ├── User.js
│   │   └── GameSession.js (with rounds & player scores)
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── sessionRoutes.js
│   │   └── statsRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── .env
│   ├── server.js
│   └── package.json
│
└── client/trickytally/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.tsx
    │   │   └── ProtectedRoute.tsx
    │   ├── context/
    │   │   └── AuthContext.tsx
    │   ├── pages/
    │   │   ├── Login.tsx
    │   │   ├── Signup.tsx
    │   │   ├── Dashboard.tsx
    │   │   ├── SessionList.tsx
    │   │   ├── SessionDetail.tsx (with round tables)
    │   │   ├── CreateSession.tsx (round entry)
    │   │   └── Stats.tsx
    │   ├── App.tsx
    │   └── main.tsx
    └── package.json
```

## 🔌 API Endpoints

### Authentication
```
POST /api/auth/register - Create new user
POST /api/auth/login    - Login user
```

### Sessions (Protected)
```
GET    /api/sessions     - Get all user sessions
GET    /api/sessions/:id - Get single session
POST   /api/sessions     - Create new session
PUT    /api/sessions/:id - Update session
DELETE /api/sessions/:id - Delete session
```

### Statistics (Protected)
```
GET /api/stats/summary   - Overall statistics
GET /api/stats/by-game   - Stats by trump suit
GET /api/stats/by-player - Player performance data
```

## 💡 Usage

1. **Sign Up** - Create an account
2. **Create Session** - Log a new Call Break game
   - Add 4 player names
   - Add rounds one by one
   - For each round: select trump, enter each player's call and tricks won
3. **View Sessions** - Browse all your game sessions
4. **View Details** - Click any session to see round-by-round breakdown
5. **Stats** - Check analytics, trump statistics, and player performance

## 🎯 Interview Talking Points

"TrickTally is a MERN-based Call Break game tracker. Users can log complete game sessions with round-by-round tracking of player calls, tricks won, and trump suits. The app automatically calculates scores based on Call Break rules, stores all data in MongoDB with embedded round documents, and provides comprehensive analytics including player performance, success rates, and trump statistics through an interactive React dashboard."

**Key Technical Highlights:**
- Implemented JWT-based authentication with protected routes
- RESTful API with proper error handling and validation
- MongoDB schema design with embedded round documents
- Mongoose pre-save middleware for automatic score calculation
- React Context API for global state management
- TypeScript for type safety on frontend
- Responsive design with CSS-in-JS
- Dynamic round entry with real-time point calculation

## 🔒 Security Features
- Password hashing with bcrypt
- JWT token authentication
- Protected API routes
- User-specific data isolation

## 🚀 Future Enhancements
- [ ] Charts and graphs for statistics (Chart.js/Recharts)
- [ ] Export game history to CSV/PDF
- [ ] Live game mode with real-time updates
- [ ] Tournament brackets
- [ ] Mobile app version
- [ ] Social features (share sessions)

## 📝 License
MIT

## 👨‍💻 Author
Built for portfolio and interview demonstrations
