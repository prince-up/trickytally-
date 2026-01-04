import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
      const response = await fetch('http://localhost:5000/api/sessions', {
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
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#1f2937',
  },
  createBtn: {
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '6px',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: '600',
  },
  sessionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '1.5rem',
  },
  sessionCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
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
    borderBottom: '1px solid #e5e7eb',
  },
  gameType: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: 0,
  },
  date: {
    color: '#6b7280',
    fontSize: '0.9rem',
  },
  cardBody: {
    marginBottom: '1rem',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    color: '#6b7280',
    fontSize: '0.9rem',
    marginBottom: '0.5rem',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '1rem',
    borderTop: '1px solid #e5e7eb',
  },
  profitLabel: {
    color: '#6b7280',
    fontWeight: '500',
  },
  profitValue: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#1f2937',
  },
  emptyState: {
    textAlign: 'center',
    padding: '4rem 2rem',
    backgroundColor: 'white',
    borderRadius: '8px',
  },
  createBtnLarge: {
    display: 'inline-block',
    marginTop: '1.5rem',
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '1rem 2rem',
    borderRadius: '6px',
    textDecoration: 'none',
    fontSize: '1.1rem',
    fontWeight: '600',
  },
};

export default SessionList;
