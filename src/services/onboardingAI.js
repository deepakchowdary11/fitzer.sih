/**
 * Onboarding AI Service using Groq API
 * Generates dynamic 7-question assessments tailored to user gender and fitness intent.
 */

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || import.meta.env.GROQ_API_KEY || '';

// Fallback tailored question sets if offline or API latency occurs
export const FALLBACK_QUESTIONS = {
  male: [
    {
      id: 'gender_age',
      category: 'Profile',
      question: 'What is your current biological age group?',
      subtitle: 'Helps us tailor your cardiovascular and metabolic recovery targets.',
      type: 'single',
      options: [
        { label: '18 - 25 years', value: '18-25', desc: 'Peak metabolic conditioning', icon: '⚡' },
        { label: '26 - 35 years', value: '26-35', desc: 'Prime strength & hypertrophy phase', icon: '💪' },
        { label: '36 - 48 years', value: '36-48', desc: 'Joint longevity & lean mass retention', icon: '🛡️' },
        { label: '49+ years', value: '49+', desc: 'Mobility, core resilience & vitality', icon: '🌟' }
      ]
    },
    {
      id: 'primary_goal',
      category: 'Primary Objective',
      question: 'What is your primary athletic & body goal?',
      subtitle: 'We will calibrate your AI posture feedback and exercise sets around this.',
      type: 'single',
      options: [
        { label: 'Build Muscle & Hypertrophy', value: 'build_muscle', desc: 'Focus on progressive overload and upper/lower mass', icon: '🏋️' },
        { label: 'Shred Fat & Lean Athleticism', value: 'lose_weight', desc: 'High metabolic burn with continuous core engagement', icon: '🔥' },
        { label: 'Explosive Strength & Power', value: 'gain_weight', desc: 'Heavy compound biomechanics and functional power', icon: '⚡' },
        { label: 'Longevity, Posture & Core Stability', value: 'maintain', desc: 'Spine alignment, joint health, and daily stamina', icon: '🧘' }
      ]
    },
    {
      id: 'exercise_capability',
      category: 'Strength & Experience',
      question: 'How would you rate your current bodyweight strength capability?',
      subtitle: 'Determines starting rep thresholds in your computer-vision training.',
      type: 'single',
      options: [
        { label: 'Beginner (0-5 standard pushups)', value: 'beginner', desc: 'Focus on form foundation and knee/wall variations', icon: '🌱' },
        { label: 'Intermediate (10-25 clean pushups & deep squats)', value: 'intermediate', desc: 'Solid biomechanics, ready for intense volume', icon: '🎯' },
        { label: 'Advanced Athlete (30+ pushups, full planks)', value: 'advanced', desc: 'High stamina, strict cadence, sub-second transitions', icon: '🏆' }
      ]
    },
    {
      id: 'workout_frequency',
      category: 'Schedule',
      question: 'How many days per week can you dedicate to AI workouts?',
      subtitle: 'We balance your high-intensity rep sessions with active recovery days.',
      type: 'single',
      options: [
        { label: '2 - 3 Days / Week', value: 'light', desc: 'Efficient full-body routine', icon: '📅' },
        { label: '4 - 5 Days / Week', value: 'moderate', desc: 'Optimal hypertrophy & stamina split', icon: '⚡' },
        { label: '6 Days / Week (High Intensity)', value: 'very_active', desc: 'Maximum performance & strict daily tracking', icon: '🚀' }
      ]
    },
    {
      id: 'focus_exercises',
      category: 'Focus Areas',
      question: 'Which exercise categories do you want our AI camera to prioritize?',
      subtitle: 'Select your preferred training focus (multi-select).',
      type: 'multi',
      options: [
        { label: 'Upper Body & Arms (Bicep Curls, Push-ups, Shoulder Press)', value: 'upper_body', icon: '💪' },
        { label: 'Lower Body & Legs (Squats, Lunges, Side Leg Raises)', value: 'lower_body', icon: '🦵' },
        { label: 'Core & Stability (Planks, Mountain Climbers, Knee-to-Elbow)', value: 'core', icon: '🛡️' },
        { label: 'Cardio & Agility (Jumping Jacks, High Knees)', value: 'cardio', icon: '🔥' }
      ]
    },
    {
      id: 'sleep_recovery',
      category: 'Recovery',
      question: 'How many hours of restful sleep do you average per night?',
      subtitle: 'Essential for testosterone, protein synthesis, and nervous system repair.',
      type: 'single',
      options: [
        { label: 'Less than 6 Hours', value: 'under_6', desc: 'Requires lighter volume to prevent overtraining', icon: '⚠️' },
        { label: '6 - 7 Hours', value: '6_7', desc: 'Moderate recovery capacity', icon: '🔋' },
        { label: '7 - 9 Hours (Optimal)', value: '7_9', desc: 'Full muscle recovery and maximum work capacity', icon: '⚡' },
        { label: '9+ Hours', value: '9_plus', desc: 'High recovery potential', icon: '✨' }
      ]
    },
    {
      id: 'nutrition_approach',
      category: 'Nutrition & Macros',
      question: 'What is your preferred nutrition and dietary structure?',
      subtitle: 'Our AI will generate tailored budget-friendly macro and calorie plans.',
      type: 'single',
      options: [
        { label: 'High Protein Non-Vegetarian', value: 'high_protein_nonveg', desc: 'Eggs, chicken, fish, dairy & legumes', icon: '🍗' },
        { label: 'Vegetarian / High-Protein Veg', value: 'vegetarian_protein', desc: 'Paneer, lentils, chickpeas, soy & sprouts', icon: '🥗' },
        { label: 'Clean Balanced Indian Diet', value: 'balanced_desi', desc: 'Rotis, rice, dal, vegetables, homemade curd', icon: '🍛' },
        { label: 'Keto / Low-Carb High-Fat', value: 'low_carb', desc: 'Nuts, seeds, healthy fats & greens', icon: '🥑' }
      ]
    }
  ],

  female: [
    {
      id: 'gender_age',
      category: 'Profile',
      question: 'What is your current biological age bracket?',
      subtitle: 'Helps customize your metabolic burn and joint recovery curves.',
      type: 'single',
      options: [
        { label: '18 - 25 years', value: '18-25', desc: 'High metabolic rate & rapid adaptability', icon: '⚡' },
        { label: '26 - 35 years', value: '26-35', desc: 'Optimal lean muscle toning & core stamina', icon: '💫' },
        { label: '36 - 48 years', value: '36-48', desc: 'Bone density, posture alignment & lean tone', icon: '🌸' },
        { label: '49+ years', value: '49+', desc: 'Joint mobility, core strength & longevity', icon: '🌟' }
      ]
    },
    {
      id: 'primary_goal',
      category: 'Primary Objective',
      question: 'What is your primary fitness & body goal?',
      subtitle: 'We will calibrate your camera rep tracking and AI workout plans accordingly.',
      type: 'single',
      options: [
        { label: 'Full-Body Toning & Lean Definition', value: 'maintain', desc: 'Sculpt arms, glutes, and waist with precision reps', icon: '✨' },
        { label: 'Fat Loss, Waist Slimming & Energy', value: 'lose_weight', desc: 'Metabolic calorie burn and cardiovascular health', icon: '🔥' },
        { label: 'Glute, Leg & Core Strength', value: 'build_muscle', desc: 'Targeted squats, lunges, bridges and rigid core holds', icon: '🍑' },
        { label: 'Spine Posture, Mobility & Flexibility', value: 'posture', desc: 'Desk posture correction and ergonomic spinal relief', icon: '🧘' }
      ]
    },
    {
      id: 'exercise_capability',
      category: 'Experience & Capacity',
      question: 'What is your current exercise experience level?',
      subtitle: 'We tailor the difficulty curve of your live AI posture workouts.',
      type: 'single',
      options: [
        { label: 'Beginner / Starting Fresh', value: 'beginner', desc: 'Step-by-step guidance with forgiving camera angle angles', icon: '🌱' },
        { label: 'Consistent / Active (Home or Gym Workouts)', value: 'intermediate', desc: 'Good form discipline, ready for dynamic tempo workouts', icon: '🎯' },
        { label: 'Advanced Fitness Athlete', value: 'advanced', desc: 'High cadence, strict form tracking, long plank holds', icon: '🏆' }
      ]
    },
    {
      id: 'workout_frequency',
      category: 'Weekly Rhythm',
      question: 'How many days per week can you train with Fitzer AI?',
      subtitle: 'Keeps your workout routine sustainable and prevents burnout.',
      type: 'single',
      options: [
        { label: '2 - 3 Days (20-25 mins / session)', value: 'light', desc: 'Time-efficient, high-impact sessions', icon: '📅' },
        { label: '4 - 5 Days (Balanced Routine)', value: 'moderate', desc: 'Steady progression in tone and endurance', icon: '⚡' },
        { label: '6 Days (Dedicated Athletic Plan)', value: 'very_active', desc: 'Comprehensive daily workouts and recovery routines', icon: '🚀' }
      ]
    },
    {
      id: 'focus_exercises',
      category: 'Body Focus',
      question: 'Which body areas would you like to prioritize in your live training?',
      subtitle: 'Select all target areas you want our AI camera to focus on (multi-select).',
      type: 'multi',
      options: [
        { label: 'Glutes & Legs (Deep Squats, Lunges, Glute Bridges)', value: 'lower_body', icon: '🍑' },
        { label: 'Core & Flat Stomach (Planks, Mountain Climbers, Knee Crunches)', value: 'core', icon: '🛡️' },
        { label: 'Arms & Upper Back (Push-ups, Shoulder Press, Arm Circles)', value: 'upper_body', icon: '💪' },
        { label: 'Full Body Agility & Cardio (Jumping Jacks, High Knees)', value: 'cardio', icon: '🔥' }
      ]
    },
    {
      id: 'sleep_recovery',
      category: 'Sleep & Hormonal Health',
      question: 'How many hours of sleep do you get on average?',
      subtitle: 'Critical for cortisol regulation, fat burning, and energy levels.',
      type: 'single',
      options: [
        { label: 'Under 6 Hours (Often tired)', value: 'under_6', desc: 'Lower intensity advised to protect hormonal recovery', icon: '⚠️' },
        { label: '6 - 7 Hours', value: '6_7', desc: 'Standard recovery capacity', icon: '🔋' },
        { label: '7 - 8.5 Hours (Restorative)', value: '7_9', desc: 'Optimal recovery, high energy & metabolic efficiency', icon: '⚡' },
        { label: '9+ Hours', value: '9_plus', desc: 'Exceptional muscle repair & rejuvenation', icon: '✨' }
      ]
    },
    {
      id: 'nutrition_approach',
      category: 'Nutrition & Diet',
      question: 'What is your preferred nutrition preference?',
      subtitle: 'Our AI will generate tailored meal plans with realistic Indian pricing.',
      type: 'single',
      options: [
        { label: 'Vegetarian (High Protein & Fiber)', value: 'vegetarian_protein', desc: 'Dal, paneer, tofu, sprouts, nuts & green veggies', icon: '🥗' },
        { label: 'Non-Vegetarian (Lean Protein Focus)', value: 'high_protein_nonveg', desc: 'Eggs, grilled chicken, fish, legumes & whole grains', icon: '🍗' },
        { label: 'Eggetarian / Flexible', value: 'eggetarian', desc: 'Egg whites, whole eggs, dairy, grains & vegetables', icon: '🥚' },
        { label: 'Low Carb / High Vitality', value: 'low_carb', desc: 'Low refined carbs, colorful salads & healthy seeds', icon: '🥑' }
      ]
    }
  ]
};

