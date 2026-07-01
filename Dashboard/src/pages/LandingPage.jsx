import { useState, useRef } from 'react';
import { ArrowRight, Globe2, TrendingUp, ShieldAlert, CheckCircle2, LineChart, Cpu, Globe, Map } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

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
      <nav style={{
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
          <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.03em', background: 'linear-gradient(90deg, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
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
      `}</style>

      {/* Hero Section */}
      <section style={{
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

        <div className="animate-in" style={{ zIndex: 1, maxWidth: 900 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: 999, color: 'var(--accent-emerald)', fontSize: '0.9rem', fontWeight: 600, marginBottom: 32 }}>
            <Globe2 size={16} /> {t('landing.hero.badge')}
          </div>
          <h1 style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: 24, letterSpacing: '-0.02em' }}>
            {t('landing.hero.title1')} <span className="text-gradient">{t('landing.hero.title2')}</span>{t('landing.hero.title3')}
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto 48px', lineHeight: 1.6 }}>
            {t('landing.hero.subtitle')}
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
            <button onClick={() => navigate('/dashboard')} className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem', borderRadius: 999, boxShadow: '0 8px 30px rgba(16, 185, 129, 0.3)' }}>
              {t('landing.hero.btnPrimary')} <ArrowRight size={20} />
            </button>
            <button onClick={() => {
              document.getElementById('problem-section').scrollIntoView({ behavior: 'smooth' });
            }} className="btn btn-ghost" style={{ padding: '16px 32px', fontSize: '1.1rem', borderRadius: 999, border: '1px solid var(--border-subtle)' }}>
              {t('landing.hero.btnSecondary')}
            </button>
          </div>
        </div>

        {/* Floating Interactive Elements */}
        <div className="animate-in" style={{ animationDelay: '0.3s', marginTop: 80, width: '100%', maxWidth: 1000, position: 'relative', zIndex: 1 }}>
          <TiltCard>
            <div style={{ flex: 1, textAlign: 'left', transform: 'translateZ(30px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                 <div style={{ padding: 12, background: 'var(--accent-red-dim)', borderRadius: 12, color: 'var(--accent-red)' }}><TrendingUp size={24} /></div>
                 <div>
                   <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{t('landing.card.alert')}</div>
                   <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{t('landing.card.alertTitle')}</div>
                 </div>
              </div>
              <div style={{ height: 8, background: 'var(--bg-input)', borderRadius: 4, overflow: 'hidden', width: '80%', marginBottom: 8 }}>
                <div style={{ width: '75%', height: '100%', background: 'var(--accent-red)' }} />
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-red)' }}>{t('landing.card.critical')} (75%)</span>
            </div>

            <div style={{ width: 1, height: 100, background: 'var(--border-subtle)', transform: 'translateZ(10px)' }} />

            <div style={{ flex: 1, textAlign: 'left', transform: 'translateZ(30px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                 <div style={{ padding: 12, background: 'var(--accent-emerald-dim)', borderRadius: 12, color: 'var(--accent-emerald)' }}><Map size={24} /></div>
                 <div>
                   <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{t('landing.card.reco')}</div>
                   <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{t('landing.card.recoTitle')}</div>
                 </div>
              </div>
              <div style={{ height: 8, background: 'var(--bg-input)', borderRadius: 4, overflow: 'hidden', width: '80%', marginBottom: 8 }}>
                <div style={{ width: '92%', height: '100%', background: 'var(--accent-emerald)' }} />
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)' }}>{t('landing.card.confidence')} (92%)</span>
            </div>
          </TiltCard>
        </div>
      </section>

      {/* The Problem Section */}
      <section id="problem-section" style={{ padding: '120px 24px', background: '#0a0f1c', position: 'relative' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 16 }}>{t('landing.problem.title')}</h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto' }}>
              {t('landing.problem.subtitle')}
            </p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            <div className="card hover-scale" style={{ padding: 32, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 24, transition: 'all 0.3s' }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--accent-red-dim)', color: 'var(--accent-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                <ShieldAlert size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 12 }}>{t('landing.problem.c1.title')}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{t('landing.problem.c1.desc')}</p>
            </div>
            
            <div className="card hover-scale" style={{ padding: 32, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 24, transition: 'all 0.3s' }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--accent-amber-dim)', color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                <TrendingUp size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 12 }}>{t('landing.problem.c2.title')}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{t('landing.problem.c2.desc')}</p>
            </div>

            <div className="card hover-scale" style={{ padding: 32, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 24, transition: 'all 0.3s' }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--accent-purple-dim)', color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                <Cpu size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 12 }}>{t('landing.problem.c3.title')}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{t('landing.problem.c3.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Results Section */}
      <section style={{ padding: '120px 24px', position: 'relative' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 64, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 400px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 24 }}>{t('landing.impact.title')}</h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: 32, lineHeight: 1.6 }}>
              {t('landing.impact.subtitle')}
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <CheckCircle2 color="var(--accent-emerald)" size={24} style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 4 }}>{t('landing.impact.l1.title')}</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t('landing.impact.l1.desc')}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <CheckCircle2 color="var(--accent-emerald)" size={24} style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 4 }}>{t('landing.impact.l2.title')}</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t('landing.impact.l2.desc')}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <CheckCircle2 color="var(--accent-emerald)" size={24} style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 4 }}>{t('landing.impact.l3.title')}</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t('landing.impact.l3.desc')}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div style={{ flex: '1 1 400px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
             <div className="hover-scale" style={{ background: 'var(--bg-card)', padding: 32, borderRadius: 24, border: '1px solid var(--border-subtle)', textAlign: 'center', transition: 'all 0.3s' }}>
               <LineChart size={32} color="var(--accent-emerald)" style={{ margin: '0 auto 16px' }} />
               <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>{t('landing.impact.s1.val')}</div>
               <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('landing.impact.s1.lbl')}</div>
             </div>
             <div className="hover-scale" style={{ background: 'var(--bg-card)', padding: 32, borderRadius: 24, border: '1px solid var(--border-subtle)', textAlign: 'center', marginTop: 32, transition: 'all 0.3s' }}>
               <Globe2 size={32} color="var(--accent-sky)" style={{ margin: '0 auto 16px' }} />
               <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>{t('landing.impact.s2.val')}</div>
               <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('landing.impact.s2.lbl')}</div>
             </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <footer style={{ padding: '80px 24px', textAlign: 'center', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 24 }}>{t('landing.footer.title')}</h2>
        <button onClick={() => navigate('/login')} className="btn btn-primary" style={{ padding: '16px 40px', fontSize: '1.1rem', borderRadius: 999 }}>
          {t('landing.footer.btn')}
        </button>
        <p style={{ marginTop: 40, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          © 2026 AgriShield AI. Built for the Hackathon.
        </p>
      </footer>
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
    
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

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
      style={{
        background: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24,
        padding: 32, boxShadow: isHovering ? '0 40px 80px -15px rgba(16, 185, 129, 0.3)' : '0 30px 60px -15px rgba(0, 0, 0, 0.7)',
        display: 'flex', gap: 24, alignItems: 'center', justifyContent: 'space-between',
        transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${isHovering ? 1.02 : 1})`,
        transition: isHovering ? 'transform 0.1s ease-out, box-shadow 0.3s' : 'transform 0.5s ease-out, box-shadow 0.5s',
        cursor: 'pointer',
        transformStyle: 'preserve-3d'
      }}
    >
      {children}
    </div>
  );
}
