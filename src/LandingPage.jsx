import React, { useEffect, useRef, useState } from 'react';
import './landing.css';
import { useAuth } from './AuthContext';

export default function LandingPage() {
  const { user } = useAuth();
  const canvasRef = useRef(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('fitzer-theme') || 'dark');

  const handleAuthCta = (e, target = '#/exercise') => {
    if (e && e.preventDefault) e.preventDefault();
    if (user) {
      window.location.hash = target;
    } else {
      window.location.hash = '#/login';
    }
  };

  // Interactive tab state for showcase panels
  const [scannerTab, setScannerTab] = useState(0);
  const [postureTab, setPostureTab] = useState(0);
  const [chatTab, setChatTab] = useState(0);

  // Theme synchronization
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('fitzer-theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Navbar scroll listener
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Particle Canvas Background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H;
    let animId;

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const COLORS = ['#ff6b35', '#ff3864', '#c8b400', '#f59e0b', '#00d4ff'];
    const COUNT = 70;
    const particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.4 + 0.3,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.45 + 0.1,
    }));

    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = 'rgba(255,107,53,' + (0.05 * (1 - d / 110)) + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(p.alpha * 255).toString(16).padStart(2, '0');
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > W) p.dx *= -1;
        if (p.y < 0 || p.y > H) p.dy *= -1;
      });
      animId = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Scroll Reveal Observer
  useEffect(() => {
    const els = document.querySelectorAll('.landing-root .reveal-up, .landing-root .reveal-right, .landing-root .reveal-left');
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Number Counter Animation
  useEffect(() => {
    function fmt(n, t) {
      if (t >= 1000000) return (n / 1000000).toFixed(1) + 'M';
      if (t >= 1000) return Math.round(n / 1000) + 'K';
      return Math.round(n);
    }
    const counters = document.querySelectorAll('.landing-root .counter');
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (!e.isIntersecting) return;
          const el = e.target;
          const target = +el.dataset.target;
          const suffix = el.dataset.suffix || '';
          const dur = 2000;
          const t0 = performance.now();
          function step(now) {
            const p = Math.min((now - t0) / dur, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            el.textContent = fmt(target * ease, target) + (p === 1 ? suffix : '');
            if (p < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
          obs.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(c => obs.observe(c));
    return () => obs.disconnect();
  }, []);

  // 3D Card Tilt Effect
  useEffect(() => {
    const cards = document.querySelectorAll('.landing-root .feature-card, .landing-root .metric-box, .landing-root .phone-frame, .landing-root .tech-stat-card');
    const handleMove = (e) => {
      const card = e.currentTarget;
      const r = card.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width / 2) / (r.width / 2);
      const dy = (e.clientY - r.top - r.height / 2) / (r.height / 2);
      card.style.transform = `translateY(-4px) rotateX(${-dy * 3.5}deg) rotateY(${dx * 3.5}deg)`;
    };
    const handleLeave = (e) => {
      e.currentTarget.style.transform = '';
    };

    cards.forEach(card => {
      card.addEventListener('mousemove', handleMove);
      card.addEventListener('mouseleave', handleLeave);
    });

    return () => {
      cards.forEach(card => {
        card.removeEventListener('mousemove', handleMove);
        card.removeEventListener('mouseleave', handleLeave);
      });
    };
  }, []);

  const navigateTo = (route) => {
    window.location.hash = route;
  };

  return (
    <div className="landing-root">
      <canvas id="particles-canvas" ref={canvasRef}></canvas>

      {/* NAVBAR */}
      <nav id="navbar" className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <a href="#/" className="nav-logo" id="nav-logo">
            <span className="logo-icon">&#9889;</span>
            <span className="logo-text">Fitzer</span>
          </a>
          <ul className={`nav-links ${mobileMenuOpen ? 'open' : ''}`} id="nav-links">
            <li><a href="#features" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Features</a></li>
            <li><a href="#how-it-works" className="nav-link" onClick={() => setMobileMenuOpen(false)}>How It Works</a></li>
            <li><a href="#stats" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Results</a></li>
            <li><a href="#ai-showcase" className="nav-link" onClick={() => setMobileMenuOpen(false)}>AI Demo</a></li>
            <li><a href="#/exercise" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Exercises</a></li>
            <li><a href="#/diet" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Diet Plans</a></li>
            <li><a href="#/assistant" className="nav-link" onClick={() => setMobileMenuOpen(false)}>AI Coach</a></li>
          </ul>
          <div className="nav-actions">
            <button
              className="theme-toggle-btn"
              id="theme-toggle-btn"
              aria-label="Toggle light and dark mode"
              title="Toggle theme"
              onClick={toggleTheme}
            >
              {theme === 'dark' ? (
                <span className="theme-icon sun-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                </span>
              ) : (
                <span className="theme-icon moon-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                </span>
              )}
            </button>
            <button
              onClick={(e) => handleAuthCta(e, user ? '#/profile' : '#/exercise')}
              className="btn btn-nav"
              id="btn-nav"
              style={{ cursor: 'pointer' }}
            >
              {user ? 'Dashboard' : 'Get Started'}
            </button>
          </div>
          <button
            className="hamburger"
            id="hamburger"
            aria-label="Toggle menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>

      {/* HERO (REFERENCE GYM LAYOUT) */}
      <section className="hero hero-reference" id="hero">
        {/* Giant Center Headline */}
        <div className="hero-ref-header">
          <h1 className="hero-ref-title reveal-up delay-1">
            <span className="title-white">CREATE YOUR</span>{' '}
            <span className="title-orange">DREAM BODY</span>
          </h1>
          <p className="hero-ref-subtitle reveal-up delay-2">
            Your way to health and strength! We offer AI-powered food calorie detection, real-time posture correction, personalised nutrition plans, and elite workout intelligence.
          </p>
        </div>

        {/* Central Dumbbell Stage */}
        <div className="hero-ref-stage reveal-up delay-3">
          <div className="hero-ref-centerpiece">
            <img src="/dumbell.png" alt="Fitzer Dumbbells" className="hero-ref-img" />

            {/* Enhanced Left Floating Badge: 420 Calories */}
            <div className="float-card float-card-calories-ref" id="float-card-calories">
              <div className="float-card-header">
                <div className="float-icon-glow fire-glow">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="url(#flameGrad)">
                    <defs>
                      <linearGradient id="flameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ff9a3c" />
                        <stop offset="100%" stopColor="#ff3864" />
                      </linearGradient>
                    </defs>
                    <path d="M12 2c.5 3.5 3 5.5 3 8.5a6 6 0 1 1-12 0c0-3 2.5-5 3-8.5 2 2 3.5 3.5 6 0z" />
                  </svg>
                </div>
                <span className="float-badge-status">Live Burn</span>
              </div>
              <div className="float-card-body">
                <span className="float-label">Calories Burned</span>
                <div className="float-num-row">
                  <span className="float-value counter" data-target="420">0</span>
                  <span className="float-unit">kcal</span>
                </div>
                <div className="float-sparkline">
                  <div className="float-progress-fill cal-fill"></div>
                </div>
              </div>
            </div>

            {/* Enhanced Right Floating Badge: 94 Posture Score */}
            <div className="float-card float-card-posture-ref" id="float-card-posture">
              <div className="float-card-header">
                <div className="float-icon-glow posture-glow">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00e676" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <span className="float-badge-status posture-status">Optimal Alignment</span>
              </div>
              <div className="float-card-body">
                <span className="float-label">Posture Score</span>
                <div className="float-num-row">
                  <span className="float-value posture-val counter" data-target="94">0</span>
                  <span className="float-unit">/ 100</span>
                </div>
                <div className="float-sparkline">
                  <div className="float-progress-fill posture-fill"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Start Free Button placed right below under the dumbbell */}
          <div className="hero-ref-btn-wrap reveal-up delay-4">
            <a
              href="#/exercise"
              onClick={(e) => handleAuthCta(e, '#/exercise')}
              className="hero-ref-bottom-btn"
              id="hero-ref-bottom-btn"
            >
              <span>Start Free</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>

        {/* Circular Rotating Play Demo Widget */}
        <div className="circle-badge-wrapper reveal-right delay-4">
          <div className="circle-text-rotating">
            <svg viewBox="0 0 100 100" className="circle-svg">
              <defs>
                <path id="circlePath" d="M 50, 50 m -36, 0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0" />
              </defs>
              <text fill="rgba(255, 170, 130, 0.75)" fontSize="9.2" fontWeight="700" letterSpacing="2.2">
                <textPath xlinkHref="#circlePath">
                  &bull; ABOUT FITZER &bull; AI FITNESS &bull;
                </textPath>
              </text>
            </svg>
          </div>
          <a href="#ai-showcase" className="circle-play-btn" id="circle-play-btn" aria-label="Watch AI Demo">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#ff6b35">
              <polygon points="8 5 19 12 8 19 8 5" />
            </svg>
          </a>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-strip" aria-hidden="true">
        <div className="marquee-track">
          <span>Calorie Detection</span><span className="sep">&#10022;</span>
          <span>Posture Analysis</span><span className="sep">&#10022;</span>
          <span>AI Diet Plans</span><span className="sep">&#10022;</span>
          <span>Smart Workouts</span><span className="sep">&#10022;</span>
          <span>Personal AI Coach</span><span className="sep">&#10022;</span>
          <span>Real-Time Feedback</span><span className="sep">&#10022;</span>
          <span>Calorie Detection</span><span className="sep">&#10022;</span>
          <span>Posture Analysis</span><span className="sep">&#10022;</span>
          <span>AI Diet Plans</span><span className="sep">&#10022;</span>
          <span>Smart Workouts</span><span className="sep">&#10022;</span>
          <span>Personal AI Coach</span><span className="sep">&#10022;</span>
          <span>Real-Time Feedback</span><span className="sep">&#10022;</span>
        </div>
      </div>

      {/* FEATURES (ZIGZAG SHOWCASE TIMELINE) */}
      <section className="section features" id="features">
        <div className="container">
          <div className="section-header">
            <p className="section-label reveal-up">Core Intelligence</p>
            <h2 className="section-title reveal-up delay-1">
              Everything You Need to <span className="gradient-text">Transform</span>
            </h2>
            <p className="section-desc reveal-up delay-2">
              Five synchronized AI systems engineered to craft your ultimate body composition and performance.
            </p>
          </div>

          {/* Zigzag Timeline Container */}
          <div className="features-zigzag-container">
            <div className="zigzag-spine" aria-hidden="true"></div>

            {/* Feature 1: Food Calorie Detection */}
            <div className="zigzag-row zigzag-left reveal-left" id="feat-calorie">
              <div className="zigzag-card feature-card card-orange" style={{ cursor: 'pointer' }} onClick={() => navigateTo('/diet')}>
                <div className="card-glow glow-orange"></div>
                <div className="card-header-row">
                  <div className="card-icon-wrap icon-orange">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2a10 10 0 1 0 10 10" />
                      <path d="M12 6v6l4 2" />
                      <circle cx="19" cy="5" r="3" />
                    </svg>
                  </div>
                  <div className="card-tag">Vision AI &bull; Step 01</div>
                </div>
                <h3 className="card-title">Food Calorie Detection</h3>
                <p className="card-desc">
                  Simply snap a photo of any meal. Fitzer's computer vision instantly identifies every food item, portions, exact caloric density, and macro split.
                </p>
                <ul className="card-bullets">
                  <li><span className="bullet-dot orange"></span>Instant multi-item meal scanning</li>
                  <li><span className="bullet-dot orange"></span>Automated protein, carb & fat breakdown</li>
                  <li><span className="bullet-dot orange"></span>Restaurant & packaged barcode recognition</li>
                </ul>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px' }}>
                  <div className="card-badge">98.4% Accuracy</div>
                  <span style={{ color: 'var(--orange)', fontSize: '0.82rem', fontWeight: 600 }}>Open Diet Module &rarr;</span>
                </div>
              </div>
              <div className="zigzag-node"><span className="node-dot dot-orange"></span></div>
              <div className="zigzag-visual-preview preview-orange">
                <div className="preview-mini-metric">
                  <span className="pm-label">Detected Dish</span>
                  <span className="pm-val">Grilled Salmon & Quinoa</span>
                  <span className="pm-sub">540 kcal &bull; 42g Protein &bull; 18g Fat</span>
                </div>
              </div>
            </div>

            {/* Feature 2: Posture Correction */}
            <div className="zigzag-row zigzag-right reveal-right delay-1" id="feat-posture">
              <div className="zigzag-visual-preview preview-red">
                <div className="preview-mini-metric">
                  <span className="pm-label">Joint Tracking</span>
                  <span className="pm-val">Spine & Hip Alignment</span>
                  <span className="pm-sub green-txt">&#10003; 98% Biomechanical Precision</span>
                </div>
              </div>
              <div className="zigzag-node"><span className="node-dot dot-red"></span></div>
              <div className="zigzag-card feature-card card-red" style={{ cursor: 'pointer' }} onClick={() => navigateTo('/exercise')}>
                <div className="card-glow glow-red"></div>
                <div className="card-header-row">
                  <div className="card-icon-wrap icon-red">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
                      <path d="M6.5 8.5C4.7 9.8 4 12 4 12s2 2.5 5 3l1 5h4l1-5c3-.5 5-3 5-3s-.7-2.2-2.5-3.5" />
                      <path d="M12 15v4" />
                    </svg>
                  </div>
                  <div className="card-tag">Real-Time CV &bull; Step 02</div>
                </div>
                <h3 className="card-title">Posture Correction</h3>
                <p className="card-desc">
                  Your camera acts as an Olympic coach in your pocket &mdash; tracking 33 skeletal keypoints to alert you to form breakdowns before injury occurs.
                </p>
                <ul className="card-bullets">
                  <li><span className="bullet-dot red"></span>Sub-millisecond joint tracking</li>
                  <li><span className="bullet-dot red"></span>Real-time audio correction cues</li>
                  <li><span className="bullet-dot red"></span>Biomechanical injury prevention</li>
                </ul>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px' }}>
                  <div className="card-badge red-badge">Live 60 FPS</div>
                  <span style={{ color: 'var(--red)', fontSize: '0.82rem', fontWeight: 600 }}>Start Exercise &rarr;</span>
                </div>
              </div>
            </div>

            {/* Feature 3: Personalised AI Assistant */}
            <div className="zigzag-row zigzag-left reveal-left delay-1" id="feat-ai">
              <div className="zigzag-card feature-card card-olive" style={{ cursor: 'pointer' }} onClick={() => navigateTo('/assistant')}>
                <div className="card-glow glow-olive"></div>
                <div className="card-header-row">
                  <div className="card-icon-wrap icon-olive">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="3" />
                      <path d="M9 9h.01M15 9h.01M9 15h6" />
                      <circle cx="12" cy="12" r="1" />
                    </svg>
                  </div>
                  <div className="card-tag">Generative AI &bull; Step 03</div>
                </div>
                <h3 className="card-title">Personalised AI Assistant</h3>
                <p className="card-desc">
                  Your 24/7 dedicated fitness intelligence. Ask questions about recovery, progressive overload, sleep optimization, or instant recipe substitutions.
                </p>
                <ul className="card-bullets">
                  <li><span className="bullet-dot olive"></span>Context-aware training guidance</li>
                  <li><span className="bullet-dot olive"></span>Daily readiness & recovery adaptation</li>
                  <li><span className="bullet-dot olive"></span>Direct voice & text interactive chat</li>
                </ul>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px' }}>
                  <div className="card-badge olive-badge">Always Active</div>
                  <span style={{ color: 'var(--olive)', fontSize: '0.82rem', fontWeight: 600 }}>Chat with Coach &rarr;</span>
                </div>
              </div>
              <div className="zigzag-node"><span className="node-dot dot-olive"></span></div>
              <div className="zigzag-visual-preview preview-olive">
                <div className="preview-mini-metric">
                  <span className="pm-label">AI Coach Intelligence</span>
                  <span className="pm-val">"Recovery 92% &bull; Ready for Legs"</span>
                  <span className="pm-sub">Auto-adjusted 3 exercises today</span>
                </div>
              </div>
            </div>

            {/* Feature 4: Smart Diet Plans */}
            <div className="zigzag-row zigzag-right reveal-right delay-1" id="feat-diet">
              <div className="zigzag-visual-preview preview-amber">
                <div className="preview-mini-metric">
                  <span className="pm-label">Weekly Macro Goal</span>
                  <span className="pm-val">2,400 kcal &bull; 190g Protein</span>
                  <span className="pm-sub amber-txt">&#10022; Clean Hypertrophy Plan</span>
                </div>
              </div>
              <div className="zigzag-node"><span className="node-dot dot-amber"></span></div>
              <div className="zigzag-card feature-card card-amber" style={{ cursor: 'pointer' }} onClick={() => navigateTo('/diet')}>
                <div className="card-glow glow-amber"></div>
                <div className="card-header-row">
                  <div className="card-icon-wrap icon-amber">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M3 12h18M3 18h18" />
                      <path d="M8 6V4M16 6V4M8 18v2M16 18v2" />
                    </svg>
                  </div>
                  <div className="card-tag">Nutrition Science &bull; Step 04</div>
                </div>
                <h3 className="card-title">Smart Diet Plans</h3>
                <p className="card-desc">
                  Dynamic meal plans engineered around your metabolic rate, food allergies, cultural preferences, and physique goals &mdash; updated every single week.
                </p>
                <ul className="card-bullets">
                  <li><span className="bullet-dot amber"></span>Keto, high-protein, Mediterranean, vegan</li>
                  <li><span className="bullet-dot amber"></span>1-tap smart grocery shopping lists</li>
                  <li><span className="bullet-dot amber"></span>Micronutrient and electrolyte balancing</li>
                </ul>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px' }}>
                  <div className="card-badge amber-badge">Weekly Refreshed</div>
                  <span style={{ color: 'var(--amber)', fontSize: '0.82rem', fontWeight: 600 }}>Explore Diets &rarr;</span>
                </div>
              </div>
            </div>

            {/* Feature 5: Exercise Recommendations */}
            <div className="zigzag-finale reveal-up delay-2" id="feat-exercise">
              <div className="feature-card card-full card-cyan" style={{ cursor: 'pointer' }} onClick={() => navigateTo('/exercise')}>
                <div className="card-glow glow-cyan"></div>
                <div className="exercise-card-inner">
                  <div className="exercise-text">
                    <div className="card-icon-wrap icon-cyan">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6.5 6.5h11M6.5 17.5h11M4 12h16M7 9l-3 3 3 3M17 9l3 3-3 3" />
                      </svg>
                    </div>
                    <div className="card-tag">Adaptive AI &bull; Step 05</div>
                    <h3 className="card-title">Exercise Recommendations</h3>
                    <p className="card-desc">
                      No two training sessions are identical. Fitzer computes your recovery index, past strength data, and gym gear to deliver the perfect workout protocol.
                    </p>
                    <ul className="card-bullets horizontal">
                      <li><span className="bullet-dot cyan"></span>Adaptive progressive overload</li>
                      <li><span className="bullet-dot cyan"></span>Home and commercial gym routines</li>
                      <li><span className="bullet-dot cyan"></span>3D motion-guided form instructions</li>
                      <li><span className="bullet-dot cyan"></span>Fatigue-based auto-deloading</li>
                    </ul>
                  </div>
                  <div className="exercise-visual">
                    <div className="workout-ring">
                      <svg viewBox="0 0 160 160" className="ring-svg">
                        <circle cx="80" cy="80" r="65" fill="none" stroke="#0d080a" strokeWidth="14" />
                        <circle
                          cx="80" cy="80" r="65" fill="none" stroke="url(#ringGrad)" strokeWidth="14"
                          strokeDasharray="408" strokeDashoffset="100" strokeLinecap="round"
                          transform="rotate(-90 80 80)" className="ring-progress"
                        />
                        <defs>
                          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#ff6b35" />
                            <stop offset="100%" stopColor="#ff3864" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="ring-center">
                        <span className="ring-pct">76%</span>
                        <span className="ring-label">Goal</span>
                      </div>
                    </div>
                    <div className="workout-stats">
                      <div className="ws-item"><span className="ws-val">45</span><span className="ws-key">Min</span></div>
                      <div className="ws-divider"></div>
                      <div className="ws-item"><span className="ws-val">380</span><span className="ws-key">kcal</span></div>
                      <div className="ws-divider"></div>
                      <div className="ws-item"><span className="ws-val">12</span><span className="ws-key">Exercises</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section how" id="how-it-works">
        <div className="container">
          <div className="section-header">
            <p className="section-label reveal-up">Simple Process</p>
            <h2 className="section-title reveal-up delay-1">Get Started in <span className="gradient-text">3 Steps</span></h2>
            <p className="section-desc reveal-up delay-2">Seamless onboarding to unlock your customized artificial intelligence fitness coach in seconds.</p>
          </div>
          <div className="steps-grid">
            {/* Step 1 */}
            <div className="step reveal-up delay-1" id="step-1">
              <div className="step-num">01</div>
              <div className="step-icon-authentic icon-amber-stage">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                  <path d="M2 12h20" />
                  <circle cx="12" cy="12" r="3" fill="#f59e0b" />
                </svg>
              </div>
              <h3>Set Your Goals</h3>
              <p>Tell Fitzer your body metrics, target physique, dietary preferences, and schedule &mdash; an effortless 2-minute setup.</p>
            </div>

            <div className="step-connector" aria-hidden="true"></div>

            {/* Step 2 */}
            <div className="step reveal-up delay-2" id="step-2">
              <div className="step-num">02</div>
              <div className="step-icon-authentic icon-orange-stage">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#ff6b35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="4" width="16" height="16" rx="2" />
                  <rect x="9" y="9" width="6" height="6" />
                  <line x1="9" y1="1" x2="9" y2="4" />
                  <line x1="15" y1="1" x2="15" y2="4" />
                  <line x1="9" y1="20" x2="9" y2="23" />
                  <line x1="15" y1="20" x2="15" y2="23" />
                  <line x1="20" y1="9" x2="23" y2="9" />
                  <line x1="20" y1="14" x2="23" y2="14" />
                  <line x1="1" y1="9" x2="4" y2="9" />
                  <line x1="1" y1="14" x2="4" y2="14" />
                </svg>
              </div>
              <h3>AI Builds Your Plan</h3>
              <p>Our machine learning engine generates your customized nutritional blueprint, exercise schedule, and assigns your coach.</p>
            </div>

            <div className="step-connector" aria-hidden="true"></div>

            {/* Step 3 */}
            <div className="step reveal-up delay-3" id="step-3">
              <div className="step-num">03</div>
              <div className="step-icon-authentic icon-cyan-stage">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  <circle cx="12" cy="12" r="2" fill="#00d4ff" />
                </svg>
              </div>
              <h3>Track and Improve</h3>
              <p>Photograph meals, track workouts in real time, and watch Fitzer automatically refine your routine as you gain strength.</p>
            </div>
          </div>
        </div>
      </section>

      {/* STATS & CORE ENGINES */}
      <section className="section tech-stats-section" id="stats">
        <div className="container">
          <div className="tech-stats-grid">
            {/* Module 1 */}
            <div className="tech-stat-card reveal-up delay-1" id="stat-cv">
              <div className="tech-card-glow glow-orange"></div>
              <div className="tech-stat-header">
                <div className="tech-icon-pill pill-orange">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ff6b35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
                <span className="tech-badge">Computer Vision</span>
              </div>
              <h3 className="tech-stat-title">Computer Vision Powered</h3>
              <p className="tech-stat-main">Personalized Workout Library</p>
              <p className="tech-stat-desc">Adaptive exercise tracking, rep counting & instant form guidance.</p>
            </div>

            {/* Module 2 */}
            <div className="tech-stat-card reveal-up delay-2" id="stat-posture-eng">
              <div className="tech-card-glow glow-red"></div>
              <div className="tech-stat-header">
                <div className="tech-icon-pill pill-red">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ff3864" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
                    <path d="M6.5 8.5C4.7 9.8 4 12 4 12s2 2.5 5 3l1 5h4l1-5c3-.5 5-3 5-3s-.7-2.2-2.5-3.5" />
                    <path d="M12 15v4" />
                  </svg>
                </div>
                <span className="tech-badge red-badge">Biometrics</span>
              </div>
              <h3 className="tech-stat-title">Posture Correction Engine</h3>
              <p className="tech-stat-main">BMI & Body Fitness Tracking</p>
              <p className="tech-stat-desc">Real-time skeletal alignment, joint trajectory & fitness diagnostics.</p>
            </div>

            {/* Module 3 */}
            <div className="tech-stat-card reveal-up delay-3" id="stat-nutrition-eng">
              <div className="tech-card-glow glow-amber"></div>
              <div className="tech-stat-header">
                <div className="tech-icon-pill pill-amber">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18M3 12h18M3 18h18" />
                    <circle cx="9" cy="6" r="2" fill="#f59e0b" />
                    <circle cx="15" cy="12" r="2" fill="#f59e0b" />
                    <circle cx="9" cy="18" r="2" fill="#f59e0b" />
                  </svg>
                </div>
                <span className="tech-badge amber-badge">YOLOv11 AI</span>
              </div>
              <h3 className="tech-stat-title">Nutrition Intelligence</h3>
              <p className="tech-stat-main">YOLOv11 Food Recognition</p>
              <p className="tech-stat-desc">Instant multi-item meal detection, calorie calculation & macro split.</p>
            </div>

            {/* Module 4 */}
            <div className="tech-stat-card reveal-up delay-4" id="stat-voice-eng">
              <div className="tech-card-glow glow-olive"></div>
              <div className="tech-stat-header">
                <div className="tech-icon-pill pill-olive">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c8b400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="22" />
                  </svg>
                </div>
                <span className="tech-badge olive-badge">24/7 Voice</span>
              </div>
              <h3 className="tech-stat-title">Real-Time Voice Coaching</h3>
              <p className="tech-stat-main">24/7 Fitness Assistant</p>
              <p className="tech-stat-desc">Always-available health guidance, voice interaction & habit accountability.</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI IN ACTION SHOWCASE */}
      <section className="section ai-showcase" id="ai-showcase">
        <div className="container">
          <div className="section-header">
            <p className="section-label reveal-up">Live Intelligence</p>
            <h2 className="section-title reveal-up delay-1">Watch Fitzer <span className="gradient-text">Think in Real Time</span></h2>
            <p className="section-desc reveal-up delay-2">Three core AI engines running simultaneously &mdash; see exactly what happens the moment you open Fitzer.</p>
          </div>

          {/* PANEL 1: FOOD SCANNER */}
          <div className="showcase-grid reveal-up delay-1" id="showcase-scan">
            <div className="phone-frame" id="frame-scanner">
              <div className="card-glow glow-orange"></div>
              <div className="showcase-tabs">
                {['Food Scanner', 'Macro Breakdown', 'Weekly Trend'].map((tabName, idx) => (
                  <button
                    key={tabName}
                    className={`stab ${scannerTab === idx ? 'active' : ''}`}
                    onClick={() => setScannerTab(idx)}
                  >
                    {tabName}
                  </button>
                ))}
              </div>
              <div className="scanner-box scan-corners">
                <div className="scanner-plate">&#127829;</div>
                <div className="scan-line"></div>
              </div>
              <div className="result-pills">
                <span className="rpill rpill-orange">Rice &mdash; 206 kcal</span>
                <span className="rpill rpill-red">Chicken &mdash; 165 kcal</span>
                <span className="rpill rpill-olive">Broccoli &mdash; 34 kcal</span>
                <span className="rpill rpill-amber">Olive Oil &mdash; 40 kcal</span>
                <span className="rpill rpill-cyan">Total: 445 kcal</span>
              </div>
              <div className="cal-chart">
                <div className="cal-bar" style={{ height: '40%' }}><span className="bar-label">Mon</span></div>
                <div className="cal-bar" style={{ height: '65%' }}><span className="bar-label">Tue</span></div>
                <div className="cal-bar" style={{ height: '50%' }}><span className="bar-label">Wed</span></div>
                <div className="cal-bar" style={{ height: '80%' }}><span className="bar-label">Thu</span></div>
                <div className="cal-bar" style={{ height: '90%' }}><span className="bar-label">Fri</span></div>
                <div className="cal-bar" style={{ height: '55%' }}><span className="bar-label">Sat</span></div>
                <div className="cal-bar" style={{ height: '35%' }}><span className="bar-label">Sun</span></div>
              </div>
            </div>
            <div className="showcase-info">
              <div>
                <p className="section-label" style={{ textAlign: 'left', marginBottom: '10px' }}>Calorie Intelligence</p>
                <h3 className="showcase-headline">Snap a Photo.<br /><span className="gradient-text">Know Every Calorie.</span></h3>
                <p className="showcase-sub" style={{ marginTop: '14px' }}>
                  No barcodes. No searching. No guessing. Fitzer's food detection model was trained on 5 million food images across 120 cuisines &mdash; point, shoot, done.
                </p>
              </div>
              <div className="showcase-metrics">
                <div className="metric-box"><div className="metric-val">0.8s</div><div className="metric-key">Scan Speed</div></div>
                <div className="metric-box"><div className="metric-val">120+</div><div className="metric-key">Cuisines</div></div>
                <div className="metric-box"><div className="metric-val">5M+</div><div className="metric-key">Training Images</div></div>
                <div className="metric-box"><div className="metric-val">98.4%</div><div className="metric-key">Accuracy</div></div>
              </div>
              <ul className="feature-list-mini">
                <li><span className="fli-dot orange"></span>Detects mixed dishes and portion sizes automatically</li>
                <li><span className="fli-dot red"></span>Full macro and micronutrient breakdown per item</li>
                <li><span className="fli-dot olive"></span>Syncs with your daily calorie and protein targets</li>
                <li><span className="fli-dot amber"></span>Restaurant menus and packaged food labels supported</li>
              </ul>
              <div style={{ marginTop: '24px' }}>
                <a href="#/diet" className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '0.9rem' }}>
                  Try Food Calorie Planner
                </a>
              </div>
            </div>
          </div>

          {/* PANEL 2: POSTURE */}
          <div className="showcase-grid showcase-grid-reverse reveal-up delay-2" id="showcase-posture">
            <div className="showcase-info">
              <div>
                <p className="section-label" style={{ textAlign: 'left', marginBottom: '10px' }}>Biomechanical AI</p>
                <h3 className="showcase-headline">Your Camera as a <span className="gradient-text-fire">Physio Coach.</span></h3>
                <p className="showcase-sub" style={{ marginTop: '14px' }}>
                  Fitzer maps 33 body landmarks every frame, computing joint angles and alignment vectors to catch what the naked eye misses &mdash; in real time, no wearables needed.
                </p>
              </div>
              <div className="showcase-metrics">
                <div className="metric-box"><div className="metric-val">33</div><div className="metric-key">Body Landmarks</div></div>
                <div className="metric-box"><div className="metric-val">30fps</div><div className="metric-key">Analysis Rate</div></div>
                <div className="metric-box"><div className="metric-val">12</div><div className="metric-key">Joints Tracked</div></div>
                <div className="metric-box"><div className="metric-val">0ms</div><div className="metric-key">Input Lag</div></div>
              </div>
              <ul className="feature-list-mini">
                <li><span className="fli-dot red"></span>Detects slouch, forward head, pelvic tilt and more</li>
                <li><span className="fli-dot orange"></span>Corrective audio cues spoken aloud in real time</li>
                <li><span className="fli-dot amber"></span>Weekly posture score trend to track improvement</li>
                <li><span className="fli-dot cyan"></span>Works with any standard front or rear camera</li>
              </ul>
              <div style={{ marginTop: '24px' }}>
                <a href="#/exercise" className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '0.9rem' }}>
                  Launch Posture Detection
                </a>
              </div>
            </div>
            <div className="phone-frame" id="frame-posture">
              <div className="card-glow glow-red"></div>
              <div className="showcase-tabs">
                {['Live Posture', 'History', 'Exercises'].map((tabName, idx) => (
                  <button
                    key={tabName}
                    className={`stab ${postureTab === idx ? 'active' : ''}`}
                    onClick={() => setPostureTab(idx)}
                  >
                    {tabName}
                  </button>
                ))}
              </div>
              <div className="posture-demo">
                <svg className="skeleton-svg" viewBox="0 0 100 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <line x1="50" y1="30" x2="50" y2="80" className="skel-bone" />
                  <line x1="50" y1="80" x2="54" y2="130" className="skel-bone bad" />
                  <line x1="28" y1="50" x2="72" y2="50" className="skel-bone" />
                  <line x1="28" y1="50" x2="18" y2="90" className="skel-bone" />
                  <line x1="18" y1="90" x2="12" y2="125" className="skel-bone" />
                  <line x1="72" y1="50" x2="82" y2="90" className="skel-bone" />
                  <line x1="82" y1="90" x2="88" y2="125" className="skel-bone" />
                  <line x1="40" y1="130" x2="66" y2="130" className="skel-bone bad" />
                  <line x1="42" y1="130" x2="38" y2="170" className="skel-bone" />
                  <line x1="38" y1="170" x2="36" y2="195" className="skel-bone" />
                  <line x1="64" y1="130" x2="68" y2="170" className="skel-bone" />
                  <line x1="68" y1="170" x2="70" y2="195" className="skel-bone" />
                  <circle cx="50" cy="18" r="12" className="skel-bone" strokeWidth="2" />
                  <circle cx="50" cy="30" r="4" className="skel-joint" />
                  <circle cx="28" cy="50" r="5" className="skel-joint" />
                  <circle cx="72" cy="50" r="5" className="skel-joint" />
                  <circle cx="18" cy="90" r="4" className="skel-joint bad" />
                  <circle cx="82" cy="90" r="4" className="skel-joint" />
                  <circle cx="50" cy="80" r="4" className="skel-joint" />
                  <circle cx="54" cy="130" r="5" className="skel-joint bad" />
                  <circle cx="38" cy="170" r="4" className="skel-joint" />
                  <circle cx="68" cy="170" r="4" className="skel-joint" />
                </svg>
                <div className="posture-badge">&#9888; Slouch Detected</div>
                <div className="posture-fix">
                  <span>&#128161;</span>
                  Straighten lower back &mdash; tuck pelvis slightly forward
                </div>
              </div>
              <div className="result-pills" style={{ justifyContent: 'center' }}>
                <span className="rpill rpill-red">Spine: Misaligned</span>
                <span className="rpill rpill-amber">Shoulders: OK</span>
                <span className="rpill rpill-orange">Score: 61 / 100</span>
              </div>
            </div>
          </div>

          {/* PANEL 3: AI CHAT */}
          <div className="showcase-grid reveal-up delay-3" id="showcase-chat">
            <div className="phone-frame" id="frame-chat">
              <div className="card-glow glow-olive"></div>
              <div className="showcase-tabs">
                {['AI Coach Chat', 'Workout Plan', 'Diet Plan'].map((tabName, idx) => (
                  <button
                    key={tabName}
                    className={`stab ${chatTab === idx ? 'active' : ''}`}
                    onClick={() => setChatTab(idx)}
                  >
                    {tabName}
                  </button>
                ))}
              </div>
              <div className="chat-window">
                <div className="chat-msg">
                  <div className="chat-avatar ai">F</div>
                  <div className="chat-bubble ai">Hey! I noticed you skipped your strength session yesterday. Want me to adjust today's plan? Your recovery score looks great &#128170;</div>
                </div>
                <div className="chat-msg user">
                  <div className="chat-avatar usr">U</div>
                  <div className="chat-bubble usr">Yes please! Also, I had a heavy meal last night &mdash; can you compensate in today's diet?</div>
                </div>
                <div className="chat-msg">
                  <div className="chat-avatar ai">F</div>
                  <div className="chat-bubble ai">On it! I've shifted your deficit by 200 kcal today and moved your strength session to 6 PM. For lunch I recommend a high-protein salad &mdash; want a recipe?</div>
                </div>
                <div className="chat-msg user">
                  <div className="chat-avatar usr">U</div>
                  <div className="chat-bubble usr">That's perfect. Yes send me a recipe!</div>
                </div>
                <div className="chat-msg">
                  <div className="chat-avatar ai">F</div>
                  <div className="chat-typing">
                    <span className="dot-bounce"></span>
                    <span className="dot-bounce"></span>
                    <span className="dot-bounce"></span>
                  </div>
                </div>
              </div>
            </div>
            <div className="showcase-info">
              <div>
                <p className="section-label" style={{ textAlign: 'left', marginBottom: '10px' }}>Conversational AI</p>
                <h3 className="showcase-headline">A Coach That Truly <span className="gradient-text">Knows You.</span></h3>
                <p className="showcase-sub" style={{ marginTop: '14px' }}>
                  Fitzer's AI coach reads your history, tracks your mood, and adapts your plan daily. Not a chatbot &mdash; a coach with memory, intuition, and zero judgment.
                </p>
              </div>
              <div className="showcase-metrics">
                <div className="metric-box"><div className="metric-val">24/7</div><div className="metric-key">Available</div></div>
                <div className="metric-box"><div className="metric-val">&lt;2s</div><div className="metric-key">Response Time</div></div>
                <div className="metric-box"><div className="metric-val">&#8734;</div><div className="metric-key">Memory</div></div>
                <div className="metric-box"><div className="metric-val">100%</div><div className="metric-key">Personalised</div></div>
              </div>
              <ul className="feature-list-mini">
                <li><span className="fli-dot olive"></span>Remembers every meal, workout, and goal you set</li>
                <li><span className="fli-dot orange"></span>Proactively adjusts plans based on your behaviour</li>
                <li><span className="fli-dot red"></span>Answers science-backed nutrition and exercise questions</li>
                <li><span className="fli-dot amber"></span>Motivates through streaks, badges, and challenges</li>
              </ul>
              <div style={{ marginTop: '24px' }}>
                <a href="#/assistant" className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '0.9rem' }}>
                  Open AI Coach
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="section cta-section" id="cta">
        <div className="container">
          <div className="cta-card reveal-up">
            <div className="cta-glow-1"></div>
            <div className="cta-glow-2"></div>
            <p className="section-label">Start Your Journey</p>
            <h2 className="cta-title">Your <span className="gradient-text">Fittest Self</span><br />Is One Tap Away</h2>
            <p className="cta-sub">Join Fitzer today and unlock a smarter, healthier, and more confident version of yourself.</p>
            <div className="cta-actions">
              <a
                href="#/exercise"
                onClick={(e) => handleAuthCta(e, '#/exercise')}
                className="btn btn-primary btn-lg"
                id="cta-primary"
              >
                Unlock Your Better Self
              </a>
              <div className="app-badges">
                <a
                  href="#/exercise"
                  onClick={(e) => handleAuthCta(e, '#/exercise')}
                  className="app-badge"
                  id="app-store-badge"
                >
                  Get Started
                </a>
                <a href="#/diet" className="app-badge" id="play-store-badge">Diet Plans</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <a href="#/" className="nav-logo">
                <span className="logo-icon">&#9889;</span>
                <span className="logo-text">Fitzer</span>
              </a>
              <p>AI-powered fitness intelligence for the modern world. Train smarter, eat better, live fitter.</p>
              <div className="social-links">
                <a href="#/" aria-label="Twitter" className="social-link">X</a>
                <a href="#/" aria-label="Instagram" className="social-link">IG</a>
                <a href="#/" aria-label="LinkedIn" className="social-link">in</a>
              </div>
            </div>
            <div className="footer-col">
              <h4>Product</h4>
              <ul>
                <li><a href="#/exercise">Exercises</a></li>
                <li><a href="#/diet">Diet Plans</a></li>
                <li><a href="#/assistant">AI Coach</a></li>
                <li><a href="#/profile">Profile</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Features</h4>
              <ul>
                <li><a href="#features">Calorie Detection</a></li>
                <li><a href="#features">Posture Correction</a></li>
                <li><a href="#ai-showcase">AI Demo</a></li>
                <li><a href="#stats">Tech Engines</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Support</h4>
              <ul>
                <li><a href="#/assistant">AI Support</a></li>
                <li><a href="#/">Privacy Policy</a></li>
                <li><a href="#/">Terms of Service</a></li>
                <li><a href="#/">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 Fitzer Inc. All rights reserved.</p>
            <p>Built with passion for a healthier world.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
