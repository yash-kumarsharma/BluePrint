import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Lock, Eye, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { API_ENDPOINTS } from '../config';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const config = { headers: { 'Content-Type': 'application/json' } };
      await axios.put(`${API_ENDPOINTS.AUTH}/reset-password/${token}`, { password }, config);
      
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Link may be invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper" style={{ background: '#F8FAFC', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: '450px', width: '100%', padding: '2rem' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ background: '#fff', borderRadius: '32px', padding: '2.5rem', border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 15px 35px rgba(0,0,0,0.03)' }}
        >
          {success ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ background: '#ECFDF5', width: '70px', height: '70px', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#047857' }}>
                 <CheckCircle size={32} />
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: 950, color: '#0F172A', marginBottom: '0.8rem', letterSpacing: '-0.04em', lineHeight: 1.1, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                Password Updated
              </h2>
              <p style={{ color: '#64748B', fontSize: '0.95rem', marginBottom: '2rem', lineHeight: 1.5, fontWeight: 500 }}>
                Your account credentials have been successfully updated. You can now log in using your new password.
              </p>

              <button 
                onClick={() => navigate('/login')}
                style={{ width: '100%', padding: '16px', borderRadius: '12px', fontSize: '1rem', fontWeight: 800, background: '#38B2AC', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(56, 178, 172, 0.4)' }}
              >
                Go to Sign In <ArrowRight size={18} />
              </button>
            </div>
          ) : (
            <div>
              <h2 style={{ fontSize: '2.4rem', fontWeight: 950, color: '#0F172A', marginBottom: '0.5rem', letterSpacing: '-0.04em', lineHeight: 1.1, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                Set New <br/> <span style={{ color: '#12B8C9' }}>Password</span>
              </h2>
              <p style={{ color: '#64748B', fontSize: '0.95rem', marginBottom: '2rem', lineHeight: 1.5, fontWeight: 500 }}>
                Please enter a secure password containing at least 6 characters.
              </p>

              {error && (
                <div style={{ color: '#e53e3e', background: '#fff5f5', padding: '12px 16px', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.88rem', border: '1px solid #fed7d7', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                
                <div className="auth-input-group">
                  <label>New Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={18} color="#A0AEC0" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      required 
                      placeholder="Minimum 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      minLength="6"
                      style={{ paddingLeft: '40px', width: '100%' }}
                    />
                    <Eye 
                      size={18} 
                      color="#A0AEC0" 
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }} 
                    />
                  </div>
                </div>

                <div className="auth-input-group">
                  <label>Confirm Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={18} color="#A0AEC0" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      required 
                      placeholder="Repeat new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      style={{ paddingLeft: '40px', width: '100%' }}
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  style={{ width: '100%', marginTop: '0.5rem', padding: '16px', borderRadius: '12px', fontSize: '1rem', fontWeight: 800, background: '#0F172A', color: '#fff', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(15, 23, 42, 0.2)' }} 
                >
                  {loading ? 'Updating Password...' : 'Save New Password'}
                </button>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#718096', margin: 0 }}>
                  Back to <Link to="/login" style={{ color: '#319795', fontWeight: 700, textDecoration: 'none' }}>Sign In</Link>
                </p>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;
