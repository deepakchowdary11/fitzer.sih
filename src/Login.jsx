import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, UserPlus, Dumbbell, ShieldCheck, Mail, Lock, User, Sparkles, Loader2 } from 'lucide-react';
import { CinematicLayout, Kicker } from './CinematicLayout';
import { useAuth } from './AuthContext';

export default function Login() {
  const { signIn, signUp, signInWithGoogle, user } = useAuth();
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // If already logged in, show user status or allow redirect
  React.useEffect(() => {
    if (user) {
      // already authenticated
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (mode === 'signin') {
        if (!email.trim() || !password.trim()) {
          throw new Error('Please enter both email and password.');
        }
        await signIn(email.trim(), password);
        window.location.hash = '#/exercise';
      } else {
        if (!email.trim() || !password.trim() || !name.trim()) {
          throw new Error('Please fill in your name, email, and password.');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters.');
        }
        await signUp(email.trim(), password, name.trim(), username.trim());
        setSuccess('Account created! Setting up your athletic profile...');
        setTimeout(() => {
          window.location.hash = '#/onboarding';
        }, 800);
      }
    } catch (err) {
      console.error('Auth error:', err);
      let msg = err.message || 'Authentication failed. Please check your credentials.';
      if (msg.includes('Invalid login credentials')) {
        msg = 'Invalid email or password. Please try again or create an account.';
      } else if (msg.includes('User already registered')) {
        msg = 'An account with this email already exists. Please sign in.';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };



  const handleGoogleLogin = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error('Google Auth error:', err);
      setError('Unable to sign in with Google. Please try again.');
      setLoading(false);
    }
  };

  return (
    <CinematicLayout>
      <div className="cn-content" style={{ maxWidth: 1100, width: '100%', margin: '2rem auto 0 auto' }}>
        {/* ── Two Column Layout: Separated Auth Card and Pure Animated Typewriter Text ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '3.5rem',
            alignItems: 'center',
          }}
        >
          {/* ── STANDALONE AUTHENTICATION CARD ── */}
          <div
            className="cn-glow-card"
            style={{
              padding: '2.5rem 2.25rem',
              border: '1px solid rgba(255,107,53,0.28)',
              boxShadow: '0 24px 60px rgba(0,0,0,0.7), 0 0 40px rgba(255,107,53,0.12)',
              borderRadius: 20,
            }}
          >
            {/* Mode Switcher Tabs */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.4rem',
                marginBottom: '1.75rem',
                background: 'rgba(255,255,255,0.03)',
                padding: '0.35rem',
                borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <button
                type="button"
                onClick={() => { setMode('signin'); setError(''); setSuccess(''); }}
                style={{
                  padding: '0.65rem',
                  borderRadius: 9,
                  fontFamily: 'inherit',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  border: 'none',
                  background: mode === 'signin' ? 'var(--grad-btn)' : 'transparent',
                  color: mode === 'signin' ? '#fff' : 'var(--text3)',
                  boxShadow: mode === 'signin' ? '0 4px 14px rgba(255,107,53,0.3)' : 'none',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                }}
              >
                <LogIn size={15} /> Sign In
              </button>
              <button
                type="button"
                onClick={() => { setMode('signup'); setError(''); setSuccess(''); }}
                style={{
                  padding: '0.65rem',
                  borderRadius: 9,
                  fontFamily: 'inherit',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  border: 'none',
                  background: mode === 'signup' ? 'var(--grad-btn)' : 'transparent',
                  color: mode === 'signup' ? '#fff' : 'var(--text3)',
                  boxShadow: mode === 'signup' ? '0 4px 14px rgba(255,107,53,0.3)' : 'none',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                }}
              >
                <UserPlus size={15} /> Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              {mode === 'signup' && (
                <>
                  <div>
                    <label className="cn-label">Full Name</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        className="cn-input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Alex Johnson"
                        style={{ paddingLeft: '2.5rem' }}
                        required
                      />
                      <User size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }} />
                    </div>
                  </div>

                  <div>
                    <label className="cn-label">Username</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        className="cn-input"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="e.g. alexj"
                        style={{ paddingLeft: '2.5rem' }}
                      />
                      <span style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)', fontWeight: 700, fontSize: '0.9rem' }}>@</span>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="cn-label">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    className="cn-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="athlete@example.com"
                    style={{ paddingLeft: '2.5rem' }}
                    required
                  />
                  <Mail size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }} />
                </div>
              </div>

              <div>
                <label className="cn-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="password"
                    className="cn-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{ paddingLeft: '2.5rem' }}
                    required
                  />
                  <Lock size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }} />
                </div>
              </div>

              {error && (
                <div style={{ padding: '0.75rem 1rem', borderRadius: 10, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', fontSize: '0.82rem', lineHeight: 1.5 }}>
                  {error}
                </div>
              )}

              {success && (
                <div style={{ padding: '0.75rem 1rem', borderRadius: 10, background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', color: '#86efac', fontSize: '0.82rem', lineHeight: 1.5 }}>
                  {success}
                </div>
              )}

              <button
                type="submit"
                className="cn-btn"
                disabled={loading}
                style={{ marginTop: '0.35rem', width: '100%', justifyContent: 'center', padding: '0.85rem' }}
              >
                {loading ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
                  </>
                ) : (
                  <>
                    {mode === 'signin' ? <LogIn size={17} /> : <UserPlus size={17} />}
                    {mode === 'signin' ? 'Sign In' : 'Create Account'}
                  </>
                )}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '0.25rem 0' }}>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
                <span style={{ fontSize: '0.72rem', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>or</span>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="cn-btn-ghost"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '0.85rem',
                  fontSize: '0.88rem',
                  gap: '0.65rem',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.1-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2c0 2.8.7 5.5 1.9 7.9l3.7-2.9c-.2-.7-.4-1.5-.4-2.3z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16.5C3.7 20.9 7.5 23.5 12 23.5z"
                  />
                </svg>
                <span>{mode === 'signin' ? 'Continue with Google' : 'Sign Up with Google'}</span>
              </button>
            </form>
          </div>

          {/* ── RIGHT COLUMN: ONLY BOLD TYPEWRITER TEXT & ANIMATION ── */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '1rem' }}>
            <TypewriterText />
          </div>
        </div>

        {/* ── Security / Feature Trust Badges ── */}
        <div style={{ marginTop: '2.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.85rem' }}>
          {[
            { icon: <ShieldCheck size={16} />, text: 'End-to-end encrypted user authentication' },
            { icon: <Dumbbell size={16} />, text: 'Cloud synchronisation for workout & posture logs' },
            { icon: <span style={{ fontSize: '1rem' }}>🥗</span>, text: 'Persistent diet targets & personal records' },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                color: 'var(--text2)',
                fontSize: '0.84rem',
                background: 'rgba(255,255,255,0.02)',
                padding: '0.75rem 1rem',
                borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <span style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center' }}>{item.icon}</span>
              {item.text}
            </div>
          ))}
        </div>
      </div>
    </CinematicLayout>
  );
}

