import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, ArrowRight, ShieldCheck } from 'lucide-react';
import { API_ENDPOINTS } from '../config';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.post(`${API_ENDPOINTS.AUTH}/register`, { name, email, password }, config);
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/');
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, staggerChildren: 0.1, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative' }}>
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="auth-card"
        style={{ 
          width: '100%', 
          maxWidth: '440px', 
          background: '#fff', 
          borderRadius: '32px', 
          padding: '3.5rem',
          border: '1px solid rgba(0,0,0,0.05)',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.05)',
          position: 'relative',
          zIndex: 10
        }}
      >
        <motion.div variants={itemVariants} style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', padding: '12px', background: 'rgba(0,0,0,0.03)', borderRadius: '16px', marginBottom: '1.5rem' }}>
            <ShieldCheck size={28} />
          </div>
          <h2 className="font-serif" style={{ fontSize: '2.5rem', fontWeight: 800, color: '#000', marginBottom: '0.5rem' }}>Create Account</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Start your journey to your dream job.</p>
        </motion.div>
        
        {error && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.05)', padding: '12px 16px', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.9rem', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
            {error}
          </motion.div>
        )}

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <motion.div variants={itemVariants}>
            <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.85rem', fontWeight: 600, color: '#000', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Full Name</label>
            <input 
              type="text" 
              required 
              className="input-field" 
              placeholder="Leonid Vovk"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ borderRadius: '12px', padding: '14px 18px', fontSize: '1rem', border: '1px solid rgba(0,0,0,0.1)' }}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.85rem', fontWeight: 600, color: '#000', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email</label>
            <input 
              type="email" 
              required 
              className="input-field" 
              placeholder="architect@blueprint.ai"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ borderRadius: '12px', padding: '14px 18px', fontSize: '1rem', border: '1px solid rgba(0,0,0,0.1)' }}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.85rem', fontWeight: 600, color: '#000', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Password</label>
            <input 
              type="password" 
              required 
              className="input-field" 
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength="6"
              style={{ borderRadius: '12px', padding: '14px 18px', fontSize: '1rem', border: '1px solid rgba(0,0,0,0.1)' }}
            />
          </motion.div>
          
          <motion.button 
            variants={itemVariants}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            className="btn-primary" 
            style={{ width: '100%', marginTop: '1rem', padding: '16px', borderRadius: '14px', fontSize: '1.1rem', gap: '10px' }} 
            disabled={loading}
          >
            {loading ? 'Creating account...' : (
              <>Get Started <ArrowRight size={20} /></>
            )}
          </motion.button>
        </form>

        <motion.p variants={itemVariants} style={{ textAlign: 'center', marginTop: '2.5rem', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: '#000', fontWeight: 700, textDecoration: 'none', borderBottom: '1.5px solid #000' }}>Sign in</Link>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Register;
