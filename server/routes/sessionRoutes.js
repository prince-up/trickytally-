const express = require('express');
const router = express.Router();
const {
    // Game operations
    createGameSession,
    getGameById,
    getUserGameHistory,
    // Player operations
    addPlayer,
    updatePlayerScore,
    // Round operations
    addRound,
    calculateRoundScore,
    updateScoresAfterRound,
    // Dashboard operations
    calculateFinalWinner,
    getDashboardStats,
    // Legacy
    getSessions,
    getSession,
    createSession,
    updateSession,
    deleteSession
} = require('../controllers/sessionController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

// 🎮 GAME OPERATIONS
router.get('/', getUserGameHistory);              // Get user's game history
router.post('/', createGameSession);              // Create new game session
router.get('/:id', getGameById);                  // Get game by ID

// 👥 PLAYER OPERATIONS
router.post('/:id/players', addPlayer);           // Add player to session
router.put('/:id/rounds/:roundIndex/players/:playerIndex', updatePlayerScore); // Update player score

// 🎲 ROUND OPERATIONS
router.post('/:id/rounds', addRound);             // Add new round
router.get('/:id/rounds/:roundIndex/calculate', calculateRoundScore); // Calculate round scores
router.put('/:id/rounds/:roundIndex/finalize', updateScoresAfterRound); // Finalize round

// 📊 DASHBOARD OPERATIONS
router.get('/:id/winner', calculateFinalWinner);  // Get final winner
router.get('/:id/stats', getDashboardStats);      // Get dashboard stats

// Legacy routes for backward compatibility
router.put('/:id', updateSession);
router.delete('/:id', deleteSession);

module.exports = router;
