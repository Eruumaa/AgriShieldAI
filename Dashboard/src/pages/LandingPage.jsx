import { useState, useRef } from 'react';
import { ArrowRight, Globe2, TrendingUp, ShieldAlert, CheckCircle2, LineChart, Cpu, Globe, Map } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

export default function LandingPage() {
  const navigate = useNavigate();
  const { lang, toggleLanguage, t } = useLanguage();
  const { user } = useAuth();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      overflowX: 'hidden'
    }}>
      {/* Navigation Bar */}
      <nav className="landing-nav" style={{
        position: 'fixed', top: 0, left: 0, width: '100%',
        padding: '20px 40px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="/logo.svg" alt="AgriShield AI" style={{ width: 36, height: 36 }} />
          <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'italic', fontSize: '1.35rem', fontWeight: 700, letterSpacing: '-0.01em', background: 'linear-gradient(90deg, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            AgriShield AI
          </span>
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <button className="topbar-icon-btn" onClick={toggleLanguage} title="Toggle Language" style={{ width: 'auto', padding: '8px 12px', gap: 6, fontWeight: 600, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, cursor: 'pointer', color: 'white' }}>
            <Globe size={16} />
            {lang.toUpperCase()}
          </button>
          
          {user ? (
            <button onClick={() => navigate('/dashboard')} className="btn btn-primary" style={{ padding: '10px 24px', fontWeight: 600, borderRadius: 999 }}>
              {t('landing.hero.btnPrimary')}
            </button>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="btn btn-ghost" style={{ padding: '10px 20px', fontWeight: 600 }}>{t('auth.signin')}</button>
              <button onClick={() => navigate('/login')} className="btn btn-primary" style={{ padding: '10px 24px', fontWeight: 600, borderRadius: 999 }}>
                {t('auth.signup')}
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Dynamic Background Animation Styles */}
      <style>{`
        @keyframes float-1 {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(5%, 10%) scale(1.1); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes float-2 {
          0% { transform: translate(0, 0) scale(1.1); }
          50% { transform: translate(-10%, -5%) scale(1); }
          100% { transform: translate(0, 0) scale(1.1); }
        }
        @keyframes float-3 {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(10%, -10%) scale(1.2); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .text-gradient {
          background: linear-gradient(270deg, var(--accent-emerald), var(--accent-sky), var(--accent-purple));
          background-size: 200% 200%;
          animation: gradient-shift 5s ease infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .title-glow {
          position: relative;
        }
        .title-glow::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 80%;
          height: 80%;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, transparent 70%);
          filter: blur(40px);
          z-index: -1;
          pointer-events: none;
        }
      `}</style>

      {/* Hero Section */}
      <section className="landing-hero" style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        position: 'relative',
        padding: '120px 24px 60px',
        textAlign: 'center',
        overflow: 'hidden'
      }}>
        {/* Dynamic Animated Background */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
          <div style={{ 
            position: 'absolute', width: '60vw', height: '60vw', 
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 60%)', 
            top: '-20%', left: '-10%', 
            animation: 'float-1 20s infinite ease-in-out' 
          }} />
          <div style={{ 
            position: 'absolute', width: '50vw', height: '50vw', 
            background: 'radial-gradient(circle, rgba(14, 165, 233, 0.12) 0%, transparent 60%)', 
            bottom: '-10%', right: '-10%', 
            animation: 'float-2 25s infinite ease-in-out' 
          }} />
          <div style={{ 
            position: 'absolute', width: '40vw', height: '40vw', 
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 60%)', 
            top: '40%', left: '30%', 
            animation: 'float-3 22s infinite ease-in-out' 
          }} />
        </div>

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          style={{ zIndex: 1, maxWidth: 900, position: 'relative' }}
        >
          <motion.h1 variants={fadeInUp} className="title-glow" style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: 24, letterSpacing: '-0.02em' }}>
            {t('landing.hero.title1')} <span className="text-gradient">{t('landing.hero.title2')}</span>{t('landing.hero.title3')}
          </motion.h1>
          <motion.p variants={fadeInUp} style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto 48px', lineHeight: 1.6 }}>
            {t('landing.hero.subtitle')}
          </motion.p>
          <motion.div variants={fadeInUp} className="landing-hero-buttons" style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
            <button onClick={() => navigate('/dashboard')} className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem', borderRadius: 999, boxShadow: '0 8px 30px rgba(16, 185, 129, 0.3)' }}>
              {t('landing.hero.btnPrimary')} <ArrowRight size={20} />
            </button>
            <button onClick={() => {
              document.getElementById('problem-section').scrollIntoView({ behavior: 'smooth' });
            }} className="btn btn-ghost" style={{ padding: '16px 32px', fontSize: '1.1rem', borderRadius: 999, border: '1px solid var(--border-subtle)' }}>
              {t('landing.hero.btnSecondary')}
            </button>
          </motion.div>
        </motion.div>

        {/* Floating Interactive Elements */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{ marginTop: 80, width: '100%', maxWidth: 1000, position: 'relative', zIndex: 1 }}
        >
          <TiltCard>
            <div style={{ flex: 1, textAlign: 'left', transform: 'translateZ(30px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                 <div style={{ padding: 12, background: 'var(--accent-red-dim)', borderRadius: 12, color: 'var(--accent-red)' }}><TrendingUp size={24} /></div>
                 <div>
                   <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{t('landing.card.alert')}</div>
                   <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{t('landing.card.alertTitle')}</div>
                 </div>
              </div>
              <div style={{ height: 8, background: 'var(--bg-input)', borderRadius: 4, overflow: 'hidden', width: '100%', marginBottom: 12 }}>
                <div style={{ width: '75%', height: '100%', background: 'var(--accent-red)' }} />
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--accent-red)', fontWeight: 500 }}>{t('landing.card.critical')} (75%)</span>
            </div>

            <div className="tilt-card-divider" style={{ background: 'var(--border-subtle)', transform: 'translateZ(10px)' }} />

            <div style={{ flex: 1, textAlign: 'left', transform: 'translateZ(30px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                 <div style={{ padding: 12, background: 'var(--accent-emerald-dim)', borderRadius: 12, color: 'var(--accent-emerald)' }}><Map size={24} /></div>
                 <div>
                   <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{t('landing.card.reco')}</div>
                   <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{t('landing.card.recoTitle')}</div>
                 </div>
              </div>
              <div style={{ height: 8, background: 'var(--bg-input)', borderRadius: 4, overflow: 'hidden', width: '100%', marginBottom: 12 }}>
                <div style={{ width: '92%', height: '100%', background: 'var(--accent-emerald)' }} />
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--accent-emerald)', fontWeight: 500 }}>{t('landing.card.confidence')} (92%)</span>
            </div>
          </TiltCard>
        </motion.div>
      </section>

      {/* The Problem Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        id="problem-section" 
        style={{ padding: '120px 24px', background: '#0a0f1c', position: 'relative' }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div variants={fadeInUp} style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 16 }}>{t('landing.problem.title')}</h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto' }}>
              {t('landing.problem.subtitle')}
            </p>
          </motion.div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {[
              { icon: ShieldAlert, color: 'red', title: t('landing.problem.c1.title'), desc: t('landing.problem.c1.desc') },
              { icon: TrendingUp, color: 'amber', title: t('landing.problem.c2.title'), desc: t('landing.problem.c2.desc') },
              { icon: Cpu, color: 'purple', title: t('landing.problem.c3.title'), desc: t('landing.problem.c3.desc') }
            ].map((feature, idx) => (
              <motion.div key={idx} variants={fadeInUp} className="card hover-scale" style={{ 
                padding: 32, background: 'rgba(255,255,255,0.02)', 
                border: '1px solid rgba(255,255,255,0.05)', borderRadius: 24, 
                transition: 'all 0.3s',
                boxShadow: `0 4px 20px rgba(0,0,0,0.2)`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `var(--accent-${feature.color})`;
                e.currentTarget.style.boxShadow = `0 10px 40px var(--accent-${feature.color}-dim)`;
                e.currentTarget.style.transform = 'translateY(-5px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              >
                <div style={{ width: 64, height: 64, borderRadius: 16, background: `var(--accent-${feature.color}-dim)`, color: `var(--accent-${feature.color})`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                  <feature.icon size={32} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 12 }}>{feature.title}</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Our Results Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        style={{ padding: '120px 24px', position: 'relative' }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 64, flexWrap: 'wrap' }}>
          <motion.div variants={fadeInUp} style={{ flex: '1 1 400px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 24 }}>{t('landing.impact.title')}</h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: 32, lineHeight: 1.6 }}>
              {t('landing.impact.subtitle')}
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {[
                { title: t('landing.impact.l1.title'), desc: t('landing.impact.l1.desc') },
                { title: t('landing.impact.l2.title'), desc: t('landing.impact.l2.desc') },
                { title: t('landing.impact.l3.title'), desc: t('landing.impact.l3.desc') }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                  <CheckCircle2 color="var(--accent-emerald)" size={28} style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: 6 }}>{item.title}</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          
          <motion.div variants={fadeInUp} style={{ flex: '1 1 400px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
             <div className="hover-scale" style={{ 
               background: 'var(--bg-card)', padding: '40px 24px', borderRadius: 24, 
               border: '1px solid var(--border-subtle)', borderTop: '4px solid var(--accent-emerald)',
               textAlign: 'center', transition: 'all 0.3s', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' 
              }}>
               <LineChart size={40} color="var(--accent-emerald)" style={{ margin: '0 auto 24px' }} />
               <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8, fontFamily: "'Playfair Display', serif" }}>{t('landing.impact.s1.val')}</div>
               <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{t('landing.impact.s1.lbl')}</div>
             </div>
             <div className="hover-scale" style={{ 
               background: 'var(--bg-card)', padding: '40px 24px', borderRadius: 24, 
               border: '1px solid var(--border-subtle)', borderTop: '4px solid var(--accent-sky)',
               textAlign: 'center', marginTop: 40, transition: 'all 0.3s', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' 
              }}>
               <Globe2 size={40} color="var(--accent-sky)" style={{ margin: '0 auto 24px' }} />
               <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8, fontFamily: "'Playfair Display', serif" }}>{t('landing.impact.s2.val')}</div>
               <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{t('landing.impact.s2.lbl')}</div>
             </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer CTA */}
      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        style={{ padding: '60px 24px', textAlign: 'center', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)' }}
      >
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 24 }}>{t('landing.footer.title')}</h2>
        <button onClick={() => navigate('/login')} className="btn btn-primary" style={{ padding: '16px 40px', fontSize: '1.1rem', borderRadius: 999 }}>
          {t('landing.footer.btn')}
        </button>
        <p style={{ marginTop: 32, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          © 2026 AgriShield AI. Built for the Hackathon.
        </p>
      </motion.footer>
    </div>
  );
}

function TiltCard({ children }) {
  const cardRef = useRef(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => {
    setIsHovering(false);
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="tilt-card"
      style={{
        background: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24,
        padding: '40px', boxShadow: isHovering ? '0 40px 80px -15px rgba(16, 185, 129, 0.3)' : '0 30px 60px -15px rgba(0, 0, 0, 0.7)',
        transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${isHovering ? 1.02 : 1})`,
        transition: isHovering ? 'transform 0.1s ease-out, box-shadow 0.3s' : 'transform 0.5s ease-out, box-shadow 0.5s',
        cursor: 'pointer',
        transformStyle: 'preserve-3d',
        minHeight: '200px'
      }}
    >
      {children}
    </div>
  );
}
