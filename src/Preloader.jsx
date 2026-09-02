import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* =====================================================
   FITZER Preloader — Dumbbell Drop Edition
   Three dumbbells fall from the top with a bounce,
   replacing the old VU-meter loading bar.
   ===================================================== */

export default function Preloader({ onDone }) {
  const [pct, setPct] = React.useState(0);
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    let current = 0;
    const timers = [];
    // Fast single sweep — done in ~1s
    const id = setInterval(() => {
      current += 1;
      setPct(current);
      if (current >= 100) clearInterval(id);
    }, 10);
    timers.push(id);
    // Fade out at 1300ms → home visible by ~2s
    timers.push(
      setTimeout(() => {
        setVisible(false);
        setTimeout(() => onDone && onDone(), 650);
      }, 1300)
    );
    return () => timers.forEach(t => clearTimeout(t) || clearInterval(t));
  }, [onDone]);

  /* Three dumbbells with different drop delays & horizontal positions */
  const dumbbells = [
    { id: 'db1', delay: 0.05, x: '-80px',  size: 72,  color: '#c8f04a' },
    { id: 'db2', delay: 0.25, x: '0px',    size: 90,  color: '#f0ede8' },
    { id: 'db3', delay: 0.45, x: '80px',   size: 68,  color: '#c8f04a' },
  ];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.65, ease: 'easeInOut' }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: '#080808',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
          role="status"
          aria-live="polite"
          aria-label="Fitzer is loading"
        >
          {/* Brand name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              fontFamily: 'Anton, sans-serif',
              fontSize: 'clamp(3rem, 12vw, 8rem)',
              lineHeight: 1,
              letterSpacing: '-0.02em',
              color: '#f0ede8',
              marginBottom: '0.5rem',
              userSelect: 'none',
            }}
          >
            FITZER
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.78rem',
              fontWeight: 500,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#6b6763',
              marginBottom: '3rem',
            }}
          >
            Train · Fuel · Transform
          </motion.p>

          {/* ── Dumbbell drop stage ── */}
          <div
            style={{
              position: 'relative',
              width: 260,
              height: 120,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              marginBottom: '2rem',
            }}
          >
            {dumbbells.map(({ id, delay, x, size, color }) => (
              <motion.div
                key={id}
                initial={{ y: -220, opacity: 0, rotate: -15 }}
                animate={{
                  y: [null, 0, -18, 0, -7, 0],
                  opacity: [null, 1, 1, 1, 1, 1],
                  rotate: [null, 0, 3, 0, -2, 0],
                }}
                transition={{
                  delay,
                  duration: 0.9,
                  times: [0, 0.5, 0.65, 0.78, 0.9, 1],
                  ease: ['easeIn', 'easeOut', 'easeIn', 'easeOut', 'easeOut'],
                }}
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: '50%',
                  translateX: x,
                  marginLeft: -(size / 2),
                }}
              >
                {/* Subtle pulse after landing */}
                <motion.div
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{
                    delay: delay + 0.95,
                    duration: 1.8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <DumbbellSVG size={size} color={color} />
                </motion.div>

                {/* Shadow under each dumbbell */}
                <motion.div
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 0.35 }}
                  transition={{ delay: delay + 0.48, duration: 0.25 }}
                  style={{
                    width: size * 0.85,
                    height: 6,
                    background: 'radial-gradient(ellipse, rgba(200,240,74,0.5) 0%, transparent 80%)',
                    borderRadius: '50%',
                    margin: '4px auto 0',
                    filter: 'blur(2px)',
                  }}
                />
              </motion.div>
            ))}
          </div>


        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Dumbbell SVG ── */
function DumbbellSVG({ size = 80, color = '#c8f04a' }) {
  const s = size;
  // Proportions: bar occupies middle, plates on each side
  const barW = s * 0.38;
  const barH = s * 0.12;
  const plateW = s * 0.18;
  const outerH = s * 0.72;
  const innerH = s * 0.50;
  const cx = s / 2;
  const cy = s / 2;
  const dim = (v) => Math.round(v * 10) / 10;

  return (
    <svg
      width={s}
      height={s}
      viewBox={`0 0 ${s} ${s}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      {/* Left outer plate */}
      <rect
        x={dim(cx - barW / 2 - plateW - plateW * 0.55)}
        y={dim(cy - outerH / 2)}
        width={dim(plateW * 0.55)}
        height={dim(outerH)}
        rx={dim(plateW * 0.18)}
        fill={color}
        opacity={0.9}
      />
      {/* Left inner plate */}
      <rect
        x={dim(cx - barW / 2 - plateW)}
        y={dim(cy - innerH / 2)}
        width={dim(plateW)}
        height={dim(innerH)}
        rx={dim(plateW * 0.2)}
        fill={color}
      />
      {/* Bar */}
      <rect
        x={dim(cx - barW / 2)}
        y={dim(cy - barH / 2)}
        width={dim(barW)}
        height={dim(barH)}
        rx={dim(barH / 2)}
        fill={color}
        opacity={0.7}
      />
      {/* Right inner plate */}
      <rect
        x={dim(cx + barW / 2)}
        y={dim(cy - innerH / 2)}
        width={dim(plateW)}
        height={dim(innerH)}
        rx={dim(plateW * 0.2)}
        fill={color}
      />
      {/* Right outer plate */}
      <rect
        x={dim(cx + barW / 2 + plateW)}
        y={dim(cy - outerH / 2)}
        width={dim(plateW * 0.55)}
        height={dim(outerH)}
        rx={dim(plateW * 0.18)}
        fill={color}
        opacity={0.9}
      />
    </svg>
  );
}
