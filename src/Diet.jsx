import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from './ThemeContext';
import { useBMI } from './BMIContext';
import { User, Target, DollarSign, Zap } from 'lucide-react';
import { CinematicLayout, AiFab, Kicker } from './CinematicLayout';

export default function Diet() {
  return (
    <CinematicLayout fab={<AiFab />}>
      <div className="cn-content" style={{ maxWidth: 960 }}>
        <Kicker num="02" label="Diet Plans" />
        <h1 className="cn-h1" style={{ marginBottom: '0.5rem' }}>Budget-Friendly Diet Plan</h1>
        <p style={{ color: 'var(--text2)', fontSize: '0.9rem', marginBottom: '2.5rem', lineHeight: 1.7 }}>
          Personalized meal plans engineered around your budget, caloric needs, and nutritional targets.
        </p>
        <UserSpecsForm />
        <BudgetDietModule />
      </div>
    </CinematicLayout>
  );
}

/* ── User Specs Form ── */
function UserSpecsForm() {
  const { bmiData, updateBMI } = useBMI();

  const handleInputChange = (field, value) => {
    updateBMI({ [field]: value });
  };

  return (
    <div className="cn-card" style={{ marginBottom: '1.5rem' }}>
      <h2 className="cn-h2" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <User size={18} style={{ color: 'var(--accent)' }} />
        Your Profile
      </h2>

      <div className="cn-grid-4" style={{ marginBottom: '1rem' }}>
        <div>
          <label className="cn-label">Age</label>
          <input type="number" className="cn-input" value={bmiData.age}
            onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 25)} min="16" max="100" />
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

