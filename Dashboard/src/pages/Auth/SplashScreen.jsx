import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../lib/supabaseClient';

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
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
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
      navigate('/dashboard', { replace: true });
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
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="auth-input"
                style={{
                  width: '100%', padding: '12px 16px', paddingRight: '40px', background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)', outline: 'none', transition: 'border-color 0.2s'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
                  padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: 8, padding: '12px' }}>
            {loading ? <Loader2 size={18} className="spin" /> : (
              <>{t(isLogin ? 'auth.signin' : 'auth.signup')} <ArrowRight size={18} /></>
            )}
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', margin: '8px 0', gap: 12 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>OR</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
          </div>
          
          <button 
            onClick={async () => {
              try {
                // Gunakan klien supabase yang diimpor, bukan window.supabase
                const { error } = await supabase.auth.signInWithOAuth({ 
                  provider: 'google',
                  options: {
                    redirectTo: 'https://agrishieldai-66164.web.app/dashboard'
                  }
                });
                if (error) throw error;
              } catch (err) {
                console.error('Error Google Login:', err.message);
                alert('Terjadi kesalahan saat mencoba login dengan Google: ' + err.message);
              }
            }}
            className="btn btn-ghost" 
            style={{ width: '100%', justifyContent: 'center', padding: '12px', border: '1px solid var(--border-subtle)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: 8 }}>
              <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.67 15.63 16.89 16.8 15.74 17.57V20.34H19.3C21.39 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
              <path d="M12 23C14.97 23 17.46 22.02 19.3 20.34L15.74 17.57C14.74 18.24 13.48 18.66 12 18.66C9.14 18.66 6.71 16.73 5.84 14.15H2.17V17.02C3.98 20.61 7.7 23 12 23Z" fill="#34A853"/>
              <path d="M5.84 14.15C5.62 13.48 5.5 12.75 5.5 12C5.5 11.25 5.62 10.52 5.84 9.85V6.98H2.17C1.43 8.46 1 10.18 1 12C1 13.82 1.43 15.54 2.17 17.02L5.84 14.15Z" fill="#FBBC05"/>
              <path d="M12 5.34C13.62 5.34 15.07 5.9 16.21 6.99L19.38 3.82C17.45 2.02 14.96 1 12 1C7.7 1 3.98 3.39 2.17 6.98L5.84 9.85C6.71 7.27 9.14 5.34 12 5.34Z" fill="#EA4335"/>
            </svg>
            Continue with Google
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
