# 🎴 TrickTally - Call Break Score Tracker

<div align="center">

![TrickTally Banner](https://img.shields.io/badge/TrickTally-Call%20Break%20Tracker-success?style=for-the-badge&logo=cards)

**A modern, full-stack web application for tracking Call Break card game scores**

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=flat-square)](https://trickytally.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Render-blue?style=flat-square)](https://trickytally.onrender.com)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

[Features](#-features) • [Demo](#-demo) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Usage](#-usage) • [API](#-api-documentation) • [Contributing](#-contributing)

</div>

---

## 📖 About

**TrickTally** is a comprehensive score tracking application designed specifically for the popular card game **Call Break**. It eliminates the hassle of manual scorekeeping by providing an intuitive, mobile-responsive interface for players to track their games, analyze statistics, and learn the rules.

### 🎯 Why TrickTally?

- ✅ **No More Paper Scorecards** - Digital tracking with automatic calculations
- ✅ **Real-time Score Updates** - Instant point calculations based on calls and tricks won
- ✅ **Comprehensive Statistics** - Track player performance, trump distribution, and success rates
- ✅ **Mobile-First Design** - Play and track scores seamlessly on any device
- ✅ **Multi-Player Support** - Perfect for 4-player games (standard Call Break format)
- ✅ **Game Rules Included** - Built-in guide for new players (Prince's Guide)

---

## ✨ Features

### 🎮 Core Features

- **User Authentication** - Secure signup/login with JWT tokens
- **Session Management** - Create, view, edit, and delete game sessions
- **Smart Score Calculation** - Automatic point calculation based on Call Break rules
- **Round-by-Round Tracking** - Track each round with trump suit, calls, and tricks won
- **Player Statistics** - Comprehensive stats including success rates and total points
- **Trump Analytics** - Analyze performance by trump suit (Spades, Hearts, Diamonds, Clubs)

### 📊 Statistics & Analytics

- **Player Performance Dashboard** - Total points, calls made, tricks won, success rate
- **Trump Distribution Analysis** - Average points per round by trump suit
- **Leaderboards** - Sortable player rankings
- **Historical Data** - View all past game sessions

### 📱 User Experience

- **Responsive Design** - Optimized for mobile, tablet, and desktop
- **Intuitive UI** - Clean, modern interface with card game aesthetics
- **Dark Theme** - Eye-friendly forest green and gold color scheme
- **Touch-Optimized** - Perfect for mobile gameplay
- **Horizontal Scroll Tables** - All data accessible on small screens

### 📖 Prince's Guide

- **Game Rules** - Complete Call Break rules and instructions
- **Scoring System** - Detailed explanation with examples
- **Pro Tips** - Strategy advice for better gameplay
- **Card Suit Reference** - Visual guide to ♠ ♥ ♦ ♣

---

## 🎬 Demo

### Live Application
- **Frontend:** [https://trickytally.vercel.app](https://trickytally.vercel.app)
- **Backend API:** [https://trickytally.onrender.com](https://trickytally.onrender.com)

### Screenshots

<div align="center">

| Dashboard | Create Session | Statistics |
|-----------|---------------|------------|
| ![Dashboard](https://via.placeholder.com/300x200?text=Dashboard) | ![Create Session](https://via.placeholder.com/300x200?text=Create+Session) | ![Statistics](https://via.placeholder.com/300x200?text=Statistics) |

</div>

---

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **React Router** - Client-side routing
- **Context API** - State management
- **CSS-in-JS** - Styled components

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Secure authentication
- **bcrypt** - Password hashing

### Deployment
- **Frontend:** Vercel (Automatic deployments)
- **Backend:** Render (Free tier)
- **Database:** MongoDB Atlas (Cloud database)

---

## 🚀 Installation

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas account)
- npm or yarn

### Clone Repository

```bash
git clone https://github.com/prince-up/trickytally-.git
cd trickytally-
```

### Backend Setup

```bash
cd server
npm install

# Create .env file
cat > .env << EOF
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=development
EOF

# Start backend server
npm run dev
```

### Frontend Setup

```bash
cd client/trickyTally
npm install

# Create .env file (optional for local development)
cat > .env << EOF
VITE_API_URL=http://localhost:5000
EOF

# Start frontend development server
npm run dev
```

### Access Application

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

---

## 📚 Usage

### 1. Create Account
- Sign up with name, email, and password
- Login to access your dashboard

### 2. Start New Game Session
- Click "New Session" in navbar
- Enter session date and location
- Add player names (4 recommended)

### 3. Track Rounds
- Click "+ Add Round"
- Select trump suit (♠ ♥ ♦ ♣)
- Enter each player's call (bid)
- Enter tricks won by each player
- Points calculated automatically!

### 4. View Statistics
- Go to "Prince's Guide"
- View player performance and trump analytics
- Analyze success rates and trends

### 5. Learn the Game
- Click "Game Rules" tab in Prince's Guide
- Read comprehensive Call Break instructions
- Learn scoring system and pro tips

---

## 🔌 API Documentation

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Prince",
  "email": "prince@example.com",
  "password": "securepassword"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "prince@example.com",
  "password": "securepassword"
}
```

### Game Sessions

#### Create Session
```http
POST /api/sessions
Authorization: Bearer <token>
Content-Type: application/json

{
  "sessionDate": "2026-01-05",
  "location": "Home",
  "rounds": [
    {
      "roundNumber": 1,
      "trump": "Spades",
      "playerScores": [
        {
          "playerName": "Prince",
          "call": 5,
          "tricksWon": 5
        }
      ]
    }
  ]
}
```

#### Get All Sessions
```http
GET /api/sessions
Authorization: Bearer <token>
```

#### Get Session by ID
```http
GET /api/sessions/:id
Authorization: Bearer <token>
```

#### Update Session
```http
PUT /api/sessions/:id
Authorization: Bearer <token>
```

#### Delete Session
```http
DELETE /api/sessions/:id
Authorization: Bearer <token>
```

### Statistics

#### Player Statistics
```http
GET /api/stats/by-player
Authorization: Bearer <token>
```

#### Trump Statistics
```http
GET /api/stats/by-game
Authorization: Bearer <token>
```

#### Summary Statistics
```http
GET /api/stats/summary
Authorization: Bearer <token>
```

---

## 📁 Project Structure

```
trickytally-/
├── client/
│   └── trickyTally/
│       ├── src/
│       │   ├── components/
│       │   │   └── Navbar.tsx
│       │   ├── context/
│       │   │   └── AuthContext.tsx
│       │   ├── pages/
│       │   │   ├── Login.tsx
│       │   │   ├── Signup.tsx
│       │   │   ├── Dashboard.tsx
│       │   │   ├── CreateSession.tsx
│       │   │   ├── SessionList.tsx
│       │   │   ├── SessionDetail.tsx
│       │   │   ├── Stats.tsx
│       │   │   └── Profile.tsx
│       │   ├── config.ts
│       │   ├── App.tsx
│       │   └── main.tsx
│       ├── index.html
│       └── package.json
├── server/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── sessionController.js
│   │   └── statsController.js
│   ├── models/
│   │   ├── User.js
│   │   └── GameSession.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── sessionRoutes.js
│   │   └── statsRoutes.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   └── package.json
├── DEPLOYMENT.md
├── CLOUD_SETUP_GUIDE.md
└── README.md
```

---

## 🎮 Call Break Rules (Quick Reference)

### Objective
Win at least as many tricks as you "call" (bid) at the start of each round.

### Scoring
- **Met your call:** +1 point per trick won
- **Exceeded your call:** +1 point per trick + 0.1 per extra trick
- **Failed your call:** -1 point per trick you called

### Example
- Called 5, Won 5 → **+5 points** ✅
- Called 5, Won 7 → **+7.2 points** ✅✅
- Called 5, Won 3 → **-5 points** ❌

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Prince Yadav**

- GitHub: [@prince-up](https://github.com/prince-up)
- Email: luckyprinceyadav1234@gmail.com

---

## 🙏 Acknowledgments

- Inspired by the traditional Call Break card game
- Built with modern web technologies
- Designed for card game enthusiasts worldwide

---

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/prince-up/trickytally-/issues) page
2. Create a new issue with detailed description
3. Contact via email: luckyprinceyadav1234@gmail.com

---

## 🔮 Future Enhancements

- [ ] Real-time multiplayer support
- [ ] Social features (friend lists, challenges)
- [ ] Tournament mode
- [ ] Advanced analytics and charts
- [ ] Mobile app (React Native)
- [ ] Multiple game variants
- [ ] Export game history to PDF
- [ ] Dark/Light theme toggle

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by Prince Yadav

</div>
