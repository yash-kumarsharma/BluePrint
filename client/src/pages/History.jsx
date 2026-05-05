import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, ArrowRight, FileText, ChevronRight, Trash2, 
  Search, Filter, Calendar, Zap, Cpu, Sparkles 
} from 'lucide-react';
import { API_ENDPOINTS } from '../config';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });
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

  const confirmDelete = async () => {
    const id = deleteModal.id;
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      await axios.delete(`${API_ENDPOINTS.ANALYSIS}/${id}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      setHistory(history.filter(item => item._id !== id));
      setDeleteModal({ show: false, id: null });
    } catch (err) {
      alert('Failed to delete analysis');
    }
  };

  const handleDeleteTrigger = (e, id) => {
    e.stopPropagation();
    setDeleteModal({ show: true, id });
  };

  if (loading) return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <div style={{ position: 'relative', width: '120px', height: '120px', marginBottom: '2rem' }}>
         <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} style={{ position: 'absolute', inset: 0, border: '3px solid rgba(18, 184, 201, 0.1)', borderRadius: '50%' }} />
         <motion.div animate={{ rotate: -360 }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }} style={{ position: 'absolute', inset: '10px', border: '3px solid rgba(18, 184, 201, 0.2)', borderRadius: '50%', borderTopColor: '#12B8C9' }} />
         <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', color: '#12B8C9' }}>
            <Clock className="spin" size={32} />
         </div>
      </div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A' }}>Accessing Archives...</h2>
    </div>
  );

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', paddingTop: '100px', paddingBottom: '100px' }}>
      <div className="container">
        
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h1 style={{ fontSize: '3.2rem', fontWeight: 900, color: '#0F172A', marginBottom: '0.2rem', letterSpacing: '-0.04em', lineHeight: 1.1, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                Your Career
              </h1>
              <h1 style={{ fontSize: '4rem', fontWeight: 950, color: '#12B8C9', marginBottom: '1.5rem', letterSpacing: '-0.05em', lineHeight: 1, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                Analysis Archives
              </h1>
              <p style={{ fontSize: '1.2rem', color: '#64748B', maxWidth: '600px', margin: '0 auto', fontWeight: 500 }}>
                Track your professional evolution across {history.length} deep-scan sessions.
              </p>
           </motion.div>
        </div>

        {/* Archives Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="responsive-history-container"
          style={{ 
            maxWidth: '1100px', 
            margin: '0 auto', 
            background: '#E6F4F1', 
            borderRadius: '60px', 
            boxShadow: '0 40px 100px rgba(0,0,0,0.03)'
          }}
        >
           {error && <div style={{ color: '#ef4444', marginBottom: '2rem', textAlign: 'center', fontWeight: 700 }}>{error}</div>}

           <AnimatePresence>
             {history.length === 0 ? (
               <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                  <div style={{ background: '#fff', width: '100px', height: '100px', borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', color: '#CBD5E1' }}>
                     <FileText size={48} />
                  </div>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A', marginBottom: '1rem' }}>No Records Found</h3>
                  <p style={{ color: '#64748B', marginBottom: '2.5rem', fontSize: '1.1rem' }}>You haven't initialized your first professional scan yet.</p>
                  <Link to="/analyze" style={{ background: '#0F172A', color: '#fff', padding: '16px 40px', borderRadius: '99px', textDecoration: 'none', fontWeight: 800, fontSize: '1.1rem', display: 'inline-block' }}>
                     Run First Analysis
                  </Link>
               </div>
             ) : (
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem' }}>
                  <div className="mobile-hidden" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', padding: '0 1rem' }}>
                     <div style={{ fontWeight: 800, color: '#38B2AC', letterSpacing: '1px', fontSize: '0.85rem' }}>ALL HISTORICAL SCANS</div>
                     <div style={{ display: 'flex', gap: '1rem' }}>
                        <button style={{ background: '#fff', border: 'none', padding: '8px 16px', borderRadius: '12px', fontWeight: 700, fontSize: '0.8rem', color: '#64748B', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                           <Filter size={14} /> Filter
                        </button>
                        <button style={{ background: '#fff', border: 'none', padding: '8px 16px', borderRadius: '12px', fontWeight: 700, fontSize: '0.8rem', color: '#64748B', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                           <Search size={14} /> Search
                        </button>
                     </div>
                  </div>

                  {history.map((record, index) => (
                    <motion.div 
                      key={record._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.01, x: 5 }}
                      onClick={() => navigate(`/analyze?id=${record._id}`)}
                      className="history-record-card"
                      style={{ 
                        background: '#fff', 
                        borderRadius: '32px', 
                        padding: '2rem', 
                        display: 'grid', 
                        alignItems: 'center', 
                        gap: '2.5rem', 
                        cursor: 'pointer',
                        border: '1px solid rgba(0,0,0,0.02)',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.02)'
                      }}
                    >
                       {/* Date/Time Section */}
                       <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                          <div style={{ width: '50px', height: '50px', background: '#F8FAFC', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38B2AC' }}>
                             <Calendar size={22} />
                          </div>
                          <div>
                             <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '1.1rem' }}>
                                {new Date(record.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                             </div>
                             <div style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 700 }}>
                                {new Date(record.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                             </div>
                          </div>
                       </div>

                       {/* JD Preview */}
                       <div>
                          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#38B2AC', letterSpacing: '1px', marginBottom: '4px' }}>TARGET ROLE</div>
                          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '300px' }}>
                             {record.jobDescription.split('\n')[0] || 'Unspecified Role'}
                          </h4>
                       </div>

                       {/* Scores Section */}
                       <div className="history-scores-row" style={{ display: 'flex', gap: '2rem', padding: '0 2rem' }}>
                          <div style={{ textAlign: 'center' }}>
                             <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#38B2AC' }}>{record.matchPercentage}%</div>
                             <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94A3B8', letterSpacing: '1px' }}>JD MATCH</div>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                             <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#9F7AEA' }}>{record.atsScore}%</div>
                             <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94A3B8', letterSpacing: '1px' }}>ATS SCORE</div>
                          </div>
                       </div>

                       {/* Actions */}
                       <div className="mobile-hidden" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <button 
                            onClick={(e) => handleDeleteTrigger(e, record._id)}
                            style={{ background: '#FFF5F5', color: '#C53030', border: 'none', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                            onMouseOver={(e) => e.currentTarget.style.background = '#FED7D7'}
                            onMouseOut={(e) => e.currentTarget.style.background = '#FFF5F5'}
                          >
                             <Trash2 size={18} />
                          </button>
                          <div style={{ color: '#CBD5E1' }}>
                             <ChevronRight size={24} />
                          </div>
                       </div>
                    </motion.div>
                  ))}
               </div>
             )}
           </AnimatePresence>
        </motion.div>

        {/* CSS for responsiveness */}
        <style dangerouslySetInnerHTML={{ __html: `
          .responsive-history-container {
            padding: 4rem;
          }
          .history-record-card {
            grid-template-columns: auto 1fr auto auto;
          }
          .history-scores-row {
            border-left: 1px solid #F1F5F9;
            border-right: 1px solid #F1F5F9;
          }
          
          @media (max-width: 768px) {
            .responsive-history-container {
              padding: 1.5rem !important;
              border-radius: 32px !important;
            }
            .history-record-card {
              grid-template-columns: 1fr !important;
              gap: 1.5rem !important;
              padding: 1.5rem !important;
              border-radius: 24px !important;
            }
            .history-scores-row {
              border-left: none !important;
              border-right: none !important;
              padding: 0 !important;
              justify-content: space-around;
              background: #F8FAFC;
              padding: 1rem !important;
              border-radius: 16px;
            }
            .mobile-hidden {
              display: none !important;
            }
          }
        `}} />

        {/* 🗑️ DELETE CONFIRMATION MODAL */}
        <AnimatePresence>
          {deleteModal.show && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}
              onClick={() => setDeleteModal({ show: false, id: null })}
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                style={{ background: '#fff', maxWidth: '450px', width: '100%', borderRadius: '32px', padding: '2.5rem', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
              >
                <div style={{ background: '#FFF5F5', width: '70px', height: '70px', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#C53030' }}>
                   <Trash2 size={32} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0F172A', marginBottom: '0.8rem', letterSpacing: '-0.02em' }}>Delete Analysis?</h3>
                <p style={{ color: '#64748B', lineHeight: 1.6, marginBottom: '2rem', fontSize: '1rem', fontWeight: 500 }}>
                  This action cannot be undone. You will lose all your AI insights and roadmaps for this session.
                </p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                   <button 
                     onClick={() => setDeleteModal({ show: false, id: null })}
                     style={{ flex: 1, padding: '14px', borderRadius: '16px', background: '#F1F5F9', color: '#475569', border: 'none', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s' }}
                   >
                     Cancel
                   </button>
                   <button 
                     onClick={confirmDelete}
                     style={{ flex: 1, padding: '14px', borderRadius: '16px', background: '#C53030', color: '#fff', border: 'none', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 8px 20px rgba(197, 48, 48, 0.25)' }}
                   >
                     Delete
                   </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Action */}
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
           <Link to="/analyze" style={{ color: '#38B2AC', textDecoration: 'none', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '1.1rem' }}>
              Back to Analyzer <ArrowRight size={20} />
           </Link>
        </div>

      </div>
    </div>
  );
};

export default History;
