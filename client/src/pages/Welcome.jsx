import { Link } from 'react-router-dom';
import { ArrowRight, BrainCircuit, Target, Code, ShieldCheck, Zap } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import GalaxyBackground from '../components/GalaxyBackground';
import InteractiveGlobe from '../components/InteractiveGlobe';

// Framer Variants
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const ParallaxCard = ({ children, speed = 0.1, top = "10%", left = "auto", right = "auto", width = "350px" }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100 * speed, -100 * speed]);

  return (
    <motion.div
      ref={ref}
      style={{ 
        position: 'absolute', 
        top, left, right, width, 
        y, 
        zIndex: 10 
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.8 }}
      className="cosmos-card"
    >
      {children}
    </motion.div>
  );
};

const Welcome = () => {
  const containerRef = useRef(null);

  return (
    <div ref={containerRef} style={{ overflowX: 'hidden', paddingBottom: '10rem' }}>
      
      {/* 1. Hero Section - Galaxy localized here */}
      <section style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 2rem', position: 'relative', zIndex: 10, overflow: 'hidden' }}>
        <GalaxyBackground />
        
        <motion.h1 
          initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.3 }} variants={fadeUp}
          style={{ fontSize: '6.5rem', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: '2rem', color: '#000' }}
        >
          Your space<br/>
          <span className="font-serif">for inspiration.</span>
        </motion.h1>
        
        <motion.p 
          initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.3 }} variants={fadeUp} transition={{ delay: 0.2 }}
          style={{ fontSize: '1.4rem', color: 'var(--text-muted)', maxWidth: '650px', marginBottom: '3.5rem', fontWeight: 500, letterSpacing: '-0.01em' }}
        >
          BluePrint analyzes your resume against target job descriptions, identifies critical skill gaps, and maps them onto the global job market.
        </motion.p>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.3 }} variants={fadeUp} transition={{ delay: 0.4 }} style={{ display: 'flex', gap: '1.5rem' }}>
          <Link to="/analyze" className="btn-primary" style={{ padding: '16px 36px', fontSize: '1.2rem', textDecoration: 'none' }}>
            Initiate Scan <ArrowRight size={20} />
          </Link>
          <a href="#gallery" className="btn-secondary" style={{ padding: '16px 36px', fontSize: '1.2rem', textDecoration: 'none', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)' }}>
            Discover More
          </a>
        </motion.div>
      </section>

      {/* 2. Organic Parallax Gallery (Cosmos Style) */}
      <section id="gallery" style={{ position: 'relative', height: '180vh', marginTop: '5rem' }}>
        
        <div style={{ position: 'sticky', top: '15vh', width: '100%', textAlign: 'center', zIndex: 5, padding: '0 2rem' }}>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: false }}
            style={{ fontSize: '4.5rem', fontWeight: 800, letterSpacing: '-0.04em', color: '#000', marginBottom: '1.5rem' }}
          >
            Engineering <span className="font-serif">Modern Careers.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: false }}
            transition={{ delay: 0.1 }}
            style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}
          >
            We don't just read your resume; we understand the latent potential within your vector mapping.
          </motion.p>
        </div>

        {/* Scattered Parallax Images */}
        <ParallaxCard speed={2} top="10%" left="10%" width="400px">
          <img src="/blueprint_resume_scan_1776623648482.png" alt="Scanner" style={{ width: '100%', borderRadius: '24px' }} />
        </ParallaxCard>

        <ParallaxCard speed={5} top="35%" right="12%" width="380px">
          <div style={{ padding: '2rem' }}>
            <h3 className="font-serif" style={{ fontSize: '2rem', marginBottom: '1rem' }}>ATS Intelligence.</h3>
            <p style={{ color: 'var(--text-muted)' }}>Automated action-verb optimization and structural validation for modern recruitment loops.</p>
          </div>
        </ParallaxCard>

        <ParallaxCard speed={3} top="60%" left="15%" width="420px">
          <img src="/blueprint_roadmap_1776623669162.png" alt="Roadmap" style={{ width: '100%', borderRadius: '24px' }} />
        </ParallaxCard>

        <ParallaxCard speed={6} top="80%" right="15%" width="350px">
          <div style={{ padding: '2rem' }}>
            <ShieldCheck size={40} style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Localized Execution.</h3>
            <p style={{ color: 'var(--text-muted)' }}>Every step validated against real-world market intelligence.</p>
          </div>
        </ParallaxCard>

      </section>

      {/* 3. The Interactive Sphere Section */}
      <motion.section 
        initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.3 }} variants={fadeUp}
        className="container" style={{ textAlign: 'center', margin: '15rem auto' }}
      >
        <h2 style={{ fontSize: '4.5rem', fontWeight: 800, letterSpacing: '-0.05em', color: '#000' }}>
          Explore <span className="font-serif">the Market Sphere.</span>
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.3rem', letterSpacing: '-0.01em', marginBottom: '2rem' }}>A physically reactive entity simulating global skill demand.</p>
        <InteractiveGlobe />
      </motion.section>

      {/* 4. Grid Features Section */}
      <motion.section 
        initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }} variants={fadeUp}
        className="container" style={{ padding: '6rem 2rem', position: 'relative', zIndex: 10 }}
      >
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <h2 style={{ fontSize: '4rem', marginBottom: '1.2rem', fontWeight: 800, letterSpacing: '-0.05em' }}>
            Search <span className="font-serif">the way you think.</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.3rem' }}>Everything connected, optimized, and yours.</p>
        </div>

        <motion.div variants={staggerContainer} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          
          <motion.div variants={fadeUp} className="cosmos-card" style={{ padding: '3.5rem' }}>
            <div style={{ background: '#000', width: '60px', height: '60px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', marginBottom: '2rem' }}>
              <BrainCircuit size={32} />
            </div>
            <h3 style={{ fontSize: '1.6rem', marginBottom: '1.2rem', fontWeight: 800 }}>Deep NLP Logic</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '1.05rem' }}>Semantic extraction of subtle nuances from your professional history vs target job requirements.</p>
          </motion.div>

          <motion.div variants={fadeUp} className="cosmos-card" style={{ padding: '3.5rem' }}>
            <div style={{ background: '#000', width: '60px', height: '60px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', marginBottom: '2rem' }}>
              <Target size={32} />
            </div>
            <h3 style={{ fontSize: '1.6rem', marginBottom: '1.2rem', fontWeight: 800 }}>Bento Analysis</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '1.05rem' }}>Experience your competitive advantages visualized in high-fidelity radar charts.</p>
          </motion.div>

          <motion.div variants={fadeUp} className="cosmos-card" style={{ padding: '3.5rem' }}>
            <div style={{ background: '#000', width: '60px', height: '60px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', marginBottom: '2rem' }}>
              <Code size={32} />
            </div>
            <h3 style={{ fontSize: '1.6rem', marginBottom: '1.2rem', fontWeight: 800 }}>Dynamic Steps</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '1.05rem' }}>Follow the glowing vertical roadmap dictating exactly what to learn and in what sequence.</p>
          </motion.div>

        </motion.div>
      </motion.section>

      {/* 5. Footer */}
      <footer style={{ background: '#FFFFFF', borderTop: '1px solid rgba(0,0,0,0.05)', padding: '5rem 2rem', position: 'relative', zIndex: 10, marginTop: '10rem' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0' }}>
          <div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-1.2px' }}>BluePrint</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.8rem', fontSize: '1.1rem', letterSpacing: '-0.01em' }}>Premium Career Architecture for top creative teams.</p>
          </div>
          <div style={{ display: 'flex', gap: '3rem' }}>
            <a href="#" style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 600 }}>Privacy</a>
            <a href="#" style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 600 }}>Terms</a>
            <a href="#github" style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 600 }}>GitHub</a>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Welcome;
