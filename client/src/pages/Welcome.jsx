import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BrainCircuit, Target, Code } from 'lucide-react';
import Globe from 'react-globe.gl';

const Welcome = () => {
  const globeRef = useRef();
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

  // Generate random arcs for the "Skill Galaxy" effect
  const N = 40;
  const arcsData = [...Array(N).keys()].map(() => ({
    startLat: (Math.random() - 0.5) * 180,
    startLng: (Math.random() - 0.5) * 360,
    endLat: (Math.random() - 0.5) * 180,
    endLng: (Math.random() - 0.5) * 360,
    color: ['#3B82F6', '#8B5CF6', '#10B981'][Math.floor(Math.random() * 3)]
  }));

  useEffect(() => {
    // Make globe rotate on load
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = 1.0;
      globeRef.current.controls().enableZoom = false;
    }

    const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '4rem', overflowX: 'hidden' }}>
      
      {/* Interactive 3D Skill Galaxy Background */}
      <div style={{ position: 'absolute', top: '-10vh', left: 0, width: '100%', height: '100vh', zIndex: -1, opacity: 0.6, pointerEvents: 'none' }}>
        <Globe
          ref={globeRef}
          width={dimensions.width}
          height={dimensions.height}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          arcsData={arcsData}
          arcColor="color"
          arcDashLength={0.5}
          arcDashGap={1}
          arcDashInitialGap={() => Math.random()}
          arcDashAnimateTime={3000}
        />
      </div>
      
      {/* Hero Section */}
      <section style={{ minHeight: '85vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 2rem' }}>

        <h1 style={{ fontSize: '5rem', fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 1.1, marginBottom: '1.5rem', zIndex: 10 }}>
          Your Next Career Move,<br/>
          <span className="text-gradient">Architected by AI.</span>
        </h1>
        
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', marginBottom: '3rem', zIndex: 10 }}>
          BluePrint analyzes your resume against target job descriptions, identifies critical skill gaps, and maps them onto the global job market to generate your roadmap.
        </p>

        <div style={{ display: 'flex', gap: '1rem', zIndex: 10 }}>
          <Link to="/analyze" className="btn-primary" style={{ padding: '14px 32px', fontSize: '1.1rem', textDecoration: 'none' }}>
            Enter the Matrix <ArrowRight size={20} />
          </Link>
          <a href="#features" className="btn-secondary" style={{ padding: '14px 32px', fontSize: '1.1rem', textDecoration: 'none', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)' }}>
            Explore Grid
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container" style={{ marginTop: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Global Market Intelligence</h2>
          <p style={{ color: 'var(--text-muted)' }}>Everything you need to systematically bridge the gap to your next job.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          
          <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'left' }}>
            <div style={{ background: 'rgba(59, 130, 246, 0.1)', width: '60px', height: '60px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)', marginBottom: '1.5rem' }}>
              <BrainCircuit size={32} />
            </div>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>Deep NLP Analysis</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>Our engine extracts subtle nuances from your resume and matches them against industry-standard requirements.</p>
          </div>

          <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'left' }}>
            <div style={{ background: 'rgba(139, 92, 246, 0.1)', width: '60px', height: '60px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-secondary)', marginBottom: '1.5rem' }}>
              <Target size={32} />
            </div>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>Bento Diagnostics</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>Experience your skill gaps visualizes in high-fidelity radar charts via our stunning Bento Grid dashboard layout.</p>
          </div>

          <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'left' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', width: '60px', height: '60px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981', marginBottom: '1.5rem' }}>
              <Code size={32} />
            </div>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>Dynamic Pathways</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>Follow glowing vertical steppers dictating exactly what to learn and in what order to maximize landing rate.</p>
          </div>

        </div>
      </section>

    </div>
  );
};

export default Welcome;
