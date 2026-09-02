import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Apple, Bot, Dumbbell, Activity, Brain } from 'lucide-react';
import { CinematicLayout, AiFab, Kicker, ScrollReveal } from './CinematicLayout';

const HERO_WORDS = ['Train.', 'Fuel.', 'Transform.'];

export default function Home() {
  const [wordIdx, setWordIdx] = React.useState(0);
  const [leaving, setLeaving] = React.useState(false);

  React.useEffect(() => {
    const id = setInterval(() => {
      setLeaving(true);
      setTimeout(() => {
        setWordIdx(i => (i + 1) % HERO_WORDS.length);
        setLeaving(false);
      }, 500);
    }, 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <CinematicLayout fab={<AiFab />}>
      {/* ── Hero ── */}
      <section id="home" style={{
        minHeight: 'calc(100vh - 64px)',
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        overflow: 'hidden',
      }}>
        <div className="cn-hero-bg" />

        {/* ── LEFT: Text content ── */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '4rem 2.5rem 4rem 2.5rem',
        }}>
          <p className="cn-hero-subline">
            <strong>Fitzer</strong> — Your intelligent fitness companion
          </p>

          <h1 className="cn-hero-title" aria-label="Train. Fuel. Transform.">
            <span className="cn-word-window" aria-hidden="true">
              <AnimatePresence mode="wait">
                <motion.span
                  key={wordIdx}
                  className="cn-word is-current"
                  initial={{ opacity: 0, y: '100%' }}
                  animate={{ opacity: 1, y: '0%' }}
                  exit={{ opacity: 0, y: '-100%' }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  style={{ display: 'block' }}
                >
                  {HERO_WORDS[wordIdx]}
                </motion.span>
              </AnimatePresence>
            </span>
          </h1>

          <p className="cn-hero-desc">
            Smart exercise plans, personalized diets, and an on-page AI coach.
            Your fitness journey — data-driven and simple.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            <a href="#/diet" className="cn-btn" style={{ textDecoration: 'none' }}>
              <Apple size={16} />
              Get Your Diet Plan
            </a>
            <a href="#/exercise" className="cn-btn-ghost" style={{ textDecoration: 'none' }}>
              <Dumbbell size={16} />
              Browse Exercises
            </a>
          </div>

          <div className="cn-hero-stats">
            <StatCounter to={650} suffix="+" label="Workouts" />
            <StatCounter to={120} suffix="+" label="Diet Plans" />
            <StatCounter to={25} suffix="k" label="Active Users" />
            <StatCounter to={18} suffix="d" label="Avg Streak" />
          </div>
        </div>

        {/* ── RIGHT: Hero athlete image ── */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          overflow: 'hidden',
        }}>
          {/* Dark gradient fade on left edge to blend with text side */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, #080808 0%, transparent 30%, transparent 70%, #080808 100%)',
            zIndex: 2,
            pointerEvents: 'none',
          }} />
          {/* Bottom fade */}
          <div style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            height: '30%',
            background: 'linear-gradient(to top, #080808, transparent)',
            zIndex: 2,
            pointerEvents: 'none',
          }} />
          {/* Top fade */}
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: '15%',
            background: 'linear-gradient(to bottom, #080808, transparent)',
            zIndex: 2,
            pointerEvents: 'none',
          }} />
          <motion.img
            src="/hero.png"
            alt="Fitzer athlete weight lifting"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center top',
              display: 'block',
              filter: 'brightness(0.85) contrast(1.1) saturate(0.9)',
            }}
          />
        </div>

        {/* Mobile responsive override */}
        <style>{`
          @media (max-width: 768px) {
            #home {
              grid-template-columns: 1fr !important;
            }
            #home > div:last-child {
              display: none !important;
            }
          }
        `}</style>
      </section>

      {/* ── What You Get ── */}
      <section style={{ background: 'var(--bg2)', padding: '0' }}>
        <div className="cn-content">
          <Kicker num="01" label="What You Get" />
          <h2 className="cn-section-title">Everything you need to perform.</h2>
          <p className="cn-section-body" style={{ marginBottom: '2.5rem' }}>
            Fitzer combines science-backed training, budget-friendly nutrition, and AI coaching into one seamless experience.
          </p>

          <div className="cn-grid-3" style={{ gap: '1rem' }}>
            <ScrollReveal delay={0}>
              <FeatureCard
                icon={<Dumbbell size={22} />}
                title="Smart Exercises"
                desc="Personalized workout recommendations based on your BMI, body composition, sleep patterns, and fitness goals."
                href="#/exercise"
                num="01"
              />
            </ScrollReveal>
            <ScrollReveal delay={120}>
              <FeatureCard
                icon={<Apple size={22} />}
                title="Budget Diet Plans"
                desc="Vegan and non-vegan meal plans engineered around your budget, caloric needs, and nutritional targets."
                href="#/diet"
                num="02"
              />
            </ScrollReveal>
            <ScrollReveal delay={240}>
              <FeatureCard
                icon={<Brain size={22} />}
                title="GigaChat AI Coach"
                desc="An always-on AI fitness assistant trained to answer all your workout, nutrition, and recovery questions."
                href="#/assistant"
                num="03"
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section>
        <div className="cn-content">
          <Kicker num="02" label="How It Works" />
          <h2 className="cn-section-title">Three steps to transformation.</h2>
          <div className="cn-section-body">
            <p>Start by filling in your body specs — height, weight, age, and fitness goal. Fitzer calculates your BMI and generates personalized recommendations across both the Exercise and Diet modules.</p>
            <p>Then fire up the AI Coach for real-time guidance, motivation, and answers to any fitness question. All data is saved locally so your journey persists across sessions.</p>
          </div>

          <div className="cn-divider" style={{ margin: '2.5rem 0' }} />

          <div className="cn-grid-4" style={{ gap: '1rem' }}>
            {[
              { step: '1', label: 'Enter Your Specs', desc: 'Height, weight, age, sleep, and goals' },
              { step: '2', label: 'Get Exercises', desc: 'Tailored workout plans for your level' },
              { step: '3', label: 'Plan Your Diet', desc: 'Budget-friendly meals for your targets' },
              { step: '4', label: 'Chat with AI', desc: 'Personalized coaching anytime' },
            ].map((s, i) => (
              <ScrollReveal key={s.step} delay={i * 80}>
                <div className="cn-card">
                  <span style={{ fontFamily: 'Anton, sans-serif', fontSize: '2.5rem', color: 'var(--accent)', opacity: 0.35, lineHeight: 1 }}>{s.step}</span>
                  <p className="cn-h3" style={{ marginTop: '0.5rem', marginBottom: '0.4rem' }}>{s.label}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>{s.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </CinematicLayout>
  );
}

function FeatureCard({ icon, title, desc, href, num }) {
  return (
    <a href={href} className="cn-card" style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem', color: 'var(--accent)' }}>
        {icon}
        <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--text3)', marginLeft: 'auto' }}>{num}</span>
      </div>
      <h3 className="cn-h3" style={{ marginBottom: '0.6rem' }}>{title}</h3>
      <p style={{ fontSize: '0.82rem', color: 'var(--text2)', lineHeight: 1.65 }}>{desc}</p>
    </a>
  );
}

function StatCounter({ to, suffix, label }) {
  const ref = React.useRef(null);
  const [count, setCount] = React.useState(0);
  const [hasStarted, setHasStarted] = React.useState(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  React.useEffect(() => {
    if (!hasStarted) return;
    let start = null;
    let reqId;
    const duration = 1800;
    
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      
      setCount(Math.floor(easeOut(progress) * to));
      
      if (progress < 1) {
        reqId = requestAnimationFrame(step);
      }
    };
    reqId = requestAnimationFrame(step);
    
    return () => cancelAnimationFrame(reqId);
  }, [hasStarted, to]);

  return (
    <div className="cn-stat" ref={ref}>
      <span className="cn-stat-val">{count}{suffix}</span>
      <span className="cn-stat-label">{label}</span>
    </div>
  );
}
