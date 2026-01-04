const express = require('express');
const router = express.Router();
const {
    getSummary,
    getByGameType,
    getByPlayer
} = require('../controllers/statsController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

router.get('/summary', getSummary);
router.get('/by-game', getByGameType);
router.get('/by-player', getByPlayer);

module.exports = router;
