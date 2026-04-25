import { useState, useRef } from 'react';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import { motion, AnimatePresence } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Download, TrendingUp, TrendingDown, AlignLeft, Target, Upload, Database, Cpu, Route, ShieldCheck, ArrowRight, FileCheck, Search, CheckCircle2, XCircle, Play, ExternalLink, BookOpen, GraduationCap } from 'lucide-react';
import { API_ENDPOINTS } from '../config';

// 📄 SHADOW TEMPLATE: Optimized for PDF Generation (No Scrolls)
const ExportTemplate = ({ result, radarData }) => {
  if (!result) return null;
  return (
    <div id="pdf-export-template" style={{ 
      width: '800px', 
      padding: '40px', 
      background: '#FDFCFB', 
      color: '#000',
      fontFamily: "'Plus Jakarta Sans', sans-serif" 
    }}>
      <header style={{ marginBottom: '40px', borderBottom: '2px solid #000', paddingBottom: '20px' }}>
         <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '3rem', margin: 0 }}>BluePrint Matrix.</h1>
         <p style={{ fontSize: '1.2rem', color: '#555', margin: '10px 0 0' }}>Professional Vector Analysis & Career Roadmap</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        <div style={{ padding: '30px', background: '#fff', border: '1px solid #eee', borderRadius: '20px', textAlign: 'center' }}>
           <div style={{ fontSize: '4rem', fontWeight: 800 }}>{result.matchPercentage}%</div>
           <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#666', textTransform: 'uppercase' }}>JD MATCHED</div>
        </div>
        <div style={{ padding: '30px', background: '#fff', border: '1px solid #eee', borderRadius: '20px', textAlign: 'center' }}>
           <div style={{ fontSize: '4rem', fontWeight: 800 }}>{result.atsScore}%</div>
           <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#666', textTransform: 'uppercase' }}>ATS SCORE</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '20px', marginBottom: '30px' }}>
         <div style={{ padding: '20px', background: '#fff', border: '1px solid #eee', borderRadius: '20px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '20px' }}>Skill Radar</h3>
            <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="60%" data={radarData}>
                    <PolarGrid stroke="#eee" />
                    <PolarAngleAxis dataKey="skill" tick={{ fill: '#333', fontSize: 10, fontWeight: 600 }} />
                    <Radar name="Skills" dataKey="value" stroke="#000" fill="#000" fillOpacity={0.1} />
                </RadarChart>
                </ResponsiveContainer>
            </div>
         </div>
         <div style={{ padding: '20px', background: '#fff', border: '1px solid #eee', borderRadius: '20px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '15px', color: '#10B981' }}>Matched Skills</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                {result.matchedSkills.map((s, i) => <span key={i} style={{ fontSize: '0.85rem', background: '#f0fdf4', padding: '5px 10px', borderRadius: '5px' }}>{s}</span>)}
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '15px', color: '#EF4444' }}>Missing Skills</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {result.missingSkills.map((s, i) => <span key={i} style={{ fontSize: '0.85rem', background: '#fef2f2', padding: '5px 10px', borderRadius: '5px' }}>{s}</span>)}
            </div>
         </div>
      </div>

      <div style={{ padding: '30px', background: '#000', color: '#fff', borderRadius: '20px', marginBottom: '30px' }}>
         <h3 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>System Corrections</h3>
         {result.resumeImprovements.map((imp, i) => (
             <div key={i} style={{ marginBottom: '15px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
                <span style={{ fontWeight: 800, marginRight: '10px' }}>0{i+1}</span> {imp}
             </div>
         ))}
      </div>

      <div style={{ padding: '30px', background: '#fff', border: '1px solid #000', borderRadius: '20px' }}>
         <h3 style={{ fontSize: '1.5rem', marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Execution Roadmap</h3>
         {result.roadmap.map((step, i) => (
             <div key={i} style={{ marginBottom: '25px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800 }}>
                    <span>STEP 0{i+1}: {step.task}</span>
                    <span>{step.duration}</span>
                </div>
                <p style={{ color: '#555', marginTop: '10px' }}>{result.recommendations[i] || 'Practical implementation phase.'}</p>
             </div>
         ))}
      </div>
    </div>
  );
};

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
    // 🎯 TARGET THE SHADOW BOX
    const element = document.getElementById('pdf-export-template');
    
    const opt = {
      margin: 5,
      filename: 'BluePrint_Final_Diagnostic.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
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
      
      {/* 🟢 THE SHADOW BOX: Always rendered but hidden off-screen */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
         <ExportTemplate result={result} radarData={radarData} />
      </div>

      <header style={{ textAlign: 'center', margin: '4rem 0 6rem' }}>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <span style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '1rem' }}>Blueprint Studio</span>
          <h1 className="font-serif" style={{ fontSize: '4.5rem', fontWeight: 800, color: '#000', lineHeight: 1.1 }}>Analysis Workbench.</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginTop: '1rem' }}>Map your professional growth against target industry vectors.</p>
        </motion.div>
      </header>

      <motion.div 
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 1 }}
        className="workbench-card"
        style={{ background: '#fff', borderRadius: '40px', border: '1px solid rgba(0,0,0,0.06)', padding: '4rem', maxWidth: '1000px', margin: '0 auto 6rem', boxShadow: '0 40px 100px -20px rgba(0,0,0,0.04)', position: 'relative', overflow: 'hidden' }}
      >
        <AnimatePresence>
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.95)', zIndex: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} style={{ marginBottom: '2rem' }}><Cpu size={60} strokeWidth={1} /></motion.div>
              <h3 className="font-serif" style={{ fontSize: '2rem', fontWeight: 800 }}>{loadingText}</h3>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleAnalyze} style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '3rem' }}>
          <div>
            <div style={{ padding: '2rem', borderRadius: '24px', border: '2px dashed rgba(0,0,0,0.1)', textAlign: 'center', marginBottom: '2rem', background: 'rgba(0,0,0,0.01)' }}>
              <Upload size={32} style={{ marginBottom: '1rem', color: 'var(--text-muted)' }} /><h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Upload Resume</h4>
              <input type="file" accept=".pdf" onChange={handleFileChange} style={{ fontSize: '0.8rem', width: '100%' }} />
            </div>
            {error && <div style={{ color: '#ef4444', fontSize: '0.9rem', padding: '10px' }}>{error}</div>}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <textarea className="input-field" placeholder="Paste the Job Description here..." value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} style={{ flex: 1, borderRadius: '16px', background: 'rgba(0,0,0,0.02)', padding: '1.5rem', resize: 'none' }} />
            <button type="submit" className="btn-primary" style={{ marginTop: '2rem', width: '100%', height: '64px', borderRadius: '16px' }}>Execute Analysis <ArrowRight /></button>
          </div>
        </form>
      </motion.div>

      <AnimatePresence>
        {result && (
          <motion.div id="blueprint-results" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <div ref={scrollIntoViewRef} className="results-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
              <div><h2 className="font-serif" style={{ fontSize: '3.5rem', fontWeight: 800 }}>Analysis Matrix.</h2></div>
              <button onClick={handleDownloadPdf} className="btn-secondary" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><Download size={20} /> Export Matrix</button>
            </div>

            <div className="bento-grid">
              <div className="bento-item bento-wide metrics-tile" style={{ display: 'flex', background: '#fff', padding: '0' }}>
                 <div style={{ flex: 1, padding: '3rem', borderRight: '1px solid rgba(0,0,0,0.05)', textAlign: 'center' }}>
                    <div className="metric-value" style={{ fontSize: '5rem', fontWeight: 800 }}>{result.matchPercentage}%</div><div style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)' }}>JD MATCHED</div>
                 </div>
                 <div style={{ flex: 1, padding: '3rem', textAlign: 'center' }}>
                    <div className="metric-value" style={{ fontSize: '5rem', fontWeight: 800 }}>{result.atsScore}%</div><div style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)' }}>ATS SCORE</div>
                 </div>
              </div>

              <div className="bento-item bento-tall custom-scrollbar radar-tile" style={{ background: '#fff', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '2rem' }}><Target size={24} /> Radar Diagnostic</h3>
                <div className="radar-container" style={{ flex: 1, minHeight: '350px', minWidth: '400px' }}>
                  <ResponsiveContainer width="100%" height="100%"><RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}><PolarGrid stroke="rgba(0,0,0,0.05)" /><PolarAngleAxis dataKey="skill" tick={{ fill: '#666', fontSize: 10, fontWeight: 600 }} /><Radar name="Skills" dataKey="value" stroke="#000" fill="#000" fillOpacity={0.1} /></RadarChart></ResponsiveContainer>
                </div>
              </div>

              <div className="bento-item custom-scrollbar" style={{ background: '#fff', display: 'flex', flexDirection: 'column', gap: '1.5rem', maxHeight: '400px', overflowY: 'auto' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10B981' }}><CheckCircle2 size={20} /> Matched Skills</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>{result.matchedSkills.map((s, i) => <span key={i} style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '4px 12px', borderRadius: '8px', fontSize: '0.85rem' }}>{s}</span>)}</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#EF4444' }}><XCircle size={20} /> Missing Skills</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>{result.missingSkills.map((s, i) => <span key={i} style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '4px 12px', borderRadius: '8px', fontSize: '0.85rem' }}>{s}</span>)}</div>
              </div>

              <div className="bento-item custom-scrollbar" style={{ background: '#000', color: '#fff', maxHeight: '400px', overflowY: 'auto' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.5rem' }}><FileCheck size={24} /> System Corrections</h3>
                {result.resumeImprovements?.map((imp, i) => <div key={i} style={{ display: 'flex', gap: '14px', marginBottom: '1rem' }}><div style={{ minWidth: '24px', height: '24px', background: 'rgba(255,255,255,0.1)', borderRadius: '6px', textAlign: 'center' }}>0{i+1}</div><p style={{ opacity: 0.85 }}>{imp}</p></div>)}
              </div>

              <div className="bento-item bento-wide" style={{ background: '#fff', border: '1px solid #000', maxHeight: '600px', display: 'flex', flexDirection: 'column' }}>
                 <h3 className="font-serif" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem' }}>Execution Roadmap.</h3>
                 <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto' }}>
                    {result.roadmap.map((step, i) => <div key={i} className="roadmap-step" style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '2rem', marginBottom: '2rem' }}><div style={{ fontSize: '2rem', fontWeight: 800, opacity: 0.1 }}>0{i+1}</div><div><div style={{ display: 'flex', justifyContent: 'space-between' }}><h4>{step.task}</h4><span style={{ background: '#000', color: '#fff', padding: '4px 12px', borderRadius: '99px' }}>{step.duration}</span></div><p style={{ color: 'var(--text-muted)' }}>{result.recommendations[i] || 'Skill gap bridge phase.'}</p></div></div>)}
                 </div>
              </div>

              <div className="bento-item" style={{ background: '#fff', display: 'flex', flexDirection: 'column' }}>
                 <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '2rem' }}><GraduationCap size={24} /> Knowledge Hub</h3>
                 <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {result.learningResources?.map((res, i) => <a key={i} href={res.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', padding: '1rem', background: 'rgba(0,0,0,0.02)', borderRadius: '12px' }}>{res.platform === 'YouTube' ? <Play size={20} color="#FF0000" /> : <BookOpen size={20} />}<div><div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#000' }}>{res.title}</div><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{res.platform}</div></div></a>)}
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
