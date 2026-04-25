import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, BrainCircuit, Target, Code, ShieldCheck, Zap, Globe, Cpu, BarChart3, Layers, Send, FileSearch, Database, Route, Network, Upload, ArrowUpRight, GraduationCap, Map, Activity } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef, useState } from 'react';
import GalaxyBackground from '../components/GalaxyBackground';
import InteractiveGlobe from '../components/InteractiveGlobe';

// Animation Variants
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const cardItem = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

// Workflow Card Component (Apple Style)
const WorkflowCard = ({ number, title, description, image }) => {
  return (
    <motion.div 
      variants={cardItem}
      whileHover={{ y: -10 }}
      className="workflow-card"
      style={{ 
        background: '#fff',
        borderRadius: '32px',
        padding: '2.5rem',
        height: '400px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        border: '1px solid rgba(0,0,0,0.04)',
        boxShadow: '0 15px 35px rgba(0,0,0,0.03)',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
          <span style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Step {number}</span>
          <motion.div 
            whileHover={{ x: 5, y: -5 }}
            style={{ background: '#000', padding: '10px', borderRadius: '50%', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <ArrowUpRight size={16} />
          </motion.div>
        </div>
        <h3 className="font-serif" style={{ fontSize: '2.4rem', fontWeight: 800, color: '#000', marginBottom: '0.8rem', lineHeight: 1.1 }}>{title}</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.4, maxWidth: '240px' }}>{description}</p>
      </div>
      <div className="workflow-card-img" style={{ position: 'absolute', bottom: '-40px', right: '-20px', width: '200px', opacity: 0.8 }}>
          <img src={image} alt={title} style={{ width: '100%', borderRadius: '24px' }} />
      </div>
    </motion.div>
  );
};

const Welcome = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const heroRef = useRef(null);
  const finalCallRef = useRef(null);
  
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const { scrollYProgress: finalScroll } = useScroll({ target: finalCallRef, offset: ["start end", "center center", "end start"] });

  const galaxyOpacity = useTransform(heroScroll, [0, 0.7], [1, 0]);
  const ctaScale = useTransform(finalScroll, [0, 0.5, 1], [0.8, 1.1, 0.8]);
  const finalBgOpacity = useTransform(finalScroll, [0, 0.4, 0.6, 1], [0, 1, 1, 0]);

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert(`Subscribed: ${email}`);
    setEmail('');
  };

  return (
    <div style={{ overflowX: 'hidden' }}>
      
      {/* 1. Hero Section - Refined for Viva */}
      <section ref={heroRef} style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 2rem', position: 'relative', zIndex: 10, overflow: 'hidden' }}>
        <motion.div style={{ position: 'absolute', inset: 0, opacity: galaxyOpacity, pointerEvents: 'auto' }}><GalaxyBackground /></motion.div>
        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontSize: '6rem', fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 1, marginBottom: '2rem', color: '#000' }}
        >
          BluePrint:<br/><span className="font-serif">Your AI Career Architect.</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 1 }} style={{ fontSize: '1.4rem', color: 'var(--text-muted)', maxWidth: '750px', marginBottom: '3.5rem', fontWeight: 500, letterSpacing: '-0.01em', lineHeight: 1.5 }}>
          Upload your resume, find your skill gaps, and get a personalized roadmap to land your dream job. Simple, fast, and powered by AI.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} style={{ display: 'flex', gap: '1.5rem', position: 'relative', zIndex: 50 }}>
          <button 
            onClick={() => navigate('/analyze')} 
            className="btn-primary" 
            style={{ padding: '20px 44px', fontSize: '1.3rem', border: 'none', cursor: 'pointer' }}
          >
            Start Your Analysis <ArrowRight size={22} />
          </button>
          <a href="#workflow" className="btn-secondary" style={{ padding: '18px 44px', fontSize: '1.3rem', textDecoration: 'none', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)', borderRadius: '999px' }}>Explore Process</a>
        </motion.div>
      </section>

      {/* 2. Trusted By */}
      <section className="logo-marquee-container" style={{ padding: '3rem 0' }}>
        <div className="logo-marquee">
          {["GOOGLE", "AMAZON", "META", "STRIPE", "NETFLIX", "COSMOS", "OPENAI", "VERCEL"].map((logo, i) => (
            <span key={i} className="logo-item">{logo}</span>
          )).concat(["GOOGLE", "AMAZON", "META", "STRIPE", "NETFLIX", "COSMOS", "OPENAI", "VERCEL"].map((logo, i) => (
            <span key={i+8} className="logo-item">{logo}</span>
          )))}
        </div>
      </section>

      {/* 3. Workflow Gallery (Simplified Copy) */}
      <section id="workflow" className="container" style={{ padding: '6rem 2rem', position: 'relative' }}>
          <div style={{ marginBottom: '4rem', maxWidth: '800px' }}>
            <h2 className="font-serif" style={{ fontSize: '4rem', fontWeight: 800, marginBottom: '1.2rem' }}>How it works.</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.3rem' }}>
               Three simple steps to your next big role. <span style={{ color: '#000', fontWeight: 700 }}>Upload. Compare. Succeed.</span>
            </p>
          </div>

          <motion.div 
            variants={staggerContainer} 
            initial="hidden" 
            whileInView="show" 
            viewport={{ once: true, amount: 0.2 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}
          >
            <WorkflowCard number="01" title="Upload." description="Send us your resume to see where you stand right now." image="/resume_scan.png" />
            <WorkflowCard number="02" title="Compare." description="We match your skills against any job you want to get." image="/market_mesh.png" />
            <WorkflowCard number="03" title="Succeed." description="Follow your custom roadmap and start landing interviews." image="/roadmap.png" />
          </motion.div>
      </section>

      {/* 4. Interactive Sphere - Tightened Spacing */}
      <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: false, amount: 0.3 }} className="container" style={{ textAlign: 'center', margin: '4rem auto 0' }}>
        <h2 style={{ fontSize: '4.5rem', fontWeight: 800, letterSpacing: '-0.05em', color: '#000', marginBottom: '1.2rem' }}>Job <span className="font-serif">Market Pulse.</span></h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.3rem', maxWidth: '700px', margin: '0 auto 2.5rem' }}>See how the world of skills changes every day through our interactive data sphere.</p>
        <InteractiveGlobe />
      </motion.section>

      {/* 5. Key Features Ecosystem */}
      <motion.section className="container" style={{ padding: '3rem 2rem 8rem', position: 'relative', zIndex: 10 }}>
        <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: false }} transition={{ duration: 1, ease: "circOut" }} style={{ height: '1px', background: 'rgba(0,0,0,0.1)', marginBottom: '2.5rem', transformOrigin: 'center' }} />
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <h2 style={{ fontSize: '4rem', marginBottom: '1rem', fontWeight: 800, letterSpacing: '-0.05em' }}>Smart <span className="font-serif">Features.</span></h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.3rem' }}>Everything you need to grow your career, all in one place.</p>
        </div>
        
        <div className="bento-grid">
          <motion.div className="bento-item bento-wide" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }}>
            <BrainCircuit size={40} style={{ marginBottom: '1.5rem' }} />
            <h3 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>Smart Skill Search</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.6 }}>We find the exact skills you're missing and tell you exactly how to learn them.</p>
            <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', opacity: 0.1 }}><Database size={150} /></div>
          </motion.div>
          
          <motion.div className="bento-item" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }}>
             <GraduationCap size={40} style={{ marginBottom: '1.5rem' }} />
              <h3 style={{ fontSize: '1.7rem', fontWeight: 800, marginBottom: '1rem' }}>Step-by-Step Roadmaps</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>Get a clear plan that shows you what to learn and when to learn it.</p>
          </motion.div>
          
          <motion.div className="bento-item" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }}>
             <Map size={40} style={{ marginBottom: '1.5rem' }} />
              <h3 style={{ fontSize: '1.7rem', fontWeight: 800, marginBottom: '1rem' }}>Career Matching</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>We match you with jobs where your skills give you the biggest advantage.</p>
          </motion.div>
          
          <motion.div className="bento-item bento-wide" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }}>
             <Activity size={40} style={{ marginBottom: '1.5rem' }} />
              <h3 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>Track Your Progress</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.6 }}>Watch your ATS score go up as you learn new skills and improve your resume.</p>
          </motion.div>
        </div>
      </motion.section>

      {/* 6. The Final Call */}
      <section ref={finalCallRef} className="final-cta-section" style={{ height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', background: '#000' }}>
        {/* Subtle Architectural Grid Pattern */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        
        <div style={{ textAlign: 'center', zIndex: 10, padding: '0 2rem' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }}>
            <h2 className="final-cta-title" style={{ fontSize: '6rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.05em', marginBottom: '1.5rem' }}>
              Ready to <span className="font-serif">Blueprint?</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.4rem', marginBottom: '4rem', fontWeight: 500 }}>
              Join thousands of architects building their future today.
            </p>
            <motion.div style={{ scale: ctaScale }}>
              <Link 
                to="/register" 
                className="btn-primary" 
                style={{ 
                  padding: '24px 60px', 
                  fontSize: '1.5rem', 
                  background: '#fff', 
                  color: '#000', 
                  border: 'none',
                  boxShadow: '0 20px 40px rgba(255,255,255,0.1)'
                }}
              >
                Create Your Free Plan
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer style={{ background: '#000', color: '#fff', padding: '8rem 2rem 4rem', position: 'relative', zIndex: 10 }}>
        <div className="container" style={{ padding: '0' }}>
          <div className="footer-grid" style={{ gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '4rem' }}>
            <div className="footer-col">
              <h3 className="font-serif" style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: '1.5rem' }}>BluePrint.</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2.5rem', maxWidth: '300px' }}>
                Your AI career architect. Building the future of professional growth.
              </p>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <a href="#" style={{ color: '#fff', opacity: 0.6 }}><Cpu size={20} /></a>
                <a href="#" style={{ color: '#fff', opacity: 0.6 }}><Globe size={20} /></a>
                <a href="#" style={{ color: '#fff', opacity: 0.6 }}><Target size={20} /></a>
              </div>
            </div>
            
            <div className="footer-col">
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '2rem', color: 'rgba(255,255,255,0.4)' }}>Product</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <li><Link to="/analyze" style={{ color: '#fff', textDecoration: 'none', opacity: 0.6 }}>Career Analysis</Link></li>
                <li><Link to="/analyze" style={{ color: '#fff', textDecoration: 'none', opacity: 0.6 }}>Growth Plans</Link></li>
                <li><Link to="/history" style={{ color: '#fff', textDecoration: 'none', opacity: 0.6 }}>History</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '2rem', color: 'rgba(255,255,255,0.4)' }}>Resources</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <li><a href="#" style={{ color: '#fff', textDecoration: 'none', opacity: 0.6 }}>Documentation</a></li>
                <li><a href="#" style={{ color: '#fff', textDecoration: 'none', opacity: 0.6 }}>PDF Guide</a></li>
                <li><a href="#" style={{ color: '#fff', textDecoration: 'none', opacity: 0.6 }}>Skill Directory</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '2rem', color: 'rgba(255,255,255,0.4)' }}>Join Us</h4>
              <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>Get career tips once a week.</p>
              <form className="newsletter-form" onSubmit={handleSubscribe} style={{ display: 'flex', gap: '10px' }}>
                <input 
                  type="email" 
                  placeholder="Email" 
                  className="newsletter-input" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '12px', padding: '10px 15px', width: '100%' }}
                />
                <button type="submit" className="btn-primary" style={{ padding: '10px 20px', borderRadius: '12px' }}><Send size={18} /></button>
              </form>
            </div>
          </div>
          
          <div style={{ marginTop: '6rem', paddingTop: '2.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.4 }}>
            <p style={{ fontSize: '0.9rem' }}>&copy; 2026 BluePrint Career Architecture. All rights reserved.</p>
            <div style={{ display: 'flex', gap: '2.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Privacy</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Terms</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;
