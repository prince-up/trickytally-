const GameSession = require('../models/GameSession');

// 🎮 GAME OPERATIONS

// @desc    Create new game session
// @route   POST /api/sessions
// @access  Private
exports.createGameSession = async (req, res) => {
    try {
        console.log('📝 Creating game session...');
        console.log('User ID:', req.user.id);
        console.log('Request body:', JSON.stringify(req.body, null, 2));
        
        const sessionData = {
            ...req.body,
            userId: req.user.id
        };

        const session = await GameSession.create(sessionData);
        console.log('✅ Session created:', session._id);

        res.status(201).json({
            success: true,
            message: 'Game session created successfully',
            data: session
        });
    } catch (error) {
        console.error('❌ Error creating session:', error.message);
        console.error('Error name:', error.name);
        if (error.errors) {
            console.error('Validation errors:', JSON.stringify(error.errors, null, 2));
        }
        console.error('Full error:', error);
        res.status(400).json({
            success: false,
            message: 'Error creating game session',
            error: error.message,
            details: error.errors || {}
        });
    }
};

// @desc    Get single game session by ID
// @route   GET /api/sessions/:id
// @access  Private
exports.getGameById = async (req, res) => {
    try {
        const session = await GameSession.findById(req.params.id);

        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Game session not found'
            });
        }

        // Check if session belongs to logged-in user
        if (session.userId.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this game'
            });
        }

        res.status(200).json({
            success: true,
            data: session
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching game session',
            error: error.message
        });
    }
};

// @desc    Get user's game history
// @route   GET /api/sessions
// @access  Private
exports.getUserGameHistory = async (req, res) => {
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
            message: 'Error fetching game history',
            error: error.message
        });
    }
};

// 👥 PLAYER OPERATIONS

// @desc    Add player to session
// @route   POST /api/sessions/:id/players
// @access  Private
exports.addPlayer = async (req, res) => {
    try {
        const session = await GameSession.findById(req.params.id);

        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Session not found'
            });
        }

        if (session.userId.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized'
            });
        }

        const { playerName } = req.body;

        // Add player to all existing rounds
        session.rounds.forEach(round => {
            round.playerScores.push({
                playerName,
                call: 1,
                tricksWon: 0,
                points: -1
            });
        });

        await session.save();

        res.status(200).json({
            success: true,
            message: 'Player added successfully',
            data: session
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error adding player',
            error: error.message
        });
    }
};

// @desc    Update player score in a specific round
// @route   PUT /api/sessions/:id/rounds/:roundIndex/players/:playerIndex
// @access  Private
exports.updatePlayerScore = async (req, res) => {
    try {
        const { id, roundIndex, playerIndex } = req.params;
        const { call, tricksWon } = req.body;

        const session = await GameSession.findById(id);

        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Session not found'
            });
        }

        if (session.userId.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized'
            });
        }

        const round = session.rounds[roundIndex];
        if (!round) {
            return res.status(404).json({
                success: false,
                message: 'Round not found'
            });
        }

        const playerScore = round.playerScores[playerIndex];
        if (!playerScore) {
            return res.status(404).json({
                success: false,
                message: 'Player not found'
            });
        }

        // Update scores
        if (call !== undefined) playerScore.call = call;
        if (tricksWon !== undefined) playerScore.tricksWon = tricksWon;

        await session.save(); // This triggers pre-save hook to recalculate points

        res.status(200).json({
            success: true,
            message: 'Player score updated',
            data: session
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating player score',
            error: error.message
        });
    }
};

// 🎲 ROUND OPERATIONS

// @desc    Add new round to session
// @route   POST /api/sessions/:id/rounds
// @access  Private
exports.addRound = async (req, res) => {
    try {
        const session = await GameSession.findById(req.params.id);

        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Session not found'
            });
        }

        if (session.userId.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized'
            });
        }

        const { trump, playerScores } = req.body;

        session.rounds.push({
            roundNumber: session.rounds.length + 1,
            trump: trump || 'Spades',
            playerScores: playerScores || []
        });

        await session.save();

        res.status(200).json({
            success: true,
            message: 'Round added successfully',
            data: session
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error adding round',
            error: error.message
        });
    }
};

