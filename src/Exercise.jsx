import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Target, Activity, Clock, Zap, Play, X, Info, CheckCircle2 } from "lucide-react";
import { useTheme } from "./ThemeContext";
import { useBMI } from "./BMIContext";
import { CinematicLayout, AiFab, Kicker } from "./CinematicLayout";
import { ExerciseAnimation } from "./ExerciseAnimations";

export default function Exercise() {
  return (
    <CinematicLayout fab={<AiFab />}>
      <div className="cn-content" style={{ maxWidth: 960 }}>
        <Kicker num="01" label="Exercises" />
        <h1 className="cn-h1" style={{ marginBottom: '0.5rem' }}>Exercise & Fitness Assessment</h1>
        <p style={{ color: 'var(--text2)', fontSize: '0.9rem', marginBottom: '2.5rem', lineHeight: 1.7 }}>
          Enter your details to get AI-powered exercise recommendations based on your body composition, sleep patterns, and fitness goals.
        </p>
        <UserSpecsForm />
        <Calculator />
      </div>
    </CinematicLayout>
  );
}

/* ── User Specs Form (100% original logic, cinematic skin) ── */
function UserSpecsForm() {
  const { bmiData, updateBMI } = useBMI();

  const handleInputChange = (field, value) => {
    updateBMI({ [field]: value });
  };

  return (
    <div className="cn-card" style={{ marginBottom: '1.5rem' }}>
      <h2 className="cn-h2" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <User size={18} style={{ color: 'var(--accent)' }} />
        Your Fitness Profile
      </h2>

      <div className="cn-grid-4" style={{ marginBottom: '1rem' }}>
        <div>
          <label className="cn-label">Age</label>
          <input type="number" className="cn-input" value={bmiData.age}
            onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 25)}
            min="16" max="100" />
        </div>
        <div>
          <label className="cn-label">Gender</label>
          <select className="cn-input" value={bmiData.gender}
            onChange={(e) => handleInputChange('gender', e.target.value)}>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="cn-label">Body Fat %</label>
          <input type="number" className="cn-input" value={bmiData.bodyFatPercentage}
            onChange={(e) => handleInputChange('bodyFatPercentage', parseFloat(e.target.value) || 15)}
            min="5" max="50" step="0.1" />
        </div>
        <div>
          <label className="cn-label">Sleep Hours</label>
          <input type="number" className="cn-input" value={bmiData.sleepHours}
            onChange={(e) => handleInputChange('sleepHours', parseFloat(e.target.value) || 8)}
            min="4" max="12" step="0.5" />
        </div>
      </div>

      <div className="cn-grid-2">
        <div>
          <label className="cn-label">Activity Level</label>
          <select className="cn-input" value={bmiData.activityLevel}
            onChange={(e) => handleInputChange('activityLevel', e.target.value)}>
            <option value="sedentary">Sedentary</option>
            <option value="light">Light Activity</option>
            <option value="moderate">Moderate Activity</option>
            <option value="active">Active</option>
            <option value="very_active">Very Active</option>
          </select>
        </div>
        <div>
          <label className="cn-label">Fitness Goal</label>
          <select className="cn-input" value={bmiData.fitnessGoal}
            onChange={(e) => handleInputChange('fitnessGoal', e.target.value)}>
            <option value="lose_weight">Lose Weight</option>
            <option value="maintain">Maintain Weight</option>
            <option value="gain_weight">Gain Weight</option>
            <option value="build_muscle">Build Muscle</option>
          </select>
        </div>
      </div>
    </div>
  );
}

