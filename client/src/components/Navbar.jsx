import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  // Simple check for authentication
  const userInfoStr = localStorage.getItem('userInfo');
  const userInfo = userInfoStr ? JSON.parse(userInfoStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  return (
    <nav style={{
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid var(--glass-border)',
      background: 'rgba(0,0,0,0.2)',
      backdropFilter: 'blur(10px)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <Link to="/" style={{ textDecoration: 'none', fontWeight: '800', fontSize: '1.5rem' }} className="text-gradient">
        BluePrint
      </Link>
      
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        {userInfo ? (
          <>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Hi, {userInfo.name}</span>
            <Link to="/history" style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 500 }}>History</Link>
            <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid var(--text-muted)', color: 'white', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer' }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 500, transition: '0.2s' }}>Login</Link>
            <Link to="/register" className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.9rem', textDecoration: 'none' }}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
