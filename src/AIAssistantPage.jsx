import React from "react";
import { motion } from "framer-motion";
import { Send, Bot } from "lucide-react";
import { useBMI } from "./BMIContext";
import { CinematicLayout, Kicker } from "./CinematicLayout";

export default function AIAssistantPage() {
  const { bmiData } = useBMI();
  const isLoggedIn = React.useMemo(() => {
    try { const u = JSON.parse(localStorage.getItem('fitzer.user') || '{}'); return Boolean(u && u.username); } catch { return false; }
  }, []);

  const [messages, setMessages] = React.useState([
    {
      sender: "bot",
      text: "Hi, I'm GigaChat, your personal AI trainer. Ask me about workouts, diet, or BMI advice.\n\nQUICK LINKS:\nDiet Plans: Budget-friendly meal plans with vegan/non-vegan options\nExercise: Personalized workout recommendations\nBMI Calculator: Track your fitness progress",
    },
  ]);
  const [input, setInput] = React.useState("");
  const chatEndRef = React.useRef(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const scrollToBottom = React.useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  React.useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  const addMessage = (msg) => setMessages((prev) => [...prev, msg]);

  const cleanAIResponse = (text) => {
    return text
      .replace(/•\s*/g, '').replace(/\*\s*/g, '').replace(/^\s*-\s*/gm, '')
      .replace(/^\s*→\s*/gm, '').replace(/^\s*>\s*/gm, '')
      .replace(/^\s*\d+\.\s*/gm, '').replace(/\n\s*\n/g, '\n')
      .replace(/^\s+|\s+$/gm, '').trim();
  };

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    addMessage({ sender: 'user', text: trimmed });
    setInput("");

    const apiKey = import.meta.env.VITE_GROQ_API_KEY || import.meta.env.GROQ_API_KEY || "";

    try {
      setIsLoading(true);
      const bmiContext = bmiData.bmi > 0 ? `
User Profile:
- BMI: ${bmiData.bmi} (${bmiData.bmiCategory})
- Age: ${bmiData.age} years
- Gender: ${bmiData.gender || 'Not specified'}
- Sleep Hours: ${bmiData.sleepHours} hours
- Body Fat: ${bmiData.bodyFatPercentage}%
- Genetic Conditions: ${bmiData.geneticCondition || 'None specified'}

` : '';

      const systemPrompt = `You are GigaChat, a dedicated fitness, workout, and sports nutrition AI coach on the Fitzer platform.

STRICT FITNESS-ONLY DOMAIN RULE:
- You ONLY answer questions strictly related to fitness, workouts, exercise techniques, bodybuilding, cardiovascular training, nutrition, meal planning, macros, calories, BMI, body fat, hydration, sleep recovery, and athletic health.
- If the user asks about ANYTHING non-fitness (e.g., coding, writing code/scripts, general trivia, math, history, politics, movies, entertainment, homework, essays, translation, philosophy, or general knowledge), you MUST IMMEDIATELY and POLITELY DECLINE.
- When declining a non-fitness question, respond with:
"I am GigaChat, your dedicated AI Fitness and Nutrition Coach. I only assist with workouts, exercise posture, meal planning, calorie tracking, and fitness goals. Let's get back on track: how can I help with your training, diet, or recovery today?"
- NEVER answer or assist with non-fitness tasks even if requested or framed as hypothetical scenarios.

${bmiContext}CRITICAL EXERCISE RESTRICTION:
When recommending specific exercises, ONLY recommend from this approved list:
1. Bicep Curl
2. Squats
3. Pushups
4. Plank
5. Lunges
6. Shoulder Press
7. Glute Bridge
8. Mountain Climbers
9. Jumping Jacks
10. High Knees
11. Side Lunges
12. Side Leg Raises
13. Wall Sit
14. Standing Knee-to-Elbow
15. Arm Circles

IMPORTANT FORMATTING RULES:
- NEVER use bullet points (•), asterisks (*), or dashes (-) in your responses
- Format all information as clean, line-by-line text
- Use simple line breaks to separate different points
- Keep advice practical, encouraging, and tailored to the user's fitness goals and budget in Indian Rupees (₹)
- If asked for medical diagnosis or injury treatment, advise consulting a healthcare professional`;

      const recentMessages = messages.slice(-10);
      const conversationHistory = recentMessages.map(m => ({
        role: m.sender === 'bot' ? 'assistant' : 'user',
        content: m.text
      }));

      const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: 'qwen/qwen3.8-27b',
          messages: [{ role: 'system', content: systemPrompt }, ...conversationHistory, { role: 'user', content: trimmed }],
          temperature: 0.7,
          max_tokens: 600,
          stream: false
        })
      });

      if (!resp.ok) { const errorText = await resp.text(); throw new Error(`API Error: ${resp.status} - ${errorText}`); }
      const data = await resp.json();
      if (data.choices && data.choices.length > 0) {
        const rawBotText = data.choices[0].message?.content?.trim() || "Sorry, I couldn't process your request.";
        addMessage({ sender: 'bot', text: cleanAIResponse(rawBotText) });
      } else {
        throw new Error('Invalid response format from API');
      }
    } catch (e) {
      let errorMessage = "I'm having trouble connecting right now. ";
      if (e.message.includes('401') || e.message.includes('Unauthorized')) errorMessage += "There's an authentication issue with the AI service.";
      else if (e.message.includes('429') || e.message.includes('rate limit')) errorMessage += "I'm getting too many requests. Please wait a moment and try again.";
      else if (e.message.includes('network') || e.message.includes('fetch') || e.message.includes('Failed to fetch')) errorMessage += "Please check your internet connection and try again.";
      else errorMessage += `Debug info: ${e.message}`;
      addMessage({ sender: 'bot', text: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CinematicLayout>
      <div className="cn-content" style={{ maxWidth: 880 }}>
        <Kicker num="03" label="AI Neural Fitness Coach" />
        
        {/* Holographic AI Core Orb Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '2.5rem' }}>
          <div className="cn-ai-orb-wrap" style={{ marginBottom: '1.25rem' }}>
            <div className="cn-ai-orb-ring-1" />
            <div className="cn-ai-orb-ring-2" />
            <div className="cn-ai-orb-core" />
          </div>
          <h1 className="cn-h1" style={{ fontSize: 'clamp(2rem, 4.5vw, 3rem)', marginBottom: '0.5rem' }}>
            <span style={{ background: 'var(--grad-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>GigaChat</span> AI Coach
          </h1>
          <p style={{ color: 'var(--text2)', fontSize: '0.92rem', maxWidth: 520, lineHeight: 1.7 }}>
            Your 24/7 intelligent coach for workout routines, tailored nutrition, form recovery, and science-backed fitness insights.
          </p>
        </div>

        {/* Chat Window */}
        <div className="cn-glow-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: 580, boxShadow: '0 16px 40px rgba(0,0,0,0.6)', border: '1px solid rgba(255,107,53,0.25)' }}>
          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.1rem', background: 'radial-gradient(ellipse at 50% 0%, rgba(255,107,53,0.04) 0%, transparent 70%)' }}>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.22 }}
                style={{ display: 'flex', justifyContent: msg.sender === 'bot' ? 'flex-start' : 'flex-end' }}
              >
                {msg.sender === 'bot' && (
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--accent2)', border: '1px solid rgba(255,107,53,0.35)', display: 'grid', placeItems: 'center', flexShrink: 0, marginRight: '0.75rem', marginTop: 2, boxShadow: '0 0 12px rgba(255,107,53,0.2)' }}>
                    <Bot size={17} style={{ color: 'var(--accent)' }} />
                  </div>
                )}
                <div className={`cn-bubble ${msg.sender}`} style={{ maxWidth: '78%', boxShadow: msg.sender === 'bot' ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 20px rgba(255,107,53,0.15)' }}>
                  {msg.text.split('\n').map((line, lineIdx) => (
                    <div key={lineIdx} style={{ marginBottom: lineIdx < msg.text.split('\n').length - 1 ? '0.25rem' : 0 }}>{line}</div>
                  ))}
                </div>
              </motion.div>
            ))}

            {isLoading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--accent2)', border: '1px solid rgba(255,107,53,0.35)', display: 'grid', placeItems: 'center' }}>
                  <Bot size={17} style={{ color: 'var(--accent)' }} />
                </div>
                <div className="cn-bubble bot" style={{ display: 'flex', gap: '6px', alignItems: 'center', padding: '0.85rem 1.25rem' }}>
                  {[0, 0.2, 0.4].map(d => (
                    <motion.span key={d} style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)' }}
                      animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }} transition={{ duration: 1.1, repeat: Infinity, delay: d }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div style={{ borderTop: '1px solid var(--border)', padding: '1.25rem 1.5rem', display: 'flex', gap: '0.75rem', background: 'rgba(12, 10, 16, 0.95)' }}>
            <input
              className="cn-input"
              type="text"
              placeholder="Ask GigaChat about workouts, diets, macros..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isLoading && sendMessage()}
              style={{ flex: 1, padding: '0.8rem 1.1rem' }}
            />
            <button className="cn-btn" onClick={sendMessage} disabled={isLoading || !input.trim()} aria-label="Send" style={{ padding: '0.8rem 1.4rem' }}>
              <Send size={17} />
            </button>
          </div>
        </div>

        {/* Quick prompts */}
        <div style={{ marginTop: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '0.6rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>Quick Prompts:</span>
          {['Best exercises for fat loss', 'Budget vegan meal plan', 'How to improve sleep for recovery', 'What is a healthy BMI?'].map(p => (
            <button
              key={p}
              onClick={() => { setInput(p); }}
              className="cn-btn-ghost"
              style={{ fontSize: '0.78rem', padding: '0.45rem 0.95rem', borderRadius: 99 }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </CinematicLayout>
  );
}