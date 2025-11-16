import React, { useState } from 'react';
import { Heart, MessageCircle, Smile, Send, Sparkles, Sun, Moon, Coffee, Wind } from 'lucide-react';

const EmotionalSupport = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [mood, setMood] = useState(null);
  const [sessionStarted, setSessionStarted] = useState(false);

  const moods = [
    { id: 'stressed', emoji: '😰', label: 'Stressed', color: 'red', greeting: "I can sense you're feeling overwhelmed. Take a deep breath - you're in a safe space here. Would you like to tell me what's weighing on your mind?" },
    { id: 'anxious', emoji: '😟', label: 'Anxious', color: 'orange', greeting: "Anxiety can feel so heavy, I understand. Remember, these feelings are temporary. I'm here to listen without judgment. What's making you feel anxious right now?" },
    { id: 'sad', emoji: '😢', label: 'Sad', color: 'blue', greeting: "It's okay to feel sad - your emotions are valid. Sometimes we just need someone to listen. I'm here for you. What's on your heart?" },
    { id: 'tired', emoji: '😴', label: 'Tired', color: 'purple', greeting: "Burnout is real, and you deserve rest. Let's talk about what's draining your energy. You matter, and your wellbeing comes first." },
    { id: 'overwhelmed', emoji: '😵', label: 'Overwhelmed', color: 'yellow', greeting: "When everything feels like too much, it helps to take things one step at a time. Let's break down what you're dealing with together. What's the biggest challenge right now?" },
    { id: 'frustrated', emoji: '😤', label: 'Frustrated', color: 'pink', greeting: "Frustration shows you care deeply about something. That's not weakness - that's passion. Tell me what's frustrating you, and let's work through it." },
    { id: 'lonely', emoji: '😔', label: 'Lonely', color: 'indigo', greeting: "Feeling alone can be incredibly hard. But you're not alone right now - I'm here, and I care. What's been making you feel disconnected?" },
    { id: 'confused', emoji: '😕', label: 'Confused', color: 'teal', greeting: "Uncertainty is uncomfortable, but it's also where growth happens. Let's explore what's unclear together. What's confusing you?" }
  ];

  const encouragements = [
    "You're incredibly brave for opening up about this. That takes real courage.",
    "I hear you, and what you're feeling is completely valid.",
    "Thank you for trusting me with these feelings. You're not alone.",
    "It's okay to not be okay. You're human, and that's beautiful.",
    "Your feelings matter, and so do you. Never forget that.",
    "Taking care of your mental health is one of the strongest things you can do.",
    "You've overcome challenges before, and you'll get through this too.",
    "Be gentle with yourself. You're doing better than you think.",
    "Small steps are still progress. You're moving forward.",
    "Your story matters. Your struggles matter. You matter."
  ];

  const copingStrategies = {
    stressed: [
      "🌬️ Try the 4-7-8 breathing technique: Breathe in for 4, hold for 7, exhale for 8.",
      "📝 Write down your worries. Sometimes seeing them on paper makes them feel more manageable.",
      "🚶‍♀️ Take a short 5-minute walk outside. Fresh air and movement can reset your mind.",
      "🎵 Listen to calming music or nature sounds.",
      "💪 Remember: You don't have to do everything at once. One task at a time."
    ],
    anxious: [
      "🔢 Use the 5-4-3-2-1 grounding technique: Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.",
      "❄️ Hold an ice cube. The cold sensation can help ground you in the present.",
      "📱 Text a friend or family member. Connection helps.",
      "🧘‍♀️ Try a 5-minute guided meditation on YouTube.",
      "💭 Challenge anxious thoughts: Ask 'Is this thought helpful? Is it true?'"
    ],
    sad: [
      "☀️ Get some sunlight, even if just for 5 minutes. Light affects mood.",
      "🎨 Do something creative - draw, color, or write freely.",
      "🤗 Hug a pet, a pillow, or give yourself a gentle squeeze.",
      "📞 Reach out to someone who makes you smile.",
      "🎬 Watch a comfort show or movie. Sometimes distraction is okay."
    ],
    tired: [
      "😴 Take a 20-minute power nap if you can. Set an alarm.",
      "💧 Drink a full glass of water. Dehydration affects energy.",
      "🍎 Have a healthy snack with protein.",
      "🚫 It's okay to say no to non-essential tasks today.",
      "⏸️ Schedule genuine rest time - not just sleep, but relaxation."
    ],
    overwhelmed: [
      "📋 Brain dump: Write everything down, then prioritize just 3 things.",
      "⏰ Use the Pomodoro technique: 25 minutes work, 5 minutes break.",
      "🗑️ What can you eliminate, delegate, or postpone?",
      "🎯 Focus on ONE thing at a time. Multitasking increases overwhelm.",
      "🆘 Ask for help. Strength isn't doing everything alone."
    ],
    frustrated: [
      "🛑 Take a 5-minute break from what's frustrating you.",
      "💪 Physical activity helps release frustration - do 10 jumping jacks.",
      "🗣️ Vent in a journal. Get it all out.",
      "🔄 Try approaching the problem from a different angle.",
      "🕐 Sometimes sleeping on it brings clarity."
    ],
    lonely: [
      "👋 Join an online community around something you enjoy.",
      "☕ Visit a café or library - being around people helps.",
      "💌 Send a message to an old friend. Reconnecting feels good.",
      "🎮 Play a multiplayer game or join a Discord server.",
      "🤝 Volunteer opportunities connect you with others meaningfully."
    ],
    confused: [
      "📝 Write out what you know vs. what you don't know.",
      "🗣️ Talk it out loud. Hearing yourself helps organize thoughts.",
      "🧩 Break the big confusion into smaller, specific questions.",
      "👥 Ask someone else's perspective.",
      "⏳ Give yourself permission to not have all answers right now."
    ]
  };

  const startSession = (selectedMood) => {
    setMood(selectedMood);
    setSessionStarted(true);
    const moodData = moods.find(m => m.id === selectedMood);
    setMessages([
      { role: 'assistant', content: moodData.greeting }
    ]);
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Generate empathetic AI response
    setTimeout(() => {
      const responses = generateEmpatheticResponse(input, mood);
      setMessages(prev => [...prev, { role: 'assistant', content: responses }]);
    }, 1000);
  };

  const generateEmpatheticResponse = (userInput, currentMood) => {
    const encouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
    const strategies = copingStrategies[currentMood];
    const randomStrategy = strategies[Math.floor(Math.random() * strategies.length)];

    const responses = [
      `${encouragement}\n\n${randomStrategy}\n\nRemember: This feeling is temporary. You've gotten through 100% of your worst days so far. You're stronger than you know. 💙`,
      
      `I can feel the weight of what you're sharing. Thank you for trusting me with this. ${randomStrategy}\n\n${encouragement}\n\nYou're taking the right steps by reaching out. That's real strength.`,
      
      `What you're feeling is completely understandable given what you're going through. ${encouragement}\n\nHere's something that might help: ${randomStrategy}\n\nTake your time. There's no rush. I'm here.`,
      
      `Your feelings are so valid. ${randomStrategy}\n\n${encouragement}\n\nRemember: healing isn't linear. Some days will be harder than others, and that's okay. You're doing amazing just by being here.`,
      
      `Thank you for sharing that with me. It takes courage to be this honest about how you feel. ${encouragement}\n\n${randomStrategy}\n\nYou deserve compassion - especially from yourself. 🌟`
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const suggestActivity = () => {
    const activities = [
      { icon: '🧘‍♀️', title: 'Guided Meditation', desc: 'Try a 5-minute breathing exercise' },
      { icon: '📓', title: 'Journaling', desc: 'Write down three things you\'re grateful for' },
      { icon: '🚶‍♂️', title: 'Walk Outside', desc: 'Even 10 minutes of fresh air helps' },
      { icon: '🎵', title: 'Music Therapy', desc: 'Listen to calming or uplifting music' },
      { icon: '☕', title: 'Self-Care Break', desc: 'Make your favorite tea or coffee mindfully' },
      { icon: '📱', title: 'Connect', desc: 'Text someone who makes you smile' }
    ];

    const randomActivity = activities[Math.floor(Math.random() * activities.length)];
    
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: `💡 **Activity Suggestion**\n\n${randomActivity.icon} **${randomActivity.title}**\n${randomActivity.desc}\n\nWould this help right now? Remember, you don't have to do anything you're not ready for. Just being here is enough. 💙`
    }]);
  };

  const endSession = () => {
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: `Thank you for sharing this time with me. Remember:\n\n✨ You are worthy of love and care\n💪 You are stronger than you think\n🌟 Your feelings are valid\n💙 You are not alone\n\nTake care of yourself. I'm here whenever you need to talk. You've got this. 🤗`
    }]);
    
    setTimeout(() => {
      setSessionStarted(false);
      setMood(null);
      setMessages([]);
    }, 5000);
  };

  if (!sessionStarted) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <Heart size={64} className="mx-auto mb-4 text-pink-400 animate-pulse" />
        <h2 className="text-3xl font-bold mb-2">💙 Emotional Wellbeing Space</h2>
        <p className="text-gray-400 mb-6">A safe, judgment-free space to share your feelings</p>
        
        <div className="bg-slate-700/30 rounded-2xl p-6 mb-8 border border-slate-600 max-w-2xl mx-auto">
          <h3 className="font-semibold mb-4">🌈 You Are Safe Here</h3>
          <div className="text-sm text-gray-300 space-y-2 text-left">
            <p>• This is a confidential, supportive space</p>
            <p>• Your feelings are valid, whatever they are</p>
            <p>• There's no judgment here - only support</p>
            <p>• You can share as much or as little as you want</p>
            <p>• Taking care of your mental health is strength, not weakness</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-4">How are you feeling right now?</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto mb-6">
          {moods.map((m) => (
            <button
              key={m.id}
              onClick={() => startSession(m.id)}
              className={`p-4 rounded-xl border-2 transition-all hover:scale-105 bg-${m.color}-500/10 border-${m.color}-500/30 hover:bg-${m.color}-500/20`}
            >
              <div className="text-4xl mb-2">{m.emoji}</div>
              <div className="text-sm font-medium">{m.label}</div>
            </button>
          ))}
        </div>

        <p className="text-xs text-gray-500 max-w-2xl mx-auto">
          ⚠️ If you're experiencing a mental health crisis, please contact a professional helpline:
          <br />National Suicide Prevention Lifeline: 988 | Crisis Text Line: Text HOME to 741741
        </p>
      </div>
    );
  }

  const currentMood = moods.find(m => m.id === mood);

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      {/* Session Header */}
      <div className="bg-slate-700/30 rounded-2xl p-4 mb-4 border border-slate-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`text-4xl`}>{currentMood.emoji}</div>
            <div>
              <h3 className="font-bold">Safe Space - {currentMood.label}</h3>
              <p className="text-xs text-gray-400">Your feelings are valid and heard</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={suggestActivity}
              className="px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium flex items-center gap-2"
            >
              <Sparkles size={16} />
              Activity
            </button>
            <button
              onClick={endSession}
              className="px-3 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg text-sm font-medium"
            >
              End Session
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 px-2">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'assistant' && (
              <div className="w-10 h-10 rounded-full bg-pink-600 flex items-center justify-center flex-shrink-0">
                <Heart size={20} />
              </div>
            )}
            <div className={`max-w-2xl p-4 rounded-2xl ${
              msg.role === 'user' ? 'bg-indigo-600' : 'bg-slate-700/50'
            }`}>
              <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap">
                {msg.content}
              </div>
            </div>
            {msg.role === 'user' && (
              <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center flex-shrink-0">
                <Smile size={20} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="bg-slate-800/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Share what's on your mind... Take your time."
            className="flex-1 px-4 py-3 bg-slate-700 rounded-xl border-0 focus:ring-2 focus:ring-pink-500 outline-none"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="p-3 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          💙 Take your time. There's no rush. You're doing great by being here.
        </p>
      </div>
    </div>
  );
};

export default EmotionalSupport;