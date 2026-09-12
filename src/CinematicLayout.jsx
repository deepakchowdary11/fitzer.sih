import React from 'react';
import { Dumbbell, Bot, Menu, X, Flame, User } from 'lucide-react';
import { useAuth } from './AuthContext';
import './cinematic.css';

/* ─────────────────────────────────────────────
   Shared cinematic layout wrapper for every page
   ───────────────────────────────────────────── */

export function CinematicLayout({ children, fab = null }) {
  return (
    <>
      <div className="cn-grain" aria-hidden="true" />
      <div className="cn-ambient-orbs" aria-hidden="true">
        <div className="cn-orb cn-orb-1" />
        <div className="cn-orb cn-orb-2" />
        <div className="cn-orb cn-orb-3" />
      </div>
      <TopBar />
      <main className="cn-page">
        {children}
      </main>
      {fab}
    </>
  );
}

/* ── TopBar ── */
function TopBar() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const { user } = useAuth();
  const currentHash = typeof window !== 'undefined' ? window.location.hash : '#/';

  const isActive = (href) => currentHash === href || currentHash.startsWith(href + '/');

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const displayName = user?.name ? user.name.split(' ')[0] : 'Profile';
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : null;

  return (
    <>
      <header
        className="cn-topbar"
        style={scrolled ? { boxShadow: '0 4px 32px rgba(0,0,0,0.6)' } : {}}
      >
        {/* Logo */}
        <a href="#/" className="cn-logo">
          <span className="cn-logo-mark">
            <Flame size={18} strokeWidth={2.5} />
          </span>
          <span>Fitzer</span>
        </a>

        {/* Desktop Nav */}
        <nav className="cn-nav" aria-label="Main navigation" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <a href="#/" className={currentHash === '#/' || currentHash === '#' || currentHash === '' ? 'active' : ''}>Home</a>
          <a href="#/exercise" className={isActive('#/exercise') ? 'active' : ''}>Exercises</a>
          <a href="#/diet" className={isActive('#/diet') ? 'active' : ''}>Diet Plans</a>
          <a href="#/assistant" className={isActive('#/assistant') ? 'active' : ''}>AI Coach</a>
          
          {/* Elegant User Profile Pill */}
          <a 
            href="#/profile" 
            title="Athlete Profile"
            style={{
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.55rem',
              padding: '0.35rem 0.85rem 0.35rem 0.45rem',
              borderRadius: 999,
              background: isActive('#/profile') ? 'rgba(255,107,53,0.15)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${isActive('#/profile') ? 'var(--accent)' : 'rgba(255,255,255,0.1)'}`,
              color: isActive('#/profile') ? '#fff' : 'var(--text2)',
              fontSize: '0.82rem',
              fontWeight: 600,
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: isActive('#/profile') ? '0 0 16px rgba(255,107,53,0.25)' : 'none',
              marginLeft: '0.25rem'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--accent)';
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.background = 'rgba(255,107,53,0.12)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={e => {
              if (!isActive('#/profile')) {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.color = 'var(--text2)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
              }
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {user?.avatar_url ? (
              <img 
                src={user.avatar_url} 
                alt="Profile" 
                referrerPolicy="no-referrer"
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '1.5px solid var(--accent)',
                  flexShrink: 0
                }} 
              />
            ) : initial ? (
              <span 
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: 'var(--grad-btn)',
                  color: '#fff',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 0 8px rgba(255,107,53,0.4)'
                }}
              >
                {initial}
              </span>
            ) : (
              <span 
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  color: 'var(--accent)'
                }}
              >
                <User size={13} strokeWidth={2.5} />
              </span>
            )}
            <span>{displayName}</span>
          </a>
        </nav>

        {/* Mobile toggle */}
        <button
          className="cn-menu-btn"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
      </header>

      {/* Mobile overlay nav */}
      <div className={`cn-mobile-nav ${mobileOpen ? '' : 'hidden'}`} role="dialog" aria-modal="true">
        <button className="cn-mobile-close" onClick={() => setMobileOpen(false)} aria-label="Close menu">
          <X size={20} />
        </button>
        <a href="#/" onClick={() => setMobileOpen(false)}>Home</a>
        <a href="#/exercise" onClick={() => setMobileOpen(false)}>Exercises</a>
        <a href="#/diet" onClick={() => setMobileOpen(false)}>Diet Plans</a>
        <a href="#/assistant" onClick={() => setMobileOpen(false)}>AI Coach</a>
        <a 
          href="#/profile" 
          onClick={() => setMobileOpen(false)} 
          style={{ 
            color: 'var(--accent)', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            padding: '0.5rem 0'
          }}
        >
          <User size={18} />
          Profile
        </a>
      </div>
    </>
  );
}

/* ── Floating Action Button (AI Coach) ── */
export function AiFab() {
  return (
    <a href="#/assistant" className="cn-fab" aria-label="Open AI Coach">
      <Bot size={22} />
    </a>
  );
}

/* ── Kicker label ── */
export function Kicker({ num, label }) {
  return (
    <p className="cn-kicker">
      <span>{num}</span>
      {label}
    </p>
  );
}

export function ScrollReveal({ children, delay = 0, className = '' }) {
  const ref = React.useRef(null);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.65s cubic-bezier(0.22,1,0.36,1), transform 0.65s cubic-bezier(0.22,1,0.36,1)`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
