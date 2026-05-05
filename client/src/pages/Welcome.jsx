import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, BrainCircuit, Target, Code, ShieldCheck, Zap, Globe, Cpu, BarChart3, Layers, Send, FileSearch, Database, Route, Network, Upload, ArrowUpRight, GraduationCap, Map, Activity, CheckCircle2, ArrowUp } from 'lucide-react';
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

      {/* 1. SaaS Hero Section */}
      <section id="home" ref={heroRef} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '10rem 2rem 4rem', position: 'relative', zIndex: 10, background: 'radial-gradient(ellipse at top, rgba(56, 178, 172, 0.15) 0%, transparent 60%)' }}>
        
        {/* Badge - Back above headline, but closer to it and further from navbar */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          style={{ background: 'rgba(56, 178, 172, 0.15)', padding: '6px 16px', borderRadius: '999px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.2rem' }}
        >
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-cyan)' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#000', letterSpacing: '2px', textTransform: 'uppercase' }}>AI-Powered Skill Gap Analysis</span>
        </motion.div>

        {/* Headline */}
        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="responsive-title"
          style={{ fontSize: '7rem', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: '2rem', color: '#0B0F19' }}
        >
          AI-Driven Growth<br />
          To <span className="text-hollow">Boost Your</span><br />
          Career Path
        </motion.h1>

        {/* Subhead */}
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 1 }} style={{ fontSize: '1.4rem', color: 'var(--text-muted)', maxWidth: '650px', marginBottom: '3.5rem', fontWeight: 500, lineHeight: 1.6 }}>
          Upload your resume and target job description to reveal skill gaps, get your ATS score, and receive a definitive roadmap to land your dream role.
        </motion.p>

        {/* CTA Area */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} style={{ display: 'flex', gap: '1.5rem', position: 'relative', zIndex: 50, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={() => navigate('/analyze')}
            style={{ background: '#0B0F19', color: '#fff', padding: '18px 40px', fontSize: '1.2rem', borderRadius: '99px', border: 'none', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
          >
            Analyze My Skills <ArrowRight size={20} />
          </button>

          <div className="mobile-hidden" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: '#f3f4f6', padding: '12px 20px', borderRadius: '99px', fontSize: '0.9rem', fontWeight: 800, color: '#000' }}>
              Used by <span style={{ color: 'var(--color-cyan)' }}>Active Candidates</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 2. Metrics & Image Banner */}
      <section className="container" style={{ padding: '2rem 2rem 6rem', position: 'relative', zIndex: 10 }}>

        {/* Large Image Banner */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '1000px', margin: '0 auto 6rem' }}>
          <div className="responsive-container" style={{ background: '#0B0F19', width: '100%', minHeight: '250px', borderRadius: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', border: '8px solid #fff', boxShadow: '0 30px 60px rgba(0,0,0,0.08)', padding: '2rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-cyan)', letterSpacing: '2px', marginBottom: '1rem', textAlign: 'center' }}>DIAGNOSTIC VIEW</div>
            <div className="responsive-title" style={{ fontSize: '4rem', fontWeight: 800, textAlign: 'center' }}>Vector Mapping</div>
          </div>

          {/* Floating Badge */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            style={{ position: 'absolute', right: '-20px', bottom: '-20px', background: '#fff', padding: '24px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', maxWidth: '280px', border: '1px solid rgba(0,0,0,0.05)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ background: 'var(--color-green)', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>
                <CheckCircle2 size={20} />
              </div>
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, lineHeight: 1 }}>94.2%</div>
                <div style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>Match Accuracy</div>
              </div>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>Our AI vectors precisely map your professional history against target job requirements.</p>
          </motion.div>
        </div>

        {/* Logos */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem', flexWrap: 'wrap', opacity: 0.6, marginBottom: '6rem' }}>
          {[<Cpu size={32} />, <Target size={32} />, <Layers size={32} />, <Network size={32} />, <ShieldCheck size={32} />].map((icon, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 800, color: '#000' }}>
              {icon}
            </div>
          ))}
        </div>

        {/* Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
          {[
            { value: '98%', label: 'ATS parse accuracy', bg: 'var(--color-green)' },
            { value: '24h', label: 'average roadmap completion', bg: 'var(--color-purple)' },
            { value: '4x', label: 'faster skill acquisition', bg: 'var(--color-lime)' },
            { value: 'JD', label: 'score optimization', bg: 'var(--color-cyan)' }
          ].map((metric, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} style={{ background: metric.bg, padding: '2rem', borderRadius: '32px', color: '#0B0F19', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '220px' }}>
              <div style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.04em' }}>{metric.value}</div>
              <div style={{ fontSize: '1rem', fontWeight: 600, lineHeight: 1.3, maxWidth: '140px', opacity: 0.8 }}>{metric.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. Transformative Impact (Bento) */}
      <section id="features" className="container" style={{ padding: '6rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '3.5rem', fontWeight: 800, letterSpacing: '-0.04em', color: '#0B0F19', marginBottom: '1rem' }}>Drive Transformative<br />Impact with AI</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>We've built the tools that high-performance teams use to scale intelligence across their organization.</p>
        </div>

        <div className="mobile-stack" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
          {/* Left Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ background: '#fff', borderRadius: '40px', padding: '3rem', position: 'relative', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 20px 40px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
              <div style={{ background: 'var(--color-cyan)', width: '48px', height: '48px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>
                <Zap size={24} />
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1 }}>83%</div>
                <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>Autonomous Resolution</div>
              </div>
            </div>
            <h3 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: '1rem' }}>Matched vs Missing</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '400px', lineHeight: 1.6, marginBottom: '2rem' }}>We instantly separate what you know from what you need to land the job you want.</p>
            <div style={{ background: '#f3f4f6', flex: 1, borderRadius: '24px', marginTop: 'auto', minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: '1.2rem', fontWeight: 700 }}>
              Image Placeholder
            </div>
          </motion.div>

          {/* Right Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} viewport={{ once: true }} style={{ background: 'var(--color-cyan)', borderRadius: '40px', padding: '3rem', color: '#0B0F19' }}>
            <h3 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: '1.5rem' }}>Learning Roadmap</h3>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.6, opacity: 0.85 }}>Get curated YouTube links, documentation, and online courses tailored to bridge your unique skill gaps.</p>
          </motion.div>
        </div>
      </section>

      {/* 4. Onboarding Steps */}
      <section id="workflow" className="container responsive-container" style={{ padding: '6rem 2rem' }}>
        <div className="mobile-stack" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '3.5rem', fontWeight: 800, letterSpacing: '-0.04em', color: '#0B0F19', marginBottom: '4rem', lineHeight: 1.1 }}>Effortless<br />onboarding and<br />rapid discovery<br />steps</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
              {[
                { num: '01', color: 'var(--color-green)', title: 'Input Data', desc: 'Upload your latest resume and the target Job Description to start the engine.' },
                { num: '02', color: 'var(--color-purple)', title: 'AI Diagnostics', desc: 'Receive your ATS score, JD match percentage, and a list of verified vs missing skills.' },
                { num: '03', color: 'var(--color-lime)', title: 'Bridge the Gap', desc: 'Follow your automated roadmap with direct links to the best learning resources available.' }
              ].map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: '1.5rem' }}>
                  <div style={{ background: step.color, width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 800, color: '#000', flexShrink: 0 }}>
                    {step.num}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>{step.title}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: '#f3f4f6', height: '700px', borderRadius: '40px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: '1.5rem', fontWeight: 700 }}>
            Portrait Image
          </div>
        </div>
      </section>

      {/* 5. Testimonials */}
      <section className="container" style={{ padding: '6rem 2rem 8rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.04em', color: '#0B0F19', marginBottom: '1rem' }}>Don't Take Our Word For It</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Read their testimonials to gain insights into how we've made a positive impact.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {[
            { color: 'var(--color-green)', name: 'Sarah Jenkins', role: 'SENIOR DEV', text: '"The JD Score feature is a game changer. It told me exactly why I was getting rejected and gave me the roadmap to fix it."', img: '1' },
            { color: 'var(--color-purple)', name: 'Marcus Thorne', role: 'PRODUCT MANAGER', text: '"I used the resume refinements to boost my ATS score. The learning links were spot on—no more searching YouTube for hours."', img: '2' },
            { color: 'var(--color-lime)', name: 'Lina Wang', role: 'UX DESIGNER', text: '"Seeing my matched vs missing skills clearly laid out helped me focus my study time. I landed a senior role within a month."', img: '3' }
          ].map((test, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} style={{ background: test.color, padding: '2.5rem', borderRadius: '32px', color: '#0B0F19', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img src={`https://i.pravatar.cc/100?img=${parseInt(test.img) + 20}`} alt={test.name} style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{test.name}</div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, opacity: 0.6, letterSpacing: '1px' }}>{test.role}</div>
                </div>
              </div>
              <p style={{ fontStyle: 'italic', fontSize: '1.05rem', lineHeight: 1.6, opacity: 0.9 }}>{test.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5.5 FAQ Section */}
      <section id="faq" className="container" style={{ padding: '6rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '3.5rem', fontWeight: 800, letterSpacing: '-0.04em', color: '#0B0F19', marginBottom: '1rem' }}>Common Questions</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>Everything you need to know about BluePrint analysis.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
          {[
            { q: "How accurate is the JD score?", a: "Our AI uses semantic vector mapping to ensure 98% accuracy in skill identification vs requirements." },
            { q: "Is my resume data secure?", a: "Yes, we use enterprise-grade encryption. Your data is analyzed in a secure sandbox and never sold." },
            { q: "Can I download the roadmap?", a: "Absolutely. Every analysis includes a high-fidelity PDF export of your personalized roadmap." },
            { q: "Is BluePrint really free?", a: "Yes, our core analysis and roadmap generation tools are completely free for all users." }
          ].map((item, i) => (
            <div key={i} style={{ background: '#fff', padding: '2.5rem', borderRadius: '32px', border: '1px solid rgba(0,0,0,0.05)' }}>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem', color: '#000' }}>{item.q}</h4>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Ready to Bridge the Gap CTA */}
      <section className="container" style={{ padding: '4rem 2rem' }}>
        <div style={{ background: 'linear-gradient(135deg, #050b14 0%, #0a1128 100%)', borderRadius: '48px', padding: '6rem 2rem', textAlign: 'center', color: '#fff', position: 'relative', overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.1)' }}>
          {/* Subtle Glow */}
          <div style={{ position: 'absolute', top: '0', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(103,232,249,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

          <h2 className="responsive-title" style={{ fontSize: '5.5rem', fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 1.1, marginBottom: '2rem', position: 'relative', zIndex: 10 }}>
            Ready to bridge<br />the gap?
          </h2>
          <p style={{ fontSize: '1.4rem', color: 'rgba(255,255,255,0.7)', maxWidth: '600px', margin: '0 auto 4rem', lineHeight: 1.5, position: 'relative', zIndex: 10 }}>
            Start your journey towards mastery today. Join professionals using AI to outpace the market.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', position: 'relative', zIndex: 10, flexWrap: 'wrap' }}>
            <Link to="/register" style={{ background: '#fff', color: '#050b14', padding: '16px 32px', fontSize: '1.1rem', fontWeight: 800, borderRadius: '99px', textDecoration: 'none' }}>
              Start Analysis
            </Link>
            <a href="#demo" style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '16px 32px', fontSize: '1.1rem', fontWeight: 700, borderRadius: '99px', textDecoration: 'none', transition: 'background 0.3s' }}>
              Request Demo
            </a>
          </div>
        </div>
      </section>

      {/* 7. Let's Make It Happen Footer */}
      <footer style={{ background: 'linear-gradient(to bottom, #000000 0%, #001a1a 100%)', color: '#fff', padding: '6rem 2rem 2rem', marginTop: '4rem', position: 'relative' }}>
        <div className="container" style={{ padding: 0 }}>

          {/* Top Bar: Fake Search & Socials */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 24px', borderRadius: '99px', marginBottom: '6rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', opacity: 0.7 }}>
              <div style={{ background: '#fff', width: '20px', height: '20px', borderRadius: '4px' }} />
              <span style={{ fontSize: '0.9rem' }}>Bridge the gap between your resume and your dream job description</span>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', opacity: 0.8, alignItems: 'center' }}>
              <Globe size={20} />
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
            </div>
          </div>

          <div className="mobile-stack" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '4rem', marginBottom: '8rem' }}>
            {/* Massive Heading */}
            <div>
              <h2 className="responsive-title" style={{ fontSize: '6rem', fontWeight: 800, lineHeight: 0.9, letterSpacing: '-0.05em', marginBottom: '3rem' }}>
                BUILD YOUR<br />FUTURE NOW
              </h2>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/analyze" style={{ background: 'var(--color-cyan)', color: '#000', padding: '16px 32px', borderRadius: '99px', textDecoration: 'none', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Zap size={18} /> Analyze Now
                </Link>
                <a href="#workflow" style={{ border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '16px 32px', borderRadius: '99px', textDecoration: 'none', fontWeight: 600 }}>
                  Learn More
                </a>
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 400, letterSpacing: '1px', marginBottom: '2rem', textTransform: 'uppercase' }}>Navigate</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                {[
                  { label: 'Home', id: '#home' },
                  { label: 'Features', id: '#features' },
                  { label: 'How it Works', id: '#workflow' },
                  { label: 'FAQ', id: '#faq' }
                ].map((link) => (
                  <li key={link.label} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.1rem' }}>
                    <span style={{ color: 'var(--color-cyan)' }}>★</span>
                    <a href={link.id} style={{ color: '#fff', textDecoration: 'none', transition: 'opacity 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 400, letterSpacing: '1px', marginBottom: '2rem', textTransform: 'uppercase' }}>Capabilities</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                {['JD Scoring', 'ATS Optimization', 'Skill Mapping', 'Growth Roadmaps'].map((link) => (
                  <li key={link} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.1rem' }}>
                    <span style={{ color: 'var(--color-cyan)' }}>★</span> {link}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mobile-stack" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
            <div>
              <div style={{ fontSize: '0.8rem', letterSpacing: '1px', opacity: 0.6, marginBottom: '0.5rem' }}>ALL RIGHTS RESERVED.</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 600, letterSpacing: '-1px' }}>© 2026 BluePrint</div>
            </div>
            <div style={{ textAlign: 'right' }} className="mobile-hidden">
              <div style={{ fontSize: '0.8rem', letterSpacing: '1px', opacity: 0.6, marginBottom: '0.5rem', textTransform: 'uppercase' }}>Local Time</div>
              <div style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: 'var(--color-cyan)' }}>★</span> {new Date().toLocaleTimeString()}
              </div>
            </div>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              style={{ background: 'var(--color-cyan)', color: '#000', border: 'none', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <ArrowUp size={24} />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;
