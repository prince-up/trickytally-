const GameSession = require('../models/GameSession');

// @desc    Get all sessions for logged-in user
// @route   GET /api/sessions
// @access  Private
exports.getSessions = async (req, res) => {
    try {
        const sessions = await GameSession.find({ userId: req.user.id })
            .sort({ sessionDate: -1 });
        
        res.status(200).json({
            success: true,
            count: sessions.length,
            data: sessions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching sessions',
            error: error.message
        });
    }
};

// @desc    Get single session by ID
// @route   GET /api/sessions/:id
// @access  Private
exports.getSession = async (req, res) => {
    try {
        const session = await GameSession.findById(req.params.id);

        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Session not found'
            });
        }

        // Check if session belongs to logged-in user
        if (session.userId.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this session'
            });
        }

        res.status(200).json({
            success: true,
            data: session
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching session',
            error: error.message
        });
    }
};

// @desc    Create new game session
// @route   POST /api/sessions
// @access  Private
exports.createSession = async (req, res) => {
    try {
        const sessionData = {
            ...req.body,
            userId: req.user.id
        };

        const session = await GameSession.create(sessionData);

        res.status(201).json({
            success: true,
            message: 'Session created successfully',
            data: session
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating session',
            error: error.message
        });
    }
};

// @desc    Update game session
// @route   PUT /api/sessions/:id
// @access  Private
exports.updateSession = async (req, res) => {
    try {
        let session = await GameSession.findById(req.params.id);

        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Session not found'
            });
        }

        // Check if session belongs to logged-in user
        if (session.userId.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to update this session'
            });
        }

        session = await GameSession.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            success: true,
            message: 'Session updated successfully',
            data: session
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating session',
            error: error.message
        });
    }
};

// @desc    Delete game session
// @route   DELETE /api/sessions/:id
// @access  Private
exports.deleteSession = async (req, res) => {
    try {
        const session = await GameSession.findById(req.params.id);

        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Session not found'
            });
        }

        // Check if session belongs to logged-in user
        if (session.userId.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to delete this session'
            });
        }

        await session.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Session deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting session',
            error: error.message
        });
    }
};
