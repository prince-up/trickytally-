import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

interface PlayerStat {
  gamesPlayed: number;
  totalPoints: number;
  totalCalls: number;
  totalTricksWon: number;
  successfulCalls: number;
  successRate: string;
}

interface TrumpStat {
  rounds: number;
  totalPoints: number;
}

const Stats = () => {
  const { token } = useAuth();
  const [playerStats, setPlayerStats] = useState<{ [key: string]: PlayerStat }>({});
  const [trumpStats, setTrumpStats] = useState<{ [key: string]: TrumpStat }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [playerRes, trumpRes] = await Promise.all([
        fetch('http://localhost:5000/api/stats/by-player', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('http://localhost:5000/api/stats/by-game', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const playerData = await playerRes.json();
      const trumpData = await trumpRes.json();

      if (playerData.success) setPlayerStats(playerData.data);
      if (trumpData.success) setTrumpStats(trumpData.data);
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
                    <th style={styles.th}>Games</th>
                    <th style={styles.th}>Total Buy-In</th>
                    <th style={styles.th}>Total Cash-Out</th>
                    <th style={styles.th}>Profit/Loss</th>
                    <th style={styles.th}>ROI</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(playerStats)
                    .sort((a, b) => b[1].totalProfit - a[1].totalProfit)
                    .map(([playerName, stats]) => {
                      const roi =
                        stats.totalBuyIn > 0
                          ? ((stats.totalProfit / stats.totalBuyIn) * 100).toFixed(1)
                          : '0.0';
Points</th>
                    <th style={styles.th}>Calls Made</th>
                    <th style={styles.th}>Tricks Won</th>
                    <th style={styles.th}>Success Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(playerStats)
                    .sort((a, b) => b[1].totalPoints - a[1].totalPoints)
                    .map(([playerName, stats]) => {
                      return (
                        <tr key={playerName} style={styles.tableRow}>
                          <td style={styles.td}>{playerName}</td>
                          <td style={styles.td}>{stats.gamesPlayed}</td>
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
                          <td style={styles.td}>{stats.successRate}%es.insightGrid}>
            <div style={styles.insightCard}>
              <div style={styles.insightIcon}>🏆</div>
              <h3 style={styles.insightTitle}>Top Player</h3>
              <p style={styles.insightValue}>
                {Object.keys(playerStats).length > 0
                  ? Object.entries(playerStats).sort(
                      (a, b) => b[1].totalProfit - a[1].totalProfit
                    )[0][0]
                  : 'N/A'}
              </p>
            </div>

            <div style={styles.insightCard}>
              <div style={styles.insightIcon}>🎮</div>
              <h3 style={styles.insightTitle}>Most Played Game</h3>
              <p style={styles.insightValue}>
                {Object.keys(gameStats).length > 0
                  ? Object.entries(gameStats).sort(
                      (a, b) => b[1].sessions - a[1].sessions
                    )[0][0].toUpperCase()
                  : 'N/A'}
              </p>
            </div>

            <div style={styles.insightCard}>
              <div style={styles.insightIcon}>💰</div>
              <h3 style={styles.insightTitle}>Most Profitable Game</h3>
              <p style={styles.insightValue}>
                {Object.keys(gameStats).length > 0
                  ? Object.entries(gameStats).sort(
                      (a, b) => b[1].totalProfit - a[1].totalProfit
                    )[0][0].toUpperCase()
                  : 'N/A'}oints - a[1].totalPoints
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
                      const best = Object.entries(playerStats).sort(
                        (a, b) => parseFloat(b[1].successRate) - parseFloat(a[1].successRate)
                      )[0];
                      return `${best[0]} (${best[1].successRate}%)`;
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
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    color: '#1f2937',
  },
  gameGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
  },
  gameCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  gameTitle: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '1rem',
    paddingBottom: '0.75rem',
    borderBottom: '2px solid #e5e7eb',
  },
  statRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.75rem',
  },
  statLabel: {
    color: '#6b7280',
  },
  statValue: {
    fontWeight: '500',
    color: '#1f2937',
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
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
  emptyText: {
    textAlign: 'center',
    padding: '2rem',
    color: '#6b7280',
    backgroundColor: 'white',
    borderRadius: '8px',
  },
  insightGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
  },
  insightCard: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  insightIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  insightTitle: {
    fontSize: '0.9rem',
    color: '#6b7280',
    marginBottom: '0.5rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  insightValue: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1f2937',
  },
};

export default Stats;
