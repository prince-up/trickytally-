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
              {stats.recentSessions.map((session) => (
                <Link
                  key={session._id}
                  to={`/sessions/${session._id}`}
                  style={styles.sessionCard}
                >
                  <div style={styles.sessionHeader}>
                    <h3 style={styles.sessionGame}>{session.gameType.toUpperCase()}</h3>
                    <span style={styles.sessionDate}>
                      {new Date(session.sessionDate).toLocaleDateString()}
                    </span>
                  </div>
                  <p style={styles.sessionInfo}>
                    {session.players.length} players • {session.totalRounds} rounds •{' '}
                    {session.duration} min
                  </p>
                  <p
                    style={{
                      ...styles.sessionProfit,
                      color:
                        session.players.reduce((sum, p) => sum + p.profitLoss, 0) >= 0
                          ? '#10b981'
                          : '#ef4444',
                    }}
                  >
                    ₹
                    {session.players
                      .reduce((sum, p) => sum + p.profitLoss, 0)
                      .toFixed(2)}
                  </p>{
                const winner = session.players.reduce((max, p) => 
                  p.totalPoints > max.totalPoints ? p : max, session.players[0]);
                
                return (
                  <Link
                    key={session._id}
                    to={`/sessions/${session._id}`}
                    style={styles.sessionCard}
                  >
                    <div style={styles.sessionHeader}>
                      <h3 style={styles.sessionGame}>CALL BREAK</h3>
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
              }rid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '3rem',
  },
  statCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  statLabel: {
    fontSize: '0.9rem',
    color: '#6b7280',
    marginBottom: '0.5rem',
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#1f2937',
  },
  section: {
    marginBottom: '3rem',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1f2937',
  },
  viewAllLink: {
    color: '#3b82f6',
    textDecoration: 'none',
    fontSize: '1rem',
  },
  gameGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
  },
  gameCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  gameType: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '0.5rem',
  },
  gameInfo: {
    color: '#6b7280',
    marginBottom: '0.5rem',
  },
  gameProfit: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  sessionList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  sessionCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    textDecoration: 'none',
    transition: 'box-shadow 0.2s',
  },
  sessionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  sessionGame: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#1f2937',
  },
  sessionDate: {
    color: '#6b7280',
    fontSize: '0.9rem',
  },
  sessionInfo: {
    color: '#6b7280',
    marginBottom: '0.5rem',
  },
  sessionProfit: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem',
    backgroundColor: 'white',
    borderRadius: '8px',
  },
  createBtn: {
    display: 'inline-block',
    marginTop: '1rem',
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '6px',
    textDecoration: 'none',
  },
};

export default Dashboard;
