import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { 
  Download, Upload, Cpu, ArrowRight, FileCheck, CheckCircle2, XCircle, 
  Play, BookOpen, Layers, Star, Info, Timer, Zap, AlertCircle, Sparkles, Plus, Mic, Send
} from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { API_ENDPOINTS } from '../config';

// 📄 SHADOW TEMPLATE: Optimized for PDF Generation (Matching the new UI)
const ExportTemplate = ({ result }) => {
  if (!result) return null;
  return (
    <div id="pdf-export-template" style={{ width: '800px', padding: '40px', background: '#fff', color: '#000', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <header style={{ marginBottom: '40px', borderBottom: '2px solid #38B2AC', paddingBottom: '20px' }}>
         <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0 }}>BluePrint Matrix.</h1>
         <p style={{ fontSize: '1rem', color: '#666' }}>Career Intelligence Diagnostic Report</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '40px' }}>
        <div style={{ padding: '20px', background: '#F7FAFC', borderRadius: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#38B2AC' }}>{result.matchPercentage}%</div>
          <div style={{ fontSize: '0.7rem', fontWeight: 800 }}>JD MATCH</div>
        </div>
        <div style={{ padding: '20px', background: '#F7FAFC', borderRadius: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#9F7AEA' }}>{result.atsScore}%</div>
          <div style={{ fontSize: '0.7rem', fontWeight: 800 }}>ATS SCORE</div>
        </div>
        <div style={{ padding: '20px', background: '#F7FAFC', borderRadius: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#48BB78' }}>4.5/5</div>
          <div style={{ fontSize: '0.7rem', fontWeight: 800 }}>READINESS</div>
        </div>
      </div>

      <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Verified Skills</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '30px' }}>
        {result.matchedSkills.map((s, i) => <span key={i} style={{ padding: '6px 12px', background: '#E6FFFA', color: '#2C7A7B', borderRadius: '8px', fontSize: '0.8rem' }}>{s}</span>)}
      </div>

      <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Missing Skills (Critical Gaps)</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '30px' }}>
        {result.missingSkills.map((s, i) => <span key={i} style={{ padding: '6px 12px', background: '#FFF5F5', color: '#C53030', borderRadius: '8px', fontSize: '0.8rem' }}>{s}</span>)}
      </div>

      <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Phased Roadmap</h3>
      {result.roadmap.map((step, i) => (
        <div key={i} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #eee', borderRadius: '12px' }}>
          <div style={{ fontWeight: 800 }}>PHASE {i+1}: {step.task}</div>
          <div style={{ fontSize: '0.8rem', color: '#666' }}>Duration: {step.duration}</div>
        </div>
      ))}
    </div>
  );
};

