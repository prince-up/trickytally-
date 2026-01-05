import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API_URL from '../config';
import Navbar from '../components/Navbar';
import WinnerModal from '../components/WinnerModal';

interface PlayerScore {
  playerName: string;
  call: number;
  tricksWon: number;
  points: number;
}

interface Round {
  roundNumber: number;
  trump: string;
  playerScores: PlayerScore[];
}

interface Player {
  name: string;
  totalPoints: number;
  totalCalls: number;
  totalTricksWon: number;
  successfulCalls: number;
}

interface Session {
  _id: string;
  sessionDate: string;
  players: Player[];
  rounds: Round[];
  totalRounds: number;
  location: string;
  notes: string;
}

const SessionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [showWinnerModal, setShowWinnerModal] = useState(false);

  useEffect(() => {
    fetchSession();
  }, [id]);

  const fetchSession = async () => {
    try {
      const response = await fetch(`${API_URL}/api/sessions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setSession(data.data);
      }
    } catch (error) {
      console.error('Error fetching session:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this session?')) return;

    try {
      const response = await fetch(`${API_URL}/api/sessions/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        navigate('/sessions');
      }
    } catch (error) {
      console.error('Error deleting session:', error);
      alert('Failed to delete session');
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

  if (!session) {
    return (
      <>
        <Navbar />
        <div style={styles.container}>
          <p>Session not found</p>
          <Link to="/sessions" style={styles.backLink}>
            ← Back to Sessions
          </Link>
        </div>
      </>
    );
  }

  const winner = session.players.reduce((max, p) =>
    p.totalPoints > max.totalPoints ? p : max, session.players[0]);

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <Link to="/sessions" style={styles.backLink}>
          ← Back to Sessions
        </Link>

        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Call Break Session</h1>
            <p style={styles.date}>
              {new Date(session.sessionDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div style={styles.actionButtons}>
            <button
              type="button"
              onClick={() => setShowWinnerModal(true)}
              style={styles.winnerBtn}
            >
              🏆 Declare Winner
            </button>
            <button onClick={handleDelete} style={styles.deleteBtn}>
              Delete Session
            </button>
          </div>
        </div>

        <div style={styles.grid}>
          <div style={styles.infoCard}>
            <h3 style={styles.infoLabel}>Total Rounds</h3>
            <p style={styles.infoValue}>{session.totalRounds}</p>
          </div>
          <div style={styles.infoCard}>
            <h3 style={styles.infoLabel}>Players</h3>
            <p style={styles.infoValue}>{session.players.length}</p>
          </div>
          <div style={styles.infoCard}>
            <h3 style={styles.infoLabel}>Location</h3>
            <p style={styles.infoValue}>{session.location || 'Not specified'}</p>
          </div>
          <div style={styles.infoCard}>
            <h3 style={styles.infoLabel}>Winner</h3>
            <p style={styles.infoValue}>{winner?.name}</p>
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Final Standings</h2>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>Rank</th>
                  <th style={styles.th}>Player</th>
                  <th style={styles.th}>Total Points</th>
                  <th style={styles.th}>Calls Made</th>
                  <th style={styles.th}>Tricks Won</th>
                  <th style={styles.th}>Success Rate</th>
                </tr>
              </thead>
              <tbody>
                {session.players
                  .sort((a, b) => b.totalPoints - a.totalPoints)
                  .map((player, index) => {
                    const successRate = player.totalCalls > 0
                      ? ((player.successfulCalls / (session.totalRounds || 1)) * 100).toFixed(0)
                      : 0;

                    return (
                      <tr key={index} style={styles.tableRow}>
                        <td style={styles.td}>
                          {index === 0 && <span style={styles.winnerBadge}>🏆 </span>}
                          #{index + 1}
                        </td>
                        <td style={styles.td}>{player.name}</td>
                        <td
                          style={{
                            ...styles.td,
                            color: player.totalPoints >= 0 ? '#10b981' : '#ef4444',
                            fontWeight: 'bold',
                          }}
                        >
                          {player.totalPoints.toFixed(1)}
                        </td>
                        <td style={styles.td}>{player.totalCalls}</td>
                        <td style={styles.td}>{player.totalTricksWon}</td>
                        <td style={styles.td}>{successRate}%</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Round-by-Round Details</h2>
          {session.rounds && session.rounds.length > 0 ? (
            session.rounds.map((round) => (
              <div key={round.roundNumber} style={styles.roundCard}>
                <h3 style={styles.roundTitle}>
                  Round {round.roundNumber} - Trump: {round.trump}
                </h3>
                <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                  <table style={styles.table}>
                    <thead>
                      <tr style={styles.tableHeader}>
                        <th style={styles.th}>Player</th>
                        <th style={styles.th}>Call</th>
                        <th style={styles.th}>Tricks Won</th>
                        <th style={styles.th}>Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {round.playerScores.map((ps, idx) => (
                        <tr key={idx} style={styles.tableRow}>
                          <td style={styles.td}>{ps.playerName}</td>
                          <td style={styles.td}>{ps.call}</td>
                          <td style={styles.td}>{ps.tricksWon}</td>
                          <td
                            style={{
                              ...styles.td,
                              color: ps.points >= 0 ? '#00ff00' : '#ff4444',
                              fontWeight: 'bold',
                              textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                            }}
                          >
                            {ps.points >= 0 ? '+' : ''}{ps.points.toFixed(1)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          ) : (
            <p style={styles.noData}>No round data available</p>
          )}
        </div>

        {session.notes && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Notes</h2>
            <div style={styles.notesCard}>
              <p style={styles.notesText}>{session.notes}</p>
            </div>
          </div>
        )}

        {showWinnerModal && (
          <WinnerModal
            winnerName={winner.name}
            winnerScore={winner.totalPoints}
            allPlayers={session.players}
            onClose={() => setShowWinnerModal(false)}
          />
        )}
      </div>
    </>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '1rem',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f5132 0%, #1a4d2e 50%, #0f5132 100%)',
    backgroundImage: `
      radial-gradient(circle at 20% 30%, rgba(255,255,255,0.03) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(255,255,255,0.03) 0%, transparent 50%)
    `,
  },
  backLink: {
    color: '#ffd700',
    textDecoration: 'none',
    fontSize: '1.05rem',
    marginBottom: '1rem',
    display: 'inline-block',
    fontWeight: '600',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    border: '2px solid #ffd700',
    backgroundColor: 'rgba(255,215,0,0.1)',
    transition: 'all 0.3s ease',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  actionButtons: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
    marginTop: '0.5rem',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#ffd700',
    marginBottom: '0.5rem',
    textShadow: '3px 3px 6px rgba(0,0,0,0.5)',
  },
  date: {
    color: '#b8e6d5',
    fontSize: '1.1rem',
    fontWeight: '500',
  },
  deleteBtn: {
    background: 'linear-gradient(135deg, #8b0000 0%, #dc143c 100%)',
    color: '#ffffff',
    padding: '0.875rem 1.75rem',
    border: '2px solid #ffd700',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '700',
    boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
    transition: 'all 0.3s ease',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem',
  },
  infoCard: {
    backgroundColor: '#2d6a4f',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
    border: '3px solid #ffd700',
    textAlign: 'center',
  },
  infoLabel: {
    color: '#ffd700',
    fontSize: '0.9rem',
    fontWeight: '700',
    marginBottom: '0.5rem',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  infoValue: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#ffffff',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
  },
  section: {
    marginBottom: '2rem',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#ffd700',
    marginBottom: '1rem',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1rem',
  },
  summaryCard: {
    backgroundColor: '#2d6a4f',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
    border: '2px solid rgba(255,215,0,0.3)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  summaryLabel: {
    color: '#b8e6d5',
    fontSize: '0.95rem',
    marginBottom: '0.5rem',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#ffffff',
  },
  tableContainer: {
    backgroundColor: '#2d6a4f',
    borderRadius: '12px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
    border: '3px solid #ffd700',
    overflow: 'auto',
  },
  roundCard: {
    backgroundColor: '#2d6a4f',
    padding: '1.75rem',
    borderRadius: '12px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
    border: '3px solid #ffd700',
    marginBottom: '1.5rem',
  },
  roundTitle: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    color: '#ffd700',
    marginBottom: '1rem',
    textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
  },
  noData: {
    textAlign: 'center',
    padding: '2rem',
    color: '#ffd700',
    backgroundColor: '#2d6a4f',
    borderRadius: '12px',
    border: '2px solid #ffd700',
  },
  table: {
    width: '100%',
    minWidth: '400px',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    background: 'linear-gradient(135deg, #8b0000 0%, #dc143c 100%)',
  },
  th: {
    padding: '1.2rem',
    textAlign: 'left',
    fontWeight: '700',
    color: '#ffd700',
    borderBottom: '3px solid #ffd700',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  tableRow: {
    borderBottom: '2px solid rgba(255,215,0,0.2)',
    backgroundColor: '#52b788',
  },
  td: {
    padding: '1rem',
    color: '#ffffff',
    fontWeight: '500',
  },
  winnerBadge: {
    marginRight: '0.5rem',
  },
  winnerBtn: {
    background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
    color: '#000000',
    padding: '0.875rem 1.75rem',
    border: '3px solid #ff8c00',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '700',
    boxShadow: '0 4px 12px rgba(255,215,0,0.5)',
    transition: 'all 0.3s ease',
    whiteSpace: 'nowrap',
  },
  notesCard: {
    backgroundColor: '#2d6a4f',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
    border: '3px solid #ffd700',
  },
  notesText: {
    color: '#ffffff',
    lineHeight: '1.8',
    fontSize: '1.05rem',
  },
};

export default SessionDetail;
