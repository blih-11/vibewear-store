import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const iStyle = (err) => ({
  width: '100%', border: `1px solid ${err ? '#ef4444' : '#e5e5e5'}`, borderRadius: '2px',
  padding: '12px 14px', fontSize: '0.85rem', color: '#000',
  outline: 'none', fontFamily: 'inherit', background: '#fff', transition: 'border-color 0.2s',
});

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

export default function Auth() {
  const { loginWithGoogle, loginWithEmail, signUpWithEmail } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get('redirect') || '/';
  const { user: currentUser } = useAuth();

  const [mode, setMode] = useState('signin');
  const [loading, setLoading] = useState(false);
  const [gLoading, setGLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [firebaseErr, setFirebaseErr] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });

  useEffect(() => {
    if (currentUser) navigate(redirect.startsWith('/') ? redirect : '/');
  }, [currentUser]);

  const set = (k) => (e) => { setForm(f => ({ ...f, [k]: e.target.value })); setErrors(er => ({ ...er, [k]: '' })); setFirebaseErr(''); };

  const validate = () => {
    const e = {};
    if (mode === 'signup' && !form.name.trim()) e.name = 'Please enter your name';
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email address';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (mode === 'signup' && form.password !== form.confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const friendly = (code) => {
    const map = {
      'auth/user-not-found': 'No account found with this email.',
      'auth/wrong-password': 'Incorrect password. Try again.',
      'auth/email-already-in-use': 'An account already exists with this email.',
      'auth/invalid-email': "That email address doesn't look right.",
      'auth/weak-password': 'Password is too weak.',
      'auth/too-many-requests': 'Too many attempts. Please wait then try again.',
      'auth/network-request-failed': 'Network error. Check your connection.',
    };
    return map[code] || 'Something went wrong. Please try again.';
  };

  const handleGoogle = async () => {
    setGLoading(true); setFirebaseErr('');
    try {
      await loginWithGoogle();
    } catch (err) {
      const { currentUser } = await import('../firebase').then(m => m.auth);
      if (currentUser) return;
      const msg = friendly(err.code); if (msg) setFirebaseErr(msg);
    } finally { setGLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true); setFirebaseErr('');
    try {
      if (mode === 'signup') await signUpWithEmail(form.email, form.password, form.name.trim());
      else await loginWithEmail(form.email, form.password);
      navigate(redirect.startsWith('/') ? redirect : '/');
    } catch (err) {
      const msg = friendly(err.code); if (msg) setFirebaseErr(msg);
    } finally { setLoading(false); }
  };

  return (
    <div style={{ background: '#fff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5rem 1.5rem' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: '#000', letterSpacing: '0.1em', fontWeight: 800, textDecoration: 'none' }}>
            VIBE WEAR
          </Link>
          <p style={{ color: '#aaa', fontSize: '0.82rem', marginTop: '6px' }}>
            {mode === 'signin' ? 'Welcome back' : 'Create your account'}
          </p>
        </div>

        {/* Card */}
        <div style={{ border: '1px solid #e5e5e5', borderRadius: '4px', overflow: 'hidden' }}>

          {/* Tab switcher */}
          <div style={{ display: 'flex', borderBottom: '1px solid #f0f0f0' }}>
            {[['signin', 'Sign In'], ['signup', 'Create Account']].map(([m, label]) => (
              <button key={m} onClick={() => { setMode(m); setErrors({}); setFirebaseErr(''); }}
                style={{
                  flex: 1, padding: '14px', fontSize: '0.82rem', fontWeight: 600,
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: mode === m ? '#000' : '#aaa',
                  borderBottom: mode === m ? '2px solid #000' : '2px solid transparent',
                  marginBottom: '-1px', transition: 'all 0.2s',
                }}>
                {label}
              </button>
            ))}
          </div>

          <div style={{ padding: '1.75rem' }}>
            {/* Google */}
            <button onClick={handleGoogle} disabled={gLoading}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: '#f8f8f8', border: '1px solid #e5e5e5', borderRadius: '2px', padding: '12px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#f0f0f0'}
              onMouseLeave={e => e.currentTarget.style.background = '#f8f8f8'}>
              {gLoading
                ? <div style={{ width: '16px', height: '16px', border: '2px solid #ccc', borderTopColor: '#000', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                : <GoogleIcon />}
              {gLoading ? 'Connecting...' : 'Continue with Google'}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '1.25rem 0' }}>
              <div style={{ flex: 1, height: '1px', background: '#f0f0f0' }} />
              <span style={{ color: '#bbb', fontSize: '0.75rem' }}>or</span>
              <div style={{ flex: 1, height: '1px', background: '#f0f0f0' }} />
            </div>

            {/* Error */}
            {firebaseErr && (
              <div style={{ background: '#fff5f5', border: '1px solid #fecaca', borderRadius: '2px', padding: '10px 14px', marginBottom: '1rem' }}>
                <p style={{ color: '#ef4444', fontSize: '0.8rem' }}>{firebaseErr}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {mode === 'signup' && (
                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Full Name *</label>
                  <input value={form.name} onChange={set('name')} placeholder="e.g. Kofi Mensah" autoComplete="name" style={iStyle(errors.name)}
                    onFocus={e => e.target.style.borderColor = '#000'} onBlur={e => e.target.style.borderColor = errors.name ? '#ef4444' : '#e5e5e5'} />
                  {errors.name && <p style={{ color: '#ef4444', fontSize: '0.72rem', marginTop: '4px' }}>{errors.name}</p>}
                </div>
              )}
              <div>
                <label style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Email *</label>
                <input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" autoComplete="email" style={iStyle(errors.email)}
                  onFocus={e => e.target.style.borderColor = '#000'} onBlur={e => e.target.style.borderColor = errors.email ? '#ef4444' : '#e5e5e5'} />
                {errors.email && <p style={{ color: '#ef4444', fontSize: '0.72rem', marginTop: '4px' }}>{errors.email}</p>}
              </div>
              <div>
                <label style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Password *</label>
                <input type="password" value={form.password} onChange={set('password')} placeholder="••••••••" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} style={iStyle(errors.password)}
                  onFocus={e => e.target.style.borderColor = '#000'} onBlur={e => e.target.style.borderColor = errors.password ? '#ef4444' : '#e5e5e5'} />
                {errors.password && <p style={{ color: '#ef4444', fontSize: '0.72rem', marginTop: '4px' }}>{errors.password}</p>}
              </div>
              {mode === 'signup' && (
                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Confirm Password *</label>
                  <input type="password" value={form.confirm} onChange={set('confirm')} placeholder="••••••••" autoComplete="new-password" style={iStyle(errors.confirm)}
                    onFocus={e => e.target.style.borderColor = '#000'} onBlur={e => e.target.style.borderColor = errors.confirm ? '#ef4444' : '#e5e5e5'} />
                  {errors.confirm && <p style={{ color: '#ef4444', fontSize: '0.72rem', marginTop: '4px' }}>{errors.confirm}</p>}
                </div>
              )}
              <button type="submit" disabled={loading}
                style={{ background: '#000', color: '#fff', border: 'none', padding: '14px', fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '2px', marginTop: '4px', opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                {loading && <div style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />}
                {loading ? (mode === 'signup' ? 'Creating...' : 'Signing in...') : (mode === 'signup' ? 'Create Account' : 'Sign In')}
              </button>
            </form>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/" style={{ color: '#aaa', fontSize: '0.78rem', textDecoration: 'none' }}
            onMouseEnter={e => e.target.style.color = '#000'}
            onMouseLeave={e => e.target.style.color = '#aaa'}>
            ← Continue browsing
          </Link>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
