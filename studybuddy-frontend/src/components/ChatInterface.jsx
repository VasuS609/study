import React, { useState, useEffect } from 'react';
import { Send, Brain, Loader, Mic } from 'lucide-react';
import { askChatbot } from '../api';

// Shows a small banner when backend indicates fallback model is in use

const ChatInterface = ({ onQuestionAsked }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [aiModel, setAiModel] = useState(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const res = await askChatbot(input);
      const data = res.data || {};
      const aiMessage = {
        role: 'assistant',
        content: (data.answer && (typeof data.answer === 'string' ? data.answer : JSON.stringify(data.answer))) || 'Sorry, I couldn’t generate a response.',
      };

      setMessages((prev) => [...prev, aiMessage]);
      if (onQuestionAsked) onQuestionAsked();
    } catch (err) {
      console.error('Failed to get AI response:', err);
      setError('Failed to get a response. Please try again.');
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '⚠️ ' + (err.message || 'Something went wrong.'),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/health');
        if (!mounted) return;
        if (res.ok) {
          const data = await res.json();
          setAiModel(data.model || null);
        }
      } catch (e) {
        // ignore health errors
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      {aiModel === 'fallback-mock' && (
        <div className="text-center text-yellow-300 bg-yellow-900/10 border border-yellow-800/20 p-2 rounded-md mb-2">
          <strong>Running in fallback mode:</strong> the AI service is not configured. Responses are canned for local development.
        </div>
      )}
      {messages.length === 0 ? (
        <div className="text-center py-16">
          <Brain size={64} className="mx-auto mb-4 text-indigo-400" />
          <h2 className="text-2xl font-bold mb-2">Welcome to Zenora! 👋</h2>
          <p className="text-gray-400 mb-6">Your AI-powered study companion</p>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="px-3 py-1.5 bg-slate-700/50 rounded-full text-sm">📚 Learn any topic</span>
            <span className="px-3 py-1.5 bg-slate-700/50 rounded-full text-sm">🎯 Practice quizzes</span>
            <span className="px-3 py-1.5 bg-slate-700/50 rounded-full text-sm">⏱️ Track progress</span>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                  🤖
                </div>
              )}
              <div
                className={`max-w-2xl p-4 rounded-2xl ${
                  msg.role === 'user' ? 'bg-indigo-600' : 'bg-slate-700/50'
                }`}
              >
                <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap">
                  {msg.content}
                </div>
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center flex-shrink-0">
                  👤
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                🤖
              </div>
              <div className="bg-slate-700/50 p-4 rounded-2xl flex items-center gap-2">
                <Loader className="animate-spin" size={16} />
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          )}
          {error && (
            <div className="text-center text-red-400 text-sm py-2">
              {error}
            </div>
          )}
        </div>
      )}

      <div className="sticky bottom-0 bg-slate-800/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-700">
        <div className="flex gap-2">
          <button className="p-3 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors">
            <Mic size={20} />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !loading && sendMessage()}
            placeholder="Ask a question..."
            disabled={loading}
            className="flex-1 px-4 py-3 bg-slate-700 rounded-xl border-0 focus:ring-2 focus:ring-indigo-500 outline-none disabled:opacity-70"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="p-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;