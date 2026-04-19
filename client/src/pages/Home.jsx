import { useState } from 'react';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Download, TrendingUp, TrendingDown, AlignLeft, Target } from 'lucide-react';

const Home = () => {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loadingText, setLoadingText] = useState('Extracting entities...');

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!file || !jobDescription) {
      setError("Please provide both a resume and a job description!");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Cycle loading text for micro-interaction coolness
      const texts = ['Extracting entities...', 'Identifying latent skills...', 'Calculating ATS heuristics...'];
      let ptr = 0;
      const loaderInterval = setInterval(() => {
        ptr = (ptr + 1) % texts.length;
        setLoadingText(texts[ptr]);
      }, 1500);

      const formData = new FormData();
      formData.append('resume', file);
      formData.append('jobDescription', jobDescription);

      const userInfoStr = localStorage.getItem('userInfo');
      if (userInfoStr) {
        formData.append('userId', JSON.parse(userInfoStr)._id);
      }

      const response = await axios.post('http://localhost:5000/api/analysis/analyze-gap', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      clearInterval(loaderInterval);
      setResult(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred during analysis.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = () => {
    const element = document.getElementById('roadmap-content');
    html2pdf().from(element).set({
      margin: 0.2, filename: 'Blueprint_Analysis.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: '#0B0E14' },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' }
    }).save();
  };

  // Prepare radar data
  const radarData = result ? [
    ...result.matchedSkills.slice(0, 4).map(s => ({ skill: s, value: 100 })),
    ...result.missingSkills.slice(0, 4).map(s => ({ skill: s, value: 20 }))
  ] : [];

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '5rem' }}>
      <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>Analysis Matrix</h1>
        <p style={{ color: 'var(--text-muted)' }}>Input your vectors to generate the Bento Diagnostic.</p>
      </header>

      {/* Upload Top Section */}
      <div className={`glass-panel scan-container ${loading ? 'is-scanning' : ''}`} style={{ padding: '2rem', marginBottom: '3rem', maxWidth: '800px', margin: '0 auto 3rem auto' }}>
        <div className="scan-laser"></div>
        {loading && <div style={{ position: 'absolute', top: '10px', right: '20px', color: 'var(--accent-primary)', fontSize: '0.9rem', zIndex: 30, background: 'rgba(0,0,0,0.6)', padding: '4px 10px', borderRadius: '8px' }}>{loadingText}</div>}
        
        <form onSubmit={handleAnalyze} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', position: 'relative', zIndex: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-muted)' }}>Resume Payload (PDF)</label>
            <input type="file" accept=".pdf" onChange={handleFileChange} className="input-field" style={{ height: '100%' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-muted)' }}>Target JD Pattern</label>
            <textarea rows="3" className="input-field" placeholder="Paste JD..." value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} />
          </div>
          
          <div style={{ gridColumn: 'span 2' }}>
            {error && <div style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</div>}
            <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Initializing Neural Link...' : 'Execute Analysis'}
            </button>
          </div>
        </form>
      </div>

      {/* BENTO GRID DASHBOARD */}
      {result && (
        <div id="roadmap-content" style={{ position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '2rem' }}>Diagnostic Data</h2>
            <button onClick={handleDownloadPdf} className="btn-secondary" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Download size={18} /> Export Matrix
            </button>
          </div>

          <div className="bento-grid">
            
            {/* TILE 1: Score Metrics (Wide) */}
            <div className="bento-item bento-wide" style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', background: 'radial-gradient(ellipse at top left, rgba(59, 130, 246, 0.1), transparent)' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '4rem', fontWeight: '800', color: result.matchPercentage > 70 ? '#10B981' : '#F59E0B' }}>{result.matchPercentage}%</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '1.1rem', letterSpacing: '2px' }}>JD MATCH</div>
              </div>
              <div style={{ height: '80px', width: '1px', background: 'var(--glass-border)' }}></div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '4rem', fontWeight: '800', color: result.atsScore > 75 ? '#3B82F6' : '#EF4444' }}>{result.atsScore}%</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '1.1rem', letterSpacing: '2px' }}>ATS PREDICTION</div>
              </div>
            </div>

            {/* TILE 2: Radar Chart (Tall) */}
            <div className="bento-item bento-tall" style={{ display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ color: 'var(--accent-secondary)', marginBottom: '1rem', display:'flex', alignItems:'center', gap:'8px' }}>
                <Target size={20} /> Skill Galaxy Radar
              </h3>
              <div style={{ flex: 1, minHeight: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                    <PolarAngleAxis dataKey="skill" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="Skills" dataKey="value" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.4} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* TILE 3: Market Trends & Resume Feedback */}
            <div className="bento-item">
              <h3 style={{ color: '#3B82F6', marginBottom: '1rem', display:'flex', alignItems:'center', gap:'8px' }}>
                <AlignLeft size={20} /> AI Corrections
              </h3>
              <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {result.resumeImprovements?.slice(0,3).map((imp, idx) => (
                  <li key={idx}>{imp}</li>
                )) || <li>No syntax errors detected in payload.</li>}
              </ul>
              
              <div style={{ marginTop: '2rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-main)' }}>{result.missingSkills[0] || 'CloudTech'} Demand</span>
                  <span style={{ color: '#10B981', display:'flex', alignItems:'center', gap:'4px' }}><TrendingUp size={14}/> +24% YoY</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-main)' }}>Legacy Systems</span>
                  <span style={{ color: '#EF4444', display:'flex', alignItems:'center', gap:'4px' }}><TrendingDown size={14}/> -8% YoY</span>
                </div>
              </div>
            </div>

            {/* TILE 4: Vertical Glowing Roadmap (Wide & Tall) */}
            <div className="bento-item bento-wide bento-tall" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', color: 'var(--text-main)' }}>Execution Roadmap</h3>
              
              <div className="stepper-container">
                {result.roadmap.map((step, index) => (
                  <div key={index} className="stepper-node">
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <h4 style={{ fontSize: '1.2rem', color: 'var(--accent-primary)' }}>Phase {step.step}: {step.task}</h4>
                        <span style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Timeframe: {step.duration}
                        </span>
                      </div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Execute immediately to patch detected skill gaps and improve overall ATS survival chances.</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
