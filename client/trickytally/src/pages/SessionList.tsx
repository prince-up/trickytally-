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

        <div style={styles.filters}>
          <button
            onClick={() => setFilter('all')}
            style={{
              ...styles.filterBtn,
        {s>
          </div>
        ) : (
          <div style={styles.sessionGrid}>
            {filteredSessions.map((session) => {
              const totalProfit = session.players.reduce(
                (sum, p) => sum + p.profitLoss,
                0
              );

              return (
                <Link
                  key={session._id}
                  to={`/sessions/${session._id}`}
                  style={styles.sessionCard}
                >
                  <div style={styles.cardHeader}>
                    <h3 style={styles.gameType}>
                      {session.gameType.toUpperCase()}
                    </h3>
                    <span style={styles.date}>
                      {new Date(session.sessionDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div style={styles.cardBody}>
                    <div style={styles.infoRow}>
                      <span>👥 {session.players.length} players</span>
                      <span>🎯 {session.totalRounds} rounds</span>
                    </div>
                    <div style={styles.infoRow}>
                      <span>⏱️ {session.duration} min</span>
                      {session.location && (
                        <span>📍 {session.location}</span>
                      )}
                    </div>
                  </div>

                  <div style={styles.cardFooter}>
                    <span style={styles.profitLabel}>Total P/L:</span>
                    <span
                      style={{
                        ...styles.profitValue,
                        color: totalProfit >= 0 ? '#10b981' : '#ef4444',
                      }}
                    >
                      ₹{totalProfit.toFixed(2)}
                    </span>
             sessions.map((session) => {
              const winner = session.players.reduce((max, p) => 
                p.totalPoints > max.totalPoints ? p : max, session.players[0]);

              return (
                <Link
                  key={session._id}
                  to={`/sessions/${session._id}`}
                  style={styles.sessionCard}
                >
                  <div style={styles.cardHeader}>
                    <h3 style={styles.gameType}>CALL BREAK</h3>
                    <span style={styles.date}>
                      {new Date(session.sessionDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div style={styles.cardBody}>
                    <div style={styles.infoRow}>
                      <span>👥 {session.players.length} players</span>
                      <span>🎯 {session.totalRounds} rounds</span>
                    </div>
                    <div style={styles.infoRow}>
                      {session.location && (
                        <span>📍 {session.location}</span>
                      )}
                    </div>
                  </div>

                  <div style={styles.cardFooter}>
                    <span style={styles.profitLabel}>Winner:</span>
                    <span style={styles.profitValue}>
                      {winner?.name} ({winner?.totalPoints} pts)
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    backgroundColor: 'white',
    cursor: 'pointer',
    fontSize: '0.95rem',
  },
  activeFilter: {
    backgroundColor: '#3b82f6',
    color: 'white',
    borderColor: '#3b82f6',
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
    fontSize: '1.3rem',
    fontWeight: 'bold',
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
  },
};

export default SessionList;
rem',
    fontWeight: 'bold',
    color: '#1f2937