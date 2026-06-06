import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Compass, Menu, X, Bell, ChevronDown, User, History, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [showDropdown, setShowDropdown] = useState(false);

  const userInfoStr = localStorage.getItem('userInfo');
  const userInfo = userInfoStr ? JSON.parse(userInfoStr) : null;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
    setIsOpen(false);
  };

  const handleLinkClick = (e, href) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      setIsOpen(false);
      
      // If we're not on the home page, go home first
      if (location.pathname !== '/') {
        navigate('/' + href);
      } else {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
      setIsOpen(false);
    }
  };

  const navLinks = userInfo ? [
    { name: 'Dashboard', href: '/analyze' },
    { name: 'My Analyses', href: '/history' },
    { name: 'Learning Path', href: '/analyze' }
  ] : [
    { name: 'Features', href: '#features' },
    { name: 'How it Works', href: '#workflow' },
    { name: 'FAQ', href: '#faq' }
  ];

  return (
    <>
      <nav style={{
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: isMobile ? '90%' : 'max-content',
        minWidth: isMobile ? 'auto' : '1100px',
        padding: '0.8rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.75)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderRadius: '999px',
        border: '1px solid rgba(0, 0, 0, 0.08)',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
        zIndex: 1000,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <Link to="/" onClick={() => setIsOpen(false)} style={{ textDecoration: 'none', fontWeight: '950', fontSize: '1.4rem', color: '#0B0F19', letterSpacing: '-0.8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ background: 'var(--color-cyan)', color: '#fff', padding: '6px', borderRadius: '10px', display: 'flex', boxShadow: '0 4px 10px rgba(56, 178, 172, 0.25)' }}>
            <Compass size={20} />
          </div>
          BluePrint
        </Link>
        
        {/* Desktop Links */}
        {!isMobile && (
          <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
            {navLinks.map(link => (
              <Link 
                key={link.name} 
                to={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                style={{ 
                  color: location.pathname === link.href ? '#38B2AC' : '#64748B', 
                  textDecoration: 'none', 
                  fontWeight: 800, 
                  fontSize: '0.9rem',
                  transition: 'color 0.2s',
                  letterSpacing: '0.2px'
                }}
              >
                {link.name}
              </Link>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          {!isMobile && (
            userInfo ? (
              <>
                <button style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', position: 'relative' }}>
                   <Bell size={20} />
                   <div style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', background: '#EF4444', borderRadius: '50%', border: '2px solid #fff' }} />
                </button>
                <div 
                  onMouseEnter={() => setShowDropdown(true)}
                  onMouseLeave={() => setShowDropdown(false)}
                  style={{ position: 'relative', display: 'inline-block' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '1.5rem', borderLeft: '1px solid rgba(0,0,0,0.05)', cursor: 'pointer', paddingBottom: '5px', paddingTop: '5px' }}>
                     <img 
                       src={`https://ui-avatars.com/api/?name=${userInfo.name}&background=38B2AC&color=fff&bold=true`} 
                       alt="User" 
                       style={{ width: '36px', height: '36px', borderRadius: '50%' }}
                     />
                     <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0B0F19' }}>{userInfo.name}</span>
                     <ChevronDown size={16} color="#64748B" style={{ transform: showDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </div>

                  <AnimatePresence>
                    {showDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        style={{
                          position: 'absolute',
                          top: '100%',
                          right: 0,
                          background: 'rgba(255, 255, 255, 0.95)',
                          backdropFilter: 'blur(20px) saturate(180%)',
                          border: '1px solid rgba(0, 0, 0, 0.08)',
                          borderRadius: '16px',
                          padding: '8px',
                          minWidth: '200px',
                          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px',
                          zIndex: 1100
                        }}
                      >
                        <Link 
                          to="/profile" 
                          onClick={() => setShowDropdown(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 14px',
                            borderRadius: '10px',
                            color: '#64748B',
                            textDecoration: 'none',
                            fontSize: '0.88rem',
                            fontWeight: 800,
                            transition: 'all 0.2s'
                          }}
                          className="dropdown-item"
                        >
                          <User size={16} /> My Profile
                        </Link>
                        <Link 
                          to="/history" 
                          onClick={() => setShowDropdown(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 14px',
                            borderRadius: '10px',
                            color: '#64748B',
                            textDecoration: 'none',
                            fontSize: '0.88rem',
                            fontWeight: 800,
                            transition: 'all 0.2s'
                          }}
                          className="dropdown-item"
                        >
                          <History size={16} /> My History
                        </Link>
                        <div style={{ height: '1px', background: 'rgba(0,0,0,0.05)', margin: '4px 0' }} />
                        <button 
                          onClick={() => {
                            setShowDropdown(false);
                            handleLogout();
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 14px',
                            borderRadius: '10px',
                            color: '#EF4444',
                            background: 'none',
                            border: 'none',
                            width: '100%',
                            textAlign: 'left',
                            fontSize: '0.88rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          className="dropdown-item-logout"
                        >
                          <LogOut size={16} /> Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" style={{ color: '#0B0F19', textDecoration: 'none', fontWeight: 800, fontSize: '0.9rem' }}>Log In</Link>
                <Link to="/register" className="btn-primary" style={{ padding: '12px 28px', fontSize: '0.9rem', textDecoration: 'none', background: '#0B0F19', color: '#fff', borderRadius: '99px', fontWeight: 800 }}>Get Started</Link>
              </>
            )
          )}
          
          {isMobile && (
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              style={{ background: 'none', border: 'none', color: '#000', cursor: 'pointer', padding: '8px' }}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mobile-menu-overlay"
          >
            {/* Close Button Inside Menu */}
            <button 
              onClick={() => setIsOpen(false)}
              style={{ position: 'absolute', top: '30px', right: '30px', background: 'none', border: 'none', color: '#000', cursor: 'pointer' }}
            >
              <X size={32} />
            </button>

            {navLinks.map(link => (
              <Link 
                key={link.name} 
                to={link.href} 
                onClick={(e) => handleLinkClick(e, link.href)}
                style={{ fontSize: '2.5rem', fontWeight: 950, color: '#0F172A', textDecoration: 'none', letterSpacing: '-0.05em' }}
              >
                {link.name}
              </Link>
            ))}
            <div style={{ width: '40px', height: '4px', background: 'var(--color-cyan)', margin: '1.5rem 0', borderRadius: '2px' }} />
            {userInfo ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '2rem' }}>
                   <img 
                     src={`https://ui-avatars.com/api/?name=${userInfo.name}&background=38B2AC&color=fff&bold=true`} 
                     alt="User" 
                     style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                   />
                   <div style={{ fontSize: '1.4rem', fontWeight: 900 }}>{userInfo.name}</div>
                </div>
                <Link to="/profile" onClick={() => setIsOpen(false)} style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A', textDecoration: 'none', marginBottom: '1.5rem', display: 'block' }}>My Profile</Link>
                <Link to="/history" onClick={() => setIsOpen(false)} style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A', textDecoration: 'none', marginBottom: '1.5rem', display: 'block' }}>My History</Link>
                <button onClick={handleLogout} style={{ background: 'none', border: 'none', fontSize: '1.8rem', fontWeight: 800, color: '#EF4444', cursor: 'pointer', textAlign: 'left', padding: 0 }}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)} style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A', textDecoration: 'none' }}>Log In</Link>
                <Link to="/register" onClick={() => setIsOpen(false)} style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38B2AC', textDecoration: 'none' }}>Join BluePrint</Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <style dangerouslySetInnerHTML={{ __html: `
        .dropdown-item:hover {
          background: rgba(56, 178, 172, 0.08) !important;
          color: #38B2AC !important;
        }
        .dropdown-item-logout:hover {
          background: #FFF5F5 !important;
        }
      `}} />
    </>
  );
};

export default Navbar;
