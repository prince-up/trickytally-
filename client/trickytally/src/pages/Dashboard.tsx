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
}

interface Stats {
  totalSessions: number;
  totalRounds: number;
  totalCalls: number;
  totalSuccessfulCalls: number;
  successRate: string;
  recentSessions: Session[];
}

const Dashboard = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/stats/summary', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
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
        <h1 style={styles.title}>Dashboard</h1>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <h3 style={styles.statLabel}>Total Sessions</h3>
            <p style={styles.statValue}>{stats?.totalSessions || 0}</p>
          </div>

          <div style={styles.statCard}>
            <h3 style={styles.statLabel}>Total Rounds</h3>
            <p style={styles.statValue}>{stats?.totalRounds || 0}</p>
          </div>

          <div style={styles.statCard}>
            <h3 style={styles.statLabel}>Successful Calls</h3>
            <p style={styles.statValue}>{stats?.totalSuccessfulCalls || 0}</p>
          </div>

          <div style={styles.statCard}>
            <h3 style={styles.statLabel}>Success Rate</h3>
            <p style={styles.statValue}>{stats?.successRate || 0}%</p>
          </div>
        </div>

        <div style={styles.section}>
          <div style={styles.headerRow}>
            <h2 style={styles.sectionTitle}>Recent Sessions</h2>
            <Link to="/sessions" style={styles.viewAllLink}>
              View All →
            </Link>
          </div>

          {stats?.recentSessions && stats.recentSessions.length > 0 ? (
            <div style={styles.sessionList}>
              {stats.recentSessions.map((session) => {
                const winner = session.players.reduce((max, p) => 
                  p.totalPoints > max.totalPoints ? p : max, session.players[0]);
                
                return (
                  <Link
                    key={session._id}
                    to={`/sessions/${session._id}`}
                    style={styles.sessionCard}
                  >
                    <div style={styles.sessionHeader}>
                      <h3 style={styles.sessionGame}>Call Break</h3>
                      <span style={styles.sessionDate}>
                        {new Date(session.sessionDate).toLocaleDateString()}
                      </span>
                    </div>
                    <p style={styles.sessionInfo}>
                      {session.players.length} players • {session.totalRounds} rounds
                    </p>
                    <p style={styles.sessionProfit}>
                      Winner: {winner?.name} ({winner?.totalPoints} pts)
                    </p>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p style={styles.emptyText}>No sessions yet. Create your first session!</p>
          )}
        </div>
      </div>
    </>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
    background: 'linear-gradient(135deg, #0f5132 0%, #1a4d2e 50%, #0f5132 100%)',
    minHeight: '100vh',
    backgroundImage: `
      radial-gradient(circle at 20% 30%, rgba(255,255,255,0.03) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(255,255,255,0.03) 0%, transparent 50%)
    `,
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '2rem',
    color: '#ffd700',
    textAlign: 'center',
    textShadow: '3px 3px 6px rgba(0,0,0,0.5), 0 0 20px rgba(255,215,0,0.3)',
    letterSpacing: '2px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '3rem',
  },
  statCard: {
    backgroundColor: '#2d6a4f',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
    border: '3px solid #ffd700',
    textAlign: 'center',
    transition: 'transform 0.3s ease',
  },
  statLabel: {
    fontSize: '1rem',
    color: '#ffd700',
    marginBottom: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontWeight: '600',
  },
  statValue: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#ffffff',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
  },
  section: {
    marginBottom: '3rem',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  sectionTitle: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#ffd700',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
  },
  viewAllLink: {
    color: '#ffd700',
    textDecoration: 'none',
    fontSize: '1.1rem',
    fontWeight: '600',
    padding: '0.5rem 1rem',
    border: '2px solid #ffd700',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    backgroundColor: 'rgba(255,215,0,0.1)',
  },
  sessionList: {
    display: 'grid',
    gap: '1.5rem',
  },
  sessionCard: {
    backgroundColor: '#2d6a4f',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
    border: '2px solid #ffd700',
    textDecoration: 'none',
    display: 'block',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  sessionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  sessionGame: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    color: '#ffd700',
    margin: 0,
    textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
  },
  sessionDate: {
    color: '#ffffff',
    fontSize: '0.95rem',
    fontWeight: '500',
  },
  sessionInfo: {
    color: '#b8e6d5',
    fontSize: '0.95rem',
    marginBottom: '0.75rem',
  },
  sessionProfit: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#ffffff',
    textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
  },
  emptyText: {
    textAlign: 'center' as const,
    padding: '3rem',
    color: '#ffd700',
    backgroundColor: '#2d6a4f',
    borderRadius: '12px',
    border: '2px solid #ffd700',
    fontSize: '1.1rem',
  },
};

export default Dashboard;
