import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

        const { data } = await axios.get('http://localhost:5000/api/analysis/history', config);
        setHistory(data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [navigate]);

  if (loading) return <div className="container" style={{ textAlign: 'center', marginTop: '4rem' }}>Loading your career paths...</div>;

  return (
    <div className="container animate-fade-in">
      <h2 style={{ marginBottom: '2rem', color: 'var(--accent-primary)' }}>Your Analysis History</h2>
      
      {error && <div style={{ color: '#ef4444' }}>{error}</div>}
      
      {history.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>You haven't run any analysis yet. Go back to the dashboard to get started!</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {history.map((record) => (
            <div key={record._id} className="glass-panel" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ color: 'var(--text-main)' }}>Analysis from {new Date(record.createdAt).toLocaleDateString()}</h3>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <span style={{ 
                    background: record.matchPercentage > 70 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', 
                    color: record.matchPercentage > 70 ? '#10B981' : '#F59E0B', 
                    padding: '6px 16px', 
                    borderRadius: '20px', 
                    fontWeight: 'bold' 
                  }}>
                    {record.matchPercentage}% Match
                  </span>
                  {(record.atsScore || record.atsScore === 0) && (
                    <span style={{ 
                      background: record.atsScore > 75 ? 'rgba(59, 130, 246, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
                      color: record.atsScore > 75 ? '#3B82F6' : '#EF4444', 
                      padding: '6px 16px', 
                      borderRadius: '20px', 
                      fontWeight: 'bold' 
                    }}>
                      {record.atsScore}% ATS Score
                    </span>
                  )}
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <strong style={{ color: 'var(--text-muted)' }}>Target Role / ID:</strong>
                <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', opacity: 0.8 }}>{record.jobDescription.substring(0, 150)}...</p>
              </div>

              <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ color: '#EF4444', marginBottom: '0.5rem' }}>Skill Gaps Identified</h4>
                  <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    {record.missingSkills.slice(0, 5).map((skill, i) => <li key={i}>{skill}</li>)}
                  </ul>
                </div>
                
                <div style={{ flex: 1 }}>
                  <h4 style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>Top Recommendations</h4>
                  <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    {record.recommendations?.slice(0, 3).map((rec, i) => <li key={i}>{rec}</li>) || <li>No specific recommendations.</li>}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
