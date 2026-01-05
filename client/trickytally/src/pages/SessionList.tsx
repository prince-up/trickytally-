import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API_URL from '../config';
import Navbar from '../components/Navbar';

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
  totalRounds: number;
  location: string;
  notes: string;
}

const SessionList = () => {
  const { token } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await fetch(`${API_URL}/api/sessions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setSessions(data.data);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
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
        <div style={styles.header}>
          <h1 style={styles.title}>All Sessions</h1>
          <Link to="/create-session" style={styles.createBtn}>
            + New Session
          </Link>
        </div>

        {sessions.length === 0 ? (
          <div style={styles.emptyState}>
            <p>No sessions found. Create your first Call Break session!</p>
            <Link to="/create-session" style={styles.createBtnLarge}>
              + Create Session
            </Link>
          </div>
        ) : (
          <div style={styles.sessionGrid}>
            {sessions.map((session) => {
              const winner = session.players.reduce((max, p) =>
                p.totalPoints > max.totalPoints ? p : max, session.players[0]);

              return (
                <Link
                  key={session._id}
                  to={`/sessions/${session._id}`}
                  style={styles.sessionCard}
                >
                  <div style={styles.cardHeader}>
                    <h3 style={styles.gameType}>Call Break</h3>
                    <span style={styles.date}>
                      {new Date(session.sessionDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div style={styles.cardBody}>
                    <div style={styles.infoRow}>
                      <span>👥 {session.players.length} players</span>
                      <span>🎯 {session.totalRounds} rounds</span>
                    </div>
                    {session.location && (
                      <div style={styles.infoRow}>
                        <span>📍 {session.location}</span>
                      </div>
                    )}
                  </div>

                  <div style={styles.cardFooter}>
                    <span style={styles.profitLabel}>Winner:</span>
                    <span style={styles.profitValue}>
                      {winner.name} ({winner.totalPoints} pts)
                    </span>
                  </div>
                </Link>
              );
            })}
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
    padding: '2rem',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f5132 0%, #1a4d2e 50%, #0f5132 100%)',
    backgroundImage: `
      radial-gradient(circle at 20% 30%, rgba(255,255,255,0.03) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(255,255,255,0.03) 0%, transparent 50%)
    `,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#ffd700',
    textShadow: '3px 3px 6px rgba(0,0,0,0.5), 0 0 20px rgba(255,215,0,0.3)',
    letterSpacing: '2px',
  },
  createBtn: {
    background: 'linear-gradient(135deg, #8b0000 0%, #dc143c 100%)',
    color: '#ffffff',
    padding: '0.875rem 1.75rem',
    borderRadius: '10px',
    textDecoration: 'none',
    fontSize: '1.05rem',
    fontWeight: '700',
    border: '2px solid #ffd700',
    boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
    transition: 'all 0.3s ease',
  },
  sessionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '1.5rem',
  },
  sessionCard: {
    backgroundColor: '#2d6a4f',
    padding: '1.75rem',
    borderRadius: '12px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
    border: '3px solid #ffd700',
    textDecoration: 'none',
    transition: 'transform 0.2s, box-shadow 0.2s',
    display: 'block',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    paddingBottom: '1rem',
    borderBottom: '2px solid rgba(255,215,0,0.3)',
  },
  gameType: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#ffd700',
    margin: 0,
    textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
  },
  date: {
    color: '#ffffff',
    fontSize: '0.95rem',
    fontWeight: '500',
  },
  cardBody: {
    marginBottom: '1rem',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    color: '#b8e6d5',
    fontSize: '1rem',
    marginBottom: '0.5rem',
    fontWeight: '500',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '1rem',
    borderTop: '2px solid rgba(255,215,0,0.3)',
  },
  profitLabel: {
    color: '#b8e6d5',
    fontWeight: '600',
    fontSize: '1rem',
  },
  profitValue: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#ffffff',
    textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
  },
  emptyState: {
    textAlign: 'center',
    padding: '4rem 2rem',
    backgroundColor: '#2d6a4f',
    borderRadius: '12px',
    border: '3px solid #ffd700',
    color: '#ffd700',
  },
  createBtnLarge: {
    display: 'inline-block',
    marginTop: '1.5rem',
    background: 'linear-gradient(135deg, #8b0000 0%, #dc143c 100%)',
    color: '#ffffff',
    padding: '1rem 2rem',
    borderRadius: '10px',
    textDecoration: 'none',
    fontSize: '1.1rem',
    fontWeight: '700',
    border: '2px solid #ffd700',
    boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
  },
};

export default SessionList;
