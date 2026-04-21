import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ArrowRight, Share2, FileText, ChevronRight, Hash, Trash2 } from 'lucide-react';
import { API_ENDPOINTS } from '../config';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      const userInfoStr = localStorage.getItem('userInfo');
      if (!userInfoStr) {
        navigate('/login');
        return;
      }

      const userInfo = JSON.parse(userInfoStr);
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`
          }
        };

        const { data } = await axios.get(`${API_ENDPOINTS.ANALYSIS}/history`, config);
        setHistory(data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [navigate]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  if (loading) return (
    <div className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5 }} className="font-serif" style={{ fontSize: '1.5rem' }}>
        Accessing Career Archives...
      </motion.div>
    </div>
  );

  return (
    <div className="container" style={{ paddingBottom: '10rem' }}>
      
      {/* 1. Header */}
      <header style={{ margin: '4rem 0 5rem' }}>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <span style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '1rem' }}>Digital Directory</span>
          <h1 className="font-serif" style={{ fontSize: '4.5rem', fontWeight: 800, color: '#000', lineHeight: 1.1 }}>Analysis History.</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginTop: '1rem' }}>A chronological ledger of your platform ingestions and roadmap evolutions.</p>
        </motion.div>
      </header>

      {error && <div style={{ color: '#ef4444', marginBottom: '2rem' }}>{error}</div>}
      
      <AnimatePresence>
        {history.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '6rem', borderRadius: '40px', border: '1px dashed rgba(0,0,0,0.1)', textAlign: 'center', background: 'rgba(0,0,0,0.01)' }}>
             <FileText size={48} style={{ marginBottom: '1.5rem', opacity: 0.2, margin: '0 auto 1.5rem' }} />
             <h3 className="font-serif" style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>Empty Archive.</h3>
             <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>You haven't initialized your first professional scan yet.</p>
             <Link to="/analyze" className="btn-primary" style={{ padding: '16px 32px', borderRadius: '12px' }}>Initialize First Scan</Link>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
          >
            {history.map((record, index) => (
              <motion.div 
                key={record._id} 
                variants={itemVariants}
                whileHover={{ x: 10 }}
                style={{ 
                  background: '#fff', 
                  borderRadius: '24px', 
                  padding: '2.5rem', 
                  border: '1px solid rgba(0,0,0,0.06)',
                  boxShadow: '0 20px 40px -15px rgba(0,0,0,0.03)',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  alignItems: 'center',
                  gap: '3rem',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'rgba(0,0,0,0.1)', minWidth: '40px' }}>0{index+1}</div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.4rem' }}>{new Date(record.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                       <Clock size={14} /> {new Date(record.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>

                <div>
                   <span style={{ fontWeight: 800, fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '0.5rem' }}>Target Profile</span>
                   <p style={{ fontSize: '0.95rem', fontWeight: 600, color: '#000', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '250px' }}>
                     {record.jobDescription.substring(0, 40)}...
                   </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '2rem' }}>
                   <div style={{ textAlign: 'right' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '0.4rem' }}>Match Parity</span>
                      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: record.matchPercentage > 75 ? '#000' : '#F59E0B' }}>{record.matchPercentage}%</div>
                   </div>
                   <div style={{ textAlign: 'right' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '0.4rem' }}>ATS Prediction</span>
                      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: record.atsScore > 80 ? '#000' : '#EF4444' }}>{record.atsScore}%</div>
                   </div>
                   <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '1.5rem', marginLeft: '1.5rem', borderLeft: '1px solid rgba(0,0,0,0.05)' }}>
                      <motion.div whileHover={{ x: 5 }} style={{ color: '#000' }}><ChevronRight size={24}/></motion.div>
                   </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default History;
