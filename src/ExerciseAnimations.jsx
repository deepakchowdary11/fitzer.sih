import React from 'react';

/* ── Color System ── */
const ACCENT = '#ff6b35';     // Electric neon lime accent
const MUSCLE = '#ff5555';     // Muscle engagement glow red/pink
const BONE   = '#f8fafc';     // Clean off-white limbs
const JOINT  = '#38bdf8';     // Cyan joint pivot points
const GRID   = 'rgba(255,255,255,0.06)';

/* ── Keyframe Animations CSS ── */
const STYLES = `
/* Push-up: Arm flexion & chest drop */
@keyframes real-pushup-arm {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(70deg); }
}
@keyframes real-pushup-forearm {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(-50deg); }
}
@keyframes real-pushup-body {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(32px) rotate(2deg); }
}

/* Squat: Hip hinge + deep knee bend */
@keyframes real-squat-torso {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(48px) rotate(18deg); }
}
@keyframes real-squat-thigh {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(-80deg); }
}
@keyframes real-squat-shin {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(75deg); }
}
@keyframes real-squat-arm {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(-70deg); }
}

/* Lunges: Front & back knee flexion */
@keyframes real-lunge-body {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(42px); }
}
@keyframes real-lunge-front-thigh {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(-45deg); }
}
@keyframes real-lunge-front-shin {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(45deg); }
}
@keyframes real-lunge-back-thigh {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(40deg); }
}
@keyframes real-lunge-back-shin {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(-45deg); }
}

/* Jumping Jacks: Synchronized arm abduction & leg stride */
@keyframes jack-arm-left {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(-140deg); }
}
@keyframes jack-arm-right {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(140deg); }
}
@keyframes jack-leg-left {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(-25deg); }
}
@keyframes jack-leg-right {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(25deg); }
}

/* Mountain Climbers: Rapid alternating knee tucks */
@keyframes climber-knee-left {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(-65deg); }
}
@keyframes climber-knee-right {
  0%, 50%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-65deg); }
}

/* Burpee: Drop down -> Plank -> Jump up */
@keyframes burpee-cycle {
  0%, 15% { transform: translateY(0) scale(1); }
  35%, 65% { transform: translateY(85px) scale(0.7) rotate(25deg); }
  85%, 100% { transform: translateY(-30px) scale(1.05); }
}

/* Plank: Isomeric micro-pulse & core glow */
@keyframes plank-breath {
  0%, 100% { transform: translateY(0px); opacity: 1; }
  50% { transform: translateY(-2px); opacity: 0.88; }
}

/* Muscle glow pulse */
@keyframes muscle-pulse {
  0%, 100% { opacity: 0.35; transform: scale(1); }
  50% { opacity: 0.85; transform: scale(1.15); }
}

/* Ground shadow expansion */
@keyframes shadow-scale {
  0%, 100% { transform: scaleX(1); opacity: 0.4; }
  50% { transform: scaleX(1.3); opacity: 0.7; }
}
`;

function useInjectStyles() {
  React.useEffect(() => {
    const id = 'real-biomech-styles';
    if (!document.getElementById(id)) {
      const el = document.createElement('style');
      el.id = id;
      el.textContent = STYLES;
      document.head.appendChild(el);
    }
  }, []);
}

