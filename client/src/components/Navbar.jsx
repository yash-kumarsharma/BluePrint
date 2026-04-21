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
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: 'max-content',
      minWidth: '500px',
      padding: '0.8rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      borderRadius: '999px',
      border: '1px solid rgba(0, 0, 0, 0.05)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
      zIndex: 1000
    }}>
      <Link to="/" style={{ textDecoration: 'none', fontWeight: '800', fontSize: '1.4rem', color: '#000', letterSpacing: '-1px' }}>
        BluePrint
      </Link>
      
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginLeft: '3rem' }}>
        <Link to="/analyze" style={{ color: '#000', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }}>Analyze</Link>
        {userInfo ? (
          <>
            <Link to="/history" style={{ color: '#000', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }}>History</Link>
            <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: '#000', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem' }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: '#555', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }}>Login</Link>
            <Link to="/register" className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.9rem', textDecoration: 'none' }}>Join</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