// @desc    Calculate round score (Call Break rules)
// @route   GET /api/sessions/:id/rounds/:roundIndex/calculate
// @access  Private
exports.calculateRoundScore = async (req, res) => {
    try {
        const { id, roundIndex } = req.params;
        const session = await GameSession.findById(id);

        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Session not found'
            });
        }

        if (session.userId.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized'
            });
        }

        const round = session.rounds[roundIndex];
        if (!round) {
            return res.status(404).json({
                success: false,
                message: 'Round not found'
            });
        }

        // Calculate points for each player in this round
        const roundScores = round.playerScores.map(ps => ({
            playerName: ps.playerName,
            call: ps.call,
            tricksWon: ps.tricksWon,
            points: ps.tricksWon >= ps.call ? ps.call : -ps.call
        }));

        res.status(200).json({
            success: true,
            roundNumber: round.roundNumber,
            trump: round.trump,
            data: roundScores
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error calculating round score',
            error: error.message
        });
    }
};

// @desc    Update all scores after round completion
// @route   PUT /api/sessions/:id/rounds/:roundIndex/finalize
// @access  Private
exports.updateScoresAfterRound = async (req, res) => {
    try {
        const { id, roundIndex } = req.params;
        const session = await GameSession.findById(id);

        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Session not found'
            });
        }

        if (session.userId.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized'
            });
        }

        await session.save(); // Triggers pre-save hook to recalculate everything

        res.status(200).json({
            success: true,
            message: 'Scores updated successfully',
            data: session
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating scores',
            error: error.message
        });
    }
};

// 📊 DASHBOARD OPERATIONS

// @desc    Calculate final winner of a session
// @route   GET /api/sessions/:id/winner
// @access  Private
exports.calculateFinalWinner = async (req, res) => {
    try {
        const session = await GameSession.findById(req.params.id);

        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Session not found'
            });
        }

        if (session.userId.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized'
            });
        }

        // playerTotals are already calculated by pre-save hook
        const sortedPlayers = session.playerTotals
            .sort((a, b) => b.totalPoints - a.totalPoints);

        const winner = sortedPlayers[0];

        res.status(200).json({
            success: true,
            winner: {
                playerName: winner.playerName,
                totalPoints: winner.totalPoints,
                rank: 1
            },
            leaderboard: sortedPlayers.map((player, index) => ({
                rank: index + 1,
                playerName: player.playerName,
                totalPoints: player.totalPoints
            }))
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error calculating winner',
            error: error.message
        });
    }
};

// @desc    Get dashboard statistics
// @route   GET /api/sessions/:id/stats
// @access  Private
exports.getDashboardStats = async (req, res) => {
    try {
        const session = await GameSession.findById(req.params.id);

        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Session not found'
            });
        }

        if (session.userId.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized'
            });
        }

        // Calculate statistics
        const stats = {
            sessionInfo: {
                sessionDate: session.sessionDate,
                location: session.location,
                totalRounds: session.rounds.length,
                totalPlayers: session.playerTotals.length
            },
            trumpDistribution: {
                Spades: session.rounds.filter(r => r.trump === 'Spades').length,
                Hearts: session.rounds.filter(r => r.trump === 'Hearts').length,
                Diamonds: session.rounds.filter(r => r.trump === 'Diamonds').length,
                Clubs: session.rounds.filter(r => r.trump === 'Clubs').length
            },
            playerStats: session.playerTotals.map(player => {
                const playerRounds = session.rounds.map(round => 
                    round.playerScores.find(ps => ps.playerName === player.playerName)
                ).filter(Boolean);

                const successfulCalls = playerRounds.filter(pr => pr.tricksWon >= pr.call).length;
                const failedCalls = playerRounds.filter(pr => pr.tricksWon < pr.call).length;

                return {
                    playerName: player.playerName,
                    totalPoints: player.totalPoints,
                    successfulCalls,
                    failedCalls,
                    successRate: playerRounds.length > 0 
                        ? ((successfulCalls / playerRounds.length) * 100).toFixed(1) + '%'
                        : '0%'
                };
            }).sort((a, b) => b.totalPoints - a.totalPoints)
        };

        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error fetching dashboard stats',
            error: error.message
        });
    }
};

// Legacy/Alias methods for backward compatibility
exports.getSessions = exports.getUserGameHistory;
exports.getSession = exports.getGameById;
exports.createSession = exports.createGameSession;

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