const Home = () => {
  const location = useLocation();
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loadingText, setLoadingText] = useState('Ingesting Vectors...');
  const [activeTab, setActiveTab] = useState('matched');
  const resultsRef = useRef(null);

  const [jdMode, setJdMode] = useState('paste'); // 'paste' or 'url'
  const [scrapeUrl, setScrapeUrl] = useState('');
  const [scraping, setScraping] = useState(false);
  const [scrapeError, setScrapeError] = useState('');
  const [scrapeSuccess, setScrapeSuccess] = useState(false);

  const handleScrapeUrl = async () => {
    if (!scrapeUrl) {
      setScrapeError("Provide a valid Job Posting URL.");
      return;
    }
    if (!scrapeUrl.startsWith('http://') && !scrapeUrl.startsWith('https://')) {
      setScrapeError("URL must start with http:// or https://");
      return;
    }

    try {
      setScraping(true);
      setScrapeError('');
      setScrapeSuccess(false);

      const response = await axios.post(`${API_ENDPOINTS.ANALYSIS}/scrape-jd`, {
        url: scrapeUrl
      });

      if (response.data?.success) {
        setJobDescription(response.data.text);
        setScrapeSuccess(true);
        setTimeout(() => {
          setJdMode('paste');
          setScrapeSuccess(false);
          setScrapeUrl('');
        }, 1500);
      } else {
        setScrapeError("Failed to parse the job posting.");
      }
    } catch (err) {
      setScrapeError(err.response?.data?.message || "Failed to fetch job description. Please paste it manually.");
    } finally {
      setScraping(false);
    }
  };

  // 🔄 Fetch Analysis by ID if present in URL
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const id = query.get('id');

    if (id) {
      const fetchAnalysis = async () => {
        try {
          setLoading(true);
          const userInfo = JSON.parse(localStorage.getItem('userInfo'));
          if (!userInfo) return;

          const { data } = await axios.get(`${API_ENDPOINTS.ANALYSIS}/${id}`, {
            headers: { Authorization: `Bearer ${userInfo.token}` }
          });
          setResult(data.data);
          setJobDescription(data.data.jobDescription);
        } catch (err) {
          setError("Failed to load historical analysis.");
        } finally {
          setLoading(false);
        }
      };
      fetchAnalysis();
    }
  }, [location]);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleAnalyze = async (e) => {
    if (e) e.preventDefault();
    if (!file || !jobDescription) {
      setError("Provide both Resume and Job Description payloads.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const texts = ['Reading Resume...', 'Finding Skill Gaps...', 'Creating Roadmap...', 'Finalizing Analysis...'];
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
      
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred during analysis.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = () => {
    const element = document.getElementById('pdf-export-template');
    const opt = {
      margin: 5,
      filename: 'BluePrint_Career_Diagnostic.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().from(element).set(opt).save();
  };

  const radarData = result ? [
    ...result.matchedSkills.slice(0, 5).map(s => ({ skill: s, value: 100 })),
    ...result.missingSkills.slice(0, 5).map(s => ({ skill: s, value: 30 }))
  ] : [];

  // Scroll to results when they appear
  useEffect(() => {
    if (result && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [result]);

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', paddingTop: '80px' }}>
      
      {/* 🔴 SHADOW EXPORT BOX */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
         <ExportTemplate result={result} />
      </div>

      <div className="container" style={{ paddingBottom: '100px' }}>
        
        {/* PHASE 1: UPLOAD & INPUT (Wrapped in Large Card as per latest image) */}
        {!result && !loading && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="responsive-workspace-card"
            style={{ 
              maxWidth: '1200px', 
              margin: '0 auto', 
              background: '#E6F4F1', 
              borderRadius: '60px', 
              boxShadow: '0 40px 100px rgba(0,0,0,0.03)'
            }}
          >
            <div className="hero-header-container">
              <h1 className="hero-title-top">
                Analyze Your Resume Against
              </h1>
              <h1 className="hero-title-main">
                Job Description
              </h1>
              <p className="hero-subtitle">
                Get instant insights on JD match, ATS compatibility, and your <span className="desktop-br"><br/></span> personalized improvement roadmap in seconds.
              </p>
            </div>

            <div className="input-layout-grid" style={{ marginBottom: '4rem' }}>
              {/* Resume Upload Box */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 800, color: '#38B2AC', letterSpacing: '1px', fontSize: '0.9rem' }}>
                   <Upload size={20} /> 1. UPLOAD YOUR RESUME
                </div>
                <div className="upload-box hover-lift">
                   <div style={{ background: '#E6F4F1', color: '#38B2AC', width: '70px', height: '70px', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                      <Upload size={32} />
                   </div>
                   <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '1.2rem', wordBreak: 'break-all', textAlign: 'center', padding: '0 1rem', maxWidth: '100%' }}>{file ? file.name : "Drag & drop PDF here"}</div>
                   <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 700 }}>OR CLICK TO BROWSE</div>
                   <input type="file" accept=".pdf" onChange={handleFileChange} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                </div>
              </div>

              {/* JD Input Box */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 800, color: '#38B2AC', letterSpacing: '1px', fontSize: '0.9rem' }}>
                     <FileCheck size={20} /> 2. JOB DESCRIPTION (JD)
                  </div>
                  <div style={{ display: 'flex', background: '#E2E8F0', padding: '4px', borderRadius: '12px', gap: '4px' }}>
                    <button
                      type="button"
                      onClick={() => setJdMode('paste')}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '8px',
                        border: 'none',
                        background: jdMode === 'paste' ? '#fff' : 'transparent',
                        color: jdMode === 'paste' ? '#0F172A' : '#64748B',
                        fontWeight: 800,
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        boxShadow: jdMode === 'paste' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                        transition: 'all 0.2s'
                      }}
                    >
                      Paste Text
                    </button>
                    <button
                      type="button"
                      onClick={() => setJdMode('url')}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '8px',
                        border: 'none',
                        background: jdMode === 'url' ? '#fff' : 'transparent',
                        color: jdMode === 'url' ? '#0F172A' : '#64748B',
                        fontWeight: 800,
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        boxShadow: jdMode === 'url' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                        transition: 'all 0.2s'
                      }}
                    >
                      Scrape URL
                    </button>
                  </div>
                </div>

                <div className="jd-input-box">
                  {jdMode === 'paste' ? (
                    <textarea 
                      placeholder="Copy and paste the full job description here... Detailed JD helps get better analysis!"
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      style={{ width: '100%', height: '100%', background: 'transparent', border: 'none', resize: 'none', outline: 'none', fontSize: '1.1rem', color: '#0F172A', lineHeight: 1.6 }}
                    />
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', padding: '1rem', gap: '1rem' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748B' }}>
                        Paste any Job Posting link (LinkedIn, Google Careers, etc.) to fetch details using AI:
                      </div>
                      <div className="scrape-input-container">
                        <input
                          type="text"
                          placeholder="https://careers.google.com/jobs/results/..."
                          value={scrapeUrl}
                          onChange={(e) => setScrapeUrl(e.target.value)}
                          style={{
                            flex: 1,
                            padding: '14px 20px',
                            borderRadius: '16px',
                            border: '1px solid rgba(56, 178, 172, 0.2)',
                            background: '#F8FAFC',
                            fontSize: '1rem',
                            outline: 'none',
                            color: '#0F172A'
                          }}
                        />
                        <button
                          type="button"
                          onClick={handleScrapeUrl}
                          disabled={scraping}
                          style={{
                            background: 'linear-gradient(90deg, #12B8C9 0%, #38B2AC 100%)',
                            color: '#fff',
                            border: 'none',
                            padding: '0 24px',
                            borderRadius: '16px',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.2s',
                            boxShadow: '0 4px 12px rgba(18, 184, 201, 0.2)'
                          }}
                        >
                          {scraping ? <Cpu className="spin" size={18} /> : <Sparkles size={18} />}
                          <span>{scraping ? 'Importing...' : 'Fetch'}</span>
                        </button>
                      </div>
                      {scrapeError && (
                        <div style={{ color: '#EF4444', fontSize: '0.85rem', fontWeight: 600 }}>
                          {scrapeError}
                        </div>
                      )}
                      {scrapeSuccess && (
                        <div style={{ color: '#10B981', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={16} /> Successfully extracted job details!
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Redesigned Button Phase */}
            <div style={{ textAlign: 'center' }}>
               <motion.button 
                 whileHover={{ scale: 1.02 }}
                 whileTap={{ scale: 0.98 }}
                 onClick={handleAnalyze} 
                 disabled={loading} 
                 className="btn-analyze"
               >
                 {loading ? <Cpu className="spin" size={28} /> : <><span style={{ letterSpacing: '-0.02em' }}>Analyze & Match</span> <Sparkles size={28} /></>}
               </motion.button>
               <p style={{ marginTop: '1.5rem', color: '#64748B', fontStyle: 'italic', fontSize: '1.1rem', fontWeight: 500 }}>
                  Analysis usually takes 3-5 seconds
               </p>
            </div>
            {error && <p style={{ color: '#EF4444', textAlign: 'center', marginTop: '2rem', fontWeight: 600 }}>{error}</p>}
          </motion.div>
        )}

        {/* 🧠 DYNAMIC AI LOADER */}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
            <div style={{ position: 'relative', width: '200px', height: '200px', marginBottom: '3rem' }}>
               {/* Orbital Rings */}
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                 style={{ position: 'absolute', inset: 0, border: '2px solid rgba(18, 184, 201, 0.1)', borderRadius: '50%' }}
               />
               <motion.div 
                 animate={{ rotate: -360 }}
                 transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                 style={{ position: 'absolute', inset: '20px', border: '2px solid rgba(18, 184, 201, 0.2)', borderRadius: '50%', borderTopColor: '#12B8C9' }}
               />
               
               {/* Pulsing Core */}
               <motion.div 
                 animate={{ scale: [1, 1.1, 1] }}
                 transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                 style={{ 
                   position: 'absolute', 
                   left: '50%', 
                   top: '50%', 
                   transform: 'translate(-50%, -50%)',
                   width: '80px', 
                   height: '80px', 
                   background: 'radial-gradient(circle, #12B8C9 0%, #38B2AC 100%)',
                   borderRadius: '50%',
                   display: 'flex',
                   alignItems: 'center',
                   justifyContent: 'center',
                   color: '#fff',
                   boxShadow: '0 0 40px rgba(18, 184, 201, 0.4)'
                 }}
               >
                 <Cpu className="spin" size={32} />
               </motion.div>
               
               {/* Scanning Line */}
               <motion.div 
                 animate={{ top: ['0%', '100%', '0%'] }}
                 transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                 style={{ position: 'absolute', left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, #12B8C9, transparent)', zIndex: 5 }}
               />
            </div>
            
            <motion.h2 
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', marginBottom: '1rem' }}
            >
              {loadingText}
            </motion.h2>
            <p style={{ color: '#64748B', fontWeight: 500 }}>AI is cross-referencing your profile with market standards...</p>
          </motion.div>
        )}

        {/* PHASE 2: DASHBOARD RESULTS */}
        <AnimatePresence>
          {result && (
            <motion.div ref={resultsRef} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
              
              {/* Section 1: Compact Score Overview */}
              <div className="score-overview-grid">
                <div className="score-card teal-card">
                  <div>{result.matchPercentage}%</div>
                  <h3>JD Match Score</h3>
                </div>
                <div className="score-card purple-card">
                  <div>{result.atsScore}%</div>
                  <h3>ATS Score</h3>
                </div>
                <div className="score-card green-card">
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '0.5rem' }}>
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} fill={s <= 4 ? "#fff" : "none"} size={24} />)}
                  </div>
                  <h3>Readiness</h3>
                </div>
              </div>

              {/* Section 2: 3-Column Command Center (Skills | Radar | Refinements) */}
              <div className="dashboard-grid">
                 
                 {/* Left: Tabbed Skills Card */}
                 <div className="dashboard-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0' }}>
                       <button 
                         onClick={() => setActiveTab('matched')}
                         style={{ flex: 1, padding: '1.2rem', border: 'none', background: activeTab === 'matched' ? '#fff' : '#F8FAFC', color: activeTab === 'matched' ? '#38B2AC' : '#64748B', fontWeight: 800, cursor: 'pointer', borderBottom: activeTab === 'matched' ? '3px solid #38B2AC' : 'none', transition: 'all 0.2s', fontSize: '0.8rem' }}
                       >
                         MATCHED ({result.matchedSkills.length})
                       </button>
                       <button 
                         onClick={() => setActiveTab('missing')}
                         style={{ flex: 1, padding: '1.2rem', border: 'none', background: activeTab === 'missing' ? '#fff' : '#F8FAFC', color: activeTab === 'missing' ? '#EF4444' : '#64748B', fontWeight: 800, cursor: 'pointer', borderBottom: activeTab === 'missing' ? '3px solid #EF4444' : 'none', transition: 'all 0.2s', fontSize: '0.8rem' }}
                       >
                         MISSING ({result.missingSkills.length})
                       </button>
                    </div>
                    <div style={{ padding: '1.5rem', maxHeight: '320px', overflowY: 'auto' }}>
                       <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {activeTab === 'matched' ? (
                            result.matchedSkills.map((s, i) => (
                              <div key={i} style={{ background: '#F0FFF4', color: '#2F855A', border: '1px solid #C6F6D5', padding: '8px 14px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <CheckCircle2 size={14} /> {s}
                              </div>
                            ))
                          ) : (
                            result.missingSkills.map((s, i) => (
                              <div key={i} style={{ background: '#FFF5F5', color: '#C53030', border: '1px solid #FED7D7', padding: '8px 14px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <AlertCircle size={14} /> {s}
                              </div>
                            ))
                          )}
                       </div>
                    </div>
                 </div>

                 {/* Middle: Skill Analysis Graph */}
                 <div className="dashboard-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#64748B', marginBottom: '1rem', letterSpacing: '1px' }}>SKILL ANALYSIS</div>
                    <div style={{ width: '100%', height: '250px' }}>
                       <ResponsiveContainer width="100%" height="100%">
                         <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                           <PolarGrid stroke="#E2E8F0" />
                           <PolarAngleAxis dataKey="skill" tick={{ fill: '#4A5568', fontSize: 10, fontWeight: 700 }} />
                           <Radar name="Skills" dataKey="value" stroke="#38B2AC" fill="#38B2AC" fillOpacity={0.2} />
                         </RadarChart>
                       </ResponsiveContainer>
                    </div>
                 </div>

                 {/* Right: Resume Refinements */}
                 <div className="dashboard-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                       <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A' }}>Refinements</h3>
                       <button onClick={handleDownloadPdf} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '6px 12px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}>
                          PDF
                       </button>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto', maxHeight: '280px', paddingRight: '4px' }}>
                       {result.resumeImprovements.map((imp, i) => (
                         <div key={i} style={{ padding: '1rem', background: '#F8FAFC', borderRadius: '16px', marginBottom: '0.8rem', border: '1px solid #F1F5F9' }}>
                            <p style={{ color: '#4A5568', fontSize: '0.85rem', lineHeight: 1.4 }}>{imp}</p>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>

              {/* Section 3: Compact Roadmap Card (Local Scroll) */}
              <div className="roadmap-card">
                 <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A' }}>Phased Execution Roadmap</h2>
                    <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Scroll through your 90-day mastery plan</p>
                 </div>
                 
                 <div className="roadmap-scroll-container">
                    <div style={{ position: 'relative' }}>
                       <div className="roadmap-timeline-line" />
                       {result.roadmap.map((step, i) => (
                         <div key={i} className="roadmap-step-item">
                            <div className="roadmap-step-badge" style={{ background: i === 0 ? '#38B2AC' : '#fff', color: i === 0 ? '#fff' : '#38B2AC' }}>
                               {i+1}
                            </div>
                            <div className="roadmap-step-content">
                               <div className="roadmap-step-header">
                                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>Phase {i+1}: {step.task}</h4>
                                  <div style={{ display: 'flex', gap: '8px' }}>
                                     <span style={{ fontSize: '0.7rem', fontWeight: 800, background: '#E6FFFA', color: '#2C7A7B', padding: '4px 10px', borderRadius: '6px' }}>{step.duration}</span>
                                  </div>
                                </div>
                               <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: 1.5 }}>{result.recommendations[i] || 'Focus on fundamental concepts and practical implementation.'}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>

              {/* Section 4: Learning Resources (YouTube/Docs) - Vibrant Styling */}
              <div className="resources-section">
                 <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
                 <div style={{ position: 'absolute', bottom: '-50px', left: '-50px', width: '200px', height: '200px', background: 'rgba(0,0,0,0.05)', borderRadius: '50%' }} />
                 
                 <div style={{ textAlign: 'center', marginBottom: '3rem', position: 'relative', zIndex: 10 }}>
                    <div style={{ background: 'rgba(255,255,255,0.2)', display: 'inline-block', padding: '8px 20px', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '2px', marginBottom: '1rem' }}>RESOURCES</div>
                    <h2 className="font-serif resources-title">Start Your Mastery.</h2>
                 </div>

                 <div className="resources-grid">
                    {result.roadmap.map((step, i) => {
                       const resource = result.learningResources?.[i];
                       if (!resource) return null;
                       const cardGradients = [
                          'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
                          'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)'
                       ];
                       return (
                         <motion.a 
                           whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                           key={i} 
                           href={resource.url} 
                           target="_blank" 
                           rel="noopener noreferrer" 
                           className="resource-card"
                           style={{ background: cardGradients[i % 2] }}
                         >
                           <div style={{ background: '#fff', width: '50px', height: '50px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38B2AC', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
                              {resource.platform === 'YouTube' ? <Play size={24} /> : <BookOpen size={24} />}
                           </div>
                           <div style={{ flex: 1 }}>
                              <div style={{ fontSize: '0.7rem', fontWeight: 800, opacity: 0.7, textTransform: 'uppercase', marginBottom: '4px' }}>{resource.platform}</div>
                              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem', lineHeight: 1.3 }}>{step.task}</h4>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
                                 LEARN PHASE {i+1} <ArrowRight size={14} />
                              </div>
                           </div>
                         </motion.a>
                       );
                    })}
                 </div>
              </div>

              {/* Reset Action */}
              <div className="reset-action-container">
                 <button onClick={() => { setResult(null); setFile(null); setJobDescription(''); }} className="btn-reset">
                    Analyze Another Profile
                 </button>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

        {/* 🚀 RESPONSIVE CSS */}
      <style dangerouslySetInnerHTML={{ __html: `
        .hero-header-container {
          text-align: center;
          margin-bottom: clamp(2rem, 8vw, 5rem);
        }
        .hero-title-top {
          font-size: clamp(1.8rem, 5vw, 3.2rem);
          font-weight: 900;
          color: #0F172A;
          margin-bottom: 0.2rem;
          letter-spacing: -0.04em;
          line-height: 1.15;
          font-family: "Plus Jakarta Sans", sans-serif;
        }
        .hero-title-main {
          font-size: clamp(2.2rem, 6vw, 4rem);
          font-weight: 950;
          color: #12B8C9;
          margin-bottom: 1.5rem;
          letter-spacing: -0.05em;
          line-height: 1.1;
          font-family: "Plus Jakarta Sans", sans-serif;
        }
        .hero-subtitle {
          font-size: clamp(0.95rem, 2.5vw, 1.2rem);
          color: #64748B;
          max-width: 700px;
          margin: 0 auto;
          font-weight: 500;
          line-height: 1.6;
        }
        .responsive-workspace-card {
          padding: 4rem;
          border-radius: clamp(24px, 5vw, 60px) !important;
        }
        .input-layout-grid, .results-layout-grid {
          display: grid;
          gap: 3rem;
        }
        .input-layout-grid { grid-template-columns: 1.2fr 1fr; }
        .results-layout-grid { grid-template-columns: 1fr 1.5fr; }
        
        .upload-box {
          background: #fff;
          border-radius: clamp(20px, 4vw, 40px);
          padding: clamp(2rem, 5vw, 3.5rem);
          border: 1px solid rgba(56, 178, 172, 0.1);
          position: relative;
          transition: all 0.3s;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 280px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.02);
        }
        .jd-input-box {
          background: #fff;
          border-radius: clamp(20px, 4vw, 40px);
          padding: 1.5rem;
          border: 1px solid rgba(56, 178, 172, 0.1);
          height: 280px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.02);
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .scrape-input-container {
          display: flex;
          gap: 0.8rem;
        }
        .btn-analyze {
          background: linear-gradient(90deg, #12B8C9 0%, #38B2AC 100%);
          border: none;
          color: #fff;
          padding: clamp(16px, 3.5vw, 24px) clamp(30px, 7vw, 70px);
          border-radius: 99px;
          font-weight: 800;
          font-size: clamp(1.1rem, 3.5vw, 1.6rem);
          display: inline-flex;
          align-items: center;
          gap: 15px;
          cursor: pointer;
          box-shadow: 0 20px 50px rgba(18, 184, 201, 0.4);
          transition: all 0.3s;
        }

        /* Results dashboard responsive styling */
        .score-overview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }
        .score-card {
          border-radius: 32px;
          padding: 2.5rem 2rem;
          color: #fff;
          text-align: center;
          transition: transform 0.2s;
        }
        .score-card div {
          font-size: clamp(2.2rem, 5vw, 3rem);
          font-weight: 800;
          margin-bottom: 0.5rem;
        }
        .score-card h3 {
          font-size: clamp(0.95rem, 2vw, 1.1rem);
          font-weight: 800;
          opacity: 0.9;
        }
        .teal-card {
          background: linear-gradient(135deg, #38B2AC 0%, #319795 100%);
        }
        .purple-card {
          background: linear-gradient(135deg, #9F7AEA 0%, #805AD5 100%);
        }
        .green-card {
          background: linear-gradient(135deg, #48BB78 0%, #38A169 100%);
        }
        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr 1fr;
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }
        .dashboard-card {
          background: #fff;
          border-radius: 32px;
          border: 1px solid #E2E8F0;
          transition: all 0.3s;
        }
        .roadmap-card {
          background: #fff;
          border-radius: 32px;
          border: 1px solid #E2E8F0;
          padding: 2.5rem;
          margin-bottom: 2.5rem;
        }
        .roadmap-scroll-container {
          max-height: 450px;
          overflow-y: auto;
          background: #F8FAFC;
          border-radius: 24px;
          padding: 2rem;
        }
        .roadmap-timeline-line {
          position: absolute;
          left: 20px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: #E2E8F0;
        }
        .roadmap-step-item {
          position: relative;
          padding-left: 60px;
          margin-bottom: 2.5rem;
        }
        .roadmap-step-badge {
          position: absolute;
          left: 0;
          top: 0;
          width: 42px;
          height: 42px;
          border: 2px solid #38B2AC;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 0.9rem;
          z-index: 10;
        }
        .roadmap-step-content {
          background: #fff;
          padding: 1.5rem;
          border-radius: 20px;
          border: 1px solid #E2E8F0;
          box-shadow: 0 4px 12px rgba(0,0,0,0.02);
        }
        .roadmap-step-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.8rem;
          gap: 1rem;
        }
        .resources-section {
          background: linear-gradient(135deg, #38B2AC 0%, #319795 100%);
          border-radius: 40px;
          padding: 4rem 3rem;
          color: #fff;
          position: relative;
          overflow: hidden;
        }
        .resources-title {
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 800;
        }
        .resources-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          position: relative;
          z-index: 10;
        }
        .resource-card {
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: clamp(1.5rem, 4vw, 2.5rem) clamp(1.2rem, 3vw, 2rem);
          border-radius: clamp(20px, 4vw, 32px);
          text-decoration: none;
          color: #fff;
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
          transition: all 0.3s;
        }
        .reset-action-container {
          text-align: center;
          margin-top: 6rem;
        }
        .btn-reset {
          background: #0F172A;
          color: #fff;
          padding: 18px 40px;
          border-radius: 99px;
          font-weight: 800;
          border: none;
          cursor: pointer;
          font-size: 1.1rem;
          transition: all 0.2s;
        }

        @media (max-width: 1024px) {
          .input-layout-grid, .results-layout-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          .responsive-workspace-card {
            padding: 2.5rem !important;
          }
          .dashboard-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
        }
        @media (max-width: 768px) {
          .responsive-workspace-card {
            padding: 1.5rem !important;
            margin-top: 1rem !important;
          }
          .upload-box {
            height: 220px;
          }
          .jd-input-box {
            height: auto;
            min-height: 250px;
          }
          textarea {
            height: 250px !important;
          }
          .metrics-header-row {
            flex-direction: column;
            gap: 1.5rem;
          }
          .btn-analyze {
            width: 100%;
            max-width: 400px;
            justify-content: center;
          }
          .score-card {
            padding: 1.5rem 1rem;
            border-radius: 20px;
          }
          .dashboard-card {
            border-radius: 24px;
          }
          .roadmap-card {
            border-radius: 24px;
            padding: 1.5rem;
          }
          .roadmap-scroll-container {
            padding: 1rem;
            border-radius: 16px;
          }
          .resources-section {
            border-radius: 24px;
            padding: 2.5rem 1.5rem;
          }
          .reset-action-container {
            margin-top: 3rem;
          }
          .btn-reset {
            padding: 14px 30px;
            font-size: 0.95rem;
            width: 100%;
            max-width: 300px;
          }
        }
        @media (max-width: 640px) {
          .roadmap-step-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
          .resources-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 480px) {
          .desktop-br {
            display: none;
          }
          .scrape-input-container {
            flex-direction: column;
          }
          .scrape-input-container button {
            padding: 12px 20px !important;
            justify-content: center;
          }
          .roadmap-timeline-line {
            left: 15px;
          }
          .roadmap-step-item {
            padding-left: 45px;
            margin-bottom: 1.5rem;
          }
          .roadmap-step-badge {
            width: 32px;
            height: 32px;
            font-size: 0.75rem;
          }
          .roadmap-step-content {
            padding: 1rem;
            border-radius: 14px;
          }
        }
      `}} />
      </div>
    </div>
  );
};

export default Home;


