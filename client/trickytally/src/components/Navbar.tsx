import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) return null;

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to="/dashboard" style={styles.logo}>
          🃏 TrickTally
        </Link>

        <div style={styles.links}>
          <Link to="/dashboard" style={styles.link}>
            Dashboard
          </Link>
          <Link to="/sessions" style={styles.link}>
            Sessions
          </Link>
          <Link to="/create-session" style={styles.link}>
            New Session
          </Link>
          <Link to="/stats" style={styles.link}>
            Stats
          </Link>
        </div>

        <div style={styles.user}>
          <Link to="/profile" style={styles.userName}>
            👤 {user?.name}
          </Link>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  nav: {
    background: 'linear-gradient(135deg, #1a4d2e 0%, #0f5132 100%)',
    color: 'white',
    padding: '1rem 0',
    boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
    borderBottom: '3px solid #ffd700',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 0.75rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  logo: {
    fontSize: 'clamp(1.2rem, 4vw, 1.8rem)',
    fontWeight: 'bold',
    color: '#ffd700',
    textDecoration: 'none',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
    transition: 'transform 0.3s ease',
  },
  links: {
    display: 'flex',
    gap: 'clamp(0.5rem, 2vw, 2rem)',
    flexWrap: 'wrap',
  },
  link: {
    color: '#ffffff',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    fontSize: 'clamp(0.85rem, 2vw, 1.05rem)',
    fontWeight: '500',
    padding: '0.4rem 0.75rem',
    borderRadius: '8px',
    border: '2px solid transparent',
    whiteSpace: 'nowrap',
  },
  user: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  userName: {
    color: '#ffd700',
    fontWeight: '600',
    fontSize: 'clamp(0.85rem, 2vw, 1.05rem)',
    textDecoration: 'none',
    padding: '0.4rem 0.75rem',
    borderRadius: '8px',
    border: '2px solid #ffd700',
    transition: 'all 0.3s ease',
    backgroundColor: 'rgba(255,215,0,0.1)',
    whiteSpace: 'nowrap',
  },
  logoutBtn: {
    background: 'linear-gradient(135deg, #dc143c 0%, #8b0000 100%)',
    color: '#ffffff',
    border: '2px solid #ffd700',
    padding: '0.4rem 1rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: 'clamp(0.85rem, 2vw, 1rem)',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
    whiteSpace: 'nowrap',
  },
};

export default Navbar;