/* ── Budget Diet Module (100% original logic, cinematic skin) ── */
function BudgetDietModule() {
  const { bmiData } = useBMI();
  const [budgetRange, setBudgetRange] = React.useState('low');
  const [dietType, setDietType] = React.useState('vegan');
  const [dietPlan, setDietPlan] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const budgetRanges = {
    low: { label: 'Low Budget', max: 300 },
    medium: { label: 'Medium Budget', max: 600 },
    high: { label: 'High Budget', max: 1000 }
  };

  // ── All original calculation logic ──
  const calculateCalorieNeeds = (userData) => {
    const { age, gender, activityLevel } = userData;
    let bmr = gender === 'male' ? 10 * 70 + 6.25 * 170 - 5 * age + 5 : 10 * 70 + 6.25 * 170 - 5 * age - 161;
    const multipliers = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9 };
    const maintenance = bmr * multipliers[activityLevel];
    if (userData.fitnessGoal === 'lose_weight') return Math.round(maintenance - 500);
    if (userData.fitnessGoal === 'gain_weight') return Math.round(maintenance + 300);
    if (userData.fitnessGoal === 'build_muscle') return Math.round(maintenance + 200);
    return Math.round(maintenance);
  };

  const calculateProteinNeeds = (userData) => {
    const { fitnessGoal, bodyFatPercentage } = userData;
    let proteinPerKg = 1.6;
    if (fitnessGoal === 'build_muscle') proteinPerKg = 2.2;
    else if (fitnessGoal === 'lose_weight') proteinPerKg = 2.0;
    else if (bodyFatPercentage > 25) proteinPerKg = 1.8;
    return Math.round(70 * proteinPerKg);
  };

  const calculateWaterNeeds = (userData) => {
    const { activityLevel, sleepHours } = userData;
    let baseWater = 8;
    if (activityLevel === 'very_active') baseWater += 2;
    else if (activityLevel === 'active') baseWater += 1;
    if (sleepHours < 7) baseWater += 1;
    return baseWater;
  };

  const generateBudgetMealPlans = (budget, calories, protein, goal, dietType) => {
    const veganMeals = {
      low: { breakfast: "Oatmeal (1 cup) + Banana + 2 tbsp peanut butter + 1 cup almond milk", snack1: "Mixed nuts (1/4 cup) + Apple", lunch: "Brown rice (1 cup) + Black beans (1/2 cup) + Mixed vegetables + Olive oil", snack2: "Coconut yogurt (1 cup) + Berries", dinner: "Tofu curry (4oz) + Sweet potato + Broccoli + Garlic", total: "₹180" },
      medium: { breakfast: "Whole grain toast + Avocado + 2 tbsp tahini + Spinach", snack1: "Protein smoothie (plant protein + banana + spinach + almond milk)", lunch: "Quinoa salad + Chickpeas + Mixed vegetables + Olive oil", snack2: "Mixed nuts (1/4 cup) + Dried fruit", dinner: "Lentil curry + Brown rice + Asparagus + Lemon", total: "₹320" },
      high: { breakfast: "Acai bowl + Granola + Fresh berries + Chia seeds + Almond milk", snack1: "Protein bar + Fresh fruit + Almond butter", lunch: "Tempeh stir-fry + Quinoa + Roasted vegetables + Avocado", snack2: "Coconut yogurt parfait + Nuts + Honey", dinner: "Mushroom steak + Sweet potato + Green beans + Herbs", total: "₹550" }
    };
    const nonVeganMeals = {
      low: { breakfast: "Oatmeal (1 cup) + Banana + 2 tbsp peanut butter + 1 cup milk", snack1: "Hard-boiled eggs (2) + Apple", lunch: "Brown rice (1 cup) + Black beans (1/2 cup) + Mixed vegetables + Olive oil", snack2: "Greek yogurt (1 cup) + Berries", dinner: "Chicken thigh (4oz) + Sweet potato + Broccoli + Garlic", total: "₹200" },
      medium: { breakfast: "Whole grain toast + Avocado + 2 eggs + Spinach", snack1: "Protein smoothie (whey + banana + spinach + milk)", lunch: "Quinoa salad + Grilled chicken breast + Mixed vegetables + Olive oil", snack2: "Mixed nuts (1/4 cup) + Dried fruit", dinner: "Salmon fillet (4oz) + Brown rice + Asparagus + Lemon", total: "₹380" },
      high: { breakfast: "Acai bowl + Granola + Fresh berries + Chia seeds + Almond milk", snack1: "Protein bar + Fresh fruit + Almond butter", lunch: "Grilled salmon + Quinoa + Roasted vegetables + Avocado", snack2: "Greek yogurt parfait + Nuts + Honey", dinner: "Lean beef steak + Sweet potato + Green beans + Herbs", total: "₹650" }
    };
    return dietType === 'vegan' ? veganMeals[budget] : nonVeganMeals[budget];
  };

  const generateShoppingList = (mealPlan, dietType) => {
    const veganItems = ["Oatmeal, Rice, Quinoa, Lentils", "Tofu, Chickpeas, Black beans, Coconut yogurt", "Bananas, Apples, Berries, Avocado", "Vegetables (frozen for budget), Mixed nuts", "Peanut butter, Olive oil, Tahini"];
    const nonVeganItems = ["Oatmeal, Rice, Quinoa", "Chicken, Eggs, Greek yogurt, Salmon", "Bananas, Apples, Berries, Avocado", "Vegetables (frozen for budget), Mixed nuts", "Peanut butter, Olive oil, Whey protein"];
    return (dietType === 'vegan' ? veganItems : nonVeganItems).join(", ");
  };

  const getBudgetTip = (budget) => {
    const tips = { low: "Shop at local markets, buy seasonal vegetables, and use lentils as primary protein source.", medium: "Buy grains in bulk, shop at wholesale markets, and consider local dairy products.", high: "Invest in organic produce, quality proteins, and premium nuts for maximum nutrition." };
    return tips[budget];
  };

  const generateBudgetDiet = async () => {
    setIsLoading(true);
    const baseCalories = calculateCalorieNeeds(bmiData);
    const proteinNeeds = calculateProteinNeeds(bmiData);
    const budgetCap = budgetRanges[budgetRange]?.max || 500;
    const apiKey = import.meta.env.VITE_GROQ_API_KEY || import.meta.env.GROQ_API_KEY || "";

    if (apiKey) {
      try {
        const systemPrompt = `You are an expert sports nutritionist specializing in affordable, Indian-market fitness meal plans.
Generate a structured, personalized budget diet plan for a user with the following profile:
- Age: ${bmiData.age}
- Gender: ${bmiData.gender}
- Goal: ${bmiData.fitnessGoal.replace('_', ' ')}
- Body Fat: ${bmiData.bodyFatPercentage}%
- Sleep: ${bmiData.sleepHours} hours
- Diet Preference: ${dietType.toUpperCase()}
- Budget Tier: ${budgetRange.toUpperCase()} (Target Max: ₹${budgetCap}/day)
- Target Daily Calories: ~${baseCalories} kcal
- Target Daily Protein: ~${proteinNeeds}g

Format the output EXACTLY using these clean sections without markdown asterisks, bullet points or hashes:

PERSONAL PROFILE
Age: ${bmiData.age} years | Gender: ${bmiData.gender}
Body Fat: ${bmiData.bodyFatPercentage}% | Sleep: ${bmiData.sleepHours} hours
Fitness Goal: ${bmiData.fitnessGoal.replace('_', ' ').toUpperCase()}
Diet Type: ${dietType.toUpperCase()}
Daily Calories: ${baseCalories} kcal | Protein: ${proteinNeeds}g

MEAL PLAN
Breakfast: [Specific delicious meal with portion and protein]
Morning Snack: [Healthy budget snack]
Lunch: [Balanced meal with carbs, protein, and vegetables]
Afternoon Snack: [Energy / protein booster]
Dinner: [Nutritious, easy to digest dinner]
Hydration: ${calculateWaterNeeds(bmiData)} glasses of water per day

COST SUMMARY
Daily Total: ₹[Realistic estimated total cost under ₹${budgetCap}]
Budget Tip: [One high-impact budget shopping or prep tip]

SHOPPING LIST
[Comma-separated essential items for the week]`;

        const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: 'Generate my personalized budget diet plan.' }],
            temperature: 0.6,
            max_tokens: 650,
            stream: false
          })
        });

        if (resp.ok) {
          const data = await resp.json();
          const content = data.choices?.[0]?.message?.content?.trim();
          if (content) {
            const lines = content.split('\n').map(l => l.replace(/^[#*•-]\s*/, '').trim());
            setDietPlan(lines);
            setIsLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Groq API diet fetch failed, falling back to local generator:', err);
      }
    }

    // Fallback if API unavailable
    try {
      const mealPlans = generateBudgetMealPlans(budgetRange, baseCalories, proteinNeeds, bmiData.fitnessGoal, dietType);
      setDietPlan([
        `PERSONAL PROFILE`,
        `Age: ${bmiData.age} years | Gender: ${bmiData.gender}`,
        `Body Fat: ${bmiData.bodyFatPercentage}% | Sleep: ${bmiData.sleepHours} hours`,
        `Fitness Goal: ${bmiData.fitnessGoal.replace('_', ' ').toUpperCase()}`,
        `Diet Type: ${dietType.toUpperCase()}`,
        `Daily Calories: ${baseCalories} | Protein: ${proteinNeeds}g`,
        ``,
        `MEAL PLAN`,
        `Breakfast: ${mealPlans.breakfast}`,
        `Morning Snack: ${mealPlans.snack1}`,
        `Lunch: ${mealPlans.lunch}`,
        `Afternoon Snack: ${mealPlans.snack2}`,
        `Dinner: ${mealPlans.dinner}`,
        `Hydration: ${calculateWaterNeeds(bmiData)} glasses per day`,
        ``,
        `COST SUMMARY`,
        `Daily Total: ${mealPlans.total}`,
        `Budget Tip: ${getBudgetTip(budgetRange)}`,
        ``,
        `SHOPPING LIST`,
        `${generateShoppingList(mealPlans, dietType)}`
      ]);
    } catch (error) {
      console.error('Error generating diet plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (dietPlan.length > 0) {
      localStorage.setItem('fitzer.budgetDiet', JSON.stringify({ budgetRange, dietPlan, userSpecs: bmiData, generatedAt: Date.now() }));
    }
  }, [dietPlan, budgetRange, bmiData]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Budget + Diet type selection */}
      <div className="cn-glow-card" style={{ padding: '2rem' }}>
        <h2 className="cn-h2" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,107,53,0.15)', border: '1px solid rgba(255,107,53,0.3)', display: 'grid', placeItems: 'center', color: 'var(--accent)' }}>
            <DollarSign size={20} />
          </div>
          Target Daily Budget
        </h2>

        <div className="cn-grid-3" style={{ marginBottom: '1.5rem', gap: '1rem' }}>
          {Object.entries(budgetRanges).map(([key, range]) => (
            <button
              key={key}
              onClick={() => setBudgetRange(key)}
              style={{
                padding: '1.25rem',
                borderRadius: 14,
                textAlign: 'left',
                border: budgetRange === key ? '1.5px solid var(--accent)' : '1px solid var(--border)',
                background: budgetRange === key ? 'var(--accent2)' : 'rgba(255,255,255,0.02)',
                color: budgetRange === key ? 'var(--text)' : 'var(--text2)',
                boxShadow: budgetRange === key ? '0 4px 20px rgba(255,107,53,0.18)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                fontFamily: 'inherit',
              }}
            >
              <div style={{ fontWeight: 800, fontSize: '1.05rem', color: budgetRange === key ? 'var(--accent)' : 'var(--text)', marginBottom: '0.35rem' }}>{range.label}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text3)' }}>Up to ₹{range.max} / day</div>
            </button>
          ))}
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label className="cn-label" style={{ marginBottom: '0.75rem', display: 'block' }}>Diet Preference</label>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {[['vegan', 'Vegan / Plant-Based'], ['non-vegan', 'Non-Vegan / High Protein']].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setDietType(val)}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: 10,
                  fontFamily: 'inherit',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  border: dietType === val ? '1.5px solid var(--accent)' : '1px solid var(--border)',
                  background: dietType === val ? 'var(--accent2)' : 'rgba(255,255,255,0.02)',
                  color: dietType === val ? 'var(--accent)' : 'var(--text2)',
                  boxShadow: dietType === val ? '0 4px 16px rgba(255,107,53,0.15)' : 'none',
                  transition: 'all 0.2s',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <button className="cn-btn" onClick={generateBudgetDiet} disabled={isLoading} style={{ width: '100%', justifyContent: 'center', padding: '0.9rem' }}>
          <Zap size={16} />
          {isLoading ? 'Computing Precision Diet Plan...' : 'Generate Personalized Diet Plan'}
        </button>
      </div>

      {/* Diet Plan Results */}
      {dietPlan.length > 0 && (
        <div className="cn-card">
          <h3 className="cn-h2" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Target size={18} style={{ color: 'var(--accent)' }} />
            Your Budget-Friendly Diet Plan
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {dietPlan.map((item, idx) => {
              const isHeader = item === item.toUpperCase() && !item.includes(':') && !item.includes('|') && !item.includes('₹');
              const isSubHeader = item.includes(':') && !item.includes('₹');
              const isCost = item.includes('₹');
              if (item === '') return <div key={idx} style={{ height: '0.75rem' }} />;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: idx * 0.03 }}
                  style={{
                    padding: '0.65rem 1rem',
                    borderRadius: 8,
                    fontSize: '0.85rem',
                    background: isHeader ? 'rgba(255,107,53,0.06)' : 'rgba(255,255,255,0.02)',
                    borderLeft: isHeader ? '3px solid var(--accent)' : '1px solid var(--border2)',
                    color: isHeader ? 'var(--text)' : isCost ? 'var(--accent)' : isSubHeader ? 'var(--text)' : 'var(--text2)',
                    fontWeight: isHeader ? 700 : isSubHeader ? 600 : 400,
                  }}
                >
                  {isHeader ? item : isSubHeader ? item : `· ${item}`}
                </motion.div>
              );
            })}
          </div>

          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 10 }}>
            <h4 className="cn-h3" style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Zap size={14} style={{ color: 'var(--accent)' }} /> Budget Optimization Tips
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text2)' }}>
              {['Plan meals weekly and create a shopping list', 'Buy seasonal produce for better prices', 'Cook in batches and freeze portions', 'Use cheaper protein sources like eggs, beans, and chicken', 'Shop at discount stores for pantry staples'].map(tip => (
                <li key={tip} style={{ display: 'flex', gap: '0.4rem' }}>
                  <span style={{ color: 'var(--accent)' }}>·</span> {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}