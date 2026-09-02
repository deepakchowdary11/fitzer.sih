import React from 'react';
import { Dumbbell, Bot, Menu, X, Zap } from 'lucide-react';
import './cinematic.css';

/* ─────────────────────────────────────────────
   Shared cinematic layout wrapper for every page
   ───────────────────────────────────────────── */

export function CinematicLayout({ children, fab = null }) {
  return (
    <>
      <div className="cn-grain" aria-hidden="true" />
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
  const currentHash = typeof window !== 'undefined' ? window.location.hash : '#/';

  const isActive = (href) => currentHash === href || currentHash.startsWith(href + '/');

  return (
    <>
      <header className="cn-topbar">
        {/* Logo */}
        <a href="#/" className="cn-logo">
          <span className="cn-logo-mark">FZ</span>
          <span>Fitzer</span>
        </a>

        {/* Desktop Nav */}
        <nav className="cn-nav" aria-label="Main navigation">
          <a href="#/" className={isActive('#/') && currentHash === '#/' ? 'active' : ''}>Home</a>
          <a href="#/exercise" className={isActive('#/exercise') ? 'active' : ''}>Exercises</a>
          <a href="#/diet" className={isActive('#/diet') ? 'active' : ''}>Diet Plans</a>
          <a href="#/assistant" className={isActive('#/assistant') ? 'active' : ''}>AI Coach</a>
          <a href="#/profile" className="cn-cta-btn accent" style={{ textDecoration: 'none' }}>
            Profile
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
        <a href="#/profile" onClick={() => setMobileOpen(false)} style={{ color: 'var(--accent)' }}>Profile</a>
      </div>
    </>
  );
}

/* ── Floating Action Button (AI Coach) ── */
export function AiFab() {
  return (
    <a href="#/assistant" className="cn-fab" aria-label="Open AI Coach">
      <Bot size={20} />
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
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
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
        transition: `opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1)`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