function TypewriterText() {
  const quote = "“No great thing is created suddenly.”";
  const [text, setText] = React.useState('');
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    let timer;

    if (isDeleting) {
      timer = setTimeout(() => {
        setText((prev) => prev.substring(0, prev.length - 1));
        if (text.length <= 1) {
          setIsDeleting(false);
        }
      }, 30);
    } else {
      if (text.length < quote.length) {
        timer = setTimeout(() => {
          setText(quote.substring(0, text.length + 1));
        }, 55);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 3600);
      }
    }

    return () => clearTimeout(timer);
  }, [text, isDeleting]);

  const isComplete = text.length >= quote.length;

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 580 }}>
      <div
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 'clamp(2.4rem, 4.4vw, 3.8rem)',
          fontWeight: 900,
          lineHeight: 1.18,
          color: '#ffffff',
          letterSpacing: '-0.02em',
        }}
      >
        <span
          style={{
            background: 'linear-gradient(135deg, #ffffff 20%, #ffa080 65%, var(--accent) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {text}
        </span>
        <span
          style={{
            display: 'inline-block',
            width: '5px',
            height: 'clamp(2.2rem, 4vw, 3.4rem)',
            background: 'var(--accent)',
            marginLeft: '8px',
            verticalAlign: 'middle',
            boxShadow: '0 0 16px var(--accent)',
            animation: 'aiPulse 0.9s infinite',
          }}
        />
      </div>

      <div
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 'clamp(1.3rem, 2.2vw, 1.8rem)',
          fontWeight: 700,
          color: 'var(--accent)',
          textAlign: 'right',
          marginTop: '1.4rem',
          letterSpacing: '0.04em',
          opacity: isComplete ? 1 : 0.3,
          transform: isComplete ? 'translateY(0)' : 'translateY(4px)',
          transition: 'all 0.5s ease',
          textShadow: '0 0 20px rgba(255,107,53,0.35)',
        }}
      >
        - Epictetus
      </div>
    </div>
  );
}

