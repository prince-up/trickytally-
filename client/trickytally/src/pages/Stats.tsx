import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API_URL from '../config';
import Navbar from '../components/Navbar';

interface TrumpStats {
  rounds: number;
  totalPoints: number;
}

interface PlayerStats {
  totalPoints: number;
  totalCalls: number;
  totalTricksWon: number;
  successfulCalls: number;
}

const Stats = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [trumpStats, setTrumpStats] = useState<{ [key: string]: TrumpStats }>({});
  const [playerStats, setPlayerStats] = useState<{ [key: string]: PlayerStats }>({});
  const [activeTab, setActiveTab] = useState<'stats' | 'rules'>('stats');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [playerRes, trumpRes] = await Promise.all([
        fetch(`${API_URL}/api/stats/by-player`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/api/stats/by-game`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (playerRes.ok) {
        const playerData = await playerRes.json();
        if (playerData.success) setPlayerStats(playerData.data || {});
      }

      if (trumpRes.ok) {
        const trumpData = await trumpRes.json();
        if (trumpData.success) setTrumpStats(trumpData.data || {});
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setPlayerStats({});
      setTrumpStats({});
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={styles.container}>
          <p>Loading...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h1 style={styles.title}>👑 Prince's Guide</h1>

        {/* Tab Navigation */}
        <div style={styles.tabContainer}>
          <button
            onClick={() => setActiveTab('stats')}
            style={{
              ...styles.tabButton,
              ...(activeTab === 'stats' ? styles.activeTab : {}),
            }}
          >
            📊 Statistics
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            style={{
              ...styles.tabButton,
              ...(activeTab === 'rules' ? styles.activeTab : {}),
            }}
          >
            📖 Game Rules
          </button>
        </div>

        {/* Statistics Tab */}
        {activeTab === 'stats' && (
          <>
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>Trump Statistics</h2>
              <div style={styles.gameGrid}>
                {Object.entries(trumpStats).map(([trump, stats]) => (
                  <div key={trump} style={styles.gameCard}>
                    <h3 style={styles.gameTitle}>{trump}</h3>
                    <div style={styles.statRow}>
                      <span style={styles.statLabel}>Rounds:</span>
                      <span style={styles.statValue}>{stats.rounds}</span>
                    </div>
                    <div style={styles.statRow}>
                      <span style={styles.statLabel}>Avg Points/Round:</span>
                      <span style={styles.statValue}>
                        {stats.rounds > 0 ? (stats.totalPoints / stats.rounds).toFixed(1) : 0}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {Object.keys(trumpStats).length === 0 && (
                <p style={styles.emptyText}>No trump data available</p>
              )}
            </section>

            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>Player Performance</h2>
              <div style={{ overflowX: 'auto' }}>
                {Object.keys(playerStats).length > 0 ? (
                  <table style={styles.table}>
                    <thead>
                      <tr style={styles.tableHeader}>
                        <th style={styles.th}>Player</th>
                        <th style={styles.th}>Total Points</th>
                        <th style={styles.th}>Calls Made</th>
                        <th style={styles.th}>Tricks Won</th>
                        <th style={styles.th}>Success Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(playerStats)
                        .sort((a, b) => b[1].totalPoints - a[1].totalPoints)
                        .map(([playerName, stats]) => {
                          const successRate = stats.totalCalls > 0
                            ? ((stats.successfulCalls / stats.totalCalls) * 100).toFixed(1)
                            : '0.0';

                          return (
                            <tr key={playerName} style={styles.tr}>
                              <td style={styles.td}>{playerName}</td>
                              <td style={styles.td}>{stats.totalPoints}</td>
                              <td style={styles.td}>{stats.totalCalls}</td>
                              <td style={styles.td}>{stats.totalTricksWon}</td>
                              <td style={styles.td}>{successRate}%</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                ) : (
                  <p style={styles.emptyText}>No player data available</p>
                )}
              </div>
            </section>
          </>
        )}

        {/* Rules Tab */}
        {activeTab === 'rules' && (
          <div style={styles.rulesContainer}>
            <h2 style={styles.rulesTitle}>🎴 How to Play Call Break</h2>

            <div style={styles.ruleSection}>
              <h3 style={styles.ruleHeading}>🎯 Objective</h3>
              <p style={styles.ruleText}>
                Call Break is a trick-taking card game. The goal is to win at least as many tricks as you "call" (bid) at the start of each round.
              </p>
            </div>

            <div style={styles.ruleSection}>
              <h3 style={styles.ruleHeading}>👥 Players & Deck</h3>
              <p style={styles.ruleText}>
                • <strong>Players:</strong> 4 players (recommended)<br />
                • <strong>Deck:</strong> Standard 52-card deck<br />
                • <strong>Card Ranking:</strong> A (highest) → K → Q → J → 10 → 9 → 8 → 7 → 6 → 5 → 4 → 3 → 2 (lowest)
              </p>
              <div style={styles.cardSuits}>
                <span style={styles.spade}>♠ Spades</span>
                <span style={styles.heart}>♥ Hearts</span>
                <span style={styles.diamond}>♦ Diamonds</span>
                <span style={styles.club}>♣ Clubs</span>
              </div>
            </div>

            <div style={styles.ruleSection}>
              <h3 style={styles.ruleHeading}>🃏 Game Setup</h3>
              <p style={styles.ruleText}>
                1. Each player is dealt <strong>13 cards</strong><br />
                2. One suit is chosen as the <strong>Trump</strong> (usually Spades ♠)<br />
                3. Players make their <strong>Call</strong> (bid) - how many tricks they think they'll win (0-13)
              </p>
            </div>

            <div style={styles.ruleSection}>
              <h3 style={styles.ruleHeading}>🎮 How to Play</h3>
              <p style={styles.ruleText}>
                1. <strong>First player</strong> leads with any card<br />
                2. Other players must <strong>follow suit</strong> if possible<br />
                3. If you can't follow suit, you can play a <strong>Trump card</strong> (♠) to win<br />
                4. <strong>Highest card of the led suit wins</strong> (unless a Trump is played)<br />
                5. <strong>Highest Trump wins</strong> if multiple Trumps are played<br />
                6. Winner of the trick leads the next round
              </p>
            </div>

            <div style={styles.ruleSection}>
              <h3 style={styles.ruleHeading}>💰 Scoring</h3>
              <p style={styles.ruleText}>
                • <strong>Met your call:</strong> +1 point per trick won<br />
                • <strong>Exceeded your call:</strong> +1 point per trick + 0.1 per extra trick<br />
                • <strong>Failed your call:</strong> -1 point per trick you called<br />
                <br />
                <strong>Example:</strong><br />
                - Called 5, Won 5 → +5 points ✅<br />
                - Called 5, Won 7 → +7.2 points ✅✅<br />
                - Called 5, Won 3 → -5 points ❌
              </p>
            </div>

            <div style={styles.ruleSection}>
              <h3 style={styles.ruleHeading}>🏆 Winning</h3>
              <p style={styles.ruleText}>
                The player with the <strong>highest total points</strong> after all rounds wins the game!
              </p>
            </div>

            <div style={styles.ruleSection}>
              <h3 style={styles.ruleHeading}>💡 Pro Tips</h3>
              <p style={styles.ruleText}>
                • Trump cards (♠) are powerful - use them wisely!<br />
                • Count cards to know what's been played<br />
                • Be realistic with your call - it's better to meet a small call than fail a big one<br />
                • Watch what other players are playing to predict their hands
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '1rem',
    background: 'linear-gradient(135deg, #0f5132 0%, #1a4d2e 50%, #0f5132 100%)',
    minHeight: '100vh',
  },
  title: {
    fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    color: '#ffd700',
    textAlign: 'center',
    textShadow: '3px 3px 6px rgba(0,0,0,0.5)',
  },
  tabContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginBottom: '2rem',
    flexWrap: 'wrap',
  },
  tabButton: {
    padding: '0.75rem 1.5rem',
    fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
    fontWeight: '600',
    border: '3px solid #ffd700',
    borderRadius: '10px',
    backgroundColor: '#2d6a4f',
    color: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  activeTab: {
    backgroundColor: '#ffd700',
    color: '#000000',
    transform: 'scale(1.05)',
  },
  section: {
    marginBottom: '3rem',
  },
  sectionTitle: {
    fontSize: 'clamp(1.3rem, 4vw, 1.8rem)',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    color: '#ffd700',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
  },
  gameGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
  },
  gameCard: {
    backgroundColor: '#2d6a4f',
    padding: '1.5rem',
    borderRadius: '12px',
    border: '2px solid #ffd700',
  },
  gameTitle: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    color: '#ffd700',
    marginBottom: '1rem',
  },
  statRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5rem',
  },
  statLabel: {
    color: '#b8e6d5',
  },
  statValue: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  table: {
    width: '100%',
    minWidth: '500px',
    borderCollapse: 'collapse',
    backgroundColor: '#2d6a4f',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  tableHeader: {
    backgroundColor: '#1e5128',
  },
  th: {
    padding: '1rem',
    textAlign: 'left',
    color: '#ffd700',
    fontWeight: 'bold',
    borderBottom: '2px solid #ffd700',
  },
  tr: {
    borderBottom: '1px solid rgba(255,215,0,0.2)',
  },
  td: {
    padding: '1rem',
    color: '#ffffff',
  },
  emptyText: {
    textAlign: 'center',
    color: '#b8e6d5',
    fontSize: '1.1rem',
    padding: '2rem',
  },
  rulesContainer: {
    backgroundColor: '#2d6a4f',
    padding: '2rem',
    borderRadius: '16px',
    border: '3px solid #ffd700',
  },
  rulesTitle: {
    fontSize: 'clamp(1.5rem, 5vw, 2.2rem)',
    fontWeight: 'bold',
    color: '#ffd700',
    textAlign: 'center',
    marginBottom: '2rem',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
  },
  ruleSection: {
    marginBottom: '2rem',
    padding: '1.5rem',
    backgroundColor: '#1e5128',
    borderRadius: '12px',
    border: '2px solid rgba(255,215,0,0.3)',
  },
  ruleHeading: {
    fontSize: 'clamp(1.1rem, 3vw, 1.5rem)',
    fontWeight: 'bold',
    color: '#ffd700',
    marginBottom: '1rem',
  },
  ruleText: {
    color: '#ffffff',
    fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
    lineHeight: '1.8',
    margin: 0,
  },
  cardSuits: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: '1rem',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  spade: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#000000',
    backgroundColor: '#ffffff',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
  },
  heart: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#ff0000',
    backgroundColor: '#ffffff',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
  },
  diamond: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#ff0000',
    backgroundColor: '#ffffff',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
  },
  club: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#000000',
    backgroundColor: '#ffffff',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
  },
};

export default Stats;
