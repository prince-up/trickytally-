const GameSession = require('../models/GameSession');

// @desc    Get overall statistics
// @route   GET /api/stats/summary
// @access  Private
exports.getSummary = async (req, res) => {
    try {
        const sessions = await GameSession.find({ userId: req.user.id });

        let totalRounds = 0;
        let totalCalls = 0;
        let totalSuccessfulCalls = 0;

        sessions.forEach(session => {
            totalRounds += session.totalRounds;
            session.players.forEach(player => {
                totalCalls += session.totalRounds; // Each player calls each round
                totalSuccessfulCalls += player.successfulCalls;
            });
        });

        const successRate = totalCalls > 0 ? ((totalSuccessfulCalls / totalCalls) * 100).toFixed(1) : 0;

        res.status(200).json({
            success: true,
            data: {
                totalSessions: sessions.length,
                totalRounds,
                totalCalls,
                totalSuccessfulCalls,
                successRate,
                recentSessions: sessions.slice(0, 5)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching statistics',
            error: error.message
        });
    }
};

// @desc    Get trump statistics
// @route   GET /api/stats/by-game
// @access  Private
exports.getByGameType = async (req, res) => {
    try {
        const sessions = await GameSession.find({ userId: req.user.id });

        const trumpStats = {
            'Spades': { rounds: 0, totalPoints: 0 },
            'Hearts': { rounds: 0, totalPoints: 0 },
            'Diamonds': { rounds: 0, totalPoints: 0 },
            'Clubs': { rounds: 0, totalPoints: 0 }
        };

        sessions.forEach(session => {
            session.rounds.forEach(round => {
                trumpStats[round.trump].rounds++;
                round.playerScores.forEach(ps => {
                    trumpStats[round.trump].totalPoints += ps.points;
                });
            });
        });

        res.status(200).json({
            success: true,
            data: trumpStats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching trump stats',
            error: error.message
        });
    }
};

// @desc    Get stats by player
// @route   GET /api/stats/by-player
// @access  Private
exports.getByPlayer = async (req, res) => {
    try {
        const sessions = await GameSession.find({ userId: req.user.id });

        const playerStats = {};

        sessions.forEach(session => {
            session.players.forEach(player => {
                if (!playerStats[player.name]) {
                    playerStats[player.name] = {
                        gamesPlayed: 0,
                        totalPoints: 0,
                        totalCalls: 0,
                        totalTricksWon: 0,
                        successfulCalls: 0,
                        successRate: 0
                    };
                }

                playerStats[player.name].gamesPlayed++;
                playerStats[player.name].totalPoints += player.totalPoints;
                playerStats[player.name].totalCalls += player.totalCalls;
                playerStats[player.name].totalTricksWon += player.totalTricksWon;
                playerStats[player.name].successfulCalls += player.successfulCalls;
            });
        });

        // Calculate success rate for each player
        Object.keys(playerStats).forEach(playerName => {
            const stats = playerStats[playerName];
            stats.successRate = stats.totalCalls > 0 
                ? ((stats.successfulCalls / stats.totalCalls) * 100).toFixed(1)
                : 0;
        });

        res.status(200).json({
            success: true,
            data: playerStats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching player stats',
            error: error.message
        });
    }
};
