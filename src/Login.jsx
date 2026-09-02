import React from 'react';
import { motion } from 'framer-motion';
import { LogIn, Dumbbell } from 'lucide-react';
import { CinematicLayout, Kicker } from './CinematicLayout';

export default function Login() {
  const [name, setName] = React.useState('Alex Johnson');
  const [username, setUsername] = React.useState('alexj');
  const [error, setError] = React.useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    const cleanedName = String(name || '').trim();
    const cleanedUsername = String(username || '').trim();
    if (!cleanedName || !cleanedUsername) { setError('Please enter both name and username.'); return; }
    const user = { name: cleanedName, username: cleanedUsername.toLowerCase() };
    localStorage.setItem('fitzer.user', JSON.stringify(user));
    window.location.hash = '#/profile';
  };

  return (
    <CinematicLayout>
      <div className="cn-content" style={{ maxWidth: 500 }}>
        <Kicker num="05" label="Account" />
        <h1 className="cn-h1" style={{ marginBottom: '0.5rem' }}>Login</h1>
        <p style={{ color: 'var(--text2)', fontSize: '0.9rem', marginBottom: '2.5rem', lineHeight: 1.7 }}>
          Set up your Fitzer profile to personalize your experience.
        </p>

        <form onSubmit={onSubmit} className="cn-card">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label className="cn-label">Name</label>
              <input
                type="text"
                className="cn-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="cn-label">Username</label>
              <input
                type="text"
                className="cn-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="@username"
              />
            </div>

            {error && (
              <div style={{ padding: '0.65rem 0.9rem', borderRadius: 8, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444', fontSize: '0.82rem' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="cn-btn"
              disabled={!name.trim() || !username.trim()}
              style={{ marginTop: '0.25rem', width: '100%', justifyContent: 'center' }}
            >
              <LogIn size={16} />
              Continue to Profile
            </button>

            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text3)' }}>
              No account? Just enter your name and pick a username.
            </p>
          </div>
        </form>

        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            { icon: <Dumbbell size={16} />, text: 'Get personalized exercise plans' },
            { icon: <span style={{ fontSize: '1rem' }}>🥗</span>, text: 'Track your diet and budget' },
            { icon: <span style={{ fontSize: '1rem' }}>🤖</span>, text: 'Chat with your AI fitness coach' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text2)', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--accent)' }}>{item.icon}</span>
              {item.text}
            </div>
          ))}
        </div>
      </div>
    </CinematicLayout>
  );
}
