# TrickTally API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All endpoints (except auth) require JWT token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🎮 GAME OPERATIONS

### 1. Create Game Session
**POST** `/sessions`

Create a new Call Break game session.

**Request Body:**
```json
{
  "sessionDate": "2026-01-04",
  "location": "Home",
  "notes": "Friday night game",
  "rounds": [
    {
      "roundNumber": 1,
      "trump": "Spades",
      "playerScores": [
        {
          "playerName": "Player 1",
          "call": 3,
          "tricksWon": 4
        },
        {
          "playerName": "Player 2",
          "call": 2,
          "tricksWon": 2
        }
      ]
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Game session created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "sessionDate": "2026-01-04",
    "location": "Home",
    "rounds": [...],
    "playerTotals": [...]
  }
}
```

---

### 2. Get Game By ID
**GET** `/sessions/:id`

Retrieve a specific game session by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "sessionDate": "2026-01-04",
    "rounds": [...],
    "playerTotals": [...]
  }
}
```

---

### 3. Get User Game History
**GET** `/sessions`

Get all game sessions for the logged-in user, sorted by date (newest first).

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "sessionDate": "2026-01-04",
      "location": "Home",
      "playerTotals": [...]
    },
    ...
  ]
}
```

---

## 👥 PLAYER OPERATIONS

### 4. Add Player
**POST** `/sessions/:id/players`

Add a new player to an existing session (adds them to all rounds).

**Request Body:**
```json
{
  "playerName": "Player 5"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Player added successfully",
  "data": {...}
}
```

---

### 5. Update Player Score
**PUT** `/sessions/:id/rounds/:roundIndex/players/:playerIndex`

Update a player's call and tricks won in a specific round.

**URL Parameters:**
- `id`: Session ID
- `roundIndex`: Round index (0-based)
- `playerIndex`: Player index (0-based)

**Request Body:**
```json
{
  "call": 4,
  "tricksWon": 5
}
```

**Response:**
```json
{
  "success": true,
  "message": "Player score updated",
  "data": {...}
}
```

---

## 🎲 ROUND OPERATIONS

### 6. Add Round
**POST** `/sessions/:id/rounds`

Add a new round to a game session.

**Request Body:**
```json
{
  "trump": "Hearts",
  "playerScores": [
    {
      "playerName": "Player 1",
      "call": 2,
      "tricksWon": 0
    },
    {
      "playerName": "Player 2",
      "call": 3,
      "tricksWon": 3
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Round added successfully",
  "data": {...}
}
```

---

### 7. Calculate Round Score
**GET** `/sessions/:id/rounds/:roundIndex/calculate`

Calculate and return scores for a specific round (without modifying the session).

**Response:**
```json
{
  "success": true,
  "roundNumber": 1,
  "trump": "Spades",
  "data": [
    {
      "playerName": "Player 1",
      "call": 3,
      "tricksWon": 4,
      "points": 3
    },
    {
      "playerName": "Player 2",
      "call": 2,
      "tricksWon": 1,
      "points": -2
    }
  ]
}
```

---

### 8. Update Scores After Round
**PUT** `/sessions/:id/rounds/:roundIndex/finalize`

Recalculate all scores and totals after round completion.

**Response:**
```json
{
  "success": true,
  "message": "Scores updated successfully",
  "data": {...}
}
```

---

## 📊 DASHBOARD OPERATIONS

### 9. Calculate Final Winner
**GET** `/sessions/:id/winner`

Get the winner and full leaderboard for a session.

**Response:**
```json
{
  "success": true,
  "winner": {
    "playerName": "Player 1",
    "totalPoints": 42,
    "rank": 1
  },
  "leaderboard": [
    {
      "rank": 1,
      "playerName": "Player 1",
      "totalPoints": 42
    },
    {
      "rank": 2,
      "playerName": "Player 2",
      "totalPoints": 38
    },
    {
      "rank": 3,
      "playerName": "Player 3",
      "totalPoints": 25
    }
  ]
}
```

---

### 10. Get Dashboard Stats
**GET** `/sessions/:id/stats`

Get comprehensive statistics for a game session.

**Response:**
```json
{
  "success": true,
  "data": {
    "sessionInfo": {
      "sessionDate": "2026-01-04",
      "location": "Home",
      "totalRounds": 8,
      "totalPlayers": 4
    },
    "trumpDistribution": {
      "Spades": 3,
      "Hearts": 2,
      "Diamonds": 2,
      "Clubs": 1
    },
    "playerStats": [
      {
        "playerName": "Player 1",
        "totalPoints": 42,
        "successfulCalls": 7,
        "failedCalls": 1,
        "successRate": "87.5%"
      },
      {
        "playerName": "Player 2",
        "totalPoints": 38,
        "successfulCalls": 6,
        "failedCalls": 2,
        "successRate": "75.0%"
      }
    ]
  }
}
```

---

## 🔐 AUTHENTICATION ENDPOINTS

### Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "user@example.com"
  }
}
```

---

### Signup
**POST** `/auth/signup`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "user@example.com"
  }
}
```

---

## 📈 STATISTICS ENDPOINTS

### Get Overall Stats
**GET** `/stats`

Get overall statistics across all user's sessions.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalSessions": 12,
    "totalRounds": 96,
    "trumpStats": {
      "Spades": 28,
      "Hearts": 24,
      "Diamonds": 22,
      "Clubs": 22
    },
    "topPlayers": [...]
  }
}
```

---

## 🎯 Call Break Scoring Rules

**Implemented in the backend automatically:**

1. **Successful Call**: If `tricksWon >= call` → Points = `+call`
2. **Failed Call**: If `tricksWon < call` → Points = `-call`

**Example:**
- Player calls 3, wins 4 tricks → **+3 points**
- Player calls 3, wins 2 tricks → **-3 points**
- Player calls 5, wins 5 tricks → **+5 points**

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Server Error

---

## Notes

- All routes except `/auth/*` require authentication
- Session belongs to the user who created it
- Points are automatically calculated using Call Break rules
- `playerTotals` are recalculated on every save (Mongoose pre-save hook)
- Round indices and player indices are **0-based** in API calls
