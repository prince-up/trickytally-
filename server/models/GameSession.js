const mongoose = require('mongoose');

// Schema for individual round data
const roundSchema = new mongoose.Schema({
    roundNumber: {
        type: Number,
        required: true
    },
    trump: {
        type: String,
        enum: ['Spades', 'Hearts', 'Diamonds', 'Clubs'],
        default: 'Spades'
    },
    playerScores: [{
        playerName: {
            type: String,
            required: true
        },
        call: {
            type: Number,
            required: true,
            min: 0,
            max: 13
        },
        tricksWon: {
            type: Number,
            required: true,
            min: 0,
            max: 13
        },
        points: {
            type: Number,
            default: 0
        }
    }]
}, { _id: false });

// Schema for player total scores
const playerTotalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    totalPoints: {
        type: Number,
        default: 0
    },
    totalCalls: {
        type: Number,
        default: 0
    },
    totalTricksWon: {
        type: Number,
        default: 0
    },
    successfulCalls: {
        type: Number,
        default: 0
    }
}, { _id: false });

const gameSessionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        sessionDate: {
            type: Date,
            required: true,
            default: Date.now
        },
        players: [playerTotalSchema],
        rounds: [roundSchema],
        totalRounds: {
            type: Number,
            default: 0
        },
        location: {
            type: String,
            default: ''
        },
        notes: {
            type: String,
            default: ''
        }
    },
    { timestamps: true }
);

// Calculate player totals and round points before saving
// Updated to allow call values of 0
gameSessionSchema.pre('save', async function () {
    // Calculate points for each round
    this.rounds.forEach(round => {
        round.playerScores.forEach(player => {
            // Call Break scoring: 
            // If tricks >= call: points = call
            // If tricks < call: points = -(call)
            if (player.tricksWon >= player.call) {
                player.points = player.call;
            } else {
                player.points = -Math.abs(player.call);
            }
        });
    });

    // Calculate player totals
    this.players.forEach(player => {
        let totalPoints = 0;
        let totalCalls = 0;
        let totalTricksWon = 0;
        let successfulCalls = 0;

        this.rounds.forEach(round => {
            const playerScore = round.playerScores.find(ps => ps.playerName === player.name);
            if (playerScore) {
                totalPoints += playerScore.points;
                totalCalls += playerScore.call;
                totalTricksWon += playerScore.tricksWon;
                if (playerScore.tricksWon >= playerScore.call) {
                    successfulCalls++;
                }
            }
        });

        player.totalPoints = totalPoints;
        player.totalCalls = totalCalls;
        player.totalTricksWon = totalTricksWon;
        player.successfulCalls = successfulCalls;
    });

    this.totalRounds = this.rounds.length;
});

module.exports = mongoose.model('GameSession', gameSessionSchema);
