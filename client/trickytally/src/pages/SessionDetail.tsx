import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

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

  useEffect(() => {
    fetchSession();
  }, [id]);

  const fetchSession = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/sessions/${id}`, {
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
      const response = await fetch(`http://localhost:5000/api/sessions/${id}`, {
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
            <h1 style={styles.title}>{session.gameType.toUpperCase()} Session</h1>
            <p style={styles.date}>Call Break Session</h1>
            <p style={styles.date}>
              {new Date(session.sessionDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <button onClick={handleDelete} style={styles.deleteBtn}>
            Delete Session
          </button>
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
            <p style={styles.infoValue}>{winner?.name
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
                          {player.totalPoints}
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
                            color: ps.points >= 0 ? '#10b981' : '#ef4444',
                            fontWeight: 'bold',
                          }}
                        >
                          {ps.points >= 0 ? '+' : ''}{ps.points}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
      </div>
    </>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '2rem',
  },
  backLink: {
    color: '#3b82f6',
    textDecoration: 'none',
    fontSize: '0.95rem',
    marginBottom: '1rem',
    display: 'inline-block',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '0.5rem',
  },
  date: {
    color: '#6b7280',
    fontSize: '1rem',
  },
  deleteBtn: {
    backgroundColor: '#ef4444',
    color: 'white',
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: '500',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem',
  },
  infoCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  infoLabel: {
    color: '#6b7280',
    fontSize: '0.85rem',
    fontWeight: '500',
    marginBottom: '0.5rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  infoValue: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1f2937',
  },
  section: {
    marginBottom: '2rem',
  },
  sectionTitle: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '1rem',
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1rem',
  },
  summaryCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  summaryLabel: {
    color: '#6b7280',
    fontSize: '0.9rem',
    marginBottom: '0.5rem',
  },
  summaryValue: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1f2937',
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  roundCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    marginBottom: '1rem',
  },
  roundTitle: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '1rem',
  },
  noData: {
    textAlign: 'center',
    padding: '2rem',
    color: '#6b7280',
    backgroundColor: 'white',
    borderRadius: '8px',
  },
    overflow: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    backgroundColor: '#f9fafb',
  },
  th: {
    padding: '1rem',
    textAlign: 'left',
    fontWeight: '600',
    color: '#374151',
    borderBottom: '2px solid #e5e7eb',
  },
  tableRow: {
    borderBottom: '1px solid #e5e7eb',
  },
  td: {
    padding: '1rem',
    color: '#1f2937',
  },
  winnerBadge: {
    marginRight: '0.5rem',
  },
  notesCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  notesText: {
    color: '#374151',
    lineHeight: '1.6',
  },
};

export default SessionDetail;
