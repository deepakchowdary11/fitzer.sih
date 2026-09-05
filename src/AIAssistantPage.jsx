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

    const apiKey = import.meta.env.VITE_GROQ_API_KEY || "";

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

      const systemPrompt = `You are GigaChat, an expert fitness and nutrition assistant. You provide practical, actionable advice on:

Workout routines and exercise techniques
Nutrition and diet planning (with budget-friendly options)
BMI calculations and health assessments
Fitness goals and progress tracking
Weight management strategies
Muscle building and strength training
Cardiovascular fitness
Recovery and rest
Budget-friendly meal planning
Vegan and non-vegan diet options

${bmiContext}CRITICAL EXERCISE RESTRICTION:
You MUST only recommend exercises from this approved list. Do NOT suggest any exercise outside this list under any circumstances:
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
- Consider the user's BMI category, dietary preferences (vegan/non-vegan), and budget constraints
- Make recommendations practical and budget-friendly with Indian Rupee (₹) pricing
- Always suggest visiting the Diet Plans page for personalized meal plans
- Include budget ranges: Low (₹300/day), Medium (₹600/day), High (₹1000/day)
- For vegan diets, emphasize plant-based proteins and key nutrients
- For budget questions, provide specific cost-effective meal suggestions

Always give specific, helpful responses. If asked about medical conditions, injuries, or medications, recommend consulting a healthcare professional. Keep responses concise but informative.`;

      const recentMessages = messages.slice(-10);
      const conversationHistory = recentMessages.map(m => ({
        role: m.sender === 'bot' ? 'assistant' : 'user',
        content: m.text
      }));

      const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: 'groq/compound-mini',
          messages: [{ role: 'system', content: systemPrompt }, ...conversationHistory, { role: 'user', content: trimmed }],
          temperature: 0.7,
          max_tokens: 500,
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
      <div className="cn-content" style={{ maxWidth: 860 }}>
        <Kicker num="03" label="AI Coach" />
        <h1 className="cn-h1" style={{ marginBottom: '0.5rem' }}>
          <span style={{ color: 'var(--accent)' }}>GigaChat</span> — Your AI Fitness Coach
        </h1>
        <p style={{ color: 'var(--text2)', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: 1.7 }}>
          Ask anything about workouts, nutrition, BMI, or recovery. Powered by Llama 3.1.
        </p>

        {/* Chat Window */}
        <div className="cn-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: 560 }}>
          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: msg.sender === 'bot' ? -16 : 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }}
                style={{ display: 'flex', justifyContent: msg.sender === 'bot' ? 'flex-start' : 'flex-end' }}
              >
                {msg.sender === 'bot' && (
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent2)', border: '1px solid rgba(200,240,74,0.3)', display: 'grid', placeItems: 'center', flexShrink: 0, marginRight: '0.6rem', marginTop: 2 }}>
                    <Bot size={16} style={{ color: 'var(--accent)' }} />
                  </div>
                )}
                <div className={`cn-bubble ${msg.sender}`} style={{ maxWidth: '75%' }}>
                  {msg.text.split('\n').map((line, lineIdx) => (
                    <div key={lineIdx} style={{ marginBottom: lineIdx < msg.text.split('\n').length - 1 ? '0.2rem' : 0 }}>{line}</div>
                  ))}
                </div>
              </motion.div>
            ))}

            {isLoading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent2)', border: '1px solid rgba(200,240,74,0.3)', display: 'grid', placeItems: 'center' }}>
                  <Bot size={16} style={{ color: 'var(--accent)' }} />
                </div>
                <div className="cn-bubble bot" style={{ display: 'flex', gap: '4px', alignItems: 'center', padding: '0.85rem 1.1rem' }}>
                  {[0, 0.2, 0.4].map(d => (
                    <motion.span key={d} style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: 'var(--text3)' }}
                      animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: d }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div style={{ borderTop: '1px solid var(--border)', padding: '1rem 1.5rem', display: 'flex', gap: '0.75rem', background: 'rgba(255,255,255,0.02)' }}>
            <input
              className="cn-input"
              type="text"
              placeholder="Ask GigaChat anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isLoading && sendMessage()}
              style={{ flex: 1 }}
            />
            <button className="cn-btn" onClick={sendMessage} disabled={isLoading || !input.trim()} aria-label="Send">
              <Send size={16} />
            </button>
          </div>
        </div>

        {/* Quick prompts */}
        <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {['Best exercises for fat loss', 'Budget vegan meal plan', 'How to improve sleep for recovery', 'What is a healthy BMI?'].map(p => (
            <button
              key={p}
              onClick={() => { setInput(p); }}
              className="cn-btn-ghost"
              style={{ fontSize: '0.75rem', padding: '0.4rem 0.85rem' }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </CinematicLayout>
  );
}