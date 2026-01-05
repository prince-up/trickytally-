import React from 'react';

interface WinnerModalProps {
    winnerName: string;
    winnerScore: number;
    allPlayers: { name: string; totalPoints: number }[];
    onClose: () => void;
}

const WinnerModal: React.FC<WinnerModalProps> = ({ winnerName, winnerScore, allPlayers, onClose }) => {
    // Collection of celebratory shayari for the winner
    const shayariCollection = [
        {
            hindi: "जीत उसकी होती है जो हार नहीं मानता,",
            english: "Victory belongs to those who never give up,",
            author: "Traditional"
        },
        {
            hindi: "खेल में जीत हार तो चलती रहती है, पर जीतने का मज़ा कुछ और ही है!",
            english: "Wins and losses are part of the game, but the joy of winning is unmatched!",
            author: "Traditional"
        },
        {
            hindi: "ताश के पत्तों में छुपी है किस्मत की बाज़ी, आज तुमने जीत ली ये राज़ी!",
            english: "Fortune hides in the cards, today you've won this blessed game!",
            author: "Original"
        },
        {
            hindi: "चाल में चतुराई, दिल में जोश, यही है जीत का राज़!",
            english: "Strategy in moves, passion in heart - that's the secret of victory!",
            author: "Original"
        },
        {
            hindi: "हर Call में confidence, हर Trick में excellence - यही है champion का फ़न!",
            english: "Confidence in every call, excellence in every trick - that's the art of a champion!",
            author: "Original"
        },
        {
            hindi: "जीतने वालों की हार नहीं होती, और हारने वाले कभी जीत नहीं सकते!",
            english: "Winners never quit, and quitters never win!",
            author: "Traditional"
        }
    ];

    // Randomly select a shayari
    const selectedShayari = shayariCollection[Math.floor(Math.random() * shayariCollection.length)];

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                {/* Confetti Animation */}
                <div style={styles.confettiContainer}>
                    {[...Array(30)].map((_, i) => (
                        <div
                            key={i}
                            style={{
                                ...styles.confetti,
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 2}s`,
                                backgroundColor: ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24'][Math.floor(Math.random() * 5)],
                            }}
                        />
                    ))}
                </div>

                {/* Trophy Icon */}
                <div style={styles.trophyContainer}>
                    <div style={styles.trophy}>🏆</div>
                </div>

                {/* Winner Announcement */}
                <h1 style={styles.title}>🎉 WINNER! 🎉</h1>

                <div style={styles.winnerCard}>
                    <h2 style={styles.winnerName}>{winnerName}</h2>
                    <div style={styles.scoreContainer}>
                        <span style={styles.scoreLabel}>Final Score:</span>
                        <span style={styles.scoreValue}>{winnerScore.toFixed(1)}</span>
                    </div>
                </div>

                {/* Shayari Section */}
                <div style={styles.shayariCard}>
                    <p style={styles.shayariHindi}>{selectedShayari.hindi}</p>
                    <p style={styles.shayariEnglish}>{selectedShayari.english}</p>
                    <p style={styles.shayariAuthor}>— {selectedShayari.author}</p>
                </div>

                {/* Final Standings */}
                <div style={styles.standingsContainer}>
                    <h3 style={styles.standingsTitle}>Final Standings</h3>
                    <div style={styles.standingsList}>
                        {allPlayers
                            .sort((a, b) => b.totalPoints - a.totalPoints)
                            .map((player, index) => (
                                <div
                                    key={player.name}
                                    style={{
                                        ...styles.standingItem,
                                        backgroundColor: index === 0 ? 'rgba(255, 215, 0, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                                        border: index === 0 ? '2px solid #ffd700' : '1px solid rgba(255, 255, 255, 0.1)',
                                    }}
                                >
                                    <span style={styles.rank}>
                                        {index === 0 && '👑 '}
                                        #{index + 1}
                                    </span>
                                    <span style={styles.playerName}>{player.name}</span>
                                    <span style={{
                                        ...styles.playerScore,
                                        color: player.totalPoints >= 0 ? '#00ff00' : '#ff4444',
                                    }}>
                                        {player.totalPoints >= 0 ? '+' : ''}{player.totalPoints.toFixed(1)}
                                    </span>
                                </div>
                            ))}
                    </div>
                </div>

                {/* Close Button */}
                <button style={styles.closeBtn} onClick={onClose}>
                    🎊 Celebrate & Close 🎊
                </button>
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(5px)',
        animation: 'fadeIn 0.3s ease',
    },
    modal: {
        backgroundColor: '#1a1a2e',
        borderRadius: '20px',
        padding: 'clamp(1rem, 3vw, 2rem)',
        maxWidth: '600px',
        width: '90%',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        boxShadow: '0 20px 60px rgba(255, 215, 0, 0.3), 0 0 100px rgba(255, 215, 0, 0.1)',
        border: '3px solid #ffd700',
        animation: 'slideUp 0.5s ease',
    },
    confettiContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
        borderRadius: '20px',
    },
    confetti: {
        position: 'absolute',
        width: '10px',
        height: '10px',
        top: '-10px',
        animation: 'confettiFall 3s linear infinite',
        opacity: 0.8,
    } as React.CSSProperties,
    trophyContainer: {
        textAlign: 'center',
        marginBottom: 'clamp(0.5rem, 2vw, 1rem)',
    },
    trophy: {
        fontSize: 'clamp(3rem, 10vw, 5rem)',
        animation: 'bounce 1s ease infinite',
        display: 'inline-block',
    },
    title: {
        textAlign: 'center',
        fontSize: 'clamp(1.4rem, 5vw, 3rem)',
        fontWeight: 'bold',
        color: '#ffd700',
        marginBottom: 'clamp(0.8rem, 2vw, 1.5rem)',
        textShadow: '0 0 20px rgba(255, 215, 0, 0.5), 3px 3px 6px rgba(0,0,0,0.8)',
        letterSpacing: '2px',
    },
    winnerCard: {
        background: 'linear-gradient(135deg, #8b0000 0%, #dc143c 100%)',
        borderRadius: '12px',
        padding: 'clamp(1rem, 3vw, 2rem)',
        marginBottom: 'clamp(1rem, 2vw, 2rem)',
        textAlign: 'center',
        border: '3px solid #ffd700',
        boxShadow: '0 10px 30px rgba(255, 215, 0, 0.3)',
    },
    winnerName: {
        fontSize: 'clamp(1.3rem, 4vw, 2.5rem)',
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 'clamp(0.5rem, 1.5vw, 1rem)',
        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
        wordBreak: 'break-word',
    },
    scoreContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1rem',
        flexWrap: 'wrap',
    },
    scoreLabel: {
        fontSize: 'clamp(0.9rem, 2.5vw, 1.2rem)',
        color: '#ffd700',
        fontWeight: '600',
    },
    scoreValue: {
        fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
        fontWeight: 'bold',
        color: '#00ff00',
        textShadow: '0 0 10px rgba(0, 255, 0, 0.5), 2px 2px 4px rgba(0,0,0,0.5)',
    },
    shayariCard: {
        background: 'linear-gradient(135deg, #2d6a4f 0%, #1e5128 100%)',
        borderRadius: '12px',
        padding: 'clamp(1rem, 2.5vw, 1.5rem)',
        marginBottom: 'clamp(1rem, 2vw, 2rem)',
        border: '2px solid rgba(255, 215, 0, 0.3)',
        boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
    },
    shayariHindi: {
        fontSize: 'clamp(1rem, 3vw, 1.3rem)',
        color: '#ffd700',
        fontWeight: '600',
        marginBottom: '0.5rem',
        fontStyle: 'italic',
        textAlign: 'center',
        lineHeight: '1.6',
    },
    shayariEnglish: {
        fontSize: 'clamp(0.85rem, 2.5vw, 1.1rem)',
        color: '#b8e6d5',
        marginBottom: '1rem',
        fontStyle: 'italic',
        textAlign: 'center',
        lineHeight: '1.5',
    },
    shayariAuthor: {
        fontSize: '0.9rem',
        color: '#95d5b2',
        textAlign: 'right',
        fontWeight: '500',
    },
    standingsContainer: {
        marginBottom: 'clamp(1rem, 2vw, 2rem)',
    },
    standingsTitle: {
        fontSize: 'clamp(1.1rem, 3vw, 1.3rem)',
        color: '#ffd700',
        marginBottom: 'clamp(0.75rem, 2vw, 1rem)',
        textAlign: 'center',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '1px',
    },
    standingsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    standingItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 'clamp(0.75rem, 2vw, 1rem)',
        borderRadius: '8px',
        transition: 'all 0.3s ease',
    },
    rank: {
        fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
        fontWeight: '700',
        color: '#ffd700',
        minWidth: 'clamp(50px, 15vw, 60px)',
    },
    playerName: {
        fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)',
        color: '#ffffff',
        fontWeight: '600',
        flex: 1,
        wordBreak: 'break-word',
        paddingRight: '0.5rem',
    },
    playerScore: {
        fontSize: 'clamp(1.1rem, 3vw, 1.3rem)',
        fontWeight: 'bold',
        textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
        whiteSpace: 'nowrap',
    },
    closeBtn: {
        width: '100%',
        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        color: 'white',
        padding: 'clamp(1rem, 2.5vw, 1.25rem)',
        border: '2px solid #ffd700',
        borderRadius: '12px',
        fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
        fontWeight: '700',
        cursor: 'pointer',
        boxShadow: '0 8px 25px rgba(59,130,246,0.4)',
        transition: 'all 0.3s ease',
        textTransform: 'uppercase',
        letterSpacing: '1px',
    },
};

// Add CSS animations via a style tag
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideUp {
      from { 
        transform: translateY(50px);
        opacity: 0;
      }
      to { 
        transform: translateY(0);
        opacity: 1;
      }
    }
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-20px); }
    }
    @keyframes confettiFall {
      0% {
        transform: translateY(0) rotate(0deg);
        opacity: 1;
      }
      100% {
        transform: translateY(100vh) rotate(360deg);
        opacity: 0;
      }
    }
  `;
    if (!document.querySelector('#winner-modal-animations')) {
        styleSheet.id = 'winner-modal-animations';
        document.head.appendChild(styleSheet);
    }
}

export default WinnerModal;
