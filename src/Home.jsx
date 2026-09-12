import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Apple, Bot, Dumbbell, Brain, ArrowRight, Flame, Zap, Target, TrendingUp } from 'lucide-react';
import { CinematicLayout, AiFab, Kicker, ScrollReveal } from './CinematicLayout';

const HERO_WORDS = ['Train.', 'Fuel.', 'Transform.'];

export default function Home() {
  const [wordIdx, setWordIdx] = React.useState(0);

  React.useEffect(() => {
    const id = setInterval(() => {
      setWordIdx(i => (i + 1) % HERO_WORDS.length);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <CinematicLayout fab={<AiFab />}>
      {/* ── Hero ── */}
      <section
        id="home"
        style={{
          minHeight: 'calc(100vh - 64px)',
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          overflow: 'hidden',
        }}
      >
        {/* Ambient background */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, #1a0500 0%, var(--bg) 50%, #07000f 100%)',
          zIndex: 0,
        }} />
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          background: 'radial-gradient(ellipse 65% 60% at 15% 55%, rgba(255,107,53,0.09) 0%, transparent 65%)',
        }} />

        {/* ── LEFT: Text content ── */}
        <div style={{
          position: 'relative', zIndex: 1,
          display: 'flex', flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '4rem 2.5rem 4rem 2.5rem',
        }}>
          {/* Eyebrow badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            marginBottom: '1.5rem',
            background: 'rgba(255,107,53,0.10)',
            border: '1px solid rgba(255,107,53,0.28)',
            borderRadius: '999px',
            padding: '0.3rem 0.85rem',
            width: 'fit-content',
          }}>
            <Flame size={13} style={{ color: 'var(--accent)' }} />
            <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--accent)', textTransform: 'uppercase' }}>
              Fitzer — Your AI Fitness Companion
            </span>
          </div>

          <h1
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 'clamp(3rem, 8vw, 7rem)',
              fontWeight: 900,
              lineHeight: 0.95,
              letterSpacing: '-0.03em',
              color: 'var(--text)',
              marginBottom: '2rem',
              overflow: 'hidden',
            }}
            aria-label="Train. Fuel. Transform."
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={wordIdx}
                initial={{ opacity: 0, y: '60%' }}
                animate={{ opacity: 1, y: '0%' }}
                exit={{ opacity: 0, y: '-60%' }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  display: 'block',
                  background: 'var(--grad-text)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {HERO_WORDS[wordIdx]}
              </motion.span>
            </AnimatePresence>
          </h1>

          <p style={{ color: 'var(--text2)', fontSize: '1rem', maxWidth: 400, lineHeight: 1.75, marginBottom: '2.5rem' }}>
            Smart exercise plans, personalized diets, and an AI coach — all powered by real science and your body data.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
            <a href="#/exercise" className="cn-btn" style={{ textDecoration: 'none' }}>
              <Dumbbell size={16} />
              Start Training
            </a>
            <a href="#/diet" className="cn-btn-ghost" style={{ textDecoration: 'none' }}>
              <Apple size={16} />
              View Diet Plans
            </a>
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <FireStat to={650} suffix="+" label="Workouts" />
            <FireStat to={120} suffix="+" label="Diet Plans" />
            <FireStat to={25} suffix="k" label="Users" />
            <FireStat to={18} suffix="d" label="Avg Streak" />
          </div>
        </div>

        {/* ── RIGHT: Athlete image ── */}
        <div style={{ position: 'relative', zIndex: 1, overflow: 'hidden' }}>
          {/* Gradient overlays */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
            background: 'linear-gradient(90deg, #060608 0%, transparent 30%, transparent 70%, #060608 100%)',
          }} />
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '35%', zIndex: 2, pointerEvents: 'none',
            background: 'linear-gradient(to top, #060608, transparent)',
          }} />
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '15%', zIndex: 2, pointerEvents: 'none',
            background: 'linear-gradient(to bottom, #060608, transparent)',
          }} />
          {/* Fire tint overlay */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
            background: 'radial-gradient(ellipse 80% 80% at 50% 40%, rgba(255,107,53,0.06) 0%, transparent 60%)',
          }} />
          <motion.img
            src="/hero.png"
            alt="Fitzer athlete"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center top',
              display: 'block',
              filter: 'brightness(0.8) contrast(1.15) saturate(0.85)',
            }}
          />
        </div>

        <style>{`
          @media (max-width: 768px) {
            #home { grid-template-columns: 1fr !important; }
            #home > div:last-child { display: none !important; }
          }
        `}</style>
      </section>

      {/* ── Features ── */}
      <section style={{ background: 'var(--bg2)', padding: '0' }}>
        <div className="cn-content">
          <Kicker num="01" label="Platform Features" />
          <h2 className="cn-section-title" style={{ marginBottom: '0.75rem' }}>
            Everything you need to{' '}
            <span style={{
              background: 'var(--grad-text)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>perform.</span>
          </h2>
          <p className="cn-section-body" style={{ marginBottom: '2.5rem', maxWidth: 560 }}>
            Science-backed training, budget-friendly nutrition, and AI coaching — in one seamless experience.
          </p>

          <div className="cn-grid-3" style={{ gap: '1rem' }}>
            <ScrollReveal delay={0}>
              <FeatureCard
                icon={<Dumbbell size={22} />}
                title="Smart Exercises"
                desc="Personalized workout plans based on your BMI, body composition, sleep patterns, and goals. Powered by pose-detection AI."
                href="#/exercise"
                num="01"
                color="var(--accent)"
              />
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <FeatureCard
                icon={<Apple size={22} />}
                title="Budget Diet Plans"
                desc="Vegan and non-vegan meal plans tailored to your budget, calories, and nutritional targets with Indian pricing."
                href="#/diet"
                num="02"
                color="var(--accent-amber)"
              />
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <FeatureCard
                icon={<Brain size={22} />}
                title="GigaChat AI"
                desc="An always-on AI fitness assistant that answers your workout, nutrition, and recovery questions in real-time."
                href="#/assistant"
                num="03"
                color="var(--accent-red)"
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section>
        <div className="cn-content">
          <Kicker num="02" label="How It Works" />
          <h2 className="cn-section-title" style={{ marginBottom: '0.75rem' }}>
            Three steps to{' '}
            <span style={{
              background: 'var(--grad-text)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>transformation.</span>
          </h2>
          <p className="cn-section-body" style={{ marginBottom: '2.5rem', maxWidth: 540 }}>
            Fill in your body specs, get personalized recommendations, then let the AI Coach guide you every step of the way.
          </p>

          <div className="cn-divider" />

          <div className="cn-grid-4" style={{ gap: '1rem', marginTop: '2rem' }}>
            {[
              { step: '01', label: 'Enter Your Specs', desc: 'Height, weight, age, sleep, and goals', icon: <Target size={18} /> },
              { step: '02', label: 'Get Exercises', desc: 'Tailored workout plans for your level', icon: <Dumbbell size={18} /> },
              { step: '03', label: 'Plan Your Diet', desc: 'Budget-friendly meals for your targets', icon: <Apple size={18} /> },
              { step: '04', label: 'Chat with AI', desc: 'Personalized coaching, anytime', icon: <Bot size={18} /> },
            ].map((s, i) => (
              <ScrollReveal key={s.step} delay={i * 70}>
                <div className="cn-card" style={{ height: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: '2.5rem', fontWeight: 900,
                      background: 'var(--grad-text)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      opacity: 0.4, lineHeight: 1
                    }}>{s.step}</span>
                    <span style={{ color: 'var(--accent)', opacity: 0.7 }}>{s.icon}</span>
                  </div>
                  <p className="cn-h3" style={{ marginBottom: '0.4rem' }}>{s.label}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>{s.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* CTA row */}
          <div style={{
            marginTop: '3rem', display: 'flex', gap: '0.75rem',
            justifyContent: 'center', flexWrap: 'wrap'
          }}>
            <a href="#/exercise" className="cn-btn" style={{ textDecoration: 'none' }}>
              <Flame size={16} />
              Start Your Journey
              <ArrowRight size={15} />
            </a>
            <a href="#/profile" className="cn-btn-ghost" style={{ textDecoration: 'none' }}>
              <TrendingUp size={16} />
              View Your Profile
            </a>
          </div>
        </div>
      </section>
    </CinematicLayout>
  );
}

/* ── Feature Card ── */
function FeatureCard({ icon, title, desc, href, num, color }) {
  return (
    <a
      href={href}
      className="cn-glow-card"
      style={{
        textDecoration: 'none',
        display: 'block',
        height: '100%',
        padding: '1.75rem',
        position: 'relative',
        overflow: 'hidden',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      {/* Glow spot in corner */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: 140, height: 140,
        background: `radial-gradient(circle, ${color}22 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: `${color}18`, border: `1px solid ${color}35`,
          display: 'grid', placeItems: 'center', color
        }}>
          {icon}
        </div>
        <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--text3)', fontFamily: "'Outfit', monospace" }}>{num}</span>
      </div>
      <h3 className="cn-h3" style={{ marginBottom: '0.6rem', color: 'var(--text)' }}>{title}</h3>
      <p style={{ fontSize: '0.85rem', color: 'var(--text2)', lineHeight: 1.65 }}>{desc}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '1.5rem', color, fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.02em' }}>
        Launch Module <ArrowRight size={14} />
      </div>
    </a>
  );
}

/* ── Animated Fire Stat Counter ── */
function FireStat({ to, suffix, label }) {
  const ref = React.useRef(null);
  const [count, setCount] = React.useState(0);
  const [started, setStarted] = React.useState(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting && !started) { setStarted(true); observer.disconnect(); } },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  React.useEffect(() => {
    if (!started) return;
    let reqId;
    let start = null;
    const dur = 1800;
    const ease = t => 1 - Math.pow(1 - t, 3);
    const step = ts => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      setCount(Math.floor(ease(p) * to));
      if (p < 1) reqId = requestAnimationFrame(step);
    };
    reqId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(reqId);
  }, [started, to]);

  return (
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
      <span style={{
        fontFamily: "'Outfit', sans-serif", fontSize: '2rem', fontWeight: 900, lineHeight: 1,
        background: 'var(--grad-text)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}>
        {count}{suffix}
      </span>
      <span style={{ fontSize: '0.7rem', color: 'var(--text3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        {label}
      </span>
    </div>
  );
}
