import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthGate({ onContinueAsGuest }) {
  const { loginWithGoogle, loginWithEmail, signUpWithEmail } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode]       = useState('login'); // 'login' | 'signup'
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [name, setName]       = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async () => {
    setError('');
    if (!email || !password) return setError('Please fill in all fields.');
    if (mode === 'signup' && !name) return setError('Please enter your name.');
    setLoading(true);
    try {
      if (mode === 'login') await loginWithEmail(email, password);
      else await signUpWithEmail(email, password, name);
    } catch (err) {
      setError(
        err.code === 'auth/wrong-password'    ? 'Incorrect password.' :
        err.code === 'auth/user-not-found'    ? 'No account found with this email.' :
        err.code === 'auth/email-already-in-use' ? 'Email already in use. Try logging in.' :
        err.code === 'auth/weak-password'     ? 'Password must be at least 6 characters.' :
        err.code === 'auth/invalid-email'     ? 'Invalid email address.' :
        'Something went wrong. Please try again.'
      );
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try { await loginWithGoogle(); }
    catch { setError('Google sign-in failed. Try again.'); }
    setLoading(false);
  };

  const iStyle = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm placeholder-white/25 focus:outline-none focus:border-white/35 focus:bg-white/7 transition-all';

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        {/* Brand */}
        <div className="text-center mb-10">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-white items-center justify-center mb-5">
            <img src="/images/VIBE.png" alt="Vibewear" className="w-9 h-9 object-contain" />
          </div>
          <h1 className="text-white font-black text-3xl tracking-wide">VIBEWEAR</h1>
          <p className="text-white/30 text-sm mt-2">
            {mode === 'login' ? 'Sign in to your account' : 'Create a new account'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#0f0f0f] border border-white/[0.07] rounded-2xl p-8">

          {/* Toggle */}
          <div className="flex bg-white/[0.05] rounded-xl p-1 mb-7">
            {['login', 'signup'].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(''); }}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                  mode === m ? 'bg-white text-black' : 'text-white/40 hover:text-white/70'
                }`}>
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {mode === 'signup' && (
              <input
                value={name} onChange={e => setName(e.target.value)}
                placeholder="Full name"
                className={iStyle}
              />
            )}
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="Email address"
              className={iStyle}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Password"
                className={iStyle + ' pr-12'}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
              <button onClick={() => setShowPass(s => !s)} type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                {showPass
                  ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21"/></svg>
                  : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                }
              </button>
            </div>
          </div>

          {error && (
            <p className="mt-4 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          <button onClick={handleSubmit} disabled={loading}
            className="w-full mt-6 bg-white text-black font-bold py-3.5 rounded-xl hover:bg-white/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {loading
              ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Please wait...</>
              : mode === 'login' ? 'Sign In' : 'Create Account'
            }
          </button>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/[0.07]"/>
            <span className="text-white/25 text-xs">or</span>
            <div className="flex-1 h-px bg-white/[0.07]"/>
          </div>

          <button onClick={handleGoogle} disabled={loading}
            className="w-full border border-white/10 text-white/70 py-3.5 rounded-xl hover:bg-white/[0.05] hover:border-white/20 transition-all flex items-center justify-center gap-3 font-medium text-sm">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        </div>

        {/* Guest mode */}
        <div className="mt-6 text-center">
          <p className="text-white/30 text-xs mb-3">Don't want to create an account?</p>
          <button onClick={onContinueAsGuest}
            className="text-white/50 hover:text-white text-sm underline underline-offset-4 transition-colors">
            Continue as Guest
          </button>
          <p className="text-white/20 text-xs mt-2">Cart won't be saved between sessions</p>
        </div>
      </div>
    </div>
  );
}
