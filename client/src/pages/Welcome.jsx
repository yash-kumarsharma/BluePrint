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
          BluePrint:<br/><span className="font-serif">The AI Career Optimizer.</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 1 }} style={{ fontSize: '1.4rem', color: 'var(--text-muted)', maxWidth: '750px', marginBottom: '3.5rem', fontWeight: 500, letterSpacing: '-0.01em', lineHeight: 1.5 }}>
          AI-powered profile analysis, skill-gap detection, and personalized learning roadmaps to help you bridge the gap between your resume and your dream role.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} style={{ display: 'flex', gap: '1.5rem', position: 'relative', zIndex: 50 }}>
          <button 
            onClick={() => navigate('/analyze')} 
            className="btn-primary" 
            style={{ padding: '20px 44px', fontSize: '1.3rem', border: 'none', cursor: 'pointer' }}
          >
            Initiate Scan <ArrowRight size={22} />
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
            <h2 className="font-serif" style={{ fontSize: '4rem', fontWeight: 800, marginBottom: '1.2rem' }}>Workflow.</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.3rem' }}>
               Three simple steps to redefine your career. <span style={{ color: '#000', fontWeight: 700 }}>Ingest. Decode. Optimize.</span>
            </p>
          </div>

          <motion.div 
            variants={staggerContainer} 
            initial="hidden" 
            whileInView="show" 
            viewport={{ once: true, amount: 0.2 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}
          >
            <WorkflowCard number="01" title="Ingest." description="Upload your professional history for deep AI decomposition." image="/resume_scan.png" />
            <WorkflowCard number="02" title="Decode." description="Compare your profile against target JDs to detect skill gaps." image="/market_mesh.png" />
            <WorkflowCard number="03" title="Optimize." description="Get your learning roadmap and track your ATS score progress." image="/roadmap.png" />
          </motion.div>
      </section>

      {/* 4. Interactive Sphere - Tightened Spacing */}
      <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: false, amount: 0.3 }} className="container" style={{ textAlign: 'center', margin: '4rem auto 0' }}>
        <h2 style={{ fontSize: '4.5rem', fontWeight: 800, letterSpacing: '-0.05em', color: '#000', marginBottom: '1.2rem' }}>The Market <span className="font-serif">Pulse.</span></h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.3rem', maxWidth: '700px', margin: '0 auto 2.5rem' }}>Experience the real-time skill ecosystem through our physically reactive data sphere.</p>
        <InteractiveGlobe />
      </motion.section>

      {/* 5. Key Features Ecosystem */}
      <motion.section className="container" style={{ padding: '3rem 2rem 8rem', position: 'relative', zIndex: 10 }}>
        <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: false }} transition={{ duration: 1, ease: "circOut" }} style={{ height: '1px', background: 'rgba(0,0,0,0.1)', marginBottom: '2.5rem', transformOrigin: 'center' }} />
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <h2 style={{ fontSize: '4rem', marginBottom: '1rem', fontWeight: 800, letterSpacing: '-0.05em' }}>Core <span className="font-serif">Capabilities.</span></h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.3rem' }}>BluePrint is built with next-gen career architecture logic.</p>
        </div>
        
        <div className="bento-grid">
          <motion.div className="bento-item bento-wide" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }}>
            <BrainCircuit size={40} style={{ marginBottom: '1.5rem' }} />
            <h3 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>AI-Powered Skill Assessment</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.6 }}>Deep-vector profile analysis identifying subtle skill nuances and latent professional advantages.</p>
            <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', opacity: 0.1 }}><Database size={150} /></div>
          </motion.div>
          
          <motion.div className="bento-item" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }}>
             <GraduationCap size={40} style={{ marginBottom: '1.5rem' }} />
             <h3 style={{ fontSize: '1.7rem', fontWeight: 800, marginBottom: '1rem' }}>Personalized Paths</h3>
             <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>Dynamic bridges connecting your current state to your target market.</p>
          </motion.div>
          
          <motion.div className="bento-item" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }}>
             <Map size={40} style={{ marginBottom: '1.5rem' }} />
             <h3 style={{ fontSize: '1.7rem', fontWeight: 800, marginBottom: '1rem' }}>Role Mapping</h3>
             <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>Real-time synchronization with high-growth roles where your unique skills carry maximum leverage.</p>
          </motion.div>
          
          <motion.div className="bento-item bento-wide" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }}>
             <Activity size={40} style={{ marginBottom: '1.5rem' }} />
             <h3 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>Live Progress Tracking</h3>
             <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.6 }}>Your blueprint evolves in real-time. We track your progress, identify your current ATS score, and adjust roadmaps automatically.</p>
          </motion.div>
        </div>
      </motion.section>

      {/* 6. The Final Call */}
      <section ref={finalCallRef} className="final-cta-section" style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        <motion.div style={{ position: 'absolute', inset: 0, background: '#000', opacity: finalBgOpacity, zIndex: -1 }} />
        <div style={{ textAlign: 'center', zIndex: 10 }}>
          <motion.h2 className="final-cta-title" style={{ fontSize: '5rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.04em', marginBottom: '2.5rem', opacity: finalBgOpacity }}>Ready to <span className="font-serif">Blueprint?</span></motion.h2>
          <motion.div style={{ scale: ctaScale }}>
            <Link to="/register" className="btn-primary" style={{ padding: '20px 50px', fontSize: '1.4rem', background: '#fff', color: '#000', border: 'none' }}>Create Your Roadmap</Link>
          </motion.div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer style={{ background: '#FFFFFF', borderTop: '1px solid rgba(0,0,0,0.05)', padding: '6rem 2rem 4rem', position: 'relative', zIndex: 10 }}>
        <div className="container" style={{ padding: '0' }}>
          <div className="footer-grid">
            <div className="footer-col">
              <h3 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: '1.2rem' }}>BluePrint</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem' }}>AI-native career architecture for the next billion engineers.</p>
              <h4>Join the newsletter</h4>
              <form className="newsletter-form" onSubmit={handleSubscribe}>
                <input type="email" placeholder="name@email.com" className="newsletter-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <button type="submit" className="btn-primary" style={{ padding: '12px', borderRadius: '50%', width: '45px', height: '45px' }}><Send size={18} /></button>
              </form>
            </div>
            <div className="footer-col">
              <h4>Product</h4>
              <ul><li><Link to="/analyze">AI Analyzer</Link></li><li><Link to="/analyze">Dynamic Roadmaps</Link></li><li><Link to="/history">Analysis History</Link></li></ul>
            </div>
            <div className="footer-col">
              <h4>Resources</h4>
              <ul><li><a href="#">Documentation</a></li><li><a href="#">PDF Export</a></li></ul>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <ul><li><a href="#">About Us</a></li><li><a href="#">Privacy Policy</a></li></ul>
            </div>
          </div>
          <div style={{ marginTop: '5rem', paddingTop: '2rem', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>&copy; 2026 BluePrint Career Architecture.</p>
            <div style={{ display: 'flex', gap: '2rem' }}><Globe size={18} color="var(--text-muted)" /><span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>Region: Global (EN)</span></div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;
