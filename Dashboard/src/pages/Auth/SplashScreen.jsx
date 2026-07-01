import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

export default function SplashScreen() {
  const { login, signup, user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(name, email, password);
      }
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary)',
      padding: 24,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, var(--accent-emerald-dim) 0%, transparent 70%)',
        top: '-20%',
        left: '-10%',
        opacity: 0.5,
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, var(--accent-sky-dim) 0%, transparent 70%)',
        bottom: '-10%',
        right: '-10%',
        opacity: 0.3,
        pointerEvents: 'none'
      }} />

      <div className="card animate-in" style={{
        maxWidth: 420,
        width: '100%',
        padding: '40px 32px',
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{ marginBottom: 32, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src="/logo.svg" alt="AgriShield AI" style={{ width: 64, height: 64, marginBottom: 16 }} />
          <h1 style={{ fontSize: '1.75rem', marginBottom: 8, textAlign: 'center' }}>{t(isLogin ? 'auth.welcome' : 'auth.createAccount')}</h1>
        </div>

        {error && (
          <div style={{
            width: '100%',
            padding: '12px 16px',
            background: 'var(--accent-red-dim)',
            border: '1px solid var(--accent-red)',
            borderRadius: 'var(--radius-md)',
            color: '#fca5a5',
            fontSize: '0.85rem',
            marginBottom: 20,
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {!isLogin && (
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>
                {t('auth.name')}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
                className="auth-input"
                style={{
                  width: '100%', padding: '12px 16px', background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)', outline: 'none', transition: 'border-color 0.2s'
                }}
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>
              {t('auth.email')}
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="auth-input"
              style={{
                width: '100%', padding: '12px 16px', background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)', outline: 'none', transition: 'border-color 0.2s'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>
              {t('auth.password')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="auth-input"
              style={{
                width: '100%', padding: '12px 16px', background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)', outline: 'none', transition: 'border-color 0.2s'
              }}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: 8, padding: '12px' }}>
            {loading ? <Loader2 size={18} className="spin" /> : (
              <>{t(isLogin ? 'auth.signin' : 'auth.signup')} <ArrowRight size={18} /></>
            )}
          </button>
        </form>

        <div style={{ marginTop: 24, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {t(isLogin ? 'auth.noAccount' : 'auth.hasAccount')}{' '}
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            style={{ background: 'none', border: 'none', color: 'var(--accent-sky)', cursor: 'pointer', fontWeight: 600 }}
          >
            {t(isLogin ? 'auth.signup' : 'auth.signin')}
          </button>
        </div>
      </div>
    </div>
  );
}
