import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// ── tiny helpers ─────────────────────────────────────────────────
const iStyle = (err) =>
  `w-full bg-white/5 border ${err ? 'border-red-400/60' : 'border-white/10'} rounded-xl px-4 py-3.5 text-brand-cream text-sm placeholder-white/25 focus:outline-none focus:border-white/35 focus:bg-white/7 transition-all`;

function FieldErr({ msg }) {
  if (!msg) return null;
  return (
    <p className="text-red-400 text-[11px] flex items-center gap-1 mt-1">
      <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
      </svg>
      {msg}
    </p>
  );
}

// ── Google icon SVG ───────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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

  const [mode, setMode]       = useState('signin'); // 'signin' | 'signup'
  const [loading, setLoading] = useState(false);
  const [gLoading, setGLoading] = useState(false);
  const [errors, setErrors]   = useState({});
  const [firebaseErr, setFirebaseErr] = useState('');

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const set = (k) => (e) => { setForm(f => ({ ...f, [k]: e.target.value })); setErrors(er => ({ ...er, [k]: '' })); setFirebaseErr(''); };

  const switchMode = (m) => { setMode(m); setErrors({}); setFirebaseErr(''); };

  // ── Validate ──────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (mode === 'signup' && !form.name.trim())          e.name     = 'Please enter your name';
    if (!/\S+@\S+\.\S+/.test(form.email))                e.email    = 'Enter a valid email address';
    if (form.password.length < 6)                         e.password = 'Password must be at least 6 characters';
    if (mode === 'signup' && form.password !== form.confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return !Object.keys(e).length;
  };

  // ── Firebase error messages → human language ──────────────────
  const friendly = (code) => {
    const map = {
      'auth/user-not-found':         'No account found with this email.',
      'auth/wrong-password':         'Incorrect password. Try again.',
      'auth/email-already-in-use':   'An account already exists with this email.',
      'auth/invalid-email':          'That email address doesn\'t look right.',
      'auth/weak-password':          'Password is too weak — try something stronger.',
      'auth/too-many-requests':      'Too many attempts. Please wait a moment then try again.',
      'auth/popup-closed-by-user':   'Sign-in popup was closed. Please try again.',
      'auth/network-request-failed': 'Network error. Check your connection.',
    };
    return map[code] || 'Something went wrong. Please try again.';
  };

  // ── Google ────────────────────────────────────────────────────
  const handleGoogle = async () => {
    setGLoading(true);
    setFirebaseErr('');
    try {
      await loginWithGoogle();
      navigate(redirect === 'checkout' ? '/checkout' : `/${redirect}`);
    } catch (err) {
      setFirebaseErr(friendly(err.code));
    } finally {
      setGLoading(false);
    }
  };

  // ── Email submit ──────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setFirebaseErr('');
    try {
      if (mode === 'signup') {
        await signUpWithEmail(form.email, form.password, form.name.trim());
      } else {
        await loginWithEmail(form.email, form.password);
      }
      navigate(redirect === 'checkout' ? '/checkout' : `/${redirect}`);
    } catch (err) {
      setFirebaseErr(friendly(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-brand-bg min-h-screen flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">

        {/* Brand */}
        <div className="text-center mb-8">
          <Link to="/" style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: '#fff', letterSpacing: '0.08em' }}>
            VIBE WEAR
          </Link>
          <p className="text-white/40 text-sm mt-2">
            {mode === 'signin' ? 'Welcome back' : 'Create your account'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden">

          {/* Tab switcher */}
          <div className="flex border-b border-white/[0.07]">
            {[['signin', 'Sign In'], ['signup', 'Create Account']].map(([m, label]) => (
              <button key={m} onClick={() => switchMode(m)}
                className={`flex-1 py-4 text-sm font-semibold transition-all ${
                  mode === m
                    ? 'text-brand-cream border-b-2 border-white -mb-px'
                    : 'text-white/35 hover:text-white/60'
                }`}>
                {label}
              </button>
            ))}
          </div>

          <div className="p-6 sm:p-8">

            {/* Google button */}
            <button
              onClick={handleGoogle}
              disabled={gLoading}
              className="w-full flex items-center justify-center gap-3 bg-white text-[#1a1a1a] font-semibold py-3.5 rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm"
            >
              {gLoading ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#333" strokeWidth="4"/>
                  <path className="opacity-75" fill="#333" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
              ) : <GoogleIcon />}
              {gLoading ? 'Connecting...' : 'Continue with Google'}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-white/[0.08]"/>
              <span className="text-white/30 text-xs">or continue with email</span>
              <div className="flex-1 h-px bg-white/[0.08]"/>
            </div>

            {/* Firebase error banner */}
            {firebaseErr && (
              <div className="bg-red-400/10 border border-red-400/25 rounded-xl px-4 py-3 mb-5 flex items-start gap-2">
                <svg className="w-4 h-4 text-red-400 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
                <p className="text-red-400 text-xs leading-relaxed">{firebaseErr}</p>
              </div>
            )}

            {/* Email form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-widest text-brand-cream block mb-1.5">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    value={form.name} onChange={set('name')}
                    placeholder="e.g. Kofi Mensah"
                    autoComplete="name"
                    className={iStyle(errors.name)}
                  />
                  <FieldErr msg={errors.name}/>
                </div>
              )}

              <div>
                <label className="text-[11px] font-bold uppercase tracking-widest text-brand-cream block mb-1.5">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="email" value={form.email} onChange={set('email')}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={iStyle(errors.email)}
                />
                <FieldErr msg={errors.email}/>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-widest text-brand-cream block mb-1.5">
                  Password <span className="text-red-400">*</span>
                  {mode === 'signup' && <span className="text-white/30 text-[10px] normal-case ml-1 font-normal">min. 6 characters</span>}
                </label>
                <input
                  type="password" value={form.password} onChange={set('password')}
                  placeholder="••••••••"
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  className={iStyle(errors.password)}
                />
                <FieldErr msg={errors.password}/>
              </div>

              {mode === 'signup' && (
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-widest text-brand-cream block mb-1.5">
                    Confirm Password <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="password" value={form.confirm} onChange={set('confirm')}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className={iStyle(errors.confirm)}
                  />
                  <FieldErr msg={errors.confirm}/>
                </div>
              )}

              <button
                type="submit" disabled={loading}
                className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-brand-cream transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm mt-2"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    {mode === 'signup' ? 'Creating account...' : 'Signing in...'}
                  </>
                ) : (
                  mode === 'signup' ? 'Create Account' : 'Sign In'
                )}
              </button>
            </form>

            {/* Forgot password (sign in only) */}
            {mode === 'signin' && (
              <p className="text-center mt-4">
                <button
                  onClick={() => navigate('/forgot-password')}
                  className="text-white/35 text-xs hover:text-white/60 transition-colors underline underline-offset-2"
                >
                  Forgot your password?
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-white/25 text-xs mt-6 leading-relaxed">
          By continuing, you agree to our Terms of Service and Privacy Policy.
          <br/>Your data is safe and never sold.
        </p>

        {/* Back to shopping */}
        <div className="text-center mt-4">
          <Link to="/" className="text-white/35 text-xs hover:text-white/60 transition-colors">
            ← Continue browsing without an account
          </Link>
        </div>
      </div>
    </div>
  );
}
