import { useState, useRef } from 'react';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import { motion, AnimatePresence } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Download, TrendingUp, TrendingDown, AlignLeft, Target, Upload, Database, Cpu, Route, ShieldCheck, ArrowRight, FileCheck, Search } from 'lucide-react';
import { API_ENDPOINTS } from '../config';

const Home = () => {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loadingText, setLoadingText] = useState('Ingesting Vectors...');
  const scrollIntoViewRef = useRef(null);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!file || !jobDescription) {
      setError("Provide both Resume and Job Description payloads.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const texts = ['Ingesting Vectors...', 'Decoding Skill Gaps...', 'Architecting Roadmap...', 'Verifying Match Parity...'];
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

      const response = await axios.post(`${API_ENDPOINTS.ANALYSIS}/analyze-gap`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      clearInterval(loaderInterval);
      setResult(response.data.data);
      
      // Smooth scroll to results
      setTimeout(() => {
        scrollIntoViewRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred during analysis.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = () => {
    const element = document.getElementById('blueprint-results');
    const opt = {
      margin: 0,
      filename: 'BluePrint_Carrier_Architecture.pdf',
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: '#FFFFFF' },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().from(element).set(opt).save();
  };

  const radarData = result ? [
    ...result.matchedSkills.slice(0, 4).map(s => ({ skill: s, value: 100 })),
    ...result.missingSkills.slice(0, 4).map(s => ({ skill: s, value: 20 }))
  ] : [];

  return (
    <div className="container" style={{ paddingBottom: '10rem', position: 'relative' }}>
      
      {/* 1. Workbench Header */}
      <header style={{ textAlign: 'center', margin: '4rem 0 6rem' }}>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <span style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '1rem' }}>Blueprint Studio</span>
          <h1 className="font-serif" style={{ fontSize: '4.5rem', fontWeight: 800, color: '#000', lineHeight: 1.1 }}>Analysis Workbench.</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginTop: '1rem' }}>Map your professional growth against target industry vectors.</p>
        </motion.div>
      </header>

      {/* 2. Vector Ingest Station */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.2, duration: 1 }}
        style={{ 
          background: '#fff', 
          borderRadius: '40px', 
          border: '1px solid rgba(0,0,0,0.06)', 
          padding: '4rem', 
          maxWidth: '1000px', 
          margin: '0 auto 6rem',
          boxShadow: '0 40px 100px -20px rgba(0,0,0,0.04)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <AnimatePresence>
          {loading && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.95)', zIndex: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
            >
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} style={{ marginBottom: '2rem' }}>
                 <Cpu size={60} strokeWidth={1} />
              </motion.div>
              <h3 className="font-serif" style={{ fontSize: '2rem', fontWeight: 800 }}>{loadingText}</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>The AI is architecting your roadmap.</p>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleAnalyze} style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '3rem' }}>
          <div>
            <div style={{ padding: '2rem', borderRadius: '24px', border: '2px dashed rgba(0,0,0,0.1)', textAlign: 'center', marginBottom: '2rem', background: 'rgba(0,0,0,0.01)' }}>
              <Upload size={32} style={{ marginBottom: '1rem', color: 'var(--text-muted)' }} />
              <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Upload Resume</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>PDF Vectors Only</p>
              <input type="file" accept=".pdf" onChange={handleFileChange} style={{ fontSize: '0.8rem', width: '100%' }} />
            </div>
            {error && <div style={{ color: '#ef4444', fontSize: '0.9rem', padding: '10px', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '10px', border: '1px solid rgba(239, 68, 68, 0.1)' }}>{error}</div>}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <label style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}><Search size={16}/> Target JD Pattern</label>
              <textarea 
                className="input-field" 
                placeholder="Paste the Job Description here to initiate gap analysis..." 
                value={jobDescription} 
                onChange={(e) => setJobDescription(e.target.value)} 
                style={{ flex: 1, borderRadius: '16px', background: 'rgba(0,0,0,0.02)', padding: '1.5rem', resize: 'none' }}
              />
            </div>
            <button type="submit" className="btn-primary" style={{ marginTop: '2rem', width: '100%', height: '64px', borderRadius: '16px', fontSize: '1.2rem' }}>
              Execute Analysis <ArrowRight />
            </button>
          </div>
        </form>
      </motion.div>

      {/* 3. Diagnostic Results */}
      <AnimatePresence>
        {result && (
          <motion.div id="blueprint-results" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <div ref={scrollIntoViewRef} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem', padding: '0 1rem' }}>
              <div>
                <h2 className="font-serif" style={{ fontSize: '3.5rem', fontWeight: 800 }}>Analysis Matrix.</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Vectorized diagnostic of your professional ecosystem.</p>
              </div>
              <button onClick={handleDownloadPdf} className="btn-secondary" style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '14px 28px' }}>
                <Download size={20} /> Export Matrix
              </button>
            </div>

            <div className="bento-grid">
              {/* TILE 1: Primary Metrics */}
              <div className="bento-item bento-wide" style={{ display: 'flex', background: '#fff', padding: '0' }}>
                 <div style={{ flex: 1, padding: '3rem', borderRight: '1px solid rgba(0,0,0,0.05)', textAlign: 'center' }}>
                    <div style={{ fontSize: '5rem', fontWeight: 800, color: result.matchPercentage > 75 ? '#000' : '#F59E0B' }}>{result.matchPercentage}<span style={{ fontSize: '2rem' }}>%</span></div>
                    <div style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px' }}>JD Parity</div>
                 </div>
                 <div style={{ flex: 1, padding: '3rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '5rem', fontWeight: 800, color: result.atsScore > 80 ? '#000' : '#EF4444' }}>{result.atsScore}<span style={{ fontSize: '2rem' }}>%</span></div>
                    <div style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px' }}>ATS Prediction</div>
                 </div>
              </div>

              {/* TILE 2: Skill Radar */}
              <div className="bento-item bento-tall" style={{ background: '#fff', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Target size={24} /> Radar Diagnostic
                </h3>
                <div style={{ flex: 1, minHeight: '350px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                      <PolarGrid stroke="rgba(0,0,0,0.05)" />
                      <PolarAngleAxis dataKey="skill" tick={{ fill: '#666', fontSize: 11, fontWeight: 600 }} />
                      <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar name="Skills" dataKey="value" stroke="#000" fill="#000" fillOpacity={0.1} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* TILE 3: Corrections */}
              <div className="bento-item" style={{ background: '#000', color: '#fff' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FileCheck size={24} /> System Corrections
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {result.resumeImprovements?.slice(0,3).map((imp, i) => (
                    <div key={i} style={{ display: 'flex', gap: '12px', fontSize: '0.95rem', opacity: 0.8, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                       <span style={{ color: 'var(--accent-primary)' }}>•</span> {imp}
                    </div>
                  ))}
                </div>
              </div>

              {/* TILE 4: Global Trends */}
              <div className="bento-item" style={{ background: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                   <span style={{ fontWeight: 800 }}>{result.missingSkills[0] || 'GenAI'} Demand</span>
                   <span style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}><TrendingUp size={16}/> +33%</span>
                </div>
                <motion.div style={{ height: '2px', background: 'rgba(0,0,0,0.05)', position: 'relative' }}>
                   <motion.div initial={{ width: 0 }} whileInView={{ width: '75%' }} style={{ position: 'absolute', top: 0, left: 0, height: '100%', background: '#000' }} />
                </motion.div>
                <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Market indices suggest significant expansion in your missing vector node.</p>
              </div>

              {/* TILE 5: Roadmap (Big) */}
              <div className="bento-item bento-wide" style={{ background: '#fff', border: '1px solid #000' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <h3 className="font-serif" style={{ fontSize: '2.5rem', fontWeight: 800 }}>Execution Roadmap.</h3>
                    <div style={{ display: 'flex', gap: '8px', color: 'var(--text-muted)' }}><Database size={18}/><Route size={18}/></div>
                 </div>

                 <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {result.roadmap.map((step, i) => (
                      <div key={i} style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '2rem' }}>
                         <div style={{ fontSize: '2rem', fontWeight: 800, color: 'rgba(0,0,0,0.1)', fontFamily: 'serif' }}>0{i+1}</div>
                         <div style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                               <h4 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{step.task}</h4>
                               <span style={{ background: '#000', color: '#fff', padding: '4px 14px', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 600 }}>T-Minus {step.duration}</span>
                            </div>
                            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>Deconstruct the target knowledge vector through prioritized learning modules to bridge the detected skill gap.</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