/* ── Calculator (100% original logic, cinematic skin) ── */
function Calculator() {
  const { bmiData, updateBMI } = useBMI();

  const [age, setAge] = React.useState(() => {
    try { return Number(JSON.parse(localStorage.getItem('fitzer.bmi') || '{}').age) || 25; } catch { return 25; }
  });
  const [heightCm, setHeightCm] = React.useState(() => {
    try { return Number(JSON.parse(localStorage.getItem('fitzer.bmi') || '{}').heightCm) || 170; } catch { return 170; }
  });
  const [weightKg, setWeightKg] = React.useState(() => {
    try { return Number(JSON.parse(localStorage.getItem('fitzer.bmi') || '{}').weightKg) || 70; } catch { return 70; }
  });
  const [lastResult, setLastResult] = React.useState(null);
  const [recommended, setRecommended] = React.useState([]);
  const [computedBmi, setComputedBmi] = React.useState(0);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [selectedExercise, setSelectedExercise] = React.useState(null);

  const EXERCISE_INSTRUCTIONS = {
    'wall-push-ups': {
      steps: [
        { label: "Step 1: Stance", text: "Stand facing a wall at arm's length. Place palms flat on wall at shoulder height." },
        { label: "Step 2: Lower Chest", text: "Bend elbows and smoothly lower your chest toward the wall. Keep body straight." },
        { label: "Step 3: Pause & Squeeze", text: "Hold for 1 second when chest is close to wall without letting hips sag." },
        { label: "Step 4: Push Back", text: "Press through your palms to return to starting position. Exhale as you push." }
      ],
      tip: "Keep shoulders down and elbows tucked at a 45° angle.",
      breath: "Inhale while lowering toward the wall; Exhale while pushing back."
    },
    'chair-squats': {
      steps: [
        { label: "Step 1: Setup Stance", text: "Stand in front of a chair with feet hip-width apart and chest lifted." },
        { label: "Step 2: Sit Back", text: "Push hips backward and bend knees as if about to sit down in the chair." },
        { label: "Step 3: Soft Touch", text: "Lightly touch glutes to chair seat without resting full weight." },
        { label: "Step 4: Stand Up", text: "Press firmly through your heels to return to standing stance." }
      ],
      tip: "Keep knees tracking over toes; do not let knees cave inward.",
      breath: "Inhale as you sit down; Exhale as you drive up to stand."
    },
    'seated-marches': {
      steps: [
        { label: "Step 1: Sit Tall", text: "Sit near the front of a sturdy chair with feet flat and shoulders back." },
        { label: "Step 2: Lift Knee", text: "Contract abs and raise one knee toward your chest as high as comfortable." },
        { label: "Step 3: Pause", text: "Hold knee high for 1 second keeping spine straight." },
        { label: "Step 4: Lower & Switch", text: "Lower foot back down gently and repeat with opposite leg." }
      ],
      tip: "Avoid leaning backward when lifting your knees.",
      breath: "Exhale as knee lifts up; Inhale as foot lowers down."
    },
    'standing-calf-raises': {
      steps: [
        { label: "Step 1: Balance", text: "Stand upright with feet hip-width apart. Hold a wall or chair for balance if needed." },
        { label: "Step 2: Raise Heels", text: "Lift heels off the ground, pushing up onto the balls of your feet." },
        { label: "Step 3: Squeeze Top", text: "Squeeze calves tightly at maximum height for 1-2 seconds." },
        { label: "Step 4: Lower Down", text: "Slowly lower heels back to floor with full control." }
      ],
      tip: "Focus on controlled speed—don't bounce up and down fast.",
      breath: "Exhale on the way up; Inhale on the controlled lowering phase."
    },
    'arm-circles': {
      steps: [
        { label: "Step 1: Arms Extended", text: "Stand straight with arms stretched directly to sides at shoulder height." },
        { label: "Step 2: Forward Circles", text: "Rotate arms in small, controlled forward circular movements." },
        { label: "Step 3: Switch Direction", text: "After half the duration, pause and reverse to backward circles." },
        { label: "Step 4: Finish", text: "Lower arms smoothly once time completes." }
      ],
      tip: "Keep core engaged and avoid swinging your torso.",
      breath: "Maintain steady continuous breathing throughout."
    },
    'walking-in-place': {
      steps: [
        { label: "Step 1: Stance", text: "Stand upright with feet hip-width apart and elbows bent at 90°." },
        { label: "Step 2: Drive Knee", text: "Lift left knee to hip height while pumping right arm forward." },
        { label: "Step 3: Switch Rhythmic", text: "Step down and immediately raise right knee with left arm pump." },
        { label: "Step 4: Maintain Pace", text: "Continue marching continuously with light landing." }
      ],
      tip: "Keep chest tall and land softly on the balls of your feet.",
      breath: "Breathe naturally in rhythm with your marching steps."
    },
    'push-ups': {
      steps: [
        { label: "Step 1: Plank Position", text: "Place hands shoulder-width apart, feet together, forming a straight line head to heels." },
        { label: "Step 2: Lower Body", text: "Bend elbows at 45° to lower chest smoothly until 2 inches above ground." },
        { label: "Step 3: Bottom Pause", text: "Hold briefly without letting your hips sag or lower back arch." },
        { label: "Step 4: Press Up", text: "Push forcefully through your palms back to full arm extension." }
      ],
      tip: "Keep core tight like a rigid plank from head to ankles.",
      breath: "Inhale while lowering chest; Exhale forcefully while pushing up."
    },
    'squats': [
      "Stand with feet shoulder-width apart, toes turned slightly out.",
      "Hinge hips back and bend knees to lower body down into deep squat.",
      "Pause when thighs are parallel to ground with chest lifted.",
      "Drive through heels to return forcefully to standing stance."
    ],
    'plank': {
      steps: [
        { label: "Step 1: Forearm Base", text: "Place forearms flat on ground with elbows directly under shoulders." },
        { label: "Step 2: Body Alignment", text: "Extend legs straight back on toes. Form a straight line head to heels." },
        { label: "Step 3: Lock Core", text: "Squeeze abs, glutes, and quad muscles tightly together." },
        { label: "Step 4: Hold Position", text: "Hold still without letting hips drop or arch upward." }
      ],
      tip: "Look at your hands to keep neck aligned with spine.",
      breath: "Take slow, controlled breaths into stomach while holding."
    },
    'lunges': {
      steps: [
        { label: "Step 1: Stand Tall", text: "Stand upright with hands on hips and feet hip-width apart." },
        { label: "Step 2: Step Forward", text: "Take a large stride forward with one leg and land heel first." },
        { label: "Step 3: Bend 90°", text: "Lower hips until both front and back knees form 90° angles." },
        { label: "Step 4: Push Back", text: "Press through front heel to step back to starting stance." }
      ],
      tip: "Keep front knee behind toes and torso upright.",
      breath: "Inhale on forward step; Exhale as you push back to start."
    },
    'jumping-jacks': {
      steps: [
        { label: "Step 1: Start", text: "Stand tall with feet together and arms resting at your sides." },
        { label: "Step 2: Jump Out", text: "Jump feet out sideways while raising arms overhead." },
        { label: "Step 3: Jump In", text: "Immediately jump feet back together bringing arms down." },
        { label: "Step 4: Continuous", text: "Repeat fluidly with light, springy footwork." }
      ],
      tip: "Land softly on balls of feet to absorb impact.",
      breath: "Exhale on jump out; Inhale on jump back."
    },
    'mountain-climbers': {
      steps: [
        { label: "Step 1: High Plank", text: "Start in a push-up position with hands flat under shoulders." },
        { label: "Step 2: Knee Drive", text: "Drive one knee rapidly in toward chest while keeping hips low." },
        { label: "Step 3: Quick Switch", text: "Quickly switch legs, extending back while driving opposite knee." },
        { label: "Step 4: Run Pace", text: "Continue alternating legs in a running motion." }
      ],
      tip: "Don't let your hips bounce up into the air.",
      breath: "Maintain quick, steady breathing throughout the set."
    },
    'diamond-push-ups': {
      steps: [
        { label: "Step 1: Diamond Grip", text: "In high plank, place hands together touching thumbs and index fingers." },
        { label: "Step 2: Lower Chest", text: "Lower chest toward hands keeping elbows tucked close to ribcage." },
        { label: "Step 3: Touch & Pause", text: "Touch chest lightly to hands without breaking plank form." },
        { label: "Step 4: Press Up", text: "Push back up emphasizing triceps contraction." }
      ],
      tip: "Focus on pushing through the palms to isolate triceps.",
      breath: "Inhale down; Exhale up."
    },
    'pistol-squats': {
      steps: [
        { label: "Step 1: One Leg Balance", text: "Stand on one leg with opposite leg extended forward." },
        { label: "Step 2: Lower Down", text: "Bend standing knee and lower hips into deep single-leg squat." },
        { label: "Step 3: Bottom Hold", text: "Control bottom position without letting heel lift." },
        { label: "Step 4: Drive Up", text: "Press through standing heel to return to top stance." }
      ],
      tip: "Extend arms forward to maintain balance.",
      breath: "Inhale down; Exhale up."
    },
    'burpees': {
      steps: [
        { label: "Step 1: Squat Drop", text: "Drop into squat and place palms flat on floor." },
        { label: "Step 2: Plank Kick", text: "Jump feet back into high push-up position." },
        { label: "Step 3: Jump In", text: "Jump feet back forward to hands in squat stance." },
        { label: "Step 4: Vertical Jump", text: "Explode up into air reaching hands overhead." }
      ],
      tip: "Move rhythmically through each phase without stopping.",
      breath: "Exhale on vertical jump explosion."
    },
    'handstand-push-ups': {
      steps: [
        { label: "Step 1: Handstand Wall", text: "Kick up into handstand facing wall with hands 6 inches out." },
        { label: "Step 2: Lower Head", text: "Bend elbows to lower top of head smoothly to floor." },
        { label: "Step 3: Touch Mat", text: "Lightly touch head to surface." },
        { label: "Step 4: Press Overhead", text: "Press forcefully back to arm lockout." }
      ],
      tip: "Keep core locked and toes pointed.",
      breath: "Inhale down; Exhale up."
    },
    'muscle-ups': {
      steps: [
        { label: "Step 1: False Grip Hang", text: "Grip pull-up bar with false grip arms extended." },
        { label: "Step 2: Pull & Transition", text: "Pull chest up explosively and lean torso over bar." },
        { label: "Step 3: Lock Bar Dip", text: "Transition hands onto bar into dip stance." },
        { label: "Step 4: Dip Extension", text: "Press up to full arm lockout above bar." }
      ],
      tip: "Drive hips up to assist rotation over the bar.",
      breath: "Exhale on explosive transition."
    },
    'sprint-intervals': {
      steps: [
        { label: "Step 1: Ready Stance", text: "Lean torso slightly forward with knees bent in runner setup." },
        { label: "Step 2: Max Acceleration", text: "Explode into sprint driving knees and pumping arms." },
        { label: "Step 3: Peak Speed", text: "Maintain maximum stride turnover." },
        { label: "Step 4: Smooth Decelerate", text: "Slow down gradually into walk." }
      ],
      tip: "Keep shoulders relaxed and pump elbows straight back.",
      breath: "Rhythmic breathing matching foot cadence."
    }
  };

  const heightM = heightCm > 0 ? heightCm / 100 : 0;
  const bmi = computedBmi || 0;

  const bmiCategory = (() => {
    if (!isFinite(bmi) || bmi === 0) return "";
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal";
    if (bmi < 30) return "Overweight";
    return "Obese";
  })();

  const handleCalculate = async () => {
    const nextBmi = heightM > 0 && weightKg > 0 ? Number((weightKg / (heightM * heightM)).toFixed(1)) : 0;
    setComputedBmi(nextBmi);
    setLastResult({ heightCm, weightKg, bmi: nextBmi });
    updateBMI({ heightCm, weightKg, bmi: nextBmi });
    setIsGenerating(true);
    try {
      const personalizedExercises = await generatePersonalizedExercises(bmiData, nextBmi);
      setRecommended(personalizedExercises);
    } catch (error) {
      setRecommended(getFallbackExercises());
    } finally {
      setIsGenerating(false);
    }
    setHeightCm("");
    setWeightKg("");
  };

  // ── All original AI logic below (unchanged) ──
  const generatePersonalizedExercises = async (userData, bmi) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return await generateAIRecommendations(userData, bmi);
    } catch (error) {
      return getFallbackExercises();
    }
  };

  const generateAIRecommendations = async (userData, bmi) => {
    const exerciseDatabase = getComprehensiveExerciseDatabase();
    const userProfile = analyzeUserProfile(userData, bmi);
    const selectedExercises = selectExercisesByAI(userProfile, exerciseDatabase);
    return customizeExercisesByAI(selectedExercises, userProfile);
  };

  const analyzeUserProfile = (userData, bmi) => ({
    fitnessLevel: determineFitnessLevel(userData.activityLevel, userData.sleepHours),
    riskFactors: identifyRiskFactors(userData.age, userData.bodyFatPercentage, userData.sleepHours),
    goalPriority: prioritizeGoals(userData.fitnessGoal, bmi),
    intensityLevel: calculateOptimalIntensity(userData.age, userData.activityLevel, userData.sleepHours),
    focusAreas: determineFocusAreas(userData.fitnessGoal, userData.bodyFatPercentage, userData.gender)
  });

  const determineFitnessLevel = (activityLevel, sleepHours) => {
    if (activityLevel === 'very_active' && sleepHours >= 8) return 'advanced';
    if (activityLevel === 'active' && sleepHours >= 7) return 'intermediate';
    if (activityLevel === 'moderate' && sleepHours >= 6) return 'beginner-intermediate';
    if (sleepHours < 6) return 'beginner';
    return 'beginner';
  };

  const identifyRiskFactors = (age, bodyFatPercentage, sleepHours) => {
    const risks = [];
    if (age > 50) risks.push('age');
    if (bodyFatPercentage > 25) risks.push('weight');
    if (sleepHours < 6) risks.push('recovery');
    return risks;
  };

  const prioritizeGoals = (fitnessGoal, bmi) => {
    if (fitnessGoal === 'lose_weight' || bmi > 25) return 'fat_loss';
    if (fitnessGoal === 'build_muscle') return 'muscle_gain';
    if (fitnessGoal === 'maintain') return 'maintenance';
    return 'general_fitness';
  };

  const calculateOptimalIntensity = (age, activityLevel, sleepHours) => {
    let intensity = 'moderate';
    if (age > 50 || sleepHours < 6) intensity = 'low';
    if (activityLevel === 'very_active' && sleepHours >= 8) intensity = 'high';
    return intensity;
  };

  const determineFocusAreas = (fitnessGoal, bodyFatPercentage, gender) => {
    const areas = [];
    if (fitnessGoal === 'lose_weight' || bodyFatPercentage > 20) areas.push('cardiovascular', 'core');
    if (fitnessGoal === 'build_muscle') areas.push('strength', 'muscle_endurance');
    areas.push('flexibility', 'balance');
    return areas;
  };

  const getComprehensiveExerciseDatabase = () => ({
    beginner: [
      { id: 'wall-push-ups', name: 'Wall Push-ups', bodyPart: 'chest', target: 'upper body', calories: 40, difficulty: 'low', equipment: 'wall', duration: '10-15 min', sets: '2-3', reps: '8-12', rest: '60s', intensity: 'low', focus: ['strength'] },
      { id: 'chair-squats', name: 'Chair-Assisted Squats', bodyPart: 'legs', target: 'lower body', calories: 60, difficulty: 'low', equipment: 'chair', duration: '10-15 min', sets: '2-3', reps: '8-10', rest: '60s', intensity: 'low', focus: ['strength'] },
      { id: 'seated-marches', name: 'Seated Knee Marches', bodyPart: 'core', target: 'stability', calories: 30, difficulty: 'low', equipment: 'chair', duration: '5-10 min', sets: '2-3', reps: '10-15', rest: '45s', intensity: 'low', focus: ['core'] },
      { id: 'standing-calf-raises', name: 'Standing Calf Raises', bodyPart: 'legs', target: 'lower body', calories: 35, difficulty: 'low', equipment: 'none', duration: '5-10 min', sets: '2-3', reps: '12-15', rest: '45s', intensity: 'low', focus: ['strength'] },
      { id: 'arm-circles', name: 'Arm Circles', bodyPart: 'arms', target: 'flexibility', calories: 25, difficulty: 'low', equipment: 'none', duration: '5-10 min', sets: '2-3', reps: '10-12', rest: '30s', intensity: 'low', focus: ['flexibility'] },
      { id: 'walking-in-place', name: 'Walking in Place', bodyPart: 'full body', target: 'cardiovascular', calories: 80, difficulty: 'low', equipment: 'none', duration: '10-15 min', sets: '1', reps: 'continuous', rest: 'none', intensity: 'low', focus: ['cardiovascular'] }
    ],
    'beginner-intermediate': [
      { id: 'push-ups', name: 'Standard Push-ups', bodyPart: 'chest', target: 'upper body', calories: 80, difficulty: 'moderate', equipment: 'none', duration: '15-20 min', sets: '3-4', reps: '10-15', rest: '60-90s', intensity: 'moderate', focus: ['strength'] },
      { id: 'squats', name: 'Bodyweight Squats', bodyPart: 'legs', target: 'lower body', calories: 100, difficulty: 'moderate', equipment: 'none', duration: '15-20 min', sets: '3-4', reps: '12-15', rest: '60-90s', intensity: 'moderate', focus: ['strength'] },
      { id: 'plank', name: 'Plank Hold', bodyPart: 'core', target: 'stability', calories: 60, difficulty: 'moderate', equipment: 'none', duration: '10-15 min', sets: '3-4', reps: '30-60s', rest: '60s', intensity: 'moderate', focus: ['core'] },
      { id: 'lunges', name: 'Forward Lunges', bodyPart: 'legs', target: 'lower body', calories: 90, difficulty: 'moderate', equipment: 'none', duration: '15-20 min', sets: '3-4', reps: '10-12', rest: '60-90s', intensity: 'moderate', focus: ['strength'] },
      { id: 'jumping-jacks', name: 'Jumping Jacks', bodyPart: 'full body', target: 'cardiovascular', calories: 150, difficulty: 'moderate', equipment: 'none', duration: '10-15 min', sets: '3-4', reps: '20-30', rest: '60s', intensity: 'moderate', focus: ['cardiovascular'] },
      { id: 'mountain-climbers', name: 'Mountain Climbers', bodyPart: 'core', target: 'conditioning', calories: 120, difficulty: 'moderate', equipment: 'none', duration: '10-15 min', sets: '3-4', reps: '20-30', rest: '60s', intensity: 'moderate', focus: ['conditioning'] }
    ],
    intermediate: [
      { id: 'push-ups', name: 'Standard Push-ups', bodyPart: 'chest', target: 'upper body', calories: 80, difficulty: 'moderate', equipment: 'none', duration: '15-20 min', sets: '3-4', reps: '10-15', rest: '60-90s', intensity: 'moderate', focus: ['strength'] },
      { id: 'squats', name: 'Bodyweight Squats', bodyPart: 'legs', target: 'lower body', calories: 100, difficulty: 'moderate', equipment: 'none', duration: '15-20 min', sets: '3-4', reps: '12-15', rest: '60-90s', intensity: 'moderate', focus: ['strength'] },
      { id: 'plank', name: 'Plank Hold', bodyPart: 'core', target: 'stability', calories: 60, difficulty: 'moderate', equipment: 'none', duration: '10-15 min', sets: '3-4', reps: '30-60s', rest: '60s', intensity: 'moderate', focus: ['core'] },
      { id: 'lunges', name: 'Forward Lunges', bodyPart: 'legs', target: 'lower body', calories: 90, difficulty: 'moderate', equipment: 'none', duration: '15-20 min', sets: '3-4', reps: '10-12', rest: '60-90s', intensity: 'moderate', focus: ['strength'] },
      { id: 'jumping-jacks', name: 'Jumping Jacks', bodyPart: 'full body', target: 'cardiovascular', calories: 150, difficulty: 'moderate', equipment: 'none', duration: '10-15 min', sets: '3-4', reps: '20-30', rest: '60s', intensity: 'moderate', focus: ['cardiovascular'] },
      { id: 'mountain-climbers', name: 'Mountain Climbers', bodyPart: 'core', target: 'conditioning', calories: 120, difficulty: 'moderate', equipment: 'none', duration: '10-15 min', sets: '3-4', reps: '20-30', rest: '60s', intensity: 'moderate', focus: ['conditioning'] }
    ],
    advanced: [
      { id: 'diamond-push-ups', name: 'Diamond Push-ups', bodyPart: 'chest', target: 'upper body', calories: 100, difficulty: 'high', equipment: 'none', duration: '15-20 min', sets: '4-5', reps: '8-12', rest: '90s', intensity: 'high', focus: ['strength'] },
      { id: 'pistol-squats', name: 'Pistol Squats', bodyPart: 'legs', target: 'lower body', calories: 150, difficulty: 'high', equipment: 'none', duration: '15-20 min', sets: '3-4', reps: '5-8', rest: '90-120s', intensity: 'high', focus: ['strength'] },
      { id: 'burpees', name: 'Burpees', bodyPart: 'full body', target: 'conditioning', calories: 200, difficulty: 'high', equipment: 'none', duration: '10-15 min', sets: '4-5', reps: '8-12', rest: '90s', intensity: 'high', focus: ['conditioning'] },
      { id: 'handstand-push-ups', name: 'Handstand Push-ups', bodyPart: 'shoulders', target: 'upper body', calories: 120, difficulty: 'high', equipment: 'wall', duration: '15-20 min', sets: '3-4', reps: '3-8', rest: '120s', intensity: 'high', focus: ['strength'] },
      { id: 'muscle-ups', name: 'Muscle-ups', bodyPart: 'full body', target: 'strength', calories: 180, difficulty: 'high', equipment: 'pull-up bar', duration: '15-20 min', sets: '3-4', reps: '3-6', rest: '120s', intensity: 'high', focus: ['strength'] },
      { id: 'sprint-intervals', name: 'Sprint Intervals', bodyPart: 'full body', target: 'cardiovascular', calories: 250, difficulty: 'high', equipment: 'none', duration: '15-20 min', sets: '6-8', reps: '30s', rest: '90s', intensity: 'high', focus: ['cardiovascular'] }
    ]
  });

  const selectExercisesByAI = (userProfile, exerciseDatabase) => {
    const { fitnessLevel, goalPriority, riskFactors } = userProfile;
    let difficultyLevel = fitnessLevel;
    if (riskFactors.includes('age') || riskFactors.includes('recovery')) difficultyLevel = 'beginner';
    const availableExercises = exerciseDatabase[difficultyLevel] || exerciseDatabase.beginner;
    let selectedExercises = [];
    if (goalPriority === 'fat_loss') {
      selectedExercises = availableExercises.filter(ex => ex.focus.includes('cardiovascular') || ex.focus.includes('conditioning')).slice(0, 3);
      selectedExercises.push(...availableExercises.filter(ex => ex.focus.includes('strength') || ex.focus.includes('core')).slice(0, 3));
    } else if (goalPriority === 'muscle_gain') {
      selectedExercises = availableExercises.filter(ex => ex.focus.includes('strength')).slice(0, 4);
      selectedExercises.push(...availableExercises.filter(ex => ex.focus.includes('core') || ex.focus.includes('conditioning')).slice(0, 2));
    } else {
      selectedExercises = availableExercises.slice(0, 6);
    }
    return selectedExercises.slice(0, 6);
  };

  const customizeExercisesByAI = (exercises, userProfile) => {
    const { intensityLevel, riskFactors } = userProfile;
    return exercises.map(exercise => {
      let e = { ...exercise };
      if (intensityLevel === 'low') { e.sets = '2-3'; e.reps = exercise.reps.includes('s') ? '15-30s' : '8-12'; e.rest = '90-120s'; e.intensity = 'low'; }
      else if (intensityLevel === 'high') { e.sets = '4-5'; e.reps = exercise.reps.includes('s') ? '45-60s' : '12-20'; e.rest = '60-90s'; e.intensity = 'high'; }
      if (riskFactors.includes('age')) { e.rest = '90-120s'; e.intensity = 'low'; }
      if (riskFactors.includes('recovery')) { e.sets = '2-3'; e.rest = '90-120s'; }
      e.aiInsight = generateAIInsight(exercise, userProfile);
      return e;
    });
  };

  const generateAIInsight = (exercise, userProfile) => {
    const { goalPriority, riskFactors } = userProfile;
    if (goalPriority === 'fat_loss' && exercise.focus.includes('cardiovascular')) return "Perfect for burning calories and improving cardiovascular health. Focus on maintaining steady breathing.";
    if (goalPriority === 'muscle_gain' && exercise.focus.includes('strength')) return "Excellent for building muscle mass. Focus on controlled movements and proper form.";
    if (riskFactors.includes('age')) return "Age-appropriate modification. Listen to your body and rest as needed.";
    if (riskFactors.includes('recovery') && exercise.intensity === 'high') return "Modified for better recovery. Ensure adequate rest between sets.";
    return "Great exercise for overall fitness. Focus on proper form and gradual progression.";
  };

  const getFallbackExercises = () => [
    { id: 'push-ups', name: 'Push-ups', bodyPart: 'chest', target: 'upper body', calories: 80, difficulty: 'moderate', equipment: 'none', duration: '15-20 min', sets: '3-4', reps: '10-12', rest: '60-90s', intensity: 'moderate', aiInsight: 'Standard exercise for upper body strength' },
    { id: 'squats', name: 'Bodyweight Squats', bodyPart: 'legs', target: 'lower body', calories: 100, difficulty: 'moderate', equipment: 'none', duration: '15-20 min', sets: '3-4', reps: '10-12', rest: '60-90s', intensity: 'moderate', aiInsight: 'Fundamental lower body exercise' },
    { id: 'plank', name: 'Plank', bodyPart: 'core', target: 'stability', calories: 60, difficulty: 'moderate', equipment: 'none', duration: '10-15 min', sets: '3-4', reps: '10-12', rest: '60-90s', intensity: 'moderate', aiInsight: 'Core stability and strength' }
  ];

  // Radial BMI chart
  const chart = React.useMemo(() => {
    const radius = 56;
    const circumference = 2 * Math.PI * radius;
    const maxBmi = 40;
    const pct = Math.max(0, Math.min(1, bmi / maxBmi));
    const dashOffset = circumference * (1 - pct);
    let color = 'var(--accent)';
    if (bmiCategory === 'Underweight') color = 'var(--text3)';
    if (bmiCategory === 'Overweight' || bmiCategory === 'Obese') color = '#ef4444';
    return { radius, circumference, dashOffset, color };
  }, [bmi, bmiCategory]);

  const diffColor = (d) => d === 'high' ? '#ef4444' : d === 'moderate' ? '#f59e0b' : '#c8f04a';

  return (
    <>
      {/* BMI + Inputs card */}
      <div className="cn-card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', alignItems: 'center' }}>
          <div>
            <div className="cn-grid-3" style={{ marginBottom: '1rem' }}>
              <div>
                <label className="cn-label">Age</label>
                <input type="number" className="cn-input" min={1} max={120} value={age} onChange={(e) => setAge(Number(e.target.value))} placeholder="age" />
              </div>
              <div>
                <label className="cn-label">Height (cm)</label>
                <input type="number" className="cn-input" min={50} max={260} value={heightCm} onChange={(e) => setHeightCm(Number(e.target.value))} placeholder="height" />
              </div>
              <div>
                <label className="cn-label">Weight (kg)</label>
                <input type="number" className="cn-input" min={10} max={400} value={weightKg} onChange={(e) => setWeightKg(Number(e.target.value))} placeholder="weight" />
              </div>
            </div>

            {lastResult && (
              <p style={{ fontSize: '0.8rem', color: 'var(--text3)', marginBottom: '1rem' }}>
                Last: {lastResult.heightCm} cm · {lastResult.weightKg} kg · BMI {lastResult.bmi}
              </p>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button className="cn-btn" onClick={handleCalculate} disabled={isGenerating}>
                {isGenerating ? (
                  <><span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid #080808', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />Generating...</>
                ) : 'Generate AI Exercise Plan'}
              </button>
              <button className="cn-btn-ghost" onClick={() => setRecommended(getFallbackExercises())}>
                Quick Demo
              </button>
            </div>
          </div>

          {/* BMI Donut */}
          <div style={{ position: 'relative', width: 140, height: 140, flexShrink: 0 }}>
            <svg width={140} height={140} viewBox="0 0 140 140">
              <circle cx="70" cy="70" r={chart.radius} stroke="rgba(255,255,255,0.06)" strokeWidth="12" fill="none" />
              <motion.circle
                cx="70" cy="70" r={chart.radius}
                stroke={chart.color} strokeWidth="12" fill="none"
                strokeLinecap="round"
                strokeDasharray={chart.circumference}
                animate={{ strokeDashoffset: chart.dashOffset }}
                initial={{ strokeDashoffset: chart.circumference }}
                transition={{ duration: 0.7, ease: 'easeInOut' }}
                style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
              />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', textAlign: 'center' }}>
              <div>
                <div style={{ fontFamily: 'Anton, sans-serif', fontSize: '1.8rem', color: 'var(--text)', lineHeight: 1 }}>{bmi || '—'}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text3)', marginTop: '0.25rem' }}>{bmi ? bmiCategory : 'BMI'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {recommended.length > 0 && (
        <section style={{ marginTop: '2rem' }}>
          {/* Analysis summary */}
          <div className="cn-card" style={{ marginBottom: '1.5rem' }}>
            <h3 className="cn-h3" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target size={16} style={{ color: 'var(--accent)' }} />
              AI-Generated Fitness Analysis
            </h3>
            <div className="cn-grid-4">
              {[
                { label: 'Body Composition', val: `${bmiData.age}y/o ${bmiData.gender}`, sub: `${bmiData.bodyFatPercentage}% body fat` },
                { label: 'Recovery Status', val: `${bmiData.sleepHours}h sleep`, sub: `${bmiData.activityLevel} activity` },
                { label: 'Fitness Goal', val: bmiData.fitnessGoal.replace('_', ' ').toUpperCase(), sub: '' },
                { label: 'BMI Status', val: lastResult?.bmi || '—', sub: bmiCategory || 'Not calculated' },
              ].map(s => (
                <div key={s.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 10, padding: '0.85rem' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--accent)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>{s.label}</div>
                  <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.9rem' }}>{s.val}</div>
                  {s.sub && <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>{s.sub}</div>}
                </div>
              ))}
            </div>
          </div>

          <Kicker num="—" label="AI-Powered Exercise Recommendations" />
          <p style={{ fontSize: '0.82rem', color: 'var(--text2)', marginBottom: '1.5rem' }}>
            These exercises are specifically selected and customized based on your profile, fitness level, and goals. <strong style={{ color: 'var(--accent)' }}>Click any exercise to view the 2D animated guide!</strong>
          </p>
          <div className="cn-grid-3">
            {recommended.map((ex) => (
              <div 
                key={ex.id} 
                className="cn-card"
                onClick={() => setSelectedExercise(ex)}
                style={{ 
                  cursor: 'pointer', 
                  transition: 'all 0.25s ease',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <div className="cn-h3" style={{ fontSize: '1.05rem' }}>{ex.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginTop: '0.2rem' }}>{ex.bodyPart} · {ex.target}</div>
                    </div>
                    <span style={{ fontSize: '0.65rem', fontWeight: 800, color: diffColor(ex.difficulty), background: 'rgba(255,255,255,0.05)', border: `1px solid ${diffColor(ex.difficulty)}30`, borderRadius: 6, padding: '0.2rem 0.5rem', letterSpacing: '0.08em' }}>{ex.difficulty.toUpperCase()}</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.8rem' }}>
                    {[
                      ['Sets & Reps', `${ex.sets} × ${ex.reps}`],
                      ['Rest', ex.rest],
                      ['Duration', ex.duration],
                      ['Calories', `${ex.calories} cal`],
                      ['Equipment', ex.equipment],
                    ].map(([k, v]) => (
                      <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text3)' }}>{k}</span>
                        <span style={{ color: 'var(--text)', fontWeight: 600 }}>{v}</span>
                      </div>
                    ))}
                  </div>

                  {ex.aiInsight && (
                    <div style={{ marginTop: '0.85rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border)', fontSize: '0.75rem', color: 'var(--text2)', fontStyle: 'italic' }}>
                      <span style={{ color: 'var(--accent)', fontStyle: 'normal', fontWeight: 700 }}>AI Insight: </span>{ex.aiInsight}
                    </div>
                  )}
                </div>

                <button 
                  style={{
                    marginTop: '1.2rem',
                    width: '100%',
                    padding: '0.55rem',
                    borderRadius: 8,
                    background: 'rgba(200, 240, 74, 0.1)',
                    border: '1px solid var(--accent)',
                    color: 'var(--accent)',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    cursor: 'pointer'
                  }}
                >
                  <Play size={13} fill="var(--accent)" />
                  View 2D Animation Guide
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── 2D Exercise Animation & Guide Modal ── */}
      <AnimatePresence>
        {selectedExercise && (
          <div 
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              background: 'rgba(0, 0, 0, 0.82)',
              backdropFilter: 'blur(8px)',
              display: 'grid',
              placeItems: 'center',
              padding: '1.5rem'
            }}
            onClick={() => setSelectedExercise(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: 820,
                maxHeight: '90vh',
                overflowY: 'auto',
                background: '#0d0e12',
                border: '1px solid rgba(200, 240, 74, 0.25)',
                borderRadius: 16,
                padding: '2rem',
                boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
                position: 'relative'
              }}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedExercise(null)}
                style={{
                  position: 'absolute',
                  top: '1.25rem',
                  right: '1.25rem',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
              >
                <X size={20} />
              </button>

              {/* Modal Header */}
              <div style={{ marginBottom: '1.5rem', paddingRight: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: diffColor(selectedExercise.difficulty), background: 'rgba(255,255,255,0.06)', border: `1px solid ${diffColor(selectedExercise.difficulty)}40`, borderRadius: 6, padding: '0.2rem 0.55rem', letterSpacing: '0.08em' }}>
                    {selectedExercise.difficulty.toUpperCase()}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text3)', textTransform: 'capitalize' }}>
                    {selectedExercise.bodyPart} · {selectedExercise.target}
                  </span>
                </div>
                <h2 className="cn-h2" style={{ fontSize: '1.75rem', margin: 0 }}>
                  {selectedExercise.name}
                </h2>
              </div>

              {/* Grid: Left = 2D Animation, Right = Steps & Info */}
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(240px, 300px) 1fr', gap: '2rem', alignItems: 'start' }}>
                
                {/* 2D Canvas Container */}
                <div style={{ background: '#050608', border: '1px solid var(--border)', borderRadius: 14, padding: '1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Play size={12} fill="var(--accent)" /> 2D Motion Visualizer
                  </div>
                  
                  <div style={{ background: '#0a0c10', borderRadius: 10, padding: '1rem', width: '100%', display: 'grid', placeItems: 'center', border: '1px stroke rgba(255,255,255,0.03)' }}>
                    <ExerciseAnimation exerciseId={selectedExercise.id} />
                  </div>

                  <div style={{ fontSize: '0.72rem', color: 'var(--text3)', textAlign: 'center', marginTop: '0.85rem', lineHeight: 1.4 }}>
                    Looping real-time biomechanical 2D vector animation
                  </div>
                </div>

                {/* Right Column: Instructions & Specs */}
                <div>
                  {/* Quick Specs */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.65rem', marginBottom: '1.5rem' }}>
                    {[
                      ['Sets & Reps', `${selectedExercise.sets} × ${selectedExercise.reps}`],
                      ['Rest Interval', selectedExercise.rest],
                      ['Est. Calories', `${selectedExercise.calories} cal`],
                      ['Duration', selectedExercise.duration],
                      ['Equipment', selectedExercise.equipment],
                      ['Intensity', selectedExercise.intensity],
                    ].map(([label, val]) => (
                      <div key={label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 8, padding: '0.6rem 0.75rem' }}>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)', marginTop: '0.15rem' }}>{val}</div>
                      </div>
                    ))}
                  </div>

                  {/* Step-by-Step Guide */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ fontSize: '0.9rem', color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <CheckCircle2 size={16} /> Step-by-Step Execution Guide
                    </h4>
                    
                    {(() => {
                      const data = EXERCISE_INSTRUCTIONS[selectedExercise.id];
                      const stepList = data?.steps || (Array.isArray(data) ? data.map((t, i) => ({ label: `Step ${i+1}`, text: t })) : [
                        { label: "Step 1: Stance", text: "Position body into starting athletic alignment." },
                        { label: "Step 2: Execution", text: "Perform the movement in a controlled fashion." },
                        { label: "Step 3: Tension", text: "Pause at peak contraction." },
                        { label: "Step 4: Return", text: "Return to starting stance smoothly." }
                      ]);
                      return (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                          {stepList.map((st, idx) => (
                            <div key={idx} style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid var(--border)', borderRadius: 10, padding: '0.65rem 0.85rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                              <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#000', background: 'var(--accent)', borderRadius: 6, padding: '0.2rem 0.5rem', whiteSpace: 'nowrap', textTransform: 'uppercase' }}>
                                {st.label || `Step ${idx+1}`}
                              </span>
                              <span style={{ fontSize: '0.83rem', color: 'var(--text2)', lineHeight: 1.45 }}>
                                {st.text || st}
                              </span>
                            </div>
                          ))}

                          {data?.tip && (
                            <div style={{ background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: 8, padding: '0.55rem 0.85rem', fontSize: '0.78rem', color: '#7dd3fc', marginTop: '0.25rem' }}>
                              <strong style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>💡 Form Tip: </strong>{data.tip}
                            </div>
                          )}

                          {data?.breath && (
                            <div style={{ background: 'rgba(168, 85, 247, 0.08)', border: '1px solid rgba(168, 85, 247, 0.25)', borderRadius: 8, padding: '0.55rem 0.85rem', fontSize: '0.78rem', color: '#c084fc' }}>
                              <strong style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>🫁 Breathing Rule: </strong>{data.breath}
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>

                  {/* AI Insight */}
                  {selectedExercise.aiInsight && (
                    <div style={{ background: 'rgba(200, 240, 74, 0.06)', border: '1px solid rgba(200, 240, 74, 0.2)', borderRadius: 10, padding: '0.85rem 1rem', fontSize: '0.8rem', color: 'var(--text2)' }}>
                      <span style={{ color: 'var(--accent)', fontWeight: 700 }}>⚡ AI Personalization Note: </span>
                      {selectedExercise.aiInsight}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </>
  );
}
