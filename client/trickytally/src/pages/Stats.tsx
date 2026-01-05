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
          <p>Loading statistics...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h1 style={styles.title}>Statistics & Analytics</h1>

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
          <div style={styles.tableContainer}>
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
                        <tr key={playerName} style={styles.tableRow}>
                          <td style={styles.td}>{playerName}</td>
                          <td
                            style={{
                              ...styles.td,
                              color: stats.totalPoints >= 0 ? '#10b981' : '#ef4444',
                              fontWeight: 'bold',
                            }}
                          >
                            {stats.totalPoints}
                          </td>
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

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Quick Insights</h2>
          <div style={styles.insightGrid}>
            <div style={styles.insightCard}>
              <div style={styles.insightIcon}>🏆</div>
              <h3 style={styles.insightTitle}>Top Player</h3>
              <p style={styles.insightValue}>
                {Object.keys(playerStats).length > 0
                  ? Object.entries(playerStats).sort(
                    (a, b) => b[1].totalPoints - a[1].totalPoints
                  )[0][0]
                  : 'N/A'}
              </p>
            </div>

            <div style={styles.insightCard}>
              <div style={styles.insightIcon}>🎯</div>
              <h3 style={styles.insightTitle}>Best Success Rate</h3>
              <p style={styles.insightValue}>
                {Object.keys(playerStats).length > 0
                  ? (() => {
                    const best = Object.entries(playerStats).sort((a, b) => {
                      const aRate = a[1].totalCalls > 0 ? a[1].successfulCalls / a[1].totalCalls : 0;
                      const bRate = b[1].totalCalls > 0 ? b[1].successfulCalls / b[1].totalCalls : 0;
                      return bRate - aRate;
                    })[0];
                    const rate = best[1].totalCalls > 0
                      ? ((best[1].successfulCalls / best[1].totalCalls) * 100).toFixed(1)
                      : '0.0';
                    return `${best[0]} (${rate}%)`;
                  })()
                  : 'N/A'}
              </p>
            </div>

            <div style={styles.insightCard}>
              <div style={styles.insightIcon}>♠️</div>
              <h3 style={styles.insightTitle}>Most Common Trump</h3>
              <p style={styles.insightValue}>
                {Object.keys(trumpStats).length > 0
                  ? Object.entries(trumpStats).sort(
                    (a, b) => b[1].rounds - a[1].rounds
                  )[0][0]
                  : 'N/A'}
              </p>
            </div>

            <div style={styles.insightCard}>
              <div style={styles.insightIcon}>📊</div>
              <h3 style={styles.insightTitle}>Total Rounds</h3>
              <p style={styles.insightValue}>
                {Object.values(trumpStats).reduce((sum, stats) => sum + stats.rounds, 0)}
              </p>
            </div>
          </div>
        </section>
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
  section: {
    marginBottom: '3rem',
  },
  sectionTitle: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    color: '#ffd700',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
  },
  gameGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
  },
  gameCard: {
    backgroundColor: '#2d6a4f',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
    border: '3px solid #ffd700',
  },
  gameTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#ffd700',
    marginBottom: '1rem',
    paddingBottom: '0.75rem',
    borderBottom: '2px solid rgba(255,215,0,0.3)',
    textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
  },
  statRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.75rem',
  },
  statLabel: {
    color: '#b8e6d5',
    fontWeight: '500',
  },
  statValue: {
    fontWeight: '700',
    color: '#ffffff',
  },
  tableContainer: {
    backgroundColor: '#2d6a4f',
    borderRadius: '12px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
    overflow: 'auto',
    border: '3px solid #ffd700',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
  },
  tableHeader: {
    background: 'linear-gradient(135deg, #8b0000 0%, #dc143c 100%)',
  },
  th: {
    padding: '1.2rem',
    textAlign: 'left' as const,
    fontWeight: '700',
    color: '#ffd700',
    borderBottom: '3px solid #ffd700',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
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
  emptyText: {
    textAlign: 'center' as const,
    padding: '2rem',
    color: '#ffd700',
    backgroundColor: '#2d6a4f',
    borderRadius: '12px',
    border: '2px solid #ffd700',
    fontSize: '1.1rem',
  },
  insightGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
  },
  insightCard: {
    backgroundColor: '#2d6a4f',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
    border: '3px solid #ffd700',
    textAlign: 'center' as const,
  },
  insightIcon: {
    fontSize: '3.5rem',
    marginBottom: '1rem',
    filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))',
  },
  insightTitle: {
    fontSize: '0.95rem',
    color: '#ffd700',
    marginBottom: '0.75rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    fontWeight: '600',
  },
  insightValue: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#ffffff',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
  },
};

export default Stats;
