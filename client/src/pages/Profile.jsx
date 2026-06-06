import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Key, Trash2, ShieldAlert, BarChart3, 
  CheckCircle, FileSearch, ArrowRight, Save, LogOut, Loader2 
} from 'lucide-react';
import { API_ENDPOINTS } from '../config';

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
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

        const { data } = await axios.get(`${API_ENDPOINTS.AUTH}/profile`, config);
        setProfile(data.data);
        setName(data.data.name);
        setEmail(data.data.email);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Password validation if new password is entered
    if (newPassword) {
      if (newPassword !== confirmPassword) {
        setError('New passwords do not match');
        return;
      }
      if (newPassword.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      if (!currentPassword) {
        setError('Please enter your current password to change it');
        return;
      }
    }

    try {
      setUpdating(true);
      const userInfoStr = localStorage.getItem('userInfo');
      const userInfo = JSON.parse(userInfoStr);

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`
        }
      };

      const payload = { name, email };
      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      const { data } = await axios.put(`${API_ENDPOINTS.AUTH}/profile`, payload, config);
      
      // Update local storage in case token or info changed
      localStorage.setItem('userInfo', JSON.stringify({
        ...userInfo,
        name: data.data.name,
        email: data.data.email,
        token: data.data.token
      }));

      setSuccess('Profile updated successfully!');
      
      // Reset password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      // Refresh profile data
      setProfile({
        ...profile,
        name: data.data.name,
        email: data.data.email
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText.toLowerCase() !== 'delete my account') {
      alert('Confirmation text does not match');
      return;
    }

    try {
      setDeleting(true);
      const userInfoStr = localStorage.getItem('userInfo');
      const userInfo = JSON.parse(userInfoStr);

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`
        }
      };

      await axios.delete(`${API_ENDPOINTS.AUTH}/profile`, config);
      
      // Purge storage & redirect
      localStorage.removeItem('userInfo');
      navigate('/register');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete account');
      setDeleting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  if (loading) return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <div style={{ position: 'relative', width: '120px', height: '120px', marginBottom: '2rem' }}>
         <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} style={{ position: 'absolute', inset: 0, border: '3px solid rgba(56, 178, 172, 0.1)', borderRadius: '50%' }} />
         <motion.div animate={{ rotate: -360 }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }} style={{ position: 'absolute', inset: '10px', border: '3px solid rgba(56, 178, 172, 0.2)', borderRadius: '50%', borderTopColor: '#38B2AC' }} />
         <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', color: '#38B2AC' }}>
            <Loader2 className="spin" size={32} style={{ animation: 'spin 2s linear infinite' }} />
         </div>
      </div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A' }}>Accessing Profile Cockpit...</h2>
    </div>
  );

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', paddingTop: '100px', paddingBottom: '100px' }}>
      <div className="container">
        
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h1 style={{ fontSize: '3.2rem', fontWeight: 900, color: '#0F172A', marginBottom: '0.2rem', letterSpacing: '-0.04em', lineHeight: 1.1, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                Manage Your
              </h1>
              <h1 style={{ fontSize: '4rem', fontWeight: 950, color: '#38B2AC', marginBottom: '1.5rem', letterSpacing: '-0.05em', lineHeight: 1, fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                Diagnostic Profile
              </h1>
              <p style={{ fontSize: '1.15rem', color: '#64748B', maxWidth: '600px', margin: '0 auto', fontWeight: 500 }}>
                Joined on {new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
           </motion.div>
        </div>

        {/* Outer Layout Grid */}
        <div className="profile-layout-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '3rem', maxWidth: '1100px', margin: '0 auto' }}>
          
          {/* LEFT COLUMN: Metrics & Stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Stats Dashboard */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              style={{ background: '#fff', borderRadius: '32px', padding: '2rem', border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}
            >
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <BarChart3 size={20} color="#38B2AC" /> Scan Performance
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ background: '#F8FAFC', padding: '1.5rem', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.02)' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: 950, color: '#0F172A', lineHeight: 1 }}>{profile.stats.totalScans}</div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.5px', textTransform: 'uppercase', marginTop: '4px' }}>Total Scans</div>
                </div>
                <div style={{ background: '#F8FAFC', padding: '1.5rem', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.02)' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: 950, color: '#9F7AEA', lineHeight: 1 }}>{profile.stats.highestAts}%</div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.5px', textTransform: 'uppercase', marginTop: '4px' }}>Best ATS Score</div>
                </div>
              </div>
              
              <div style={{ background: 'linear-gradient(135deg, #38B2AC 0%, #319795 100%)', padding: '1.5rem', borderRadius: '20px', color: '#fff' }}>
                <div style={{ fontSize: '2.2rem', fontWeight: 950, lineHeight: 1 }}>{profile.stats.avgMatch}%</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'rgba(255,255,255,0.8)', letterSpacing: '0.5px', textTransform: 'uppercase', marginTop: '4px' }}>Average Match Rate</div>
              </div>
            </motion.div>

            {/* Top Gaps (Tag Cloud) */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              style={{ background: '#fff', borderRadius: '32px', padding: '2rem', border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}
            >
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldAlert size={20} color="#EF4444" /> Identified Skill Gaps
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '1.5rem', fontWeight: 500 }}>
                Common technical deficits gathered across your historical diagnostics.
              </p>
              
              {profile.stats.topMissingSkills.length === 0 ? (
                <div style={{ padding: '1rem', background: '#F8FAFC', borderRadius: '16px', textAlign: 'center', fontSize: '0.9rem', color: '#64748B', fontWeight: 600 }}>
                  No missing skills detected yet. Keep scanning!
                </div>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                  {profile.stats.topMissingSkills.map((skill) => (
                    <div 
                      key={skill.name}
                      style={{ 
                        background: '#FFF5F5', 
                        color: '#C53030', 
                        border: '1px solid rgba(239, 68, 68, 0.15)',
                        borderRadius: '12px', 
                        padding: '6px 12px', 
                        fontSize: '0.82rem', 
                        fontWeight: 700, 
                        display: 'flex', 
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      {skill.name} <span style={{ opacity: 0.5, fontWeight: 900 }}>•</span> <span style={{ fontSize: '0.72rem', background: 'rgba(239, 68, 68, 0.1)', padding: '2px 6px', borderRadius: '6px' }}>{skill.count}x</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Logout Action */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={handleLogout}
              style={{
                width: '100%',
                background: '#fff',
                color: '#EF4444',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                padding: '16px',
                borderRadius: '24px',
                fontWeight: 800,
                fontSize: '1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.01)'
              }}
            >
              <LogOut size={18} /> Log Out of Session
            </motion.button>
          </div>

          {/* RIGHT COLUMN: Settings Form & Danger Zone */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Main Form Box */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              style={{ background: '#fff', borderRadius: '32px', padding: '2.5rem', border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}
            >
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <User size={20} color="#38B2AC" /> Account Configuration
              </h3>

              {error && (
                <div style={{ background: '#FFF5F5', color: '#C53030', padding: '1rem', borderRadius: '16px', fontWeight: 700, fontSize: '0.88rem', marginBottom: '1.5rem', border: '1px solid rgba(239, 68, 68, 0.15)' }}>
                  {error}
                </div>
              )}
              {success && (
                <div style={{ background: '#ECFDF5', color: '#047857', padding: '1rem', borderRadius: '16px', fontWeight: 700, fontSize: '0.88rem', marginBottom: '1.5rem', border: '1px solid rgba(5, 150, 105, 0.15)' }}>
                  {success}
                </div>
              )}

              <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                {/* Name */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', letterSpacing: '0.5px' }}>FULL NAME</label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                    <input 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      required
                      style={{ width: '100%', padding: '14px 16px 14px 44px', border: '1px solid #E2E8F0', borderRadius: '16px', fontSize: '0.95rem', fontWeight: 600, color: '#0F172A', background: '#F8FAFC' }}
                    />
                  </div>
                </div>

                {/* Email */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', letterSpacing: '0.5px' }}>EMAIL ADDRESS</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                    <input 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={{ width: '100%', padding: '14px 16px 14px 44px', border: '1px solid #E2E8F0', borderRadius: '16px', fontSize: '0.95rem', fontWeight: 600, color: '#0F172A', background: '#F8FAFC' }}
                    />
                  </div>
                </div>

                {/* Password Divider */}
                <div style={{ borderTop: '1px solid #F1F5F9', marginTop: '1rem', paddingTop: '1.5rem' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Key size={16} color="#38B2AC" /> Change Password (Optional)
                  </h4>
                </div>

                {/* Current Password */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', letterSpacing: '0.5px' }}>CURRENT PASSWORD</label>
                  <input 
                    type="password" 
                    value={currentPassword} 
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{ width: '100%', padding: '14px 16px', border: '1px solid #E2E8F0', borderRadius: '16px', fontSize: '0.95rem', fontWeight: 600, color: '#0F172A', background: '#F8FAFC' }}
                  />
                </div>

                {/* New Password */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', letterSpacing: '0.5px' }}>NEW PASSWORD</label>
                  <input 
                    type="password" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    style={{ width: '100%', padding: '14px 16px', border: '1px solid #E2E8F0', borderRadius: '16px', fontSize: '0.95rem', fontWeight: 600, color: '#0F172A', background: '#F8FAFC' }}
                  />
                </div>

                {/* Confirm Password */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', letterSpacing: '0.5px' }}>CONFIRM NEW PASSWORD</label>
                  <input 
                    type="password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    style={{ width: '100%', padding: '14px 16px', border: '1px solid #E2E8F0', borderRadius: '16px', fontSize: '0.95rem', fontWeight: 600, color: '#0F172A', background: '#F8FAFC' }}
                  />
                </div>

                {/* Submit */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  type="submit"
                  disabled={updating}
                  style={{
                    background: '#0F172A',
                    color: '#fff',
                    border: 'none',
                    padding: '16px',
                    borderRadius: '16px',
                    fontWeight: 800,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginTop: '1rem',
                    boxShadow: '0 8px 24px rgba(15,23,42,0.1)'
                  }}
                >
                  {updating ? (
                    <>
                      <Loader2 className="spin" size={18} style={{ animation: 'spin 2s linear infinite' }} /> Saving Config...
                    </>
                  ) : (
                    <>
                      <Save size={18} /> Save Configurations
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>

            {/* Danger Zone Box */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              style={{ background: '#FFF5F5', borderRadius: '32px', padding: '2rem', border: '1px solid rgba(239, 68, 68, 0.15)' }}
            >
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#991b1b', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldAlert size={18} /> Danger Zone
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#991b1b', opacity: 0.8, marginBottom: '1.5rem', lineHeight: 1.5, fontWeight: 500 }}>
                Permanently purge your account details and clear all historical diagnostic scans from our databases. This action is irreversible.
              </p>
              
              <button
                onClick={() => setShowDeleteModal(true)}
                style={{
                  background: '#C53030',
                  color: '#fff',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '16px',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(197,48,48,0.2)'
                }}
              >
                <Trash2 size={16} /> Terminate Account
              </button>
            </motion.div>
          </div>
        </div>

        {/* Back Link */}
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
           <Link to="/analyze" style={{ color: '#38B2AC', textDecoration: 'none', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '1.1rem' }}>
              Back to Analyzer <ArrowRight size={20} />
           </Link>
        </div>

      </div>

      {/* 🗑️ DOUBLE CONFIRMATION DELETE MODAL */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.45)', backdropFilter: 'blur(8px)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{ background: '#fff', maxWidth: '450px', width: '100%', borderRadius: '32px', padding: '2.5rem', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
            >
              <div style={{ background: '#FFF5F5', width: '70px', height: '70px', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#C53030' }}>
                 <ShieldAlert size={32} />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0F172A', marginBottom: '0.8rem', letterSpacing: '-0.02em' }}>Irreversible Deletion</h3>
              <p style={{ color: '#64748B', lineHeight: 1.6, marginBottom: '1.5rem', fontSize: '0.95rem', fontWeight: 500 }}>
                Type <strong style={{ color: '#0F172A' }}>"delete my account"</strong> below to confirm account termination. All diagnostic archives will be deleted.
              </p>
              
              <input 
                type="text"
                placeholder='Type: "delete my account"'
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', border: '1px solid #E2E8F0', borderRadius: '12px', fontSize: '0.92rem', fontWeight: 600, color: '#0F172A', marginBottom: '2rem', textAlign: 'center' }}
              />

              <div style={{ display: 'flex', gap: '1rem' }}>
                 <button 
                   onClick={() => setShowDeleteModal(false)}
                   disabled={deleting}
                   style={{ flex: 1, padding: '14px', borderRadius: '16px', background: '#F1F5F9', color: '#475569', border: 'none', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s' }}
                 >
                   Cancel
                 </button>
                 <button 
                   onClick={handleDeleteAccount}
                   disabled={deleting || deleteConfirmText.toLowerCase() !== 'delete my account'}
                   style={{ 
                     flex: 1, 
                     padding: '14px', 
                     borderRadius: '16px', 
                     background: deleteConfirmText.toLowerCase() === 'delete my account' ? '#C53030' : '#E2E8F0', 
                     color: deleteConfirmText.toLowerCase() === 'delete my account' ? '#fff' : '#94A3B8', 
                     border: 'none', 
                     fontWeight: 800, 
                     cursor: deleteConfirmText.toLowerCase() === 'delete my account' ? 'pointer' : 'not-allowed', 
                     transition: 'all 0.2s', 
                     boxShadow: deleteConfirmText.toLowerCase() === 'delete my account' ? '0 8px 20px rgba(197, 48, 48, 0.25)' : 'none' 
                   }}
                 >
                   {deleting ? 'Terminating...' : 'Purge All'}
                 </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Styled Grid Responsiveness */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 900px) {
          .profile-layout-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}} />
    </div>
  );
};

export default Profile;