/**
 * Fetch dynamic AI questions from Groq or return curated gender fallbacks
 */
export async function generatePersonalizedQuestions(gender = 'male', name = 'Athlete') {
  const normalizedGender = gender === 'female' ? 'female' : 'male';
  const defaultSet = FALLBACK_QUESTIONS[normalizedGender] || FALLBACK_QUESTIONS.male;

  if (!GROQ_API_KEY) {
    return defaultSet;
  }

  try {
    const prompt = `You are Fitzer AI's expert biomechanics and sports nutrition onboarding engine.
Create an array of exactly 7 progressive onboarding questions for a newly signed-up athlete named "${name}" who identified as "${normalizedGender}".

Return ONLY a valid JSON array of 7 objects with the exact schema below, and NO extra commentary or markdown:
[
  {
    "id": "string (unique snake_case ID)",
    "category": "string (short 1-2 words)",
    "question": "string (clear, empowering, gender-tailored question)",
    "subtitle": "string (brief benefit explanation)",
    "type": "single" | "multi",
    "options": [
      {
        "label": "string",
        "value": "string",
        "desc": "string",
        "icon": "emoji"
      }
    ]
  }
]

Requirements for the 7 questions:
1. Question 1: Biological Age Bracket & Metabolic baseline
2. Question 2: Primary Fitness Objective (specifically tailored to ${normalizedGender} physiology and goals)
3. Question 3: Current Bodyweight Exercise Capability & Experience level
4. Question 4: Weekly Workout Frequency & Available Time
5. Question 5: Body Focus Areas & Target Movements (multi-select, matching pushups, squats, lunges, planks, bicep curls)
6. Question 6: Sleep & Daily Recovery Quality
7. Question 7: Nutritional Preference & Dietary Style (tailored for realistic high-protein / balanced eating)

Every question must have between 3 to 4 clear, compelling options with relevant emojis.`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000); // 6s timeout

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'You output only strict JSON arrays of question objects.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.5,
        max_tokens: 1500,
        response_format: { type: 'json_object' }
      }),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      const rawText = data.choices?.[0]?.message?.content?.trim();
      if (rawText) {
        const parsed = JSON.parse(rawText);
        const questionsArray = Array.isArray(parsed) ? parsed : (parsed.questions || parsed.data || null);
        if (Array.isArray(questionsArray) && questionsArray.length === 7) {
          return questionsArray;
        }
      }
    }
  } catch (err) {
    console.warn('[Onboarding AI] Fallback to curated set due to Groq timeout or error:', err.message);
  }

  return defaultSet;
}
