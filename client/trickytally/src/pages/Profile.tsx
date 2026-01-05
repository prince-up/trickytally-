import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API_URL from '../config';
import Navbar from '../components/Navbar';

interface UserStats {
  totalSessions: number;
  totalRounds: number;
  totalPoints: number;
  gamesWon: number;
  successRate: string;
}

const Profile = () => {
  const { user, token } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      const response = await fetch(`${API_URL}/api/stats/summary`, {
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

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.profileCard}>
          <div style={styles.avatar}>
            {user?.name?.charAt(0).toUpperCase() || '👤'}
          </div>

          <h1 style={styles.name}>{user?.name}</h1>
          <p style={styles.email}>{user?.email}</p>

          <div style={styles.divider}></div>

          <h2 style={styles.sectionTitle}>📊 Your Statistics</h2>

          {loading ? (
            <p style={styles.loading}>Loading stats...</p>
          ) : (
            <div style={styles.statsGrid}>
              <div style={styles.statBox}>
                <div style={styles.statIcon}>🎮</div>
                <div style={styles.statValue}>{stats?.totalSessions || 0}</div>
                <div style={styles.statLabel}>Total Sessions</div>
              </div>

              <div style={styles.statBox}>
                <div style={styles.statIcon}>🔄</div>
                <div style={styles.statValue}>{stats?.totalRounds || 0}</div>
                <div style={styles.statLabel}>Total Rounds</div>
              </div>

              <div style={styles.statBox}>
                <div style={styles.statIcon}>🏆</div>
                <div style={styles.statValue}>{stats?.gamesWon || 0}</div>
                <div style={styles.statLabel}>Games Won</div>
              </div>

              <div style={styles.statBox}>
                <div style={styles.statIcon}>🎯</div>
                <div style={styles.statValue}>{stats?.successRate || '0'}%</div>
                <div style={styles.statLabel}>Success Rate</div>
              </div>
            </div>
          )}

          <div style={styles.divider}></div>

          <h2 style={styles.sectionTitle}>👤 Account Information</h2>

          <div style={styles.infoGrid}>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Full Name:</span>
              <span style={styles.infoValue}>{user?.name}</span>
            </div>

            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Email Address:</span>
              <span style={styles.infoValue}>{user?.email}</span>
            </div>

            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>User ID:</span>
              <span style={styles.infoValue}>{user?.id}</span>
            </div>

            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Member Since:</span>
              <span style={styles.infoValue}>
                {new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f5132 0%, #1a4d2e 50%, #0f5132 100%)',
    padding: '2rem',
    backgroundImage: `
      radial-gradient(circle at 20% 30%, rgba(255,255,255,0.03) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(255,255,255,0.03) 0%, transparent 50%)
    `,
  },
  profileCard: {
    maxWidth: '800px',
    margin: '0 auto',
    backgroundColor: '#2d6a4f',
    borderRadius: '20px',
    padding: '3rem',
    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
    border: '3px solid #ffd700',
  },
  avatar: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    backgroundColor: '#ffd700',
    color: '#1f2937',
    fontSize: '3rem',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.5rem',
    boxShadow: '0 8px 20px rgba(255,215,0,0.4)',
    border: '4px solid #fff',
  },
  name: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#ffd700',
    textAlign: 'center',
    marginBottom: '0.5rem',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
  },
  email: {
    fontSize: '1.1rem',
    color: '#b8e6d5',
    textAlign: 'center',
    marginBottom: '2rem',
  },
  divider: {
    height: '2px',
    background: 'linear-gradient(90deg, transparent, #ffd700, transparent)',
    margin: '2rem 0',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#ffd700',
    marginBottom: '1.5rem',
    textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
  },
  loading: {
    textAlign: 'center',
    color: '#b8e6d5',
    fontSize: '1.1rem',
    padding: '2rem',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  statBox: {
    backgroundColor: '#1e5128',
    padding: '1.5rem',
    borderRadius: '12px',
    textAlign: 'center',
    border: '2px solid rgba(255,215,0,0.3)',
    transition: 'transform 0.3s ease',
  },
  statIcon: {
    fontSize: '2.5rem',
    marginBottom: '0.5rem',
    filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))',
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: '0.25rem',
  },
  statLabel: {
    fontSize: '0.9rem',
    color: '#b8e6d5',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  infoGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: '#1e5128',
    borderRadius: '8px',
    border: '1px solid rgba(255,215,0,0.2)',
  },
  infoLabel: {
    fontSize: '1rem',
    color: '#b8e6d5',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: '1rem',
    color: '#ffffff',
    fontWeight: '500',
    textAlign: 'right',
  },
};

export default Profile;
