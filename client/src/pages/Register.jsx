import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, AlertCircle, TrendingUp, User, ShieldCheck } from 'lucide-react';
import { API_ENDPOINTS } from '../config';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState(null);
  const [infoMessage, setInfoMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Handle countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

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
          document.getElementById("googleBtnRegister"),
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

  const handleSendOtp = async () => {
    if (!email) {
      setError('Please enter your email first');
      return;
    }
    try {
      setOtpLoading(true);
      setError(null);
      setInfoMessage(null);
      const config = { headers: { 'Content-Type': 'application/json' } };
      await axios.post(`${API_ENDPOINTS.AUTH}/send-otp`, { email }, config);
      setOtpSent(true);
      setCountdown(60);
      setInfoMessage('Verification code (OTP) sent to your email.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send verification code');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!otpSent) {
      setError('Please request and enter your email OTP verification code');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      setInfoMessage(null);
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.post(`${API_ENDPOINTS.AUTH}/register`, { name, email, password, otp }, config);
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/');
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-container">
        
        {/* Left Side: Auth Form */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="auth-form-side">
          <div className="auth-card">
            <h2 style={{ fontSize: '2.8rem', fontWeight: 950, color: '#0F172A', marginBottom: '0.5rem', letterSpacing: '-0.04em', lineHeight: 1.1, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
              Create Your <br/> <span style={{ color: '#12B8C9' }}>Identity</span>
            </h2>
            <p style={{ color: '#64748B', fontSize: '1rem', marginBottom: '2.5rem', lineHeight: 1.5, fontWeight: 500 }}>
              Start your professional journey with AI-driven skill intelligence.
            </p>

            {error && (
              <div style={{ color: '#e53e3e', background: '#fff5f5', padding: '12px 16px', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', border: '1px solid #fed7d7' }}>
                {error}
              </div>
            )}

            {infoMessage && (
              <div style={{ color: '#047857', background: '#ECFDF5', padding: '12px 16px', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', border: '1px solid #a7f3d0' }}>
                {infoMessage}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', width: '100%', minHeight: '44px' }}>
              <div id="googleBtnRegister"></div>
            </div>

            <div className="divider">OR USE EMAIL</div>

            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              
              <div className="auth-input-group">
                <label>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} color="#A0AEC0" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="text" 
                    required 
                    placeholder="Leonid Vovk"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ paddingLeft: '40px' }}
                  />
                </div>
              </div>

              <div className="auth-input-group">
                <label>Email Address</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <Mail size={18} color="#A0AEC0" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input 
                      type="email" 
                      required 
                      disabled={otpSent}
                      placeholder="alex@blueprint.ai"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{ paddingLeft: '40px' }}
                    />
                  </div>
                  <button
                    type="button"
                    disabled={otpLoading || countdown > 0}
                    onClick={handleSendOtp}
                    style={{
                      background: countdown > 0 ? '#CBD5E1' : '#0F172A',
                      color: '#fff',
                      border: 'none',
                      padding: '0 16px',
                      borderRadius: '12px',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      cursor: countdown > 0 ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {otpLoading ? 'Sending...' : countdown > 0 ? `Resend (${countdown}s)` : 'Send OTP'}
                  </button>
                </div>
              </div>

              {otpSent && (
                <div className="auth-input-group">
                  <label>Verification Code (OTP)</label>
                  <div style={{ position: 'relative' }}>
                    <ShieldCheck size={18} color="#A0AEC0" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input 
                      type="text" 
                      required 
                      maxLength="6"
                      placeholder="Enter 6-Digit Code"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      style={{ paddingLeft: '40px', letterSpacing: '4px', fontWeight: 800 }}
                    />
                  </div>
                </div>
              )}

              <div className="auth-input-group">
                <label>Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} color="#A0AEC0" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required 
                    placeholder="Minimum 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength="6"
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
                <input type="checkbox" id="terms" required style={{ width: '16px', height: '16px', accentColor: '#38B2AC', cursor: 'pointer' }} />
                <label htmlFor="terms" style={{ fontSize: '0.85rem', color: '#4A5568', cursor: 'pointer' }}>I agree to the Terms & Privacy Policy</label>
              </div>
              
              <button 
                type="submit" 
                disabled={loading}
                style={{ width: '100%', marginTop: '0.5rem', padding: '16px', borderRadius: '12px', fontSize: '1rem', fontWeight: 700, background: '#38B2AC', color: '#fff', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(56, 178, 172, 0.4)' }} 
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '2.5rem', fontSize: '0.9rem', color: '#718096' }}>
              Already have an account? <Link to="/login" style={{ color: '#319795', fontWeight: 700, textDecoration: 'none' }}>Sign in</Link>
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

export default Register;
