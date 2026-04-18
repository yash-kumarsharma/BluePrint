import { useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!file || !jobDescription) {
      setError("Please provide both a resume and a job description!");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append('resume', file);
      formData.append('jobDescription', jobDescription);

      const response = await axios.post('http://localhost:5000/api/analysis/analyze-gap', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setResult(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred during analysis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in">
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1rem' }}>BluePrint</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>AI-Powered Career Path & Skill Gap Analyzer</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: result ? '1fr 1fr' : '1fr', gap: '2rem', transition: 'all 0.5s ease' }}>
        
        {/* Upload Form - Left Side */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--accent-primary)' }}>Analyze Your Profile</h2>
          
          <form onSubmit={handleAnalyze} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>1. Upload Resume (PDF)</label>
              <input 
                type="file" 
                accept=".pdf" 
                onChange={handleFileChange} 
                className="input-field" 
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>2. Target Job Description</label>
              <textarea 
                rows="6" 
                className="input-field" 
                placeholder="Paste the job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>
            
            {error && <div style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '8px' }}>{error}</div>}

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Analyzing with AI...' : 'Generate Career Roadmap'}
            </button>
          </form>
        </div>

        {/* Results - Right Side */}
        {result && (
          <div className="glass-panel animate-fade-in" style={{ padding: '2rem', borderTop: '4px solid var(--accent-secondary)' }}>
            <h2 style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
              Analysis Results
              <span style={{ color: result.matchPercentage > 70 ? '#10B981' : '#F59E0B' }}>
                {result.matchPercentage}% Match
              </span>
            </h2>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#10B981', marginBottom: '0.5rem' }}>✅ Matched Skills</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {result.matchedSkills.map((skill, index) => (
                  <span key={index} style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', padding: '4px 12px', borderRadius: '20px', fontSize: '0.9rem' }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#EF4444', marginBottom: '0.5rem' }}>❌ Missing Skills (Gaps)</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {result.missingSkills.map((skill, index) => (
                  <span key={index} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', padding: '4px 12px', borderRadius: '20px', fontSize: '0.9rem' }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }}>🗺️ Your Learning Roadmap</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {result.roadmap.map((step, index) => (
                  <div key={index} style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', borderLeft: '3px solid var(--accent-primary)' }}>
                    <h4 style={{ marginBottom: '0.25rem' }}>Step {step.step}: {step.task}</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>⏱️ Duration: {step.duration}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
