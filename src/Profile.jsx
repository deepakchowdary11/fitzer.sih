import React from 'react';
import { motion } from 'framer-motion';
import { CinematicLayout, AiFab, Kicker } from './CinematicLayout';

/* ── helpers ── */
const fmt = (v, unit = '') => (v ? `${v}${unit}` : '—');

function calcBMR(weightKg, heightCm, age, gender) {
  if (!weightKg || !heightCm || !age) return 0;
  // Mifflin-St Jeor
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return Math.round(gender === 'female' ? base - 161 : base + 5);
}

const ACTIVITY_MULT = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};
const ACTIVITY_LABEL = {
  sedentary: 'Sedentary',
  light: 'Lightly Active',
  moderate: 'Moderately Active',
  active: 'Very Active',
  very_active: 'Extremely Active',
};

function bmiColor(bmi) {
  if (!bmi) return '#6b6763';
  if (bmi < 18.5) return '#60a5fa';
  if (bmi < 25)   return '#c8f04a';
  if (bmi < 30)   return '#f59e0b';
  return '#ef4444';
}

function sleepScore(h) {
  if (!h) return null;
  if (h >= 7 && h <= 9) return { score: 100, label: 'Optimal', color: '#c8f04a' };
  if (h === 6 || h === 10) return { score: 70, label: 'Fair', color: '#f59e0b' };
  return { score: 35, label: 'Poor', color: '#ef4444' };
}

function idealWeightRange(heightCm) {
  if (!heightCm) return null;
  const h = heightCm / 100;
  return { low: (18.5 * h * h).toFixed(1), high: (24.9 * h * h).toFixed(1) };
}

function bodyFatCategory(fat, gender) {
  if (!fat) return null;
  if (gender === 'female') {
    if (fat < 14) return { label: 'Essential Fat', color: '#60a5fa' };
    if (fat < 21) return { label: 'Athletic', color: '#c8f04a' };
    if (fat < 25) return { label: 'Fitness', color: '#a3e635' };
    if (fat < 32) return { label: 'Average', color: '#f59e0b' };
    return { label: 'Obese Zone', color: '#ef4444' };
  }
  if (fat < 6)  return { label: 'Essential Fat', color: '#60a5fa' };
  if (fat < 14) return { label: 'Athletic', color: '#c8f04a' };
  if (fat < 18) return { label: 'Fitness', color: '#a3e635' };
  if (fat < 25) return { label: 'Average', color: '#f59e0b' };
  return { label: 'Obese Zone', color: '#ef4444' };
}

const GOAL_META = {
  lose:     { label: 'Weight Loss',    emoji: '🔥', color: '#ef4444', tip: 'Aim for a 300–500 kcal deficit daily.' },
  maintain: { label: 'Maintenance',   emoji: '⚖️', color: '#c8f04a', tip: 'Eat at TDEE and keep training consistent.' },
  gain:     { label: 'Muscle Gain',   emoji: '💪', color: '#60a5fa', tip: 'Eat 200–300 kcal above TDEE with high protein.' },
  build:    { label: 'Build Muscle',  emoji: '🏋️', color: '#a78bfa', tip: 'Progressive overload + 1.6–2.2g protein/kg.' },
  endurance:{ label: 'Endurance',     emoji: '🏃', color: '#fb923c', tip: 'Prioritise carb fuelling and Zone 2 cardio.' },
};

/* ── mini stat tile ── */
function StatTile({ label, value, sub, accent }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid var(--border2)',
      borderRadius: 12,
      padding: '1rem',
    }}>
      <div style={{ fontSize: '0.68rem', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: '0.35rem' }}>{label}</div>
      <div style={{ fontFamily: 'Anton, sans-serif', fontSize: '1.45rem', color: accent || 'var(--text)', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: '0.7rem', color: 'var(--text3)', marginTop: '0.3rem' }}>{sub}</div>}
    </div>
  );
}

