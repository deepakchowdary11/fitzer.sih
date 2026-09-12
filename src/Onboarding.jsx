import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, CheckCircle2, ChevronRight, ChevronLeft, 
  Activity, ShieldCheck, Dumbbell, Zap, Heart, Brain, 
  Flame, Check, Loader2 
} from 'lucide-react';
import { CinematicLayout, Kicker } from './CinematicLayout';
import { useAuth } from './AuthContext';
import { useBMI } from './BMIContext';
import { generatePersonalizedQuestions, FALLBACK_QUESTIONS } from './services/onboardingAI';

export default function Onboarding() {
  const { user } = useAuth();
  const { bmiData, updateBMI } = useBMI();

  const [step, setStep] = useState(0); // 0 = Gender selection, 1-7 = Questions, 8 = Environment Creation Animation
  const [gender, setGender] = useState('male');
  const [questions, setQuestions] = useState(FALLBACK_QUESTIONS.male);
  const [answers, setAnswers] = useState({
    gender: 'male',
    gender_age: '26-35',
    primary_goal: 'build_muscle',
    exercise_capability: 'intermediate',
    workout_frequency: 'moderate',
    focus_exercises: ['upper_body', 'core'],
    sleep_recovery: '7_9',
    nutrition_approach: 'high_protein_nonveg'
  });
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Environment Creation Telemetry State
  const [envProgress, setEnvProgress] = useState(0);
  const [envStatus, setEnvStatus] = useState('Initializing Neural Network...');

  // Update gender and fetch dynamic Groq questions
  const handleGenderSelect = async (selectedGender) => {
    setGender(selectedGender);
    setAnswers(prev => ({ ...prev, gender: selectedGender }));
    setIsAiLoading(true);

    try {
      const dynamicQuestions = await generatePersonalizedQuestions(selectedGender, user?.name || 'Athlete');
      setQuestions(dynamicQuestions);
    } catch (err) {
      console.warn('Using curated question fallback', err);
      setQuestions(FALLBACK_QUESTIONS[selectedGender] || FALLBACK_QUESTIONS.male);
    } finally {
      setIsAiLoading(false);
      setStep(1); // Move to Question 1
    }
  };

  const currentQIndex = step - 1;
  const currentQuestion = questions[currentQIndex];

  const handleSingleSelect = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleMultiSelect = (questionId, value) => {
    setAnswers(prev => {
      const currentList = Array.isArray(prev[questionId]) ? prev[questionId] : [];
      const exists = currentList.includes(value);
      const updated = exists 
        ? currentList.filter(item => item !== value)
        : [...currentList, value];
      return { ...prev, [questionId]: updated.length > 0 ? updated : [value] };
    });
  };

  const handleNext = () => {
    if (step < 7) {
      setStep(step + 1);
    } else {
      // Complete Questionnaire -> Trigger Environment Creation
      startEnvironmentCreation();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else if (step === 1) {
      setStep(0);
    }
  };

  // Environment Synthesis Animation sequence
  const startEnvironmentCreation = () => {
    setStep(8);
    setEnvProgress(5);
    setEnvStatus('Analyzing Biomechanical & Metabolic Profile...');

    const stages = [
      { progress: 25, status: 'Calibrating 2D Neural Vision & Pose Landmark Models...', delay: 900 },
      { progress: 52, status: 'Synthesizing Adaptive Calorie & Macro Distribution...', delay: 1800 },
      { progress: 78, status: 'Configuring GigaChat AI Athletic Assistant...', delay: 2700 },
      { progress: 95, status: 'Locking Personal Records & Posture Telemetry...', delay: 3500 },
      { progress: 100, status: 'Personalized Environment Ready!', delay: 4200 }
    ];

    stages.forEach(stage => {
      setTimeout(() => {
        setEnvProgress(stage.progress);
        setEnvStatus(stage.status);
      }, stage.delay);
    });

    // Finalize Profile & Redirect to Exercise Hub
    setTimeout(() => {
      finalizeProfileData();
      window.location.hash = '#/exercise';
    }, 4900);
  };

  const finalizeProfileData = () => {
    // Map answers to BMI context and persistent storage
    const updated = {
      ...bmiData,
      gender: answers.gender || 'male',
      fitnessGoal: answers.primary_goal || 'build_muscle',
      activityLevel: answers.workout_frequency || 'moderate',
      sleepHours: answers.sleep_recovery === 'under_6' ? 5.5 : answers.sleep_recovery === '6_7' ? 6.5 : answers.sleep_recovery === '9_plus' ? 9.5 : 8,
      dietaryPreference: answers.nutrition_approach || 'high_protein_nonveg',
      focusAreas: answers.focus_exercises || ['upper_body', 'core'],
      experienceLevel: answers.exercise_capability || 'intermediate'
    };

    updateBMI(updated, user?.id);

    try {
      if (user?.id) {
        localStorage.setItem(`fitzer_onboarding_completed_${user.id}`, 'true');
        localStorage.setItem(`fitzer.onboarding.${user.id}`, JSON.stringify(answers));
        localStorage.setItem(`fitzer.bmi.${user.id}`, JSON.stringify(updated));
      }
      localStorage.setItem('fitzer.onboarding', JSON.stringify(answers));
      localStorage.setItem('fitzer.bmi', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save onboarding data', e);
    }
  };

  return (
    <CinematicLayout>
      <div className="cn-content" style={{ maxWidth: 880, width: '100%', margin: '0 auto' }}>
        
        {/* ── STEP 8: Cinematic Environment Creation Animation ── */}
        {step === 8 ? (
          <div style={{ minHeight: 520, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              style={{ position: 'relative', width: 220, height: 220, marginBottom: '2.5rem' }}
            >
              {/* Outer pulsing neon orbital ring */}
              <div 
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  border: '3px solid rgba(255,107,53,0.2)',
                  borderTopColor: 'var(--accent)',
                  borderRightColor: '#ff8c61',
                  animation: 'spin 2.2s linear infinite',
                  boxShadow: '0 0 40px rgba(255,107,53,0.35)'
                }}
              />
              {/* Inner counter-rotating ring */}
              <div 
                style={{
                  position: 'absolute',
                  inset: 22,
                  borderRadius: '50%',
                  border: '2px dashed rgba(255,255,255,0.25)',
                  borderBottomColor: 'var(--accent)',
                  animation: 'spin 3.5s linear infinite reverse'
                }}
              />
              {/* Center Core Pulse */}
              <div
                style={{
                  position: 'absolute',
                  inset: 48,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(255,107,53,0.3) 0%, rgba(10,10,16,0.9) 80%)',
                  border: '1px solid rgba(255,107,53,0.5)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 0 25px rgba(255,107,53,0.4)'
                }}
              >
                <Brain size={34} color="var(--accent)" style={{ animation: 'aiPulse 1.2s infinite' }} />
                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.4rem', fontWeight: 900, color: '#fff', marginTop: '0.2rem' }}>
                  {envProgress}%
                </div>
              </div>
            </motion.div>

            <motion.div
              key={envStatus}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,107,53,0.1)', padding: '0.35rem 0.9rem', borderRadius: 999, border: '1px solid rgba(255,107,53,0.3)', marginBottom: '1rem' }}>
                <span className="cn-beacon" style={{ background: 'var(--accent)' }} />
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Neural Environment Synthesis
                </span>
              </div>
              <h2 className="cn-h2" style={{ fontSize: '1.9rem', marginBottom: '0.6rem' }}>
                Creating Your Personalized Environment
              </h2>
              <p style={{ color: 'var(--text2)', fontSize: '0.95rem', maxWidth: 520, margin: '0 auto', minHeight: '1.6rem' }}>
                {envStatus}
              </p>
            </motion.div>

            {/* Glowing progress bar */}
            <div style={{ width: '100%', maxWidth: 460, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 999, overflow: 'hidden', marginTop: '2.5rem', border: '1px solid rgba(255,255,255,0.08)' }}>
              <motion.div
                style={{ height: '100%', background: 'var(--grad-btn)', borderRadius: 999, boxShadow: '0 0 15px var(--accent)' }}
                animate={{ width: `${envProgress}%` }}
                transition={{ ease: 'easeOut', duration: 0.5 }}
              />
            </div>
          </div>
        ) : step === 0 ? (
          /* ── STEP 0: Welcome & Biological Profile Selection ── */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
          >
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <Kicker num="01" label="Athlete Onboarding" />
              <h1 className="cn-h1" style={{ fontSize: '2.4rem', marginBottom: '0.5rem' }}>
                Welcome to Fitzer, {user?.name || 'Athlete'}!
              </h1>
              <p style={{ color: 'var(--text2)', fontSize: '0.95rem', maxWidth: 580, margin: '0 auto', lineHeight: 1.6 }}>
                Let’s customize your AI camera posture detection, diet targets, and workout intensity. Select your biological profile to begin.
              </p>
            </div>

            <div
              className="cn-glow-card"
              style={{
                padding: '2.5rem 2rem',
                border: '1px solid rgba(255,107,53,0.25)',
                borderRadius: 20,
                maxWidth: 680,
                margin: '0 auto'
              }}
            >
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', textAlign: 'center', marginBottom: '1.75rem', fontFamily: "'Outfit', sans-serif" }}>
                Select Your Biological Profile
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                {[
                  {
                    id: 'male',
                    label: 'Male Athlete',
                    desc: 'Calibrated for upper body hypertrophy, compound biomechanics & strength',
                    icon: '🏋️‍♂️',
                    color: '#ff6b35'
                  },
                  {
                    id: 'female',
                    label: 'Female Athlete',
                    desc: 'Calibrated for glute/core toning, joint longevity & athletic definition',
                    icon: '🏃‍♀️',
                    color: '#ff8c61'
                  }
                ].map(item => (
                  <div
                    key={item.id}
                    onClick={() => handleGenderSelect(item.id)}
                    style={{
                      padding: '1.75rem 1.4rem',
                      borderRadius: 16,
                      background: gender === item.id ? 'rgba(255,107,53,0.12)' : 'rgba(255,255,255,0.03)',
                      border: `1.5px solid ${gender === item.id ? 'var(--accent)' : 'rgba(255,255,255,0.08)'}`,
                      cursor: 'pointer',
                      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                      textAlign: 'center',
                      boxShadow: gender === item.id ? '0 8px 30px rgba(255,107,53,0.2)' : 'none'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.borderColor = 'var(--accent)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = gender === item.id ? 'var(--accent)' : 'rgba(255,255,255,0.08)';
                    }}
                  >
                    <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>{item.icon}</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginBottom: '0.4rem', fontFamily: "'Outfit', sans-serif" }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text2)', lineHeight: 1.5 }}>
                      {item.desc}
                    </div>
                  </div>
                ))}
              </div>

              {isAiLoading && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', color: 'var(--accent)', fontSize: '0.88rem', padding: '0.75rem' }}>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Groq AI Neural Engine tailoring your 7-question assessment...</span>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          /* ── STEPS 1-7: Dynamic 7-Question Assessment ── */
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header with Progress Bar */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <Kicker num={`0${step}`} label={currentQuestion?.category || 'Assessment'} />
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent)', fontFamily: "'Outfit', sans-serif" }}>
                  Question {step} of 7
                </span>
              </div>

              {/* Progress Bar */}
              <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 999, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div 
                  style={{ 
                    height: '100%', 
                    width: `${(step / 7) * 100}%`, 
                    background: 'var(--grad-btn)', 
                    borderRadius: 999,
                    transition: 'width 0.4s ease',
                    boxShadow: '0 0 12px var(--accent)'
                  }} 
                />
              </div>
            </div>

            {/* Question Card */}
            <div
              className="cn-glow-card"
              style={{
                padding: '2.5rem 2.2rem',
                border: '1px solid rgba(255,107,53,0.25)',
                borderRadius: 20,
                boxShadow: '0 20px 50px rgba(0,0,0,0.7)',
                position: 'relative'
              }}
            >
              <div style={{ marginBottom: '2rem' }}>
                <h2 className="cn-h2" style={{ fontSize: '1.75rem', lineHeight: 1.3, marginBottom: '0.4rem' }}>
                  {currentQuestion?.question}
                </h2>
                {currentQuestion?.subtitle && (
                  <p style={{ color: 'var(--text2)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                    {currentQuestion.subtitle}
                  </p>
                )}
              </div>

              {/* Options Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
                {currentQuestion?.options?.map(opt => {
                  const isSelected = currentQuestion.type === 'multi'
                    ? Array.isArray(answers[currentQuestion.id]) && answers[currentQuestion.id].includes(opt.value)
                    : answers[currentQuestion.id] === opt.value;

                  return (
                    <div
                      key={opt.value}
                      onClick={() => {
                        if (currentQuestion.type === 'multi') {
                          handleMultiSelect(currentQuestion.id, opt.value);
                        } else {
                          handleSingleSelect(currentQuestion.id, opt.value);
                        }
                      }}
                      style={{
                        padding: '1.25rem 1.4rem',
                        borderRadius: 14,
                        background: isSelected ? 'rgba(255,107,53,0.12)' : 'rgba(255,255,255,0.03)',
                        border: `1.5px solid ${isSelected ? 'var(--accent)' : 'rgba(255,255,255,0.08)'}`,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        transition: 'all 0.2s ease',
                        boxShadow: isSelected ? '0 4px 20px rgba(255,107,53,0.25)' : 'none'
                      }}
                      onMouseEnter={e => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = 'rgba(255,107,53,0.4)';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }
                      }}
                      onMouseLeave={e => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }
                      }}
                    >
                      <div style={{ fontSize: '1.8rem', minWidth: '2.5rem', textAlign: 'center' }}>
                        {opt.icon || '🎯'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.98rem', fontWeight: 700, color: isSelected ? '#fff' : 'var(--text)', marginBottom: '0.2rem' }}>
                          {opt.label}
                        </div>
                        {opt.desc && (
                          <div style={{ fontSize: '0.78rem', color: 'var(--text3)', lineHeight: 1.4 }}>
                            {opt.desc}
                          </div>
                        )}
                      </div>
                      <div
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: currentQuestion.type === 'multi' ? 6 : '50%',
                          border: `2px solid ${isSelected ? 'var(--accent)' : 'rgba(255,255,255,0.2)'}`,
                          background: isSelected ? 'var(--accent)' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {isSelected && <Check size={14} color="#fff" strokeWidth={3} />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Navigation Controls */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={handleBack}
                  className="cn-btn-ghost"
                  style={{ padding: '0.75rem 1.4rem', fontSize: '0.88rem', gap: '0.4rem' }}
                >
                  <ChevronLeft size={16} /> Back
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="cn-btn"
                  style={{ padding: '0.75rem 1.8rem', fontSize: '0.9rem', gap: '0.5rem', minWidth: 140 }}
                >
                  {step === 7 ? (
                    <>
                      <Sparkles size={16} /> Create My Environment
                    </>
                  ) : (
                    <>
                      Next Question <ChevronRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}

      </div>
    </CinematicLayout>
  );
}