/* ── SVG Canvas Base ── */
function Canvas({ children, title, subtitle, targetMuscle }) {
  useInjectStyles();
  return (
    <div style={{ position: 'relative', width: 260, height: 260, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg viewBox="0 0 260 240" width="260" height="240" style={{ overflow: 'visible' }}>
        {/* Background Grid */}
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke={GRID} strokeWidth="0.8" />
        </pattern>
        <rect width="260" height="240" fill="url(#grid)" rx="12" />

        {/* Floor Line */}
        <line x1="20" y1="210" x2="240" y2="210" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeDasharray="4 4" />
        
        {children}
      </svg>
      
      {/* Target Muscle Badge */}
      <div style={{ marginTop: '0.4rem', fontSize: '0.68rem', fontWeight: 800, color: ACCENT, background: 'rgba(255,107,53,0.08)', border: '1px solid rgba(255,107,53,0.25)', borderRadius: 20, padding: '0.2rem 0.65rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        Active Muscles: {targetMuscle}
      </div>
    </div>
  );
}

/* ── Anatomical Joint Node ── */
const Joint = ({ cx, cy, r = 3.5, color = JOINT }) => (
  <circle cx={cx} cy={cy} r={r} fill={color} stroke="#0f172a" strokeWidth="1.5" />
);

/* ── Muscle Glow Aura ── */
const MuscleGlow = ({ cx, cy, r = 14 }) => (
  <circle cx={cx} cy={cy} r={r} fill={MUSCLE} style={{ animation: 'muscle-pulse 1.8s ease-in-out infinite', filter: 'blur(6px)' }} />
);

/* ════════════════════════════════════════════════════════════
   1. STANDARD PUSH-UPS (Side View with Joint Articulation)
════════════════════════════════════════════════════════════ */
export function PushUpAnim() {
  return (
    <Canvas targetMuscle="Chest, Triceps, Core">
      {/* Dynamic Ground Shadow */}
      <ellipse cx="130" cy="210" rx="70" ry="6" fill="#000" style={{ animation: 'shadow-scale 1.8s ease-in-out infinite' }} />

      {/* Main Body Pivot Group */}
      <g style={{ transformOrigin: '200px 200px', animation: 'real-pushup-body 1.8s ease-in-out infinite' }}>
        {/* Chest Muscle Glow */}
        <MuscleGlow cx="85" cy="148" r="16" />

        {/* Head & Neck */}
        <circle cx="55" cy="138" r="13" fill="none" stroke={BONE} strokeWidth="3" />
        <line x1="68" y1="142" x2="80" y2="148" stroke={BONE} strokeWidth="3" />

        {/* Torso & Spine */}
        <line x1="80" y1="148" x2="145" y2="168" stroke={ACCENT} strokeWidth="6" strokeLinecap="round" />

        {/* Legs & Feet */}
        <line x1="145" y1="168" x2="200" y2="200" stroke={BONE} strokeWidth="5" strokeLinecap="round" />
        <line x1="200" y1="200" x2="210" y2="210" stroke={BONE} strokeWidth="3" />

        {/* Arms (Upper Arm & Forearm) */}
        <g style={{ transformOrigin: '80px 148px', animation: 'real-pushup-arm 1.8s ease-in-out infinite' }}>
          <line x1="80" y1="148" x2="80" y2="182" stroke={BONE} strokeWidth="4.5" strokeLinecap="round" />
          <g style={{ transformOrigin: '80px 182px', animation: 'real-pushup-forearm 1.8s ease-in-out infinite' }}>
            <line x1="80" y1="182" x2="80" y2="210" stroke={BONE} strokeWidth="4" strokeLinecap="round" />
            <Joint cx="80" cy="210" r={4} color={ACCENT} />
          </g>
          <Joint cx="80" cy="182" />
        </g>

        {/* Joints */}
        <Joint cx="80" cy="148" color={ACCENT} /> {/* Shoulder */}
        <Joint cx="145" cy="168" />              {/* Hip */}
        <Joint cx="200" cy="200" />              {/* Ankle */}
      </g>
    </Canvas>
  );
}

/* ════════════════════════════════════════════════════════════
   2. BODYWEIGHT SQUATS (Side Profile Hip & Knee Biomechanics)
════════════════════════════════════════════════════════════ */
export function SquatAnim() {
  return (
    <Canvas targetMuscle="Quadriceps, Glutes, Hamstrings">
      <ellipse cx="130" cy="210" rx="45" ry="6" fill="#000" style={{ animation: 'shadow-scale 2.2s ease-in-out infinite' }} />

      {/* Lower Leg / Feet (Grounded) */}
      <g style={{ transformOrigin: '140px 210px', animation: 'real-squat-shin 2.2s ease-in-out infinite' }}>
        <line x1="140" y1="210" x2="155" y2="155" stroke={BONE} strokeWidth="5.5" strokeLinecap="round" />
        <line x1="140" y1="210" x2="120" y2="210" stroke={BONE} strokeWidth="4" /> {/* Foot */}

        {/* Thigh (Rotates backward at knee) */}
        <g style={{ transformOrigin: '155px 155px', animation: 'real-squat-thigh 2.2s ease-in-out infinite' }}>
          {/* Quad Muscle Glow */}
          <MuscleGlow cx="130" cy="120" r="18" />
          <line x1="155" y1="155" x2="110" y2="105" stroke={ACCENT} strokeWidth="7" strokeLinecap="round" />

          {/* Torso & Head (Hinges forward at hip) */}
          <g style={{ transformOrigin: '110px 105px', animation: 'real-squat-torso 2.2s ease-in-out infinite' }}>
            <line x1="110" y1="105" x2="125" y2="40" stroke={BONE} strokeWidth="6" strokeLinecap="round" />
            <circle cx="132" cy="24" r="14" fill="none" stroke={BONE} strokeWidth="3" />

            {/* Arms Outstretched for Balance */}
            <g style={{ transformOrigin: '122px 52px', animation: 'real-squat-arm 2.2s ease-in-out infinite' }}>
              <line x1="122" y1="52" x2="70" y2="52" stroke={BONE} strokeWidth="4" strokeLinecap="round" />
              <Joint cx="70" cy="52" color={ACCENT} />
            </g>

            <Joint cx="122" cy="52" color={ACCENT} /> {/* Shoulder */}
          </g>

          <Joint cx="110" cy="105" /> {/* Hip */}
        </g>

        <Joint cx="155" cy="155" color={ACCENT} /> {/* Knee */}
      </g>
      <Joint cx="140" cy="210" /> {/* Ankle */}
    </Canvas>
  );
}

/* ════════════════════════════════════════════════════════════
   3. FORWARD LUNGES (Dual Knee 90° Flexion)
════════════════════════════════════════════════════════════ */
export function LungeAnim() {
  return (
    <Canvas targetMuscle="Glutes, Quads, Calves">
      <ellipse cx="130" cy="210" rx="65" ry="6" fill="#000" />

      {/* Main Body Dropping Vertically */}
      <g style={{ animation: 'real-lunge-body 2.2s ease-in-out infinite' }}>
        {/* Torso & Head */}
        <line x1="130" y1="60" x2="130" y2="120" stroke={BONE} strokeWidth="6" strokeLinecap="round" />
        <circle cx="130" cy="44" r="14" fill="none" stroke={BONE} strokeWidth="3" />
        
        {/* Arms on Hips */}
        <path d="M 130 72 L 112 90 L 130 115" fill="none" stroke={BONE} strokeWidth="3.5" />

        {/* Front Leg (Step Forward) */}
        <g style={{ transformOrigin: '130px 120px', animation: 'real-lunge-front-thigh 2.2s ease-in-out infinite' }}>
          <MuscleGlow cx="100" cy="135" r="14" />
          <line x1="130" y1="120" x2="80" y2="150" stroke={ACCENT} strokeWidth="6" strokeLinecap="round" />
          <g style={{ transformOrigin: '80px 150px', animation: 'real-lunge-front-shin 2.2s ease-in-out infinite' }}>
            <line x1="80" y1="150" x2="80" y2="210" stroke={BONE} strokeWidth="5" strokeLinecap="round" />
            <Joint cx="80" cy="150" color={ACCENT} /> {/* Front Knee */}
          </g>
        </g>

        {/* Back Leg (Trailing) */}
        <g style={{ transformOrigin: '130px 120px', animation: 'real-lunge-back-thigh 2.2s ease-in-out infinite' }}>
          <line x1="130" y1="120" x2="175" y2="155" stroke={BONE} strokeWidth="5.5" strokeLinecap="round" />
          <g style={{ transformOrigin: '175px 155px', animation: 'real-lunge-back-shin 2.2s ease-in-out infinite' }}>
            <line x1="175" y1="155" x2="190" y2="208" stroke={BONE} strokeWidth="4.5" strokeLinecap="round" />
            <Joint cx="175" cy="155" /> {/* Back Knee */}
          </g>
        </g>

        <Joint cx="130" cy="120" color={ACCENT} /> {/* Hip */}
      </g>
    </Canvas>
  );
}

/* ════════════════════════════════════════════════════════════
   4. JUMPING JACKS (Synchronized Full Body Abduction)
════════════════════════════════════════════════════════════ */
export function JumpingJacksAnim() {
  return (
    <Canvas targetMuscle="Full Body, Calves, Deltoids">
      <ellipse cx="130" cy="210" rx="50" ry="6" fill="#000" style={{ animation: 'shadow-scale 1s ease-in-out infinite' }} />

      {/* Torso & Head */}
      <line x1="130" y1="50" x2="130" y2="130" stroke={BONE} strokeWidth="6" strokeLinecap="round" />
      <circle cx="130" cy="34" r="14" fill="none" stroke={BONE} strokeWidth="3" />
      <MuscleGlow cx="130" cy="90" r="16" />

      {/* Left Arm */}
      <g style={{ transformOrigin: '130px 60px', animation: 'jack-arm-left 1s ease-in-out infinite' }}>
        <line x1="130" y1="60" x2="100" y2="120" stroke={ACCENT} strokeWidth="4.5" strokeLinecap="round" />
        <Joint cx="100" cy="120" />
      </g>

      {/* Right Arm */}
      <g style={{ transformOrigin: '130px 60px', animation: 'jack-arm-right 1s ease-in-out infinite' }}>
        <line x1="130" y1="60" x2="160" y2="120" stroke={ACCENT} strokeWidth="4.5" strokeLinecap="round" />
        <Joint cx="160" cy="120" />
      </g>

      {/* Left Leg */}
      <g style={{ transformOrigin: '130px 130px', animation: 'jack-leg-left 1s ease-in-out infinite' }}>
        <line x1="130" y1="130" x2="110" y2="210" stroke={BONE} strokeWidth="5" strokeLinecap="round" />
        <Joint cx="110" cy="210" />
      </g>

      {/* Right Leg */}
      <g style={{ transformOrigin: '130px 130px', animation: 'jack-leg-right 1s ease-in-out infinite' }}>
        <line x1="130" y1="130" x2="150" y2="210" stroke={BONE} strokeWidth="5" strokeLinecap="round" />
        <Joint cx="150" cy="210" />
      </g>

      <Joint cx="130" cy="60" color={ACCENT} />
      <Joint cx="130" cy="130" color={ACCENT} />
    </Canvas>
  );
}

/* ════════════════════════════════════════════════════════════
   5. PLANK HOLD (Isometric Core & Alignment)
════════════════════════════════════════════════════════════ */
export function PlankAnim() {
  return (
    <Canvas targetMuscle="Core Abs, Obliques, Shoulders">
      <ellipse cx="130" cy="210" rx="75" ry="6" fill="#000" />

      <g style={{ animation: 'plank-breath 2.5s ease-in-out infinite' }}>
        {/* Core Glow */}
        <MuscleGlow cx="120" cy="165" r="20" />

        {/* Head */}
        <circle cx="50" cy="150" r="13" fill="none" stroke={BONE} strokeWidth="3" />

        {/* Spine Line */}
        <line x1="62" y1="155" x2="180" y2="175" stroke={ACCENT} strokeWidth="6" strokeLinecap="round" />

        {/* Forearms Grounded */}
        <line x1="75" y1="158" x2="75" y2="200" stroke={BONE} strokeWidth="5" strokeLinecap="round" />
        <line x1="75" y1="200" x2="50" y2="200" stroke={BONE} strokeWidth="4" strokeLinecap="round" />

        {/* Feet Grounded */}
        <line x1="180" y1="175" x2="210" y2="200" stroke={BONE} strokeWidth="5" strokeLinecap="round" />
        <line x1="210" y1="200" x2="218" y2="208" stroke={BONE} strokeWidth="3" />

        <Joint cx="75" cy="158" color={ACCENT} /> {/* Shoulder */}
        <Joint cx="75" cy="200" color={ACCENT} /> {/* Elbow */}
        <Joint cx="180" cy="175" color={ACCENT} />{/* Hip */}
      </g>
    </Canvas>
  );
}

/* ════════════════════════════════════════════════════════════
   6. MOUNTAIN CLIMBERS (Dynamic Alternating Knee Drives)
════════════════════════════════════════════════════════════ */
export function MountainClimberAnim() {
  return (
    <Canvas targetMuscle="Abs, Hip Flexors, Shoulders">
      <ellipse cx="130" cy="210" rx="70" ry="6" fill="#000" />

      {/* Upper Body (Plank Stance) */}
      <circle cx="55" cy="140" r="13" fill="none" stroke={BONE} strokeWidth="3" />
      <line x1="75" y1="148" x2="75" y2="205" stroke={BONE} strokeWidth="5" strokeLinecap="round" />
      <line x1="75" y1="148" x2="165" y2="162" stroke={BONE} strokeWidth="6" strokeLinecap="round" />
      <MuscleGlow cx="120" cy="155" r="18" />

      {/* Left Driving Knee */}
      <g style={{ transformOrigin: '165px 162px', animation: 'climber-knee-left 0.8s linear infinite' }}>
        <line x1="165" y1="162" x2="110" y2="175" stroke={ACCENT} strokeWidth="5.5" strokeLinecap="round" />
        <line x1="110" y1="175" x2="100" y2="205" stroke={BONE} strokeWidth="4.5" strokeLinecap="round" />
        <Joint cx="110" cy="175" color={ACCENT} />
      </g>

      {/* Right Trailing Leg */}
      <g style={{ transformOrigin: '165px 162px', animation: 'climber-knee-right 0.8s linear infinite' }}>
        <line x1="165" y1="162" x2="205" y2="205" stroke={BONE} strokeWidth="5" strokeLinecap="round" />
        <Joint cx="205" cy="205" />
      </g>

      <Joint cx="75" cy="148" color={ACCENT} />
      <Joint cx="165" cy="162" color={ACCENT} />
    </Canvas>
  );
}

/* ════════════════════════════════════════════════════════════
   7. BURPEES (Explosive Multi-phase Motion)
════════════════════════════════════════════════════════════ */
export function BurpeeAnim() {
  return (
    <Canvas targetMuscle="Full Body Explosive, Cardio">
      <ellipse cx="130" cy="210" rx="55" ry="6" fill="#000" style={{ animation: 'shadow-scale 2.5s ease-in-out infinite' }} />

      <g style={{ transformOrigin: '130px 210px', animation: 'burpee-cycle 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite' }}>
        <MuscleGlow cx="130" cy="100" r="22" />
        <line x1="130" y1="60" x2="130" y2="140" stroke={ACCENT} strokeWidth="6" strokeLinecap="round" />
        <circle cx="130" cy="42" r="14" fill="none" stroke={BONE} strokeWidth="3" />

        {/* Arms Jumping Up */}
        <line x1="130" y1="70" x2="105" y2="25" stroke={BONE} strokeWidth="4.5" strokeLinecap="round" />
        <line x1="130" y1="70" x2="155" y2="25" stroke={BONE} strokeWidth="4.5" strokeLinecap="round" />

        {/* Legs Stance */}
        <line x1="130" y1="140" x2="115" y2="210" stroke={BONE} strokeWidth="5" strokeLinecap="round" />
        <line x1="130" y1="140" x2="145" y2="210" stroke={BONE} strokeWidth="5" strokeLinecap="round" />

        <Joint cx="130" cy="70" color={ACCENT} />
        <Joint cx="130" cy="140" color={ACCENT} />
      </g>
    </Canvas>
  );
}

/* ════════════════════════════════════════════════════════════
   8. WALL PUSH-UPS (Angled Wall Press)
════════════════════════════════════════════════════════════ */
export function WallPushUpAnim() {
  return (
    <Canvas targetMuscle="Upper Chest, Front Shoulders">
      {/* Wall representation */}
      <line x1="40" y1="20" x2="40" y2="220" stroke="rgba(200, 240, 74, 0.4)" strokeWidth="4" />
      <ellipse cx="140" cy="210" rx="50" ry="5" fill="#000" />

      <g style={{ transformOrigin: '180px 200px', animation: 'real-pushup-arm 2s ease-in-out infinite' }}>
        <MuscleGlow cx="85" cy="115" r="15" />
        <line x1="100" y1="110" x2="180" y2="200" stroke={ACCENT} strokeWidth="6" strokeLinecap="round" />
        <circle cx="85" cy="95" r="13" fill="none" stroke={BONE} strokeWidth="3" />

        {/* Hands touching wall */}
        <line x1="100" y1="110" x2="40" y2="120" stroke={BONE} strokeWidth="4.5" strokeLinecap="round" />
        <Joint cx="40" cy="120" color={ACCENT} />
        <Joint cx="100" cy="110" color={ACCENT} />
      </g>
    </Canvas>
  );
}

/* ════════════════════════════════════════════════════════════
   FALLBACK / GENERIC EXERCISE VISUALIZER
════════════════════════════════════════════════════════════ */
export function DefaultExerciseAnim() {
  return <SquatAnim />;
}

/* ── Exercise Router Map ── */
const ANIM_MAP = {
  // ── 15 Approved Exercises ──
  'bicep-curl':               PushUpAnim,
  'squats':                   SquatAnim,
  'push-ups':                 PushUpAnim,
  'plank':                    PlankAnim,
  'lunges':                   LungeAnim,
  'shoulder-press':           PushUpAnim,
  'glute-bridge':             PlankAnim,
  'mountain-climbers':        MountainClimberAnim,
  'jumping-jacks':            JumpingJacksAnim,
  'high-knees':               JumpingJacksAnim,
  'side-lunges':              LungeAnim,
  'side-leg-raises':          PlankAnim,
  'wall-sit':                 SquatAnim,
  'standing-knee-to-elbow':   MountainClimberAnim,
  'arm-circles':              JumpingJacksAnim,
  // ── Legacy / fallback mappings ──
  'wall-push-ups':            WallPushUpAnim,
  'chair-squats':             SquatAnim,
};

export function ExerciseAnimation({ exerciseId }) {
  const Component = ANIM_MAP[exerciseId] || DefaultExerciseAnim;
  return <Component />;
}