/* ── radial gauge (SVG) ── */
function RadialGauge({ value, max, color, label, unit }) {
  const pct = Math.min(1, (value || 0) / max);
  const r = 44, cx = 56, cy = 56;
  const circumference = Math.PI * r; // half circle
  const dash = circumference * pct;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg width={112} height={70} viewBox="0 0 112 70">
        {/* track */}
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={9} strokeLinecap="round" />
        {/* fill */}
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none" stroke={color} strokeWidth={9} strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`} style={{ transition: 'stroke-dasharray 0.6s ease' }} />
        <text x={cx} y={cy - 4} textAnchor="middle" fill={color}
          style={{ fontFamily: 'Anton, sans-serif', fontSize: 18 }}>
          {value || '—'}{unit}
        </text>
      </svg>
      <div style={{ fontSize: '0.7rem', color: 'var(--text3)', marginTop: '-6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
    </div>
  );
}

/* ── horizontal bar ── */
function BarRow({ label, pct, color, right }) {
  return (
    <div style={{ marginBottom: '0.85rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.35rem' }}>
        <span style={{ color: 'var(--text2)', fontWeight: 600 }}>{label}</span>
        <span style={{ color: 'var(--text3)' }}>{right}</span>
      </div>
      <div style={{ height: 7, background: 'rgba(255,255,255,0.06)', borderRadius: 999, overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          style={{ height: '100%', background: color || 'var(--accent)', borderRadius: 999 }}
        />
      </div>
    </div>
  );
}

export default function Profile() {
  const [showMotivate, setShowMotivate] = React.useState(false);

  const user = React.useMemo(() => {
    try { return JSON.parse(localStorage.getItem('fitzer.user') || '{}'); } catch { return {}; }
  }, []);

  const bmi = React.useMemo(() => {
    try { return JSON.parse(localStorage.getItem('fitzer.bmi') || '{}'); } catch { return {}; }
  }, []);

  const weightHistory = React.useMemo(() => {
    try { return JSON.parse(localStorage.getItem('fitzer.weightHistory') || '[]'); } catch { return []; }
  }, []);

  React.useEffect(() => {
    if (!user || !user.name || !user.username) window.location.hash = '#/login';
  }, [user]);

  /* ── parsed fields ── */
  const name        = user.name || '';
  const username    = user.username ? `@${user.username}` : '';
  const heightCm    = Number(bmi.heightCm)          || 0;
  const weightKg    = Number(bmi.weightKg)           || 0;
  const age         = Number(bmi.age)                || 0;
  const gender      = bmi.gender                     || 'male';
  const sleepHours  = Number(bmi.sleepHours)         || 0;
  const bodyFat     = Number(bmi.bodyFatPercentage)  || 0;
  const activity    = bmi.activityLevel              || 'moderate';
  const goal        = bmi.fitnessGoal                || 'maintain';
  const genetic     = bmi.geneticCondition           || '';

  const bmiValue    = Number(bmi.bmi) ||
    (heightCm > 0 ? Number(((weightKg / ((heightCm / 100) ** 2)) || 0).toFixed(1)) : 0);
  const bmiCat      = bmi.bmiCategory || '';

  React.useEffect(() => {
    if (bmiValue && (bmiValue < 18.5 || bmiValue > 25)) setShowMotivate(true);
  }, [bmiValue]);

  /* ── derived analytics ── */
  const bmr         = calcBMR(weightKg, heightCm, age, gender);
  const tdee        = bmr ? Math.round(bmr * (ACTIVITY_MULT[activity] || 1.55)) : 0;
  const idealRange  = idealWeightRange(heightCm);
  const fatCat      = bodyFatCategory(bodyFat, gender);
  const sleep       = sleepScore(sleepHours);
  const goalMeta    = GOAL_META[goal] || GOAL_META.maintain;
  const leanMass    = (weightKg && bodyFat) ? (weightKg * (1 - bodyFat / 100)).toFixed(1) : null;
  const bmiCol      = bmiColor(bmiValue);

  /* goal-specific calorie target */
  const calTarget = tdee
    ? goal === 'lose'   ? tdee - 400
    : goal === 'gain' || goal === 'build' ? tdee + 250
    : tdee
    : 0;

  /* weight chart points */
  const chartPoints = React.useMemo(() => {
    const history = Array.isArray(weightHistory) && weightHistory.length
      ? weightHistory
      : (weightKg ? Array.from({ length: 6 }).map((_, i) => ({ t: Date.now() - (5 - i) * 86400000, weightKg: weightKg - (5 - i) })) : []);
    const maxW = Math.max(...history.map(h => h.weightKg), weightKg || 0);
    const minW = Math.min(...history.map(h => h.weightKg), weightKg || 0);
    const pad = 6, W = 600, H = 160;
    const span = Math.max(1, maxW - minW);
    return history.map((h, idx) => ({
      x: (idx / Math.max(1, history.length - 1)) * (W - pad * 2) + pad,
      y: H - pad - ((h.weightKg - minW) / span) * (H - pad * 2),
      label: new Date(h.t).toLocaleDateString(undefined, { month: 'short', day: '2-digit' }),
      weight: h.weightKg,
    }));
  }, [weightHistory, weightKg]);

  const card = { marginBottom: '1.25rem' };

  return (
    <CinematicLayout fab={<AiFab />}>
      <div className="cn-content" style={{ maxWidth: 900 }}>
        <Kicker num="04" label="Profile" />
        <h1 className="cn-h1" style={{ marginBottom: '2rem' }}>Profile & Analytics</h1>

        {/* ── User Card ── */}
        <div className="cn-card" style={card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--accent2)', border: '1px solid rgba(200,240,74,0.3)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
              <span style={{ fontFamily: 'Anton, sans-serif', fontSize: '1.3rem', color: 'var(--accent)' }}>{name.charAt(0).toUpperCase()}</span>
            </div>
            <div style={{ flex: 1 }}>
              <div className="cn-h2" style={{ lineHeight: 1.2 }}>{name}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text3)', marginTop: '0.1rem' }}>{username}</div>
            </div>
            {/* Goal badge */}
            <div style={{ background: `${goalMeta.color}18`, border: `1px solid ${goalMeta.color}44`, borderRadius: 20, padding: '0.35rem 0.85rem', fontSize: '0.75rem', fontWeight: 700, color: goalMeta.color, whiteSpace: 'nowrap' }}>
              {goalMeta.emoji} {goalMeta.label}
            </div>
          </div>

          {/* Core stats grid */}
          <div className="cn-grid-4">
            <StatTile label="Height"  value={fmt(heightCm, ' cm')} />
            <StatTile label="Weight"  value={fmt(weightKg, ' kg')} />
            <StatTile label="Age"     value={fmt(age, ' yrs')} />
            <StatTile label="Gender"  value={gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : '—'} />
          </div>
        </div>

        {/* ── BMI + Body Gauges ── */}
        <div className="cn-card" style={card}>
          <h3 className="cn-h2" style={{ marginBottom: '1.5rem' }}>🧬 Body Metrics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <RadialGauge value={bmiValue} max={40} color={bmiCol} label="BMI" unit="" />
            {bodyFat > 0 && <RadialGauge value={bodyFat} max={50} color={fatCat?.color || '#c8f04a'} label="Body Fat" unit="%" />}
            {sleepHours > 0 && <RadialGauge value={sleepHours} max={10} color={sleep?.color || '#c8f04a'} label="Sleep hrs" unit="h" />}
            {bmr > 0 && <RadialGauge value={bmr} max={3000} color="#a78bfa" label="BMR kcal" unit="" />}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
            <StatTile label="BMI Category"    value={bmiCat || '—'}          accent={bmiCol} />
            {idealRange && <StatTile label="Ideal Weight Range" value={`${idealRange.low}–${idealRange.high} kg`} sub="Based on height (BMI 18.5–24.9)" />}
            {fatCat    && <StatTile label="Body Fat Zone"      value={fatCat.label}          accent={fatCat.color} />}
            {leanMass  && <StatTile label="Lean Body Mass"     value={`${leanMass} kg`}      sub="Weight minus fat mass" />}
            {sleep     && <StatTile label="Sleep Quality"      value={sleep.label}           accent={sleep.color} sub={`${sleepHours}h per night`} />}
            {genetic   && <StatTile label="Genetic / Health Note" value={genetic}            />}
          </div>
        </div>

        {/* ── Energy & Calorie Analytics ── */}
        {tdee > 0 && (
          <div className="cn-card" style={card}>
            <h3 className="cn-h2" style={{ marginBottom: '1.5rem' }}>⚡ Energy & Calories</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.85rem', marginBottom: '1.5rem' }}>
              <StatTile label="BMR"              value={`${bmr} kcal`}    sub="Calories at complete rest"    accent="#a78bfa" />
              <StatTile label="TDEE"             value={`${tdee} kcal`}   sub={ACTIVITY_LABEL[activity]}     accent="#c8f04a" />
              <StatTile label="Daily Goal"       value={`${calTarget} kcal`} sub={goalMeta.label + ' target'} accent={goalMeta.color} />
              <StatTile label="Protein Target"   value={`${Math.round(weightKg * 1.8)}g`} sub="~1.8g per kg body weight" accent="#fb923c" />
            </div>

            <BarRow label="BMR"       pct={(bmr / (tdee || 1)) * 100}    right={`${bmr} kcal`}    color="#a78bfa" />
            <BarRow label="Activity"  pct={((tdee - bmr) / (tdee || 1)) * 100} right={`+${tdee - bmr} kcal`} color="#60a5fa" />
            <BarRow label="Goal Adj." pct={Math.abs(calTarget - tdee) / (tdee || 1) * 100 * 5}
              right={calTarget < tdee ? `−${tdee - calTarget} kcal` : calTarget > tdee ? `+${calTarget - tdee} kcal` : 'Maintenance'} color={goalMeta.color} />

            <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: `${goalMeta.color}12`, borderRadius: 10, border: `1px solid ${goalMeta.color}30`, fontSize: '0.8rem', color: 'var(--text2)', lineHeight: 1.6 }}>
              💡 <strong style={{ color: goalMeta.color }}>Goal Tip:</strong> {goalMeta.tip}
            </div>
          </div>
        )}

        {/* ── Weight Progress Chart ── */}
        <div className="cn-card" style={card}>
          <h3 className="cn-h2" style={{ marginBottom: '1.25rem' }}>📈 Weight Progress</h3>
          {localStorage.getItem('fitzer.dietPlan') && (() => {
            try {
              const dp = JSON.parse(localStorage.getItem('fitzer.dietPlan'));
              return (
                <div style={{ fontSize: '0.8rem', color: 'var(--text3)', marginBottom: '1rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text2)' }}>Diet Plan:</span>{' '}
                  {dp.dietType} · {dp.category}
                </div>
              );
            } catch { return null; }
          })()}
          {chartPoints.length ? (
            <>
              {/* Ideal range band labels */}
              {idealRange && (
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem', fontSize: '0.75rem', color: 'var(--text3)' }}>
                  <span>🎯 Ideal: <strong style={{ color: 'var(--accent)' }}>{idealRange.low}–{idealRange.high} kg</strong></span>
                  <span>📍 Current: <strong style={{ color: 'var(--text)' }}>{weightKg} kg</strong></span>
                  {weightKg && idealRange && (
                    <span style={{ color: weightKg <= Number(idealRange.high) && weightKg >= Number(idealRange.low) ? '#c8f04a' : '#f59e0b' }}>
                      {weightKg < Number(idealRange.low) ? `↑ ${(Number(idealRange.low) - weightKg).toFixed(1)} kg to ideal` :
                       weightKg > Number(idealRange.high) ? `↓ ${(weightKg - Number(idealRange.high)).toFixed(1)} kg to ideal` : '✓ In ideal range'}
                    </span>
                  )}
                </div>
              )}
              <svg className="cn-chart" width="100%" height="180" viewBox="0 0 600 180" preserveAspectRatio="none" style={{ display: 'block' }}>
                <defs>
                  <linearGradient id="line-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <polyline fill="none" stroke="var(--accent)" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round"
                  points={chartPoints.map(p => `${p.x},${p.y}`).join(' ')} />
                {chartPoints.map((p, i) => (
                  <g key={i}>
                    <circle cx={p.x} cy={p.y} r="5" fill="var(--accent)" />
                    <circle cx={p.x} cy={p.y} r="9" fill="var(--accent)" opacity="0.12" />
                    <text x={p.x} y={p.y - 14} textAnchor="middle" fill="var(--text3)" fontSize="10">{p.weight}kg</text>
                  </g>
                ))}
              </svg>
            </>
          ) : (
            <p style={{ fontSize: '0.85rem', color: 'var(--text3)' }}>No data yet. Calculate BMI in the Exercise page to populate your chart.</p>
          )}
        </div>

        {/* ── Activity & Lifestyle ── */}
        <div className="cn-card" style={card}>
          <h3 className="cn-h2" style={{ marginBottom: '1.5rem' }}>🏃 Activity & Lifestyle</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem' }}>
            <StatTile label="Activity Level" value={ACTIVITY_LABEL[activity] || activity} />
            <StatTile label="Sleep / Night"  value={fmt(sleepHours, 'h')} accent={sleep?.color} sub={sleep?.label || ''} />
            <StatTile label="Fitness Goal"   value={goalMeta.label} accent={goalMeta.color} />
            {genetic && <StatTile label="Health Note" value={genetic} />}
          </div>

          <div style={{ marginTop: '1.25rem' }}>
            <BarRow
              label="Activity Multiplier"
              pct={((ACTIVITY_MULT[activity] || 1.55) - 1.2) / (1.9 - 1.2) * 100}
              right={`×${ACTIVITY_MULT[activity] || 1.55}`}
              color="#60a5fa"
            />
            {sleepHours > 0 && (
              <BarRow
                label="Sleep Score"
                pct={sleep?.score || 0}
                right={`${sleep?.score || 0}%`}
                color={sleep?.color || '#c8f04a'}
              />
            )}
            {bodyFat > 0 && (
              <BarRow
                label="Body Fat %"
                pct={Math.min(bodyFat * 2, 100)}
                right={`${bodyFat}%`}
                color={fatCat?.color || '#c8f04a'}
              />
            )}
          </div>
        </div>

        {/* ── Motivational Card ── */}
        {showMotivate && (
          <motion.div className="cn-card cn-card-accent" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {bmiValue < 18.5 ? (
              <>
                <div className="cn-h3" style={{ marginBottom: '0.5rem' }}>You've got this 💪</div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text2)', lineHeight: 1.65 }}>Consistency builds strength. Add nutrient-dense meals and progressive training — small steps, strong results.</p>
              </>
            ) : (
              <>
                <div className="cn-h3" style={{ marginBottom: '0.5rem' }}>Keep moving, you're not alone 🚀</div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text2)', lineHeight: 1.65 }}>Focus on balanced meals, daily walks, and quality sleep. Your future self will thank you.</p>
              </>
            )}
          </motion.div>
        )}
      </div>
    </CinematicLayout>
  );
}
