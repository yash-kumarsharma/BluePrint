import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, AlertCircle, TrendingUp, X } from 'lucide-react';
import { API_ENDPOINTS } from '../config';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Forgot password states
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState(null);
  const [forgotSuccess, setForgotSuccess] = useState(null);
  
  const navigate = useNavigate();

  // Google SSO Initialization
  useEffect(() => {
    /* global google */
    const initializeGoogle = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your_google_client_id.apps.googleusercontent.com',
          callback: handleGoogleResponse
        });
        window.google.accounts.id.renderButton(
          document.getElementById("googleBtnLogin"),
          { theme: "outline", size: "large", width: 360 }
        );
      }
    };

    const checkGoogleInterval = setInterval(() => {
      if (window.google) {
        initializeGoogle();
        clearInterval(checkGoogleInterval);
      }
    }, 500);

    return () => clearInterval(checkGoogleInterval);
  }, []);

  const handleGoogleResponse = async (response) => {
    try {
      setLoading(true);
      setError(null);
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.post(`${API_ENDPOINTS.AUTH}/google`, { credential: response.credential }, config);
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/');
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || 'Google authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.post(`${API_ENDPOINTS.AUTH}/login`, { email, password }, config);
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/');
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!forgotEmail) return;

    try {
      setForgotLoading(true);
      setForgotError(null);
      setForgotSuccess(null);
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.post(`${API_ENDPOINTS.AUTH}/forgot-password`, { email: forgotEmail }, config);
      setForgotSuccess(data.message || 'Recovery email sent successfully!');
      setForgotEmail('');
    } catch (err) {
      setForgotError(err.response?.data?.message || 'Failed to request password reset');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-container">
        
        {/* Left Side: Auth Form */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="auth-form-side">
          <div className="auth-card">
            <h2 style={{ fontSize: '2.8rem', fontWeight: 950, color: '#0F172A', marginBottom: '0.5rem', letterSpacing: '-0.04em', lineHeight: 1.1, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
              Master Your <br/> <span style={{ color: '#12B8C9' }}>Career</span>
            </h2>
            <p style={{ color: '#64748B', fontSize: '1rem', marginBottom: '2.5rem', lineHeight: 1.5, fontWeight: 500 }}>
              Unlock your professional potential with AI-driven skill intelligence.
            </p>

            {error && (
              <div style={{ color: '#e53e3e', background: '#fff5f5', padding: '12px 16px', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', border: '1px solid #fed7d7' }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', width: '100%', minHeight: '44px' }}>
              <div id="googleBtnLogin"></div>
            </div>

            <div className="divider">OR USE EMAIL</div>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div className="auth-input-group">
                <label>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} color="#A0AEC0" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="email" 
                    required 
                    placeholder="alex@blueprint.ai"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ paddingLeft: '40px' }}
                  />
                </div>
              </div>

              <div className="auth-input-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ margin: 0 }}>Password</label>
                  <button 
                    type="button"
                    onClick={() => {
                      setForgotError(null);
                      setForgotSuccess(null);
                      setShowForgotModal(true);
                    }}
                    style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38B2AC', textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    FORGOT?
                  </button>
                </div>
                <div style={{ position: 'relative', marginTop: '8px' }}>
                  <Lock size={18} color="#A0AEC0" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ paddingLeft: '40px' }}
                  />
                  <Eye 
                    size={18} 
                    color="#A0AEC0" 
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }} 
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '0.5rem' }}>
                <input type="checkbox" id="remember" style={{ width: '16px', height: '16px', accentColor: '#38B2AC', cursor: 'pointer' }} />
                <label htmlFor="remember" style={{ fontSize: '0.85rem', color: '#4A5568', cursor: 'pointer' }}>Keep me logged in</label>
              </div>
              
              <button 
                type="submit" 
                disabled={loading}
                style={{ width: '100%', marginTop: '0.5rem', padding: '16px', borderRadius: '12px', fontSize: '1rem', fontWeight: 700, background: '#38B2AC', color: '#fff', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(56, 178, 172, 0.4)' }} 
              >
                {loading ? 'Accessing...' : 'Access Dashboard'}
              </button>
            </form>

            {/* Forgot Password Modal */}
            <AnimatePresence>
              {showForgotModal && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.45)', backdropFilter: 'blur(8px)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}
                  onClick={() => setShowForgotModal(false)}
                >
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    style={{ background: '#fff', maxWidth: '450px', width: '100%', borderRadius: '32px', padding: '2.5rem', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid rgba(0,0,0,0.05)', position: 'relative' }}
                  >
                    <button 
                      onClick={() => setShowForgotModal(false)}
                      style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}
                    >
                      <X size={20} />
                    </button>

                    <div style={{ background: '#E6FFFA', width: '70px', height: '70px', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#38B2AC' }}>
                       <Mail size={32} />
                    </div>
                    
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0F172A', marginBottom: '0.8rem', letterSpacing: '-0.02em', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>Recover Password</h3>
                    <p style={{ color: '#64748B', lineHeight: 1.6, marginBottom: '1.5rem', fontSize: '0.95rem', fontWeight: 500 }}>
                      Enter your registered email address below, and we will send you a secure link to reset your account password.
                    </p>

                    {forgotError && (
                      <div style={{ color: '#e53e3e', background: '#fff5f5', padding: '12px 16px', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.88rem', border: '1px solid #fed7d7', fontWeight: 600 }}>
                        {forgotError}
                      </div>
                    )}

                    {forgotSuccess && (
                      <div style={{ color: '#047857', background: '#ECFDF5', padding: '12px 16px', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.88rem', border: '1px solid #a7f3d0', fontWeight: 600 }}>
                        {forgotSuccess}
                      </div>
                    )}

                    <form onSubmit={handleForgotPasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', textAlign: 'left' }}>
                      <div className="auth-input-group">
                        <label>Email Address</label>
                        <div style={{ position: 'relative' }}>
                          <Mail size={18} color="#A0AEC0" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                          <input 
                            type="email" 
                            required 
                            placeholder="alex@blueprint.ai"
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            style={{ paddingLeft: '40px', width: '100%' }}
                          />
                        </div>
                      </div>

                      <button 
                        type="submit" 
                        disabled={forgotLoading}
                        style={{ width: '100%', marginTop: '0.5rem', padding: '16px', borderRadius: '12px', fontSize: '1rem', fontWeight: 800, background: '#0F172A', color: '#fff', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(15, 23, 42, 0.2)' }} 
                      >
                        {forgotLoading ? 'Sending Link...' : 'Request Reset Link'}
                      </button>
                    </form>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <p style={{ textAlign: 'center', marginTop: '2.5rem', fontSize: '0.9rem', color: '#718096' }}>
              New to the platform? <Link to="/register" style={{ color: '#319795', fontWeight: 700, textDecoration: 'none' }}>Create account</Link>
            </p>
          </div>
        </motion.div>

        {/* Right Side: Mockup */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="auth-mockup-side">
          <div className="iphone-mockup">
            <div className="iphone-notch" />
            
            <div style={{ padding: '40px 20px 20px', height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <div style={{ background: '#38B2AC', padding: '6px', borderRadius: '8px', color: '#fff', display: 'flex' }}>
                  <TrendingUp size={14} />
                </div>
                <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#1A202C' }}>BluePrint</span>
              </div>

              {/* Match Card */}
              <div style={{ border: '1px solid #E2E8F0', borderRadius: '20px', padding: '20px', marginBottom: '20px' }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#A0AEC0', letterSpacing: '1px', marginBottom: '4px' }}>OVERALL MATCH</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1A202C' }}>85%</div>
                
                <div style={{ marginTop: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', fontWeight: 800, color: '#A0AEC0', marginBottom: '8px' }}>
                    <span>SKILL GROWTH</span>
                    <span style={{ color: '#38B2AC' }}>+12%</span>
                  </div>
                  <div style={{ height: '6px', background: '#EDF2F7', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: '65%', height: '100%', background: '#48BB78' }} />
                  </div>
                </div>
              </div>

              {/* Skills List */}
              <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#A0AEC0', letterSpacing: '1px', marginBottom: '12px' }}>ANALYZED SKILLS</div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { name: 'React Framework', status: 'STRONG', color: '#48BB78' },
                  { name: 'Node.js Backend', status: 'MODERATE', color: '#D69E2E' },
                  { name: 'GraphQL API', status: 'GAP', color: '#E53E3E' },
                  { name: 'Kubernetes', status: 'STRONG', color: '#48BB78' }
                ].map((skill, i) => (
                  <div key={i} style={{ border: `1px solid ${skill.color}30`, background: '#fff', padding: '12px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: skill.color }} />
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#2D3748' }}>{skill.name}</span>
                    </div>
                    <span style={{ fontSize: '0.6rem', fontWeight: 800, color: '#A0AEC0' }}>{skill.status}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 'auto', background: '#1A202C', color: '#fff', textAlign: 'center', padding: '16px', borderRadius: '16px', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Bridge Your Gap Now
              </div>
            </div>
          </div>

          {/* Floating Top Gap Card */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={{ position: 'absolute', bottom: '-20px', right: '-40px', background: '#fff', padding: '16px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '220px', zIndex: 30, border: '1px solid rgba(0,0,0,0.05)' }}
          >
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ background: '#FFF5F5', color: '#E53E3E', padding: '6px', borderRadius: '8px' }}>
                <AlertCircle size={16} />
              </div>
              <div>
                <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#A0AEC0', letterSpacing: '1px' }}>TOP GAP</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1A202C', marginBottom: '4px' }}>Cloud Security</div>
                <div style={{ fontSize: '0.7rem', color: '#718096', lineHeight: 1.4 }}>Recommended: 5h course from Udemy.</div>
              </div>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </div>
  );
};

export default Login;
