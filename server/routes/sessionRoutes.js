const express = require('express');
const router = express.Router();
const {
    getSessions,
    getSession,
    createSession,
    updateSession,
    deleteSession
} = require('../controllers/sessionController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

router.route('/')
    .get(getSessions)
    .post(createSession);

router.route('/:id')
    .get(getSession)
    .put(updateSession)
    .delete(deleteSession);

module.exports = router;
